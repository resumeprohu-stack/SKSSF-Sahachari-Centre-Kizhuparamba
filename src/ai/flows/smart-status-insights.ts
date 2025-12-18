 'use server';

/**
 * @fileOverview Provides smart status insights for item management, identifying potential issues and suggesting actions.
 *
 * - getSmartStatusInsights - A function that retrieves smart status insights for item management.
 * - SmartStatusInsightsInput - The input type for the getSmartStatusInsights function.
 * - SmartStatusInsightsOutput - The return type for the getSmartStatusInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartStatusInsightsInputSchema = z.object({
  items: z.array(
    z.object({
      itemName: z.string().describe('The name of the item.'),
      issuedTo: z.string().optional().describe('The name of the person the item is issued to, if applicable.'),
      issueDate: z.string().optional().describe('The date the item was issued, if applicable.'),
      expectedReturnDate: z.string().optional().describe('The expected return date, if applicable.'),
      actualReturnDate: z.string().optional().describe('The actual return date, if applicable.'),
      status: z.string().describe('The current status of the item (Available, Issued, Returned).'),
    })
  ).describe('A list of items with their details.'),
});
export type SmartStatusInsightsInput = z.infer<typeof SmartStatusInsightsInputSchema>;

const SmartStatusInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      item: z.string().describe('The name of the item the insight pertains to.'),
      issue: z.string().describe('The identified issue or potential problem.'),
      suggestedAction: z.string().describe('The suggested action to resolve the issue.'),
    })
  ).describe('A list of insights and suggested actions.'),
});
export type SmartStatusInsightsOutput = z.infer<typeof SmartStatusInsightsOutputSchema>;

export async function getSmartStatusInsights(input: SmartStatusInsightsInput): Promise<SmartStatusInsightsOutput> {
  return smartStatusInsightsFlow(input);
}

const smartStatusInsightsPrompt = ai.definePrompt({
  name: 'smartStatusInsightsPrompt',
  input: {schema: SmartStatusInsightsInputSchema},
  output: {schema: SmartStatusInsightsOutputSchema},
  prompt: `You are an AI assistant helping a charity organization manage their resources.

  Your task is to analyze a list of items and identify potential issues or inconsistencies in their status, such as approaching return deadlines or items that are overdue.

  Based on your analysis, suggest actions to resolve these issues.

  Here is the list of items:

  {{#each items}}
  - Item Name: {{itemName}}
    Status: {{status}}
    {{#if issuedTo}}Issued To: {{issuedTo}}{{/if}}
    {{#if issueDate}}Issue Date: {{issueDate}}{{/if}}
    {{#if expectedReturnDate}}Expected Return Date: {{expectedReturnDate}}{{/if}}
    {{#if actualReturnDate}}Actual Return Date: {{actualReturnDate}}{{/if}}
  {{/each}}

  Format your output as a JSON array of insights, where each insight includes the item name, the identified issue, and a suggested action.
  Ensure that you only provide insights that indicate potential problems. Here is the format:
  {
    "insights": [
      {
        "item": "[Item Name]",
        "issue": "[Identified Issue]",
        "suggestedAction": "[Suggested Action]"
      }
    ]
  }
  `,
});

const smartStatusInsightsFlow = ai.defineFlow(
  {
    name: 'smartStatusInsightsFlow',
    inputSchema: SmartStatusInsightsInputSchema,
    outputSchema: SmartStatusInsightsOutputSchema,
  },
  async input => {
    const {output} = await smartStatusInsightsPrompt(input);
    return output!;
  }
); 
