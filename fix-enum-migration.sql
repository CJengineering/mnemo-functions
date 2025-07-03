-- Fix the enum migration issue
-- Step 1: First, check what data we have
SELECT id, status FROM collection_item LIMIT 5;

-- Step 2: Add a temporary column with the new enum type
ALTER TABLE collection_item ADD COLUMN status_new collection_item_status;

-- Step 3: Update the temporary column with mapped values
UPDATE collection_item 
SET status_new = CASE 
    WHEN status = 'active' THEN 'published'::collection_item_status
    WHEN status = 'inactive' THEN 'draft'::collection_item_status
    WHEN status = 'archived' THEN 'draft'::collection_item_status
    ELSE 'draft'::collection_item_status
END;

-- Step 4: Drop the old column
ALTER TABLE collection_item DROP COLUMN status;

-- Step 5: Rename the new column
ALTER TABLE collection_item RENAME COLUMN status_new TO status;

-- Step 6: Set default value
ALTER TABLE collection_item ALTER COLUMN status SET DEFAULT 'draft'::collection_item_status;

-- Step 7: Add not null constraint
ALTER TABLE collection_item ALTER COLUMN status SET NOT NULL;
