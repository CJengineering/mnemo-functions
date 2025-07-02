import { Request, Response } from 'express';

import { pool } from '../schema/db';

// Create PostgreSQL connection pool

// CREATE Page
export async function createPage(req: Request, res: Response) {
  try {
    const { slug, data, dataHtml, dataSeo } = req.body;

    console.log("📥 Received:", { slug, data, dataHtml, dataSeo });

    if (!slug) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const parsedData = JSON.stringify(data); // Assuming the data field is JSON
    const parsedHtml = JSON.stringify(dataHtml);
    const parsedSeo = JSON.stringify(dataSeo);

    // Insert new page into PostgreSQL
    const result = await pool.query(
      `INSERT INTO page (slug, data, data_html, data_seo) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [slug, parsedData, parsedHtml, parsedSeo]
    );

    const page = result.rows[0];

    console.log("✅ Inserted page:", page);
    res.status(201).json({ success: true, page });

  } catch (error) {
    console.error('❌ createPage error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create page';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// READ ALL Pages
export async function getAllPages(_: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM page');
    res.json({ success: true, pages: result.rows });
  } catch (error) {
    console.error('❌ getAllPages error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pages' });
  }
}

// READ ONE Page by slug
export async function getPageBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM page WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Page with slug ${slug} not found`);
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.json({ success: true, page: result.rows[0] });
  } catch (error) {
    console.error('❌ getPageBySlug error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch page';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// UPDATE Page
export async function updatePage(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { data, dataHtml, dataSeo } = req.body;

    if (!data || !dataHtml || !dataSeo) {
      return res.status(400).json({ success: false, error: 'Missing required fields for update' });
    }

    const parsedData = JSON.stringify(data);
    const parsedHtml = JSON.stringify(dataHtml);
    const parsedSeo = JSON.stringify(dataSeo);

    // Update the page in PostgreSQL
    const result = await pool.query(
      `UPDATE page SET data = $1, data_html = $2, data_seo = $3, updated_at = NOW() 
       WHERE slug = $4 RETURNING *`,
      [parsedData, parsedHtml, parsedSeo, slug]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Page with slug ${slug} not found for update`);
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.json({ success: true, page: result.rows[0] });
  } catch (error) {
    console.error('❌ updatePage error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update page';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// DELETE Page
export async function deletePage(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'DELETE FROM page WHERE slug = $1 RETURNING *',
      [slug]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️ Page with slug ${slug} not found for deletion`);
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    console.error('❌ deletePage error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete page';
    res.status(500).json({ success: false, error: errorMessage });
  }
}

// GET all Programmes
export async function getAllProgrammes(_: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM programme');
    res.json({ success: true, programmes: result.rows });
  } catch (error) {
    console.error('❌ getAllProgrammes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch programmes' });
  }
}
