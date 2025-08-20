import OpenAI from "openai";
import { z } from "zod";
import { IncomingCollectionItem, IncomingCollectionItemData } from "../mappers";

// Initialize OpenAI client with null safety for testing
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Zod schemas for validation
const AISuccessResponseSchema = z.object({
  status: z.literal("ok"),
  data: z.object({
    type: z.enum([
      "event",
      "post",
      "programme",
      "news",
      "source",
      "team",
      "partner",
      "person",
      "tag",
    ]),
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

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "post",
    "data": { 
      "title": "extracted title",
      "slug": "url-friendly-slug",
      "status": "published",
      "datePublished": "YYYY-MM-DD",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for post creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

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

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "news",
    "data": { 
      "title": "extracted title",
      "slug": "url-friendly-slug",
      "status": "published",
      "datePublished": "YYYY-MM-DD",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for news creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

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

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "programme",
    "data": { 
      "title": "extracted title",
      "slug": "url-friendly-slug",
      "status": "published",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for programme creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

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

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "source",
    "data": { 
      "title": "extracted title",
      "slug": "url-friendly-slug",
      "status": "published",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for source creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

  team: `You are an AI assistant that converts natural language descriptions into structured team member data.

REQUIRED FIELDS for team members:
- title: string (full name/title of the person)
- slug: string (URL-friendly version of name, lowercase, hyphens instead of spaces)
- status: "published" | "draft"
- paragraphDescription: string (brief description of the person)
- order: number (display order, use 1 if not specified)
- photo: object with url and alt text (profile photo)

OPTIONAL FIELDS:
- name: string (if different from title)
- nameArabic: string
- position: string (job title/role)
- positionArabic: string
- biographyArabic: string
- metaDescription: string
- metaDescriptionArabic: string
- altTextImage: string
- altTextImageArabic: string
- filter: "Leadership" | "Team" | "Advisory Committee" | "Alumnus" | "COP27 Youth Delegate"
- newsOnOff: boolean (whether to show in news sections)
- photoHires: string (high-resolution photo URL)
- tags: array of objects with id and slug

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "team",
    "data": { 
      "title": "Dr. Jane Smith",
      "slug": "dr-jane-smith",
      "status": "published",
      "paragraphDescription": "Brief description of the person",
      "order": 1,
      "photo": {
        "url": "https://example.com/photo.jpg",
        "alt": "Dr. Jane Smith"
      }
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for team member creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

  partner: `You are an AI assistant that converts natural language descriptions into structured partner organization data.

REQUIRED FIELDS for partners:
- title: string (organization name - maps to "name" field)
- slug: string (URL-friendly, lowercase, hyphens)
- name: string (organization's official name)
- status: "published" | "draft"

OPTIONAL FIELDS:
- arabic-name: string (organization name in Arabic)
- short-description: string (brief description of the organization)
- short-description-arabic: string (brief description in Arabic)
- website: string (organization's website URL)
- logo: object with url and alt text
- group: string (currently supports "COP27" as an option)
- tags: array of objects with id and slug

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "partner",
    "data": { 
      "title": "Tech Solutions Inc",
      "slug": "tech-solutions-inc",
      "name": "Tech Solutions Inc",
      "status": "published",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for partner creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

  person: `You are an AI assistant that converts natural language descriptions into structured person data.

REQUIRED FIELDS for people:
- title: string (person's display name - used as the page title)
- slug: string (URL-friendly, lowercase, hyphens)
- name: string (person's official name)
- status: "published" | "draft"

OPTIONAL FIELDS:
- name-arabic: string (person's name in Arabic)
- arabic-on-off: boolean (whether Arabic content is enabled)
- push-to-gr: boolean (whether to push to GR system)
- hero: boolean (whether this is a hero/featured person)
- related-programme: object with id and slug (primary programme association)
- related-programmes: array of objects with id and slug (all programme associations)
- color: string (hex color code for theming)
- role: string (person's role/position in English)
- role-arabic: string (person's role/position in Arabic)
- short-description: string (brief description in English, e.g., "President, American University in Cairo")
- short-description-arabic: string (brief description in Arabic)
- biography: string (full biography in English - rich text)
- biography-arabic: string (full biography in Arabic - rich text)
- events: string (events information in English - rich text)
- events-arabic: string (events information in Arabic - rich text)
- research-area-english: string (research areas in English - rich text)
- research-areas-arabic: string (research areas in Arabic - rich text)
- type: string (one of: "Professor", "Doctor", "Economist", "Researcher", "Engineer", "Diplomat", "Government official", "Organisational leadership", "Art curator", "Artist", "Musician", "Filmmaker", "Photographer")
- hero-image: object with url and alt text
- profile-picture: object with url and alt text
- feature-video: string (YouTube video ID)
- related-people-s: array of objects with id and slug (related people)
- partner-organisation: array of objects with id and slug (partner organizations)
- instagram-link: string (Instagram profile URL)
- linkedin-link: string (LinkedIn profile URL) 
- twitter-link: string (Twitter profile URL)
- facebook: string (Facebook profile URL)
- youtube-link: string (YouTube channel URL)
- github: string (GitHub profile URL)
- website-link: string (personal/professional website URL)
- shop: string (online shop URL for artists/entrepreneurs)
- photos: array of objects with url and alt text (photo gallery)
- hide-news: boolean (hide news section)
- hide-multimedia: boolean (hide multimedia section)
- hide-events: boolean (hide events section)
- hide-publications: boolean (hide publications section)
- hide-photos: boolean (hide photos section)
- hide-events-rich-text: boolean (hide events rich text section)
- multimedia: array of objects with id and slug (multimedia references)
- tag: array of objects with id and slug (tags)
- order: number (display order)
- country: string (person's country)

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "person",
    "data": { 
      "title": "Dr. Sarah Johnson",
      "slug": "dr-sarah-johnson",
      "name": "Sarah Johnson",
      "status": "published",
      "role": "Chief Research Scientist",
      "short-description": "Leading AI researcher and climate tech expert",
      "type": "Researcher",
      // ... any optional fields you can extract
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for person creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,

  tag: `You are an AI assistant that converts natural language descriptions into structured tag data.

REQUIRED FIELDS for tags:
- title: string (tag display name - used as the page title)
- slug: string (URL-friendly, lowercase, hyphens)
- name: string (tag name, typically same as title)
- status: "published" | "draft"

OPTIONAL FIELDS:
- name-arabic: string (tag name in Arabic)

RESPONSE FORMAT:
If you can extract all REQUIRED fields, respond with:
{
  "status": "ok",
  "data": {
    "type": "tag",
    "data": { 
      "title": "Machine Learning",
      "slug": "machine-learning",
      "name": "Machine Learning",
      "status": "published",
      "name-arabic": "التعلم الآلي"
    }
  }
}

If missing required fields, respond with:
{
  "status": "error", 
  "message": "Missing required information for tag creation",
  "missing": ["field1", "field2"],
  "partial_data": { /* any fields you could extract */ }
}

IMPORTANT: Always generate a slug from the title (lowercase, replace spaces with hyphens, remove special characters).`,
};

export interface PromptToItemRequest {
  prompt: string;
  type?:
    | "event"
    | "post"
    | "programme"
    | "news"
    | "source"
    | "team"
    | "partner"
    | "person"
    | "tag";
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
        `INSERT INTO collection_item (slug, title, type, data, status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          dbFormat.slug,
          dbFormat.title,
          dbFormat.type,
          JSON.stringify(dbFormat.data),
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
  if (
    lowerPrompt.includes("person") ||
    lowerPrompt.includes("individual") ||
    lowerPrompt.includes("researcher") ||
    lowerPrompt.includes("professor") ||
    lowerPrompt.includes("doctor") ||
    lowerPrompt.includes("dr.") ||
    lowerPrompt.includes("economist") ||
    lowerPrompt.includes("engineer") ||
    lowerPrompt.includes("diplomat") ||
    lowerPrompt.includes("artist") ||
    lowerPrompt.includes("musician") ||
    lowerPrompt.includes("filmmaker") ||
    lowerPrompt.includes("photographer") ||
    lowerPrompt.includes("curator") ||
    lowerPrompt.includes("biography") ||
    lowerPrompt.includes("bio") ||
    lowerPrompt.includes("profile") ||
    lowerPrompt.includes("cv") ||
    lowerPrompt.includes("resume")
  ) {
    return "person";
  }
  if (
    lowerPrompt.includes("team") ||
    lowerPrompt.includes("staff") ||
    lowerPrompt.includes("member") ||
    lowerPrompt.includes("employee") ||
    lowerPrompt.includes("director") ||
    lowerPrompt.includes("manager") ||
    lowerPrompt.includes("leader") ||
    lowerPrompt.includes("ceo") ||
    lowerPrompt.includes("cto")
  ) {
    return "team";
  }
  if (
    lowerPrompt.includes("partner") ||
    lowerPrompt.includes("organization") ||
    lowerPrompt.includes("company") ||
    lowerPrompt.includes("institution") ||
    lowerPrompt.includes("foundation") ||
    lowerPrompt.includes("corp") ||
    lowerPrompt.includes("ltd") ||
    lowerPrompt.includes("inc") ||
    lowerPrompt.includes("collaboration") ||
    lowerPrompt.includes("sponsor") ||
    lowerPrompt.includes("supporter")
  ) {
    return "partner";
  }
  if (
    lowerPrompt.includes("tag") ||
    lowerPrompt.includes("label") ||
    lowerPrompt.includes("category") ||
    lowerPrompt.includes("topic") ||
    lowerPrompt.includes("taxonomy") ||
    lowerPrompt.includes("keyword") ||
    lowerPrompt.includes("classification") ||
    lowerPrompt.includes("tagging") ||
    lowerPrompt.includes("categorize") ||
    lowerPrompt.includes("classify")
  ) {
    return "tag";
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
      case "paragraphDescription":
        suggestions.push("Please provide a brief description of this person");
        break;
      case "photo":
        suggestions.push("Please provide a profile photo URL");
        break;
      case "order":
        suggestions.push("Please specify the display order (e.g., 1, 2, 3...)");
        break;
      default:
        suggestions.push(`Please provide information about: ${field}`);
    }
  }

  return suggestions;
}
