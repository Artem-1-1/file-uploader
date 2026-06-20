import { relations, isNull, isNotNull } from "drizzle-orm";
import { pgTable, text, timestamp, bigint, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  storageUsed: bigint("storage_used", { mode: "number"}).default(0).notNull(),
  storageLimit: bigint("storage_limit", { mode: "number"}).default(1073741824).notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const file = pgTable(
  "file",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    parentId: text("parent_id").references((): any => file.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull(),
    size: bigint("size", {mode: "number"}).default(0).notNull(),
    mimeType: text("mime_type"),
    storagePath: text("storage_path"),
    checksum: text("checksum"),
    createdAt : timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    deletedAt: timestamp("deleted_at")
  },
  (table) => [
    index("file_userId_idx").on(table.userId),
    index("file_parentId_idx").on(table.parentId),

    uniqueIndex("file_user_parent_name_idx")
    .on(table.userId, table.parentId, table.name)
    .where(isNotNull(table.parentId)),

    uniqueIndex("file_user_root_name_idx")
    .on(table.userId, table.name)
    .where(isNull(table.parentId)),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  files: many(file),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const fileRelations = relations(file, ({ one, many }) => ({
  user: one(user, { fields: [file.userId], references: [user.id] }),
  parent: one(file, {
    fields: [file.parentId],
    references: [file.id],
    relationName: "file_hierarchy", 
  }),
  children: many(file, { relationName: "file_hierarchy" }),
}));
