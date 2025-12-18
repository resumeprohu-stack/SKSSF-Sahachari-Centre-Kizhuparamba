'use server';

import { getSmartStatusInsights, SmartStatusInsightsInput } from '@/ai/flows/smart-status-insights';
import { z } from 'zod';

const SmartStatusInsightsInputSchema = z.object({
  items: z.array(
    z.object({
      itemName: z.string(),
      status: z.string(),
      recipientName: z.string().optional(),
      issueDate: z.string().optional(),
      expectedReturnDate: z.string().optional(),
      actualReturnDate: z.string().optional(),
    })
  ),
});

export async function fetchSmartInsights(input: SmartStatusInsightsInput) {
    
    const validatedInput = SmartStatusInsightsInputSchema.safeParse(input);

    if (!validatedInput.success) {
        console.error("Invalid input for smart insights:", validatedInput.error);
        return { insights: [], error: "Invalid input provided." };
    }

  try {
    const result = await getSmartStatusInsights(validatedInput.data);
    return { insights: result.insights, error: null };
  } catch (error) {
    console.error("Error fetching smart insights:", error);
    return { insights: [], error: "Failed to fetch AI insights." };
  }
}
