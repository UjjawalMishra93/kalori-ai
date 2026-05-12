import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

// Priority-ordered fallback models (fastest/best first, lite last)
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
];

function sanitizeErrorMessage(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('429') || msg.includes('quota')) {
    return 'Daily limit reached. Please try again later.';
  }
  if (msg.includes('busy') || msg.includes('overloaded') || msg.includes('503')) {
    return 'AI is currently busy. Please try again in a few seconds.';
  }
  if (msg.includes('api key') || msg.includes('invalid')) {
    return 'Configuration error. Please check your API key.';
  }
  if (msg.includes('format') || msg.includes('json')) {
    return 'Failed to read meal data. Please try a clearer photo.';
  }
  if (msg.includes('image') || msg.includes('file')) {
    return 'Issue with the image file. Please try another one.';
  }
  return 'An unexpected error occurred. Please try again.';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: 'Google API Key is not configured' }, { status: 500 });
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Single combined prompt — identify food AND calculate nutrition in ONE call
    // This cuts API usage in half and avoids hitting quota on the second call
    const combinedPrompt = `You are a expert nutritionist and food recognition AI.

Look at this meal image carefully. Do two things:
1. Identify every food item and estimate its quantity/weight
2. Calculate the total estimated nutrition for the ENTIRE meal

Return ONLY a raw JSON object (no markdown, no triple backticks) with exactly this structure:
{
  "food_name": "Short human-friendly name of the overall meal",
  "ingredients": [
    { "name": "ingredient name", "quantity": "e.g. 200g or 1 cup or 2 pieces" }
  ],
  "calories": <total number>,
  "protein": <total grams>,
  "carbs": <total grams>,
  "fats": <total grams>,
  "fiber": <total grams>,
  "confidence": <number between 70-99>
}

Use USDA nutritional data as your reference for the calculations. Be as accurate as possible with portion estimation.`;

    let result: any = null;
    let lastError: any = null;
    let usedModel = '';

    for (const modelName of FALLBACK_MODELS) {
      try {
        console.log(`[Scan] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent([
          combinedPrompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: file.type || 'image/jpeg',
            },
          },
        ]);
        result = response;
        usedModel = modelName;
        break;
      } catch (e: any) {
        console.warn(`[Fallback] Model ${modelName} failed: ${e.message}`);
        lastError = e;
      }
    }

    if (!result) {
      throw lastError || new Error('All Gemini models failed to process the image.');
    }

    const rawText = result.response.text();
    const cleanedText = rawText.replace(/```json|```/g, '').trim();

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json({
        error: 'AI returned an unexpected response format. Please try again.',
        geminiRawText: rawText,
        usedModel,
      }, { status: 500 });
    }

    return NextResponse.json({
      foodName: parsed.food_name || 'Unknown Meal',
      calories: Math.round(parsed.calories || 0),
      protein: Math.round(parsed.protein || 0),
      carbs: Math.round(parsed.carbs || 0),
      fats: Math.round(parsed.fats || 0),
      fiber: Math.round(parsed.fiber || 0),
      confidence: parsed.confidence || 90,
      ingredients: parsed.ingredients || [],
      // Debug fields
      geminiRawText: rawText,
      aiInsight: (parsed.ingredients || [])
        .map((i: any) => `${i.quantity} of ${i.name}`)
        .join(', '),
      usedModel,
    });

  } catch (error: any) {
    console.error('Scan Error:', error);
    const friendlyMessage = sanitizeErrorMessage(error.message || '');
    return NextResponse.json({ error: friendlyMessage }, { status: 500 });
  }
}
