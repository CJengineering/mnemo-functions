const { Pool } = require("pg");

// Database connection
const pool = new Pool({
  host: "34.34.181.187",
  port: 5432,
  database: "mnemo_db",
  user: "mnemo_user",
  password: "simpleTestPassword2025",
});

async function createPost() {
  try {
    console.log("🔥 Creating post directly...");

    const result = await pool.query(
      `INSERT INTO collection_item (slug, title, type, data, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        "my-first-post",
        "My First Post",
        "post",
        JSON.stringify({
          content: "This is the content of my first post.",
          author: "Jane Doe",
        }),
        "draft",
      ]
    );

    console.log("✅ POST CREATED:", result.rows[0]);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

createPost();
