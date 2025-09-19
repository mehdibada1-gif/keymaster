'use server';

/**
 * @fileOverview An FAQ chatbot for property-specific questions.
 *
 * - askQuestion - A function that handles guest questions and returns answers.
 * - AskQuestionInput - The input type for the askQuestion function.
 * - AskQuestionOutput - The return type for the askQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskQuestionInputSchema = z.object({
  propertyId: z.string().describe('The unique ID of the property.'),
  question: z.string().describe('The question asked by the guest.'),
  checkInDate: z.string().optional().describe('The guest\'s check-in date.'),
  checkOutDate: z.string().optional().describe('The guest\'s check-out date.'),
});
export type AskQuestionInput = z.infer<typeof AskQuestionInputSchema>;

const AskQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AskQuestionOutput = z.infer<typeof AskQuestionOutputSchema>;

// In a real app, you'd fetch this data from a database based on the propertyId.
const getPropertyContext = (propertyId: string) => {
    const propertyData: Record<string, string> = {
        'paradise-villa': "Paradise Villa is a luxury villa with a pool. WiFi: Villa_WiFi/Sunshine123!. Door code: 1984. Rules: No smoking, quiet hours after 10 PM.",
        'downtown-loft': "Downtown Loft is a modern apartment. WiFi: LoftLife_5G/CityLights!5G. Door code: 9876. Rules: No pets.",
        'seaside-cottage': "Seaside Cottage is a cozy beach house. WiFi: CottageGuest/OceanBreeze22. Door code: 2244. Rules: Rinse sand off outside.",
    }
    return propertyData[propertyId] || "This property has general rules. Be respectful and enjoy your stay."
}

export async function askQuestion(input: AskQuestionInput): Promise<AskQuestionOutput> {
  return askQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: {schema: z.object({ question: z.string(), context: z.string() })},
  output: {schema: AskQuestionOutputSchema},
  prompt: `You are a helpful and friendly chatbot assistant for a vacation rental property.
Your goal is to answer the guest's questions based *only* on the context provided.
Do not make up information. If the answer is not in the context, politely state that you don't have that information and suggest they contact the host.

Context about the property and the guest's booking:
---
{{{context}}}
---

Guest's Question: "{{{question}}}"

Answer:`,
});

const askQuestionFlow = ai.defineFlow(
  {
    name: 'askQuestionFlow',
    inputSchema: AskQuestionInputSchema,
    outputSchema: AskQuestionOutputSchema,
  },
  async ({propertyId, question, checkInDate, checkOutDate}) => {
    
    // Step 1: In a real app, you would first search a database/vector store
    // for a direct answer to common questions for this property.
    // We will simulate this by checking for keywords.
    if (question.toLowerCase().includes('check-out time') && !checkOutDate) {
        return { answer: "Check-out time is typically 11 AM, but please refer to your rental agreement for the exact time."}
    }

    // Step 2: If no direct answer is found, use an AI model with context.
    let context = getPropertyContext(propertyId);
    if(checkInDate) {
        context += `\nThe guest's check-in date is ${checkInDate}.`;
    }
    if(checkOutDate) {
        context += `\nThe guest's check-out date is ${checkOutDate}.`;
    }
    
    const {output} = await prompt({ question, context });
    return output!;
    
    // Step 3: If the AI still can't answer, you could implement a fallback,
    // like offering to send a message to the property owner.
  }
);
