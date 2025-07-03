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

// 5. Collection Item demo route with mapper
app.post("/api/collection-items/form", async (req: Request, res: Response) => {
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
      message: "Collection item transformed successfully",
      originalData: req.body,
      mappedData: mappedItem,
      databaseFormat: dbFormat,
    });
  } catch (error) {
    console.error("❌ Mapper error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Mapping failed";
    res.status(400).json({ success: false, error: errorMessage });
  }
});

// 6. Start server
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
