import { Request, Response } from "express";
import { pool } from "../schema/db";
import {
  mapIncomingCollectionItem,
  collectionItemToDbFormat,
  IncomingCollectionItem,
} from "./mappers";
import { sendWebhookSafe } from "./services/webhookService";

// CREATE Collection Item
export async function createCollectionItem(req: Request, res: Response) {
  try {
    const { title, description, type, data, metaData, status } = req.body;

    console.log("📥 Received:", {
      title,
      description,
      type,
      data,
      metaData,
      status,
    });

    if (!title || !type) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title and type are required",
      });
    }

    // Validate enum values
    const validTypes = [
      "event",
      "post",
      "programme",
      "news",
      "team",
      "innovation",
      "award",
      "publication",
      "prize",
      "partner",
      "person",
      "tag",
    ];
    const validStatuses = ["draft", "published"]; // Fixed to match database schema

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const parsedData = JSON.stringify(data || {});

    // Generate slug from title if not provided
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Insert new collection item into PostgreSQL
    const result = await pool.query(
      `INSERT INTO collection_item (slug, title, type, data, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [slug, title, type, parsedData, status || "draft"]
    );

    const collectionItem = result.rows[0];

    console.log("✅ Inserted collection item:", collectionItem);

    // ✅ Send CREATE webhook
    await sendWebhookSafe("create", collectionItem);

    res.status(201).json({ success: true, collectionItem });
  } catch (error) {
    console.error("❌ createCollectionItem error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// READ ALL Collection Items
export async function getAllCollectionItems(req: Request, res: Response) {
  try {
    const { type, status } = req.query;

    let query = "SELECT * FROM collection_item";
    const params: any[] = [];
    const conditions: string[] = [];

    if (type) {
      conditions.push(`type = $${params.length + 1}`);
      params.push(type);
    }

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json({ success: true, collectionItems: result.rows });
  } catch (error) {
    console.error("❌ getAllCollectionItems error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch collection items" });
  }
}

// READ ONE Collection Item by ID
export async function getCollectionItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate UUID format (collection items use UUIDs, not numeric IDs)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const result = await pool.query(
      "SELECT * FROM collection_item WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Collection item with ID ${id} not found`);
      return res
        .status(404)
        .json({ success: false, error: "Collection item not found" });
    }

    res.json({ success: true, collectionItem: result.rows[0] });
  } catch (error) {
    console.error("❌ getCollectionItemById error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// UPDATE Collection Item
export async function updateCollectionItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, type, data, metaData, status, slug } = req.body;

    // Validate UUID format (collection items use UUIDs, not numeric IDs)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    // Validate enum values if provided
    const validTypes = [
      "event",
      "post",
      "programme", // ✅ Fixed duplicate "team"
      "news",
      "team",
      "innovation",
      "award",
      "publication",
      "prize",
      "partner",
      "person",
      "tag",
    ];
    const validStatuses = ["draft", "published"]; // Fixed to match database schema

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ✅ Track what fields are being changed for webhook
    const changedFields: string[] = [];

    // Build dynamic update query
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCounter = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCounter++}`);
      params.push(title);
      changedFields.push("title");
    }

    if (slug !== undefined) {
      updateFields.push(`slug = $${paramCounter++}`);
      params.push(slug);
      changedFields.push("slug");
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCounter++}`);
      params.push(description);
      changedFields.push("description");
    }

    if (type !== undefined) {
      updateFields.push(`type = $${paramCounter++}`);
      params.push(type);
      changedFields.push("type");
    }

    if (data !== undefined) {
      updateFields.push(`data = $${paramCounter++}`);
      params.push(JSON.stringify(data));
      changedFields.push("data");
    }

    if (metaData !== undefined) {
      updateFields.push(`meta_data = $${paramCounter++}`);
      params.push(JSON.stringify(metaData));
      changedFields.push("metaData");
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramCounter++}`);
      params.push(status);
      changedFields.push("status");
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No fields to update" });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    const query = `UPDATE collection_item SET ${updateFields.join(
      ", "
    )} WHERE id = $${paramCounter} RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      console.log(`⚠️ Collection item with ID ${id} not found for update`);
      return res
        .status(404)
        .json({ success: false, error: "Collection item not found" });
    }

    const updatedCollectionItem = result.rows[0];

    // ✅ Send UPDATE webhook with changed fields
    await sendWebhookSafe("update", updatedCollectionItem, changedFields);

    res.json({ success: true, collectionItem: updatedCollectionItem });
  } catch (error) {
    console.error("❌ updateCollectionItem error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// DELETE Collection Item
export async function deleteCollectionItem(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate UUID format (collection items use UUIDs, not numeric IDs)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    // First get the item data before deleting (for webhook)
    const getResult = await pool.query(
      "SELECT * FROM collection_item WHERE id = $1",
      [id]
    );

    if (getResult.rows.length === 0) {
      console.log(`⚠️ Collection item with ID ${id} not found for deletion`);
      return res
        .status(404)
        .json({ success: false, error: "Collection item not found" });
    }

    const deletedCollectionItem = getResult.rows[0];

    // Now delete the item
    const result = await pool.query(
      "DELETE FROM collection_item WHERE id = $1 RETURNING id",
      [id]
    );

    console.log(
      `✅ Deleted collection item: ${deletedCollectionItem.title} (${deletedCollectionItem.slug})`
    );

    // ✅ Send DELETE webhook
    await sendWebhookSafe("delete", deletedCollectionItem);

    res.json({
      success: true,
      message: "Collection item deleted successfully",
      deletedItem: {
        id: deletedCollectionItem.id,
        title: deletedCollectionItem.title,
        slug: deletedCollectionItem.slug,
        type: deletedCollectionItem.type,
      },
    });
  } catch (error) {
    console.error("❌ deleteCollectionItem error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to delete collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// GET Collection Items by Type
export async function getCollectionItemsByType(req: Request, res: Response) {
  try {
    const { type } = req.params;

    const validTypes = [
      "event",
      "post",
      "programme",
      "news",
      "team",
      "innovation",
      "award",
      "publication",
      "prize",
      "partner",
      "person",
      "tag",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const result = await pool.query(
      "SELECT * FROM collection_item WHERE type = $1 ORDER BY created_at DESC",
      [type]
    );

    res.json({ success: true, collectionItems: result.rows });
  } catch (error) {
    console.error("❌ getCollectionItemsByType error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch collection items by type";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// CREATE Collection Item using Mapper (NEW - Frontend Form)
export async function createCollectionItemFromForm(
  req: Request,
  res: Response
) {
  try {
    const incomingData = req.body as IncomingCollectionItem;

    console.log("📥 Received form data:", {
      type: incomingData.type,
      title: incomingData.data?.title,
      slug: incomingData.data?.slug,
    });

    // Validate the incoming data structure
    if (!incomingData.type || !incomingData.data) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: type and data are required",
      });
    }

    // Basic validation for required fields in data
    if (!incomingData.data.title || !incomingData.data.slug) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields in data: title and slug are required",
      });
    }

    console.log("🔄 Mapping data using collection item mapper...");

    // Use the mapper to transform and validate the data
    const mappedItem = mapIncomingCollectionItem(incomingData);
    const dbFormat = collectionItemToDbFormat(mappedItem);

    console.log("✅ Data mapped successfully:", {
      title: dbFormat.title,
      type: dbFormat.type,
      status: dbFormat.status,
      dataKeys: Object.keys(dbFormat.data),
    });

    // Insert the properly mapped data into the database
    const result = await pool.query(
      `INSERT INTO collection_item (slug, title, type, data, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        dbFormat.slug,
        dbFormat.title,
        dbFormat.type,
        JSON.stringify(dbFormat.data),
        dbFormat.status,
      ]
    );

    const collectionItem = result.rows[0];

    console.log("✅ Created collection item:", collectionItem.id);

    // ✅ Send CREATE webhook
    await sendWebhookSafe("create", collectionItem);

    res.status(201).json({
      success: true,
      collectionItem,
    });
  } catch (error) {
    console.error("❌ createCollectionItemFromForm error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create collection item from form";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// GET Collection Item by Slug
export async function getCollectionItemBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Slug parameter is required",
      });
    }

    console.log(`🔍 Fetching collection item with slug: ${slug}`);

    const result = await pool.query(
      "SELECT * FROM collection_item WHERE slug = $1",
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Collection item not found",
      });
    }

    const collectionItem = result.rows[0];
    console.log(`✅ Found collection item: ${collectionItem.title}`);

    res.json({ success: true, collectionItem });
  } catch (error) {
    console.error("❌ getCollectionItemBySlug error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// UPDATE Collection Item by Slug
export async function updateCollectionItemBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const {
      title,
      description,
      type,
      data,
      metaData,
      status,
      slug: newSlug,
    } = req.body;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Slug parameter is required",
      });
    }

    // Validate enum values if provided
    const validTypes = [
      "event",
      "post",
      "programme",
      "news",
      "team",
      "innovation",
      "award",
      "publication",
      "prize",
      "partner",
      "person",
      "tag",
    ];
    const validStatuses = ["draft", "published"];

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Check if collection item exists
    const existingResult = await pool.query(
      "SELECT * FROM collection_item WHERE slug = $1",
      [slug]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Collection item not found",
      });
    }

    console.log(`🔄 Updating collection item with slug: ${slug}`);

    // ✅ Track what fields are being changed for webhook
    const changedFields: string[] = [];

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
      changedFields.push("title");
    }

    if (newSlug !== undefined) {
      updates.push(`slug = $${paramCount++}`);
      values.push(newSlug);
      changedFields.push("slug");
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
      changedFields.push("description");
    }

    if (type !== undefined) {
      updates.push(`type = $${paramCount++}`);
      values.push(type);
      changedFields.push("type");
    }

    if (data !== undefined) {
      updates.push(`data = $${paramCount++}`);
      values.push(JSON.stringify(data));
      changedFields.push("data");
    }

    if (metaData !== undefined) {
      updates.push(`meta_data = $${paramCount++}`);
      values.push(JSON.stringify(metaData));
      changedFields.push("metaData");
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
      changedFields.push("status");
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date().toISOString());

    if (updates.length === 1) {
      // Only updated_at was added
      return res.status(400).json({
        success: false,
        error: "No valid fields provided for update",
      });
    }

    // Add slug to values for WHERE clause
    values.push(slug);

    const updateQuery = `
      UPDATE collection_item 
      SET ${updates.join(", ")} 
      WHERE slug = $${paramCount} 
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    const updatedItem = result.rows[0];

    console.log(`✅ Updated collection item: ${updatedItem.title}`);

    // ✅ Send UPDATE webhook with changed fields
    await sendWebhookSafe("update", updatedItem, changedFields);

    res.json({ success: true, collectionItem: updatedItem });
  } catch (error) {
    console.error("❌ updateCollectionItemBySlug error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update collection item";
    res.status(500).json({ success: false, error: errorMessage });
  }
}
