import express, { Request, Response } from "express";
import cors from "cors";

// 1. Create Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// 2. Health Check
app.get("/", (_req: Request, res: Response) => {
  res.send(
    "🚀 Mnemo Cloud Function is up and running - CI/CD Pipeline Active!"
  );
});

// 3. Health endpoint with detailed status
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8080,
    environment: process.env.NODE_ENV || "development",
  });
});

// 4. Test route
app.get("/test", (_req: Request, res: Response) => {
  res.json({ msg: "test works" });
});

// 5. Production Collection Item route with database integration
app.post("/api/collection-items", async (req: Request, res: Response) => {
  try {
    const { createCollectionItemFromForm } = await import(
      "./src/collectionItem"
    );

    // Use the new mapper-based function that saves to database
    await createCollectionItemFromForm(req, res);
  } catch (error) {
    console.error("❌ Database integration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database operation failed";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 5a. GET collection items by type (MUST come before /:id route)
app.get(
  "/api/collection-items/type/:type",
  async (req: Request, res: Response) => {
    try {
      const { getCollectionItemsByType } = await import("./src/collectionItem");
      await getCollectionItemsByType(req, res);
    } catch (error) {
      console.error("❌ Get collection items by type error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch collection items by type";
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
);

// 5b. GET all collection items
app.get("/api/collection-items", async (req: Request, res: Response) => {
  try {
    const { getAllCollectionItems } = await import("./src/collectionItem");
    await getAllCollectionItems(req, res);
  } catch (error) {
    console.error("❌ Get all collection items error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch collection items";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 5c. GET collection item by ID (MUST come after /type/:type route)
app.get("/api/collection-items/:id", async (req: Request, res: Response) => {
  try {
    const { getCollectionItemById } = await import("./src/collectionItem");
    await getCollectionItemById(req, res);
  } catch (error) {
    console.error("❌ Get collection item by ID error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 5d. PUT update collection item by ID
app.put("/api/collection-items/:id", async (req: Request, res: Response) => {
  try {
    const { updateCollectionItem } = await import("./src/collectionItem");
    await updateCollectionItem(req, res);
  } catch (error) {
    console.error("❌ Update collection item error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 5e. DELETE collection item by ID
app.delete("/api/collection-items/:id", async (req: Request, res: Response) => {
  try {
    const { deleteCollectionItem } = await import("./src/collectionItem");
    await deleteCollectionItem(req, res);
  } catch (error) {
    console.error("❌ Delete collection item error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to delete collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 6. Collection Item demo route with mapper (demo only - doesn't save to DB)
app.post("/api/collection-items/demo", async (req: Request, res: Response) => {
  try {
    const { mapIncomingCollectionItem, collectionItemToDbFormat } =
      await import("./src/mappers");

    console.log("📥 Received form data:", req.body);

    // Transform using mapper
    const mappedItem = mapIncomingCollectionItem(req.body);
    const dbFormat = collectionItemToDbFormat(mappedItem);

    console.log("🔄 Mapped to database format:", {
      title: dbFormat.title,
      type: dbFormat.type,
      status: dbFormat.status,
    });

    // For now, just return the transformed data (later you can save to DB)
    res.status(201).json({
      success: true,
      originalData: req.body,
      mappedData: mappedItem,
      databaseFormat: dbFormat,
    });
  } catch (error) {
    console.error("❌ Mapper error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Mapping failed";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 7. AI-powered endpoints
app.post("/api/prompt-to-item", async (req: Request, res: Response) => {
  try {
    const { promptToItemEndpoint } = await import("./src/api/promptToItemRoutes");
    await promptToItemEndpoint(req, res);
  } catch (error) {
    console.error("❌ AI prompt-to-item error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "AI processing failed";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

app.post("/api/prompt-to-item/demo", async (req: Request, res: Response) => {
  try {
    const { promptToItemDemoEndpoint } = await import(
      "./src/api/promptToItemRoutes"
    );
    await promptToItemDemoEndpoint(req, res);
  } catch (error) {
    console.error("❌ AI prompt-to-item demo error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "AI demo processing failed";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// 8. Start server
const port = parseInt(process.env.PORT || "8080", 10);

app
  .listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on 0.0.0.0:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  });

export { app };
