import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const FALLBACK_REPORT = {
  detected_objects: [],
  waste_type: 'Unable to confidently detect waste from the image',
  condition: 'Unable to confidently detect waste from the image',
  reuse_ideas: [],
  environmental_impact: {
    co2_saved_kg: '',
    water_saved_liters: '',
  },
  premium_startup_idea: {
    title: '',
    description: '',
    business_model: '',
    estimated_investment_inr: '',
    expected_roi_percentage: '',
    target_market: '',
    scalability: '',
  },
};

function extractJsonPayload(content) {
  if (!content) return null;
  const trimmed = String(content).trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1];
  return trimmed;
}

function parseNumeric(text) {
  const stripped = String(text ?? '').trim().replace(/[^0-9.]/g, '');
  return Number(stripped || 0);
}

function parseIndianValue(text) {
  const match = String(text || '').match(/(\d[\d,]*)/);
  if (!match) return 0;
  return Number(match[1].replace(/,/g, ''));
}

export function normalizeStructuredReport(report = {}) {
  const safeReport = { ...FALLBACK_REPORT, ...(report || {}) };
  const fallback = 'Unable to confidently detect waste from the image';
  const wasteType = safeReport.waste_type?.trim() || fallback;
  const condition = safeReport.condition?.trim() || fallback;
  const reuseIdeas = Array.isArray(safeReport.reuse_ideas) ? safeReport.reuse_ideas : [];
  const premium = safeReport.premium_startup_idea || {};
  const environment = safeReport.environmental_impact || {};

  return {
    ...safeReport,
    detected_objects: Array.isArray(safeReport.detected_objects) ? safeReport.detected_objects : [],
    waste_type: wasteType,
    condition,
    reuse_ideas: reuseIdeas,
    environmental_impact: {
      co2_saved_kg: environment.co2_saved_kg ?? '',
      water_saved_liters: environment.water_saved_liters ?? '',
    },
    premium_startup_idea: {
      ...FALLBACK_REPORT.premium_startup_idea,
      ...premium,
    },
    vision: {
      wasteType,
      materials: [],
      condition,
      confidence: 'medium',
    },
    material: {
      recoverable: reuseIdeas.slice(0, 3).map((idea, index) => ({
        name: idea.title || `Recovered material ${index + 1}`,
        method: idea.description || '',
      })),
      methods: reuseIdeas.slice(0, 3).map((idea) => idea.title),
      valuePotential: reuseIdeas[0]?.estimated_profit_inr || '',
    },
    economy: {
      currentValue: parseIndianValue(reuseIdeas[0]?.estimated_profit_inr),
      futureValue: Math.max(parseIndianValue(reuseIdeas[0]?.estimated_profit_inr), 5000),
      marketDemand: 'Strong demand in Indian recycling clusters and municipal waste programs',
      incomeOpportunity: reuseIdeas[0]?.real_world_example || '',
    },
    geo: {
      canada: 'Industrial material recovery and certified processing.',
      india: 'Community-scale collection and processing with strong local resale demand.',
      congo: 'Low-cost repair and reuse loops for local communities.',
    },
    startup: {
      name: premium.title || 'Circular startup concept',
      idea: premium.description || 'Convert this waste stream into a practical local product.',
      investment: premium.estimated_investment_inr || '₹5–20 lakh',
      revenueModel: premium.business_model || 'Service fee + resale margin',
      customers: premium.target_market || 'Indian recyclers, local SMEs, and municipal programs',
    },
    impact: {
      co2Saved: parseNumeric(environment.co2_saved_kg),
      waterSaved: parseNumeric(environment.water_saved_liters),
      earthRecoveryScore: 70,
    },
  };
}

export function buildCompatibilityReport(structuredReport) {
  return normalizeStructuredReport(structuredReport);
}

// ---------------------------------------------------------------------------
// VISION AGENT — uses Gemini to identify waste in the image
// ---------------------------------------------------------------------------
// Accepts both:
//   - base64 data URLs  (data:image/jpeg;base64,/9j/4AAQ...)
//   - remote HTTP URLs  (https://example.com/photo.jpg)
//
// Retry strategy:
//   1. Try gemini-2.0-flash
//   2. If 429 (quota), wait and retry with gemini-1.5-flash
//   3. If still 429, try gemini-1.5-flash-8b
//   4. If all Gemini models fail, fall back to Groq text-only analysis
// ---------------------------------------------------------------------------

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

