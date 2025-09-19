'use server';

/**
 * @fileOverview ID Verification Flow for KeyMaster App.
 *
 * This file contains the Genkit flow for verifying a guest's identity using ID/passport scan and selfie.
 * It includes:
 * - idVerificationFlow: The main flow for ID verification.
 * - IdVerificationInput: The input type for the flow.
 * - IdVerificationOutput: The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdVerificationInputSchema = z.object({
  idScanDataUri: z
    .string()
    .describe(
      "A photo of an ID or passport, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  selfieDataUri: z
    .string()
    .describe(
      "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ).optional(),
});

export type IdVerificationInput = z.infer<typeof IdVerificationInputSchema>;

const IdVerificationOutputSchema = z.object({
  isIdValid: z.boolean().describe('Whether the provided document is a valid government-issued ID (not a credit card, etc.).'),
  isSelfieMatch: z.boolean().describe('Whether the face in the selfie matches the face on the ID.'),
  verificationStatus: z.enum(['Verified', 'Failed', 'Error']).describe('The overall status of the verification.'),
  reason: z.string().describe('A brief explanation of the verification result, especially in case of failure.'),
  guestName: z.string().optional().describe('The full name of the person as it appears on the ID.'),
});

export type IdVerificationOutput = z.infer<typeof IdVerificationOutputSchema>;

export async function idVerification(input: IdVerificationInput): Promise<IdVerificationOutput> {
  return idVerificationFlow(input);
}

const idVerificationPrompt = ai.definePrompt({
  name: 'idVerificationPrompt',
  input: {schema: IdVerificationInputSchema},
  output: {schema: IdVerificationOutputSchema},
  prompt: `You are an AI assistant specializing in advanced identity verification for the KeyMaster application. Your task is to verify a user's identity based on an image of a government-issued ID (like a passport, driver's license, or national ID card) and optionally a selfie.

**Verification Steps:**

1.  **Validate the ID Document:**
    *   Examine the ID scan.
    *   Confirm that it is a legitimate form of government-issued identification.
    *   Explicitly reject any documents that are clearly not valid IDs, such as bank cards, library cards, or other non-official documents. Set \`isIdValid\` to \`false\` if it's not a valid ID type.
    *   If it appears to be a valid ID type, extract the person's full name and set \`guestName\`.

2.  **Match the Selfie (if provided):**
    *   If a selfie is provided, compare the face in the selfie photo with the face on the ID document.
    *   Determine if they are the same person. Set \`isSelfieMatch\` accordingly.
    *   If no selfie is provided, set \`isSelfieMatch\` to \`true\` by default.

3.  **Determine Final Verification Status:**
    *   If \`isIdValid\` is \`true\` and \`isSelfieMatch\` is \`true\`, set \`verificationStatus\` to \`Verified\`.
    *   If \`isIdValid\` is \`false\`, set \`verificationStatus\` to \`Failed\` and set the \`reason\` to "Invalid document type provided. Please upload a valid government-issued ID."
    *   If \`isIdValid\` is \`true\` but \`isSelfieMatch\` is \`false\`, set \`verificationStatus\` to \`Failed\` and set the \`reason\` to "Selfie does not match the ID photo. Please try again."
    *   If you cannot determine the outcome for any reason, set \`verificationStatus\` to \`Error\` and provide a reason.

**Input Images:**

ID Scan: {{media url=idScanDataUri}}
{{#if selfieDataUri}}
Selfie: {{media url=selfieDataUri}}
{{/if}}

Produce a JSON output that strictly follows the output schema.
`,
});

const idVerificationFlow = ai.defineFlow(
  {
    name: 'idVerificationFlow',
    inputSchema: IdVerificationInputSchema,
    outputSchema: IdVerificationOutputSchema,
  },
  async input => {
    const {output} = await idVerificationPrompt(input);
    return output!;
  }
);
