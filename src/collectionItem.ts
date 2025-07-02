import { Request, Response } from "express";
import { pool } from "../schema/db";

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
      return res
        .status(400)
        .json({
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
    ];
    const validStatuses = ["active", "inactive", "archived"];

    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
        });
    }

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
    }

    const parsedData = JSON.stringify(data || {});
    const parsedMetaData = JSON.stringify(metaData || {});

    // Insert new collection item into PostgreSQL
    const result = await pool.query(
      `INSERT INTO collection_item (title, description, type, data, meta_data, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, type, parsedData, parsedMetaData, status || "active"]
    );

    const collectionItem = result.rows[0];

    console.log("✅ Inserted collection item:", collectionItem);
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

    if (isNaN(Number(id))) {
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
    const { title, description, type, data, metaData, status } = req.body;

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
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
    ];
    const validStatuses = ["active", "inactive", "archived"];

    if (type && !validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
        });
    }

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCounter = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCounter++}`);
      params.push(title);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCounter++}`);
      params.push(description);
    }

    if (type !== undefined) {
      updateFields.push(`type = $${paramCounter++}`);
      params.push(type);
    }

    if (data !== undefined) {
      updateFields.push(`data = $${paramCounter++}`);
      params.push(JSON.stringify(data));
    }

    if (metaData !== undefined) {
      updateFields.push(`meta_data = $${paramCounter++}`);
      params.push(JSON.stringify(metaData));
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramCounter++}`);
      params.push(status);
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

    res.json({ success: true, collectionItem: result.rows[0] });
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

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }

    const result = await pool.query(
      "DELETE FROM collection_item WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Collection item with ID ${id} not found for deletion`);
      return res
        .status(404)
        .json({ success: false, error: "Collection item not found" });
    }

    res.json({
      success: true,
      message: "Collection item deleted successfully",
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
    ];

    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
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
