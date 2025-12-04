import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const convertToMarkdown = async (
  content: string, 
  mimeType: string, 
  originalName: string,
  isRawText: boolean = false
): Promise<string> => {
  const modelId = 'gemini-2.5-flash';

  let prompt = `
    You are an expert document-to-markdown converter. 
    Your task is to take the provided document content and convert it into clean, well-structured Markdown.
    
    GUIDELINES:
    1. Preserve all headers, lists (ordered and unordered), and tables.
    2. If the input is a spreadsheet, format it as a Markdown table.
    3. Remove excessive whitespace, artifacts, or page numbers if they break the flow.
    4. Do not include any conversational filler (e.g., "Here is the markdown"). Output ONLY the markdown.
    5. If the content is empty or unreadable, return a brief note explaining why in a blockquote.
    
    Original Filename: ${originalName}
  `;

  try {
    let response;

    if (isRawText) {
      // For extracted text (DOCX, PPTX, XLSX parsed client-side)
      response = await ai.models.generateContent({
        model: modelId,
        contents: [
          { role: 'user', parts: [{ text: prompt }, { text: `\n\n--- DOCUMENT CONTENT ---\n\n${content}` }] }
        ]
      });
    } else {
      // For Native Gemini formats (PDF, CSV if raw, etc.)
      // Note: content here is base64 encoded string
      response = await ai.models.generateContent({
        model: modelId,
        contents: [
          { 
            role: 'user', 
            parts: [
              { text: prompt },
              { 
                inlineData: {
                  mimeType: mimeType,
                  data: content
                }
              }
            ] 
          }
        ]
      });
    }

    return response.text || "> No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process with Gemini");
  }
};