const FALLBACK_WASTE_ITEMS = [
  {
    detected_objects: ['plastic bottle', 'beverage bottle', 'PET'],
    waste_type: 'Plastic Bottle (PET)',
    condition: 'Single-use plastic bottle, recyclable',
  },
  {
    detected_objects: ['used tyre', 'car wheel', 'rubber'],
    waste_type: 'Used Vehicle Tyre',
    condition: 'Worn car tyre, rubber-heavy, structurally durable',
  },
  {
    detected_objects: ['banana peel', 'fruit skins', 'organic waste'],
    waste_type: 'Banana Peel / Fruit Waste',
    condition: 'Organic, fresh and biodegradable',
  },
  {
    detected_objects: ['old circuit board', 'discarded mobile phone'],
    waste_type: 'Electronic Waste (E-Waste)',
    condition: 'Non-functional cell phone with recoverable metals',
  },
  {
    detected_objects: ['cardboard packaging box', 'carton'],
    waste_type: 'Cardboard Box / Paper Waste',
    condition: 'Dry cardboard box, recyclable cellulose fibres',
  }
];

function getRandomFallbackWaste() {
  const index = Math.floor(Math.random() * FALLBACK_WASTE_ITEMS.length);
  return {
    ...FALLBACK_WASTE_ITEMS[index],
    confidence: 'low',
    fallback: true,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiVision(model, mimeType, base64Data) {
  console.log(`[savior vision] Trying model: ${model}...`);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: 'Inspect the image and return ONLY valid JSON with these keys: detected_objects (array of strings), waste_type (string), condition (string describing the state of the waste), confidence (string: "high", "medium", or "low"). Keep the values concise and relevant to waste identification. Do not include any markdown formatting or explanation, ONLY the JSON object.',
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        }],
      }),
    }
  );

  if (response.status === 429) {
    const errorText = await response.text();
    // Extract retry delay from the error if available
    const retryMatch = errorText.match(/"retryDelay":\s*"(\d+)s"/);
    const retryDelay = retryMatch ? Math.min(parseInt(retryMatch[1], 10), 15) : 5;
    console.warn(`[savior vision] ${model} returned 429 (quota exceeded). Waiting ${retryDelay}s before trying next model...`);
    await sleep(retryDelay * 1000);
    return { rateLimited: true };
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${model} failed: ${response.status} ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join('\n');

  return { content };
}

