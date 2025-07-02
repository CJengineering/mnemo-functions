import express, { Request, Response } from "express";
import cors from "cors";
import {
  createDataChunk,
  deleteDataChunk,
  getAllDataChunks,
  getDataChunkById,
  updateDataChunk,
} from "./src/dataChunk";
import { wrapAsync } from "./lib/wrapAsync";
import {
  createPage,
  deletePage,
  getAllPages,
  getAllProgrammes,
  getPageBySlug,
  updatePage,
} from "./src/pageData";
import {
  createCollectionItem,
  deleteCollectionItem,
  getAllCollectionItems,
  getCollectionItemById,
  updateCollectionItem,
  getCollectionItemsByType,
} from "./src/collectionItem";

// Create PostgreSQL connection pool

// 1. Create Express app
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(
  cors({
    origin: "*", // Allow requests from any origin
  })
);
// 2. Health Check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Mnemo Cloud Function is up and running - CI/CD Pipeline Active!");
});

// 3. Test route
app.get("/test", (req: Request, res: Response) => {
  res.json({ msg: "test works" });
});

// 4. Data-chunks routes
app.post("/data-chunks", wrapAsync(createDataChunk)); // Create a new data chunk
app.get("/data-chunks", wrapAsync(getAllDataChunks)); // Get all data chunks
app.get("/data-chunks/:id", wrapAsync(getDataChunkById)); // Get a data chunk by id
app.put("/data-chunks/:id", wrapAsync(updateDataChunk)); // Update a data chunk
app.delete("/data-chunks/:id", wrapAsync(deleteDataChunk)); // Delete a data chunk
app.post("/pages", wrapAsync(createPage)); // Create page
app.get("/pages", wrapAsync(getAllPages)); // Get all pages
app.get("/pages/:slug", wrapAsync(getPageBySlug)); // Get page by slug
app.put("/pages/:slug", wrapAsync(updatePage)); // Update page by slug
app.delete("/pages/:slug", wrapAsync(deletePage)); // Delete page by slug

// 6. Get all programmes
app.get("/programmes", wrapAsync(getAllProgrammes));

// 7. Collection Item routes
app.post("/collection-items", wrapAsync(createCollectionItem)); // Create collection item
app.get("/collection-items", wrapAsync(getAllCollectionItems)); // Get all collection items
app.get("/collection-items/:id", wrapAsync(getCollectionItemById)); // Get collection item by id
app.put("/collection-items/:id", wrapAsync(updateCollectionItem)); // Update collection item
app.delete("/collection-items/:id", wrapAsync(deleteCollectionItem)); // Delete collection item
app.get("/collection-items/type/:type", wrapAsync(getCollectionItemsByType)); // Get collection items by type
// 5. Start listening on port 8080 (for Cloud Run)
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// 6. Export the app for Cloud Functions or Cloud Run
export { app };
