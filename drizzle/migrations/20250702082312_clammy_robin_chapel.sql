CREATE TYPE "public"."collection_item_type" AS ENUM('event', 'post', 'programme', 'news', 'team', 'innovation', 'award', 'publication', 'prize', 'partner');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "collection_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "collection_item_type" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"meta_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content" (
	"id" serial PRIMARY KEY NOT NULL,
	"programme_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"meta_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_data_chunk_relation" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer NOT NULL,
	"data_chunk_id" integer NOT NULL,
	"meta_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "data_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"programme_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"meta_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"data_html" jsonb DEFAULT '{}'::jsonb,
	"data_seo" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"status" "status" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer NOT NULL,
	"available_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programme" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"short_title" text,
	"acronym" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programme_content" (
	"programme_id" uuid NOT NULL,
	"content_id" integer NOT NULL,
	CONSTRAINT "programme_content_programme_id_content_id_pk" PRIMARY KEY("programme_id","content_id")
);
--> statement-breakpoint
CREATE TABLE "programme_data_chunk" (
	"programme_id" uuid NOT NULL,
	"data_chunk_id" integer NOT NULL,
	CONSTRAINT "programme_data_chunk_programme_id_data_chunk_id_pk" PRIMARY KEY("programme_id","data_chunk_id")
);
--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_programme_id_programme_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_data_chunk_relation" ADD CONSTRAINT "content_data_chunk_relation_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_data_chunk_relation" ADD CONSTRAINT "content_data_chunk_relation_data_chunk_id_data_chunks_id_fk" FOREIGN KEY ("data_chunk_id") REFERENCES "public"."data_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_chunks" ADD CONSTRAINT "data_chunks_programme_id_programme_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programme_content" ADD CONSTRAINT "programme_content_programme_id_programme_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programme_content" ADD CONSTRAINT "programme_content_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programme_data_chunk" ADD CONSTRAINT "programme_data_chunk_programme_id_programme_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programme_data_chunk" ADD CONSTRAINT "programme_data_chunk_data_chunk_id_data_chunks_id_fk" FOREIGN KEY ("data_chunk_id") REFERENCES "public"."data_chunks"("id") ON DELETE cascade ON UPDATE no action;