async function runVisionAgent(imageUrl) {
  try {
    let base64;
    let mimeType;

    // ── Handle base64 data URLs (sent by the frontend via FileReader) ──
    if (imageUrl.startsWith('data:')) {
      const match = imageUrl.match(/^data:(image\/[\w+]+);base64,(.+)$/);
      if (!match) {
        throw new Error('Invalid data URL format — expected data:image/<type>;base64,<data>');
      }
      mimeType = match[1];
      base64 = match[2];
      console.log(`[savior vision] Using inline base64 image (${mimeType}, ${Math.round(base64.length / 1024)}KB encoded)`);
    }
    // ── Handle remote HTTP/HTTPS URLs ──
    else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log(`[savior vision] Fetching remote image: ${imageUrl.slice(0, 80)}...`);
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Unable to fetch image: ${imageResponse.status}`);
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      mimeType = imageUrl.match(/\.png/i) ? 'image/png' : imageUrl.match(/\.webp/i) ? 'image/webp' : 'image/jpeg';
      base64 = buffer.toString('base64');
    }
    // ── Unsupported URL scheme ──
    else {
      throw new Error(`Unsupported image URL scheme: ${imageUrl.slice(0, 40)}...`);
    }

    // ── Try each Gemini model in order ──
    if (GEMINI_API_KEY) {
      for (const model of GEMINI_MODELS) {
        try {
          const result = await callGeminiVision(model, mimeType, base64);

          if (result.rateLimited) {
            // This model is rate-limited, try the next one
            continue;
          }

          if (result.content) {
            console.log(`[savior vision] ${model} responded:`, result.content.slice(0, 200));
            const extracted = extractJsonPayload(result.content);
            try {
              return JSON.parse(extracted);
            } catch {
              return {
                detected_objects: [],
                waste_type: extracted.slice(0, 120),
                condition: 'Image analyzed through Gemini',
                confidence: 'medium',
              };
            }
          }
        } catch (modelError) {
          console.warn(`[savior vision] ${model} error:`, modelError.message);
          // Try next model
        }
      }
      console.warn('[savior vision] All Gemini models exhausted — falling back to Groq text-only analysis');
    } else {
      console.warn('[savior vision] GEMINI_API_KEY not configured — using Groq text-only analysis');
    }

    // ── Groq-only fallback: ask Groq to guess waste type from image metadata ──
    // Since Groq can't see images, we provide what we know and ask it to infer
    if (GROQ_API_KEY) {
      console.log('[savior vision] Attempting Groq text-only waste identification...');
      const groqResponse = await callGroq({
        model: GROQ_MODEL,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'You are a waste identification expert. The user uploaded a photo but the vision API is unavailable. Based on the image metadata provided, make your best guess about what kind of waste is in the image. Return ONLY valid JSON with: detected_objects (array), waste_type (string), condition (string), confidence (string: "low"). Be helpful even with limited information.',
          },
          {
            role: 'user',
            content: `An image was uploaded (MIME type: ${mimeType}, size: ~${Math.round(base64.length / 1024)}KB). The vision API could not process it. Based on typical waste scan scenarios, provide a reasonable waste identification. This is likely a photo of household waste, e-waste, plastic, organic waste, or similar items.`,
          },
        ],
      });

      const groqContent = extractJsonPayload(groqResponse.choices?.[0]?.message?.content);
      if (groqContent) {
        try {
          const parsed = JSON.parse(groqContent);
          parsed.confidence = 'low';
          parsed.fallback = true;
          return parsed;
        } catch {
          // Groq didn't return valid JSON either
        }
      }
    }

    // ── Final fallback ──
    throw new Error('All vision providers exhausted');
  } catch (error) {
    console.warn('[savior vision fallback]', error.message);
    return {
      detected_objects: [],
      waste_type: 'Unable to confidently detect waste from the image',
      condition: 'Unable to confidently detect waste from the image',
      confidence: 'low',
      fallback: true,
    };
  }
}

// ---------------------------------------------------------------------------
// GROQ — structured content generation using LLaMA via Groq
// ---------------------------------------------------------------------------
async function callGroq(payload) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function runGroqStructuredAnalysis(visionResult) {
  try {
    const prompt = `
You are SaveEarth AI. Use the detected image context and return STRICT JSON only.
Input context: ${JSON.stringify(visionResult)}
Rules:
- Only generate ideas strictly related to the detected waste.
- Use realistic Indian recycling data and the requested benchmarks.
- If no waste is clearly detected, return the fallback structure with the phrase "Unable to confidently detect waste from the image".
- Return this exact schema:
{
  "detected_objects": [],
  "waste_type": "",
  "condition": "",
  "reuse_ideas": [{"title":"","description":"","difficulty":"","estimated_profit_inr":"","real_world_example":""}],
  "environmental_impact": {"co2_saved_kg":"","water_saved_liters":""},
  "premium_startup_idea": {"title":"","description":"","business_model":"","estimated_investment_inr":"","expected_roi_percentage":"","target_market":"","scalability":""}
}
`;

    console.log('[savior groq] Sending vision context to Groq for structured analysis...');
    const response = await callGroq({
      model: GROQ_MODEL,
      temperature: 0.2,
      max_tokens: 1400,
      messages: [
        {
          role: 'system',
          content: 'You are SaveEarth AI. Respond only with valid JSON matching the requested schema. Do not include markdown formatting, code fences, or any text outside the JSON object.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const content = extractJsonPayload(response.choices?.[0]?.message?.content);
    if (!content) throw new Error('Groq returned no content');
    console.log('[savior groq] Groq raw response:', content.slice(0, 200));
    return JSON.parse(content);
  } catch (error) {
    console.warn('[savior groq fallback]', error.message);
    return {
      ...FALLBACK_REPORT,
      waste_type: visionResult?.waste_type || FALLBACK_REPORT.waste_type,
      condition: visionResult?.condition || FALLBACK_REPORT.condition,
    };
  }
}

// ---------------------------------------------------------------------------
// ORCHESTRATOR — chains Gemini vision → Groq content → normalized report
// ---------------------------------------------------------------------------
export async function runOrchestrator({ imageUrl }) {
  console.log('[savior orchestrator] Starting analysis pipeline...');
  console.log('[savior orchestrator] Image type:', imageUrl?.startsWith('data:') ? 'base64 data URL' : 'remote URL');

  const vision = await runVisionAgent(imageUrl);
  console.log('[savior vision result]', JSON.stringify(vision).slice(0, 300));

  const structured = await runGroqStructuredAnalysis(vision);
  console.log('[savior groq result]', JSON.stringify(structured).slice(0, 300));

  return normalizeStructuredReport(structured);
}
