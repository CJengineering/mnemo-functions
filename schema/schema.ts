import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  uuid,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

// Enums
export const statusEnum = pgEnum("status", ["active", "inactive", "archived"]);
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);
export const collectionItemTypeEnum = pgEnum("collection_item_type", [
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
]);

// Tables
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  status: statusEnum("status").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  availableAt: timestamp("available_at").notNull(),
});

export const programme = pgTable("programme", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  shortTitle: text("short_title"),
  acronym: text("acronym"),
  data: jsonb("data").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  programmeId: uuid("programme_id")
    .notNull()
    .references(() => programme.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  data: jsonb("data").notNull().default({}),
  metaData: jsonb("meta_data").notNull().default({}),
  status: contentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dataChunks = pgTable("data_chunks", {
  id: serial("id").primaryKey(),
  programmeId: uuid("programme_id")
    .notNull()
    .references(() => programme.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  metaData: jsonb("meta_data").notNull().default({}),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentDataChunkRelation = pgTable("content_data_chunk_relation", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  dataChunkId: integer("data_chunk_id")
    .notNull()
    .references(() => dataChunks.id, { onDelete: "cascade" }),
  metaData: jsonb("meta_data").notNull().default({}),
  data: jsonb("data").default({}),
});

export const page = pgTable("page", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  data: jsonb("data").default({}),
  dataHtml: jsonb("data_html").default({}),
  dataSeo: jsonb("data_seo").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const programmeContent = pgTable(
  "programme_content",
  {
    programmeId: uuid("programme_id")
      .notNull()
      .references(() => programme.id, { onDelete: "cascade" }),
    contentId: integer("content_id")
      .notNull()
      .references(() => content.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.programmeId, table.contentId] }),
  })
);

export const programmeDataChunk = pgTable(
  "programme_data_chunk",
  {
    programmeId: uuid("programme_id")
      .notNull()
      .references(() => programme.id, { onDelete: "cascade" }),
    dataChunkId: integer("data_chunk_id")
      .notNull()
      .references(() => dataChunks.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.programmeId, table.dataChunkId] }),
  })
);

export const collectionItem = pgTable("collection_item", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: collectionItemTypeEnum("type").notNull(),
  data: jsonb("data").notNull().default({}),
  metaData: jsonb("meta_data").notNull().default({}),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
