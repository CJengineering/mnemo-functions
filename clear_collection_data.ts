import { pool } from "./schema/db";

async function clearCollectionItemData() {
  try {
    console.log("🗑️  Clearing all data from collection_item table...");

    const result = await pool.query("DELETE FROM collection_item");

    console.log(
      `✅ Successfully deleted ${result.rowCount} rows from collection_item table`
    );

    // Close the connection
    await pool.end();
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    process.exit(1);
  }
}

clearCollectionItemData();
