import {
  promptToCollectionItem,
  PromptToItemRequest,
  PromptToItemResponse,
} from "../promptToCollectionItem";

// Mock OpenAI
jest.mock("openai", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

// Mock mappers
jest.mock("../../mappers", () => ({
  mapIncomingCollectionItem: jest.fn().mockReturnValue({
    id: "test-uuid",
    type: "event",
    status: "published",
    slug: "test-event",
    title: "Test Event",
    created_at: "2025-07-03T10:00:00.000Z",
    updated_at: "2025-07-03T10:00:00.000Z",
    data: {
      eventDate: "2025-08-15",
      city: "Dubai",
      featured: true,
    },
  }),
  collectionItemToDbFormat: jest.fn().mockReturnValue({
    title: "Test Event",
    description: null,
    type: "event",
    data: '{"eventDate":"2025-08-15","city":"Dubai","featured":true}',
    metaData: '{"slug":"test-event","status":"published"}',
    status: "active",
  }),
}));

// Mock database
jest.mock("../../../schema/db", () => ({
  pool: {
    query: jest.fn().mockResolvedValue({
      rows: [{ id: "db-test-id", title: "Test Event", type: "event" }],
    }),
  },
}));

describe("AI Prompt to Collection Item", () => {
  const mockOpenAI = require("openai").default;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up OpenAI mock
    const mockInstance = new mockOpenAI();
    mockCreate = mockInstance.chat.completions.create;

    // Mock environment variable
    process.env.OPENAI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  describe("Successful prompt processing", () => {
    it("should successfully process an event prompt with all required fields", async () => {
      // Mock successful AI response
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "event",
          data: {
            title: "AI Innovation Summit 2025",
            slug: "ai-innovation-summit-2025",
            status: "published",
            eventDate: "2025-08-15",
            city: "Dubai",
            featured: true,
            description: "A cutting-edge summit on AI innovations",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt:
          "Create an AI Innovation Summit happening on August 15, 2025 in Dubai. Make it featured.",
        type: "event",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("event");
        expect(result.data.data.title).toBe("AI Innovation Summit 2025");
        expect((result.data.data as any).city).toBe("Dubai");
        expect((result.data.data as any).eventDate).toBe("2025-08-15");
        expect((result.data.data as any).featured).toBe(true);
      }

      expect(mockCreate).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          expect.objectContaining({
            role: "user",
            content: expect.stringContaining("Create an AI Innovation Summit"),
          }),
        ]),
        temperature: 0.1,
      });
    });

    it("should save to database when saveToDatabase is true", async () => {
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "event",
          data: {
            title: "Test Event",
            slug: "test-event",
            status: "published",
            eventDate: "2025-08-15",
            city: "Dubai",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt: "Create a test event on August 15, 2025 in Dubai",
        type: "event",
      };

      const result = await promptToCollectionItem(request, true);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.id).toBe("db-test-id");
      }

      const { pool } = require("../../../schema/db");
      expect(pool.query).toHaveBeenCalled();
    });

    it("should correctly infer collection type from prompt", async () => {
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "post",
          data: {
            title: "Amazing Blog Post",
            slug: "amazing-blog-post",
            status: "published",
            datePublished: "2025-07-15",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt: "Write a blog post about sustainable technology innovations",
        // No type specified - should infer 'post'
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("post");
      }
    });
  });

  describe("Error handling", () => {
    it("should handle missing required fields", async () => {
      const mockAIResponse = {
        status: "error",
        message: "Missing required information for event creation",
        missing: ["eventDate", "city"],
        partial_data: {
          title: "Incomplete Event",
          slug: "incomplete-event",
          status: "draft",
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt: "Create an event called Incomplete Event",
        type: "event",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.missing).toEqual(["eventDate", "city"]);
        expect(result.partialData).toBeDefined();
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions.length).toBeGreaterThan(0);
      }
    });

    it("should handle OpenAI API errors", async () => {
      mockCreate.mockRejectedValue(new Error("OpenAI API error"));

      const request: PromptToItemRequest = {
        prompt: "Create a test event",
        type: "event",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("OpenAI API error");
      }
    });

    it("should handle invalid JSON response from AI", async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: "Invalid JSON response",
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt: "Create a test event",
        type: "event",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("AI returned invalid JSON");
      }
    });

    it("should handle missing OpenAI API key", async () => {
      delete process.env.OPENAI_API_KEY;

      const request: PromptToItemRequest = {
        prompt: "Create a test event",
        type: "event",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("OpenAI API key is not configured");
      }
    });
  });

  describe("Type inference", () => {
    it('should infer "event" type from event-related keywords', async () => {
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "event",
          data: {
            title: "Conference 2025",
            slug: "conference-2025",
            status: "published",
            eventDate: "2025-08-15",
            city: "Dubai",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const requests = [
        "Create a conference next month",
        "Plan a workshop on AI",
        "Schedule a meeting with stakeholders",
        "Organize a summit in Dubai",
      ];

      for (const prompt of requests) {
        const request: PromptToItemRequest = { prompt };
        const result = await promptToCollectionItem(request, false);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.type).toBe("event");
        }
      }
    });

    it('should infer "post" type from blog-related keywords', async () => {
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "post",
          data: {
            title: "Blog Post",
            slug: "blog-post",
            status: "published",
            datePublished: "2025-07-15",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const requests = [
        "Write a blog about sustainability",
        "Create a post on technology trends",
        "Draft an article on innovation",
      ];

      for (const prompt of requests) {
        const request: PromptToItemRequest = { prompt };
        const result = await promptToCollectionItem(request, false);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.type).toBe("post");
        }
      }
    });
  });

  describe("Context handling", () => {
    it("should include context in AI prompt", async () => {
      const mockAIResponse = {
        status: "ok",
        data: {
          type: "event",
          data: {
            title: "Contextual Event",
            slug: "contextual-event",
            status: "published",
            eventDate: "2025-08-15",
            city: "Dubai",
          },
        },
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      });

      const request: PromptToItemRequest = {
        prompt: "Create a technology event",
        type: "event",
        context:
          "This event should focus on sustainable technology and be targeted at researchers",
      };

      const result = await promptToCollectionItem(request, false);

      expect(result.success).toBe(true);
      expect(mockCreate).toHaveBeenCalledWith({
        model: "gpt-4",
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "user",
            content: expect.stringContaining(
              "Additional context: This event should focus on sustainable technology"
            ),
          }),
        ]),
        temperature: 0.1,
      });
    });
  });
});
