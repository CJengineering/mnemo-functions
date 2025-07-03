CREATE TYPE "public"."collection_item_status" AS ENUM('draft', 'published');--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "status" SET DATA TYPE collection_item_status;--> statement-breakpoint
ALTER TABLE "collection_item" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "collection_item" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "collection_item_slug_idx" ON "collection_item" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "collection_item_title_idx" ON "collection_item" USING btree ("title");--> statement-breakpoint
CREATE INDEX "collection_item_type_idx" ON "collection_item" USING btree ("type");--> statement-breakpoint
CREATE INDEX "collection_item_status_idx" ON "collection_item" USING btree ("status");--> statement-breakpoint
ALTER TABLE "collection_item" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "collection_item" DROP COLUMN "meta_data";