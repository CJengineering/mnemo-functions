import OpenAI from "openai";
import { z } from "zod";
import { IncomingCollectionItem, IncomingCollectionItemData } from "../mappers";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schemas for validation
const AISuccessResponseSchema = z.object({
  status: z.literal("ok"),
  data: z.object({
    type: z.enum(["event", "post", "programme", "news", "source"]),
    data: z.record(z.any()), // Will be validated more specifically later
  }),
});

const AIErrorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
  missing: z.array(z.string()),
  partial_data: z.record(z.any()).optional(),
});

const AIResponseSchema = z.union([
  AISuccessResponseSchema,
  AIErrorResponseSchema,
]);

// System prompts for different collection types
const SYSTEM_PROMPTS = {
  event: `You are an AI assistant that converts natural language descriptions into structured event data.

REQUIRED FIELDS for events:
- title: string (event name)
- slug: string (URL-friendly version of title, lowercase, hyphens instead of spaces)
- status: "published" | "draft" 
- eventDate: string (ISO date format YYYY-MM-DD)
- city: string (event location city)

OPTIONAL FIELDS:
- featured: boolean
- arabicTitle: string
- description: string
- videoAsHero: boolean
- heroVideoYoutubeId: string
- thumbnail: object with url and alt text
- heroImage: object with url and alt text
- tags: array of objects with id and slug
- people: array of objects with id and slug
- relatedProgrammes: array of objects with id and slug
- programmeLabel: object with id and slug
- endDate: string (ISO date format)
- time: string
- address: string
- contactDetails: string
- rsvpLink: string

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "event",
    "data": { 
      "title": "extracted title",
      "slug": "url-friendly-slug",
      "status": "published",
      "eventDate": "YYYY-MM-DD",
      "city": "extracted city",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for event creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

  post: `You are an AI assistant that converts natural language descriptions into structured blog post data.

REQUIRED FIELDS for posts:
- title: string
- slug: string (URL-friendly, lowercase, hyphens)
- status: "published" | "draft"
- datePublished: string (ISO date YYYY-MM-DD)

OPTIONAL FIELDS:
- arabicTitle: string
- bodyEnglish: string
- bodyArabic: string
- featured: boolean
- seoTitle: string
- seoMeta: string
- thumbnail: object with url and alt
- mainImage: object with url and alt
- tags: array of objects with id and slug
- blogCategory: object with id and slug
- people: array of objects with id and slug
- relatedEvent: object with id and slug
- programmeLabel: object with id and slug

Follow the same response format as events. Always generate slug from title.`,

  news: `You are an AI assistant that converts natural language descriptions into structured news article data.

REQUIRED FIELDS for news:
- title: string
- slug: string (URL-friendly, lowercase, hyphens)
- status: "published" | "draft"
- datePublished: string (ISO date YYYY-MM-DD)

OPTIONAL FIELDS:
- arabicTitle: string
- externalLink: string
- featured: boolean
- summary: string
- summaryArabic: string
- excerpt: string
- thumbnail: object with url and alt
- heroImage: object with url and alt
- tags: array of objects with id and slug
- sources: object with id and slug
- programmeLabel: object with id and slug
- people: array of objects with id and slug

Follow the same response format as events. Always generate slug from title.`,

  programme: `You are an AI assistant that converts natural language descriptions into structured programme data.

REQUIRED FIELDS for programmes:
- title: string
- slug: string (URL-friendly, lowercase, hyphens)
- status: "published" | "draft"

OPTIONAL FIELDS:
- nameArabic: string
- shortNameEnglish: string
- shortNameArabic: string
- missionEnglish: string
- missionArabic: string
- description: string
- summaryEnglish: string
- summaryArabic: string
- yearEstablished: number
- yearClosed: number
- headquartersEnglish: string
- headquartersArabic: string
- website: string
- lab: boolean
- order: number
- logoSvgDark: object with url and alt
- logoSvgLight: object with url and alt

Follow the same response format as events. Always generate slug from title.`,

  source: `You are an AI assistant that converts natural language descriptions into structured source data.

REQUIRED FIELDS for sources:
- title: string
- slug: string (URL-friendly, lowercase, hyphens)
- status: "published" | "draft"

OPTIONAL FIELDS:
- nameArabic: string
- shortNameEnglish: string
- shortNameArabic: string
- logo: object with url and alt
- logoNative: object with url and alt

Follow the same response format as events. Always generate slug from title.`,
};

export interface PromptToItemRequest {
  prompt: string;
  type?: "event" | "post" | "programme" | "news" | "source";
  context?: string; // Additional context from user
}

export interface PromptToItemSuccessResponse {
  success: true;
  data: IncomingCollectionItem;
  aiResponse: any;
  id?: string; // If saved to database
}

export interface PromptToItemErrorResponse {
  success: false;
  message: string;
  missing: string[];
  partialData?: any;
  suggestions?: string[];
}

export type PromptToItemResponse =
  | PromptToItemSuccessResponse
  | PromptToItemErrorResponse;

export async function promptToCollectionItem(
  request: PromptToItemRequest,
  saveToDatabase: boolean = false
): Promise<PromptToItemResponse> {
  try {
    console.log("🤖 Processing prompt:", request.prompt);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Determine collection type (either specified or inferred)
    const collectionType =
      request.type || (await inferCollectionType(request.prompt));

    // Get appropriate system prompt
    const systemPrompt = SYSTEM_PROMPTS[collectionType] || SYSTEM_PROMPTS.event;

    console.log(`🤖 Using collection type: ${collectionType}`);

    // Call ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Convert this description into structured data: "${
            request.prompt
          }"${
            request.context ? `\n\nAdditional context: ${request.context}` : ""
          }`,
        },
      ],
      temperature: 0.1, // Low temperature for consistent structured output
    });

    const aiResponseText = completion.choices[0]?.message?.content;

    if (!aiResponseText) {
      throw new Error("No response from AI");
    }

    console.log("🤖 AI Response:", aiResponseText);

    // Parse AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      throw new Error("AI returned invalid JSON: " + aiResponseText);
    }

    // Validate AI response structure
    const validatedResponse = AIResponseSchema.parse(aiResponse);

    if (validatedResponse.status === "error") {
      return {
        success: false,
        message: validatedResponse.message,
        missing: validatedResponse.missing,
        partialData: validatedResponse.partial_data,
        suggestions: generateSuggestions(
          validatedResponse.missing,
          collectionType
        ),
      };
    }

    // Success case - we have all required fields
    const collectionItemData: IncomingCollectionItem = {
      type: validatedResponse.data.type,
      data: validatedResponse.data.data as IncomingCollectionItemData,
    };

    if (saveToDatabase) {
      // Import mapper and database functions
      const { mapIncomingCollectionItem, collectionItemToDbFormat } =
        await import("../mappers");
      const { pool } = await import("../../schema/db");

      // Transform and save to database
      const mappedItem = mapIncomingCollectionItem(collectionItemData);
      const dbFormat = collectionItemToDbFormat(mappedItem);

      console.log("💾 Saving to database:", {
        title: dbFormat.title,
        type: dbFormat.type,
        status: dbFormat.status,
      });

      const result = await pool.query(
        `INSERT INTO collection_item (title, description, type, data, meta_data, status) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          dbFormat.title,
          dbFormat.description,
          dbFormat.type,
          dbFormat.data,
          dbFormat.metaData,
          dbFormat.status,
        ]
      );

      console.log("✅ Saved to database with ID:", result.rows[0].id);

      return {
        success: true,
        data: collectionItemData,
        aiResponse: validatedResponse,
        id: result.rows[0].id,
      };
    }

    // Return without saving to database
    return {
      success: true,
      data: collectionItemData,
      aiResponse: validatedResponse,
    };
  } catch (error) {
    console.error("❌ Prompt to Collection Item error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process prompt",
      missing: [],
      partialData: undefined,
    };
  }
}

// Helper function to infer collection type from prompt
async function inferCollectionType(
  prompt: string
): Promise<keyof typeof SYSTEM_PROMPTS> {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("event") ||
    lowerPrompt.includes("conference") ||
    lowerPrompt.includes("workshop") ||
    lowerPrompt.includes("meeting") ||
    lowerPrompt.includes("summit")
  ) {
    return "event";
  }
  if (
    lowerPrompt.includes("blog") ||
    lowerPrompt.includes("post") ||
    lowerPrompt.includes("article") ||
    lowerPrompt.includes("write")
  ) {
    return "post";
  }
  if (
    lowerPrompt.includes("news") ||
    lowerPrompt.includes("announcement") ||
    lowerPrompt.includes("press") ||
    lowerPrompt.includes("breaking")
  ) {
    return "news";
  }
  if (
    lowerPrompt.includes("programme") ||
    lowerPrompt.includes("program") ||
    lowerPrompt.includes("initiative") ||
    lowerPrompt.includes("project")
  ) {
    return "programme";
  }
  if (
    lowerPrompt.includes("source") ||
    lowerPrompt.includes("publication") ||
    lowerPrompt.includes("journal") ||
    lowerPrompt.includes("magazine")
  ) {
    return "source";
  }

  // Default to event if unclear
  return "event";
}

// Helper function to generate suggestions for missing fields
function generateSuggestions(missingFields: string[], type: string): string[] {
  const suggestions = [];

  for (const field of missingFields) {
    switch (field) {
      case "title":
        suggestions.push(
          `Please provide a clear title or name for this ${type}`
        );
        break;
      case "slug":
        suggestions.push(
          'Please provide a URL-friendly identifier (e.g., "my-event-2025")'
        );
        break;
      case "eventDate":
        suggestions.push(
          "Please specify when this event will take place (date)"
        );
        break;
      case "city":
        suggestions.push(
          "Please mention the city or location where this will happen"
        );
        break;
      case "datePublished":
        suggestions.push("Please specify when this should be published (date)");
        break;
      case "thumbnail":
        suggestions.push("Please provide an image URL for the thumbnail");
        break;
      case "status":
        suggestions.push(
          'Please specify if this should be "published" or "draft"'
        );
        break;
      default:
        suggestions.push(`Please provide information about: ${field}`);
    }
  }

  return suggestions;
}
