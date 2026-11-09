import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const demoRequests = sqliteTable("demo_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  studio: text("studio").notNull(),
  role: text("role").notNull(),
  context: text("context").notNull().default(""),
  createdAt: integer("created_at").notNull(),
}, table => [index("demo_requests_email_time").on(table.email, table.createdAt)]);
