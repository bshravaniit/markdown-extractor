import { GoogleGenAI } from "@google/genai";
import { Prospect, OutreachType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const EVENT_INFO = `
Event: "The Journey Within" — An Evening with Gurudev Sri Sri Ravi Shankar
Date: Wednesday, July 9, 2025 • 7:00 PM – 9:00 PM
Venue: W.K. Kellogg Auditorium, 25 Michigan Ave W, Battle Creek, MI 49017
Tickets: $35 (General) · $75 (Preferred) · $150 (Patron) · $250 (Benefactor/VIP)
Group Discount: 10+ tickets → 15% off
Registration: tiny.cc/july9
Organizer: Art of Living Foundation — Battle Creek / Kalamazoo chapter
Goal: 2,000 attendees
`.trim();

const CATEGORY_CTA: Record<string, string> = {
  wellness: 'Suggest a natural tie-in to their students/clients — this is an evening of breath, meditation, and inner wisdom from a globally respected teacher. Offer the group ticket discount and the idea of co-promoting as a wellness event.',
  church: 'Frame as a universal spiritual gathering that transcends religion. Invite them to share with their congregation and faith community via bulletin, email, or pulpit announcement.',
  hospital: 'Frame as a stress-management and mindfulness opportunity for their staff — evidence-based breathing and meditation from one of the world\'s most recognized wellness teachers. Mention the group ticket discount for teams.',
  corporate: 'Pitch to HR/Wellness: an employee evening of mindfulness and resilience with a world leader in stress reduction. Group ticket discount available for 10+ employees. Great for Q3 wellness programming.',
  community: 'Ask them to share with their members and include in their email newsletter or social posts. This is a community landmark event.',
  education: 'Invite faculty, staff, and students — especially those interested in mindfulness, student wellness, or cross-cultural programming. Group tickets for 10+.',
  cultural: 'Emphasize this is a landmark event for the South Asian and global wellness community. Ask them to share broadly with their network and coordinate group seating.',
  fitness: 'Connect the mind-body angle — this is the mental side of total fitness. Invite their members to an evening that complements physical training with inner transformation.',
  restaurant: 'Ask if they\'d be willing to display printed flyers at the counter/tables and share the event on their social media. Simple but impactful.',
  other: 'Ask if they\'d be interested in attending or sharing the event with their network, employees, or community.',
};

export const generateOutreachDraft = async (
  prospect: Prospect,
  type: OutreachType
): Promise<string> => {
  const cta = CATEGORY_CTA[prospect.category] ?? CATEGORY_CTA.other;

  const formatNote = type === 'email'
    ? 'Write a professional, warm email. Start with "Subject: ..." on the first line, then a blank line, then the email body. Max 250 words.'
    : 'Write a natural, warm phone call script with clear talking points. Include a brief opener, the key pitch, and a soft close. Add [pause] notes where natural. Max 200 words.';

  const prompt = `You are a volunteer ambassador for the Art of Living Foundation helping promote a community event.

EVENT DETAILS:
${EVENT_INFO}

PROSPECT:
- Organization: ${prospect.name}
- Type: ${prospect.category}
- Address: ${prospect.address}, ${prospect.city}, MI ${prospect.zipCode}
${prospect.contactPerson ? `- Contact Person: ${prospect.contactPerson}` : ''}
${prospect.notes ? `- Notes: ${prospect.notes}` : ''}

TASK: ${formatNote}

CALL-TO-ACTION STRATEGY: ${cta}

TONE GUIDELINES:
- Warm, genuine, community-spirited — not a sales pitch
- Reference their specific organization type naturally
- Feel personal, not mass-blast
- Keep Gurudev's name as "Gurudev Sri Sri Ravi Shankar" on first mention, then "Gurudev"
- Do not use generic phrases like "I hope this email finds you well"

Output ONLY the ${type === 'email' ? 'email (subject + body)' : 'call script'} — no preamble, no commentary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text?.trim() || 'Unable to generate content. Please try again.';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to generate outreach draft');
  }
};
