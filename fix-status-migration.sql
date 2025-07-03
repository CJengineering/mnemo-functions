-- Step 1: Update existing status values to match new enum
UPDATE collection_item 
SET status = 'draft' 
WHERE status = 'inactive';

UPDATE collection_item 
SET status = 'published' 
WHERE status = 'active';

-- Step 2: Change column type with explicit casting
ALTER TABLE collection_item 
ALTER COLUMN status 
SET DATA TYPE collection_item_status 
USING status::text::collection_item_status;

-- Step 3: Set default value
ALTER TABLE collection_item 
ALTER COLUMN status 
SET DEFAULT 'draft';

-- Step 4: Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS collection_item_slug_idx ON collection_item USING btree (slug);
CREATE INDEX IF NOT EXISTS collection_item_title_idx ON collection_item USING btree (title);
CREATE INDEX IF NOT EXISTS collection_item_type_idx ON collection_item USING btree (type);
CREATE INDEX IF NOT EXISTS collection_item_status_idx ON collection_item USING btree (status);

-- Step 5: Remove old columns if they exist
ALTER TABLE collection_item DROP COLUMN IF EXISTS description;
ALTER TABLE collection_item DROP COLUMN IF EXISTS meta_data;
