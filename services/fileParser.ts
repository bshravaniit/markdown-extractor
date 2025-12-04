import { convertToMarkdown } from "./geminiService";

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

// Helper to read file as Base64 (for PDF/Images)
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

// Helper to read file as Text (for CSV)
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const processFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    // 1. PDF - Supported Natively by Gemini
    if (extension === 'pdf') {
      const base64 = await readFileAsBase64(file);
      return await convertToMarkdown(base64, 'application/pdf', file.name, false);
    }

    // 2. CSV - Supported Natively (as text) or via Parsing.
    // Let's send raw text to Gemini for CSV to ensure it understands the structure.
    if (extension === 'csv') {
      const text = await readFileAsText(file);
      return await convertToMarkdown(text, 'text/csv', file.name, true);
    }

    // 3. DOCX - Parse with Mammoth, then clean with Gemini
    if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      // Mammoth extracts raw text well, but styles are hard.
      // We'll extract raw text and let Gemini structure it.
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      if (!result.value.trim()) {
        return "> Empty document or unable to extract text.";
      }
      return await convertToMarkdown(result.value, 'text/plain', file.name, true);
    }

    // 4. XLSX/XLS - Parse with SheetJS, convert to CSV/JSON, then Markdown with Gemini
    if (extension === 'xlsx' || extension === 'xls') {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
      let allText = "";
      
      // Iterate through all sheets
      workbook.SheetNames.forEach((sheetName: string) => {
        const sheet = workbook.Sheets[sheetName];
        const csv = window.XLSX.utils.sheet_to_csv(sheet);
        if (csv.trim()) {
            allText += `\n\n### Sheet: ${sheetName}\n\n${csv}`;
        }
      });
      
      if (!allText.trim()) return "> Empty spreadsheet.";
      return await convertToMarkdown(allText, 'text/plain', file.name, true);
    }

    // 5. PPTX - Parse with JSZip (Naive Text Extraction)
    if (extension === 'pptx') {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const zip = new window.JSZip();
        const loadedZip = await zip.loadAsync(arrayBuffer);
        
        let allText = "";
        const slideFiles: any[] = [];
        
        // Find all slide XML files
        loadedZip.forEach((relativePath: string, zipEntry: any) => {
            if (relativePath.match(/ppt\/slides\/slide\d+\.xml/)) {
                slideFiles.push({ path: relativePath, file: zipEntry });
            }
        });

        // Sort slides by number (slide1, slide2, etc.)
        slideFiles.sort((a, b) => {
            const numA = parseInt(a.path.match(/slide(\d+)\.xml/)[1]);
            const numB = parseInt(b.path.match(/slide(\d+)\.xml/)[1]);
            return numA - numB;
        });

        // Extract text from each slide
        for (const slide of slideFiles) {
            const xmlText = await slide.file.async("string");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            // Extract text from <a:t> tags (PowerPoint text nodes)
            const textNodes = xmlDoc.getElementsByTagName("a:t");
            let slideText = "";
            for (let i = 0; i < textNodes.length; i++) {
                slideText += textNodes[i].textContent + " ";
            }
            if (slideText.trim()) {
                const slideNum = slide.path.match(/slide(\d+)\.xml/)[1];
                allText += `\n\n### Slide ${slideNum}\n${slideText.trim()}`;
            }
        }

        if (!allText.trim()) return "> Empty presentation or unable to extract text.";
        return await convertToMarkdown(allText, 'text/plain', file.name, true);
    }

    // Fallback for txt, md, etc.
    if (extension === 'txt' || extension === 'md' || extension === 'json') {
        const text = await readFileAsText(file);
        return await convertToMarkdown(text, 'text/plain', file.name, true);
    }

    throw new Error(`Unsupported file type: .${extension}`);
  } catch (err: any) {
    console.error("File processing error:", err);
    throw err;
  }
};
