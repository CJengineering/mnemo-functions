import { Request, Response } from 'express';
import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = new Pool({
    host: '34.34.181.187',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
  });
  

// CREATE
export async function createDataChunk(req: Request, res: Response) {
  try {
    const { name, type, programmeId, data, metaData } = req.body;

    console.log("📥 Received:", { name, type, programmeId, data, metaData });

    if (!name || !type || !programmeId) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const parsedData = JSON.stringify(data); // Assuming the data field is JSON

    // Insert data chunk into PostgreSQL
    const result = await pool.query(
      `INSERT INTO data_chunks (name, type, programme_id, data, meta_data) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, programmeId, parsedData, metaData || {}]
    );

    const chunk = result.rows[0];

    console.log("✅ Inserted chunk:", chunk);
    res.status(201).json({ success: true, dataChunk: chunk });

  } catch (error) {
    console.error('❌ createDataChunk error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create data chunk';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// READ ALL
export async function getAllDataChunks(_: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM data_chunks');
    res.json({ success: true, dataChunks: result.rows });
  } catch (error) {
    console.error('❌ getAllDataChunks error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data chunks' });
  }
}

// READ ONE
export async function getDataChunkById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM data_chunks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Data chunk with id ${id} not found`);
      return res.status(404).json({ success: false, error: 'Data chunk not found' });
    }

    res.json({ success: true, dataChunk: result.rows[0] });
  } catch (error) {
    console.error('❌ getDataChunkById error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data chunk';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// UPDATE
export async function updateDataChunk(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, type, data, metaData } = req.body;

    if (!name || !type || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields for update' });
    }

    const parsedData = JSON.stringify(data); // Assuming the data field is JSON

    // Update the data chunk in PostgreSQL
    const result = await pool.query(
      `UPDATE data_chunks SET name = $1, type = $2, data = $3, meta_data = $4, updated_at = NOW() 
       WHERE id = $5 RETURNING *`,
      [name, type, parsedData, metaData || {}, id]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Data chunk with id ${id} not found for update`);
      return res.status(404).json({ success: false, error: 'Data chunk not found' });
    }

    res.json({ success: true, dataChunk: result.rows[0] });
  } catch (error) {
    console.error('❌ updateDataChunk error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update data chunk';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// DELETE
export async function deleteDataChunk(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM data_chunks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Data chunk with id ${id} not found for deletion`);
      return res.status(404).json({ success: false, error: 'Data chunk not found' });
    }

    res.json({ success: true, message: 'Data chunk deleted' });
  } catch (error) {
    console.error('❌ deleteDataChunk error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete data chunk';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
