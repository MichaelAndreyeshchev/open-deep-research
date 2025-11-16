
import type { InferSelectModel } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('User', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  email: text('email', { length: 64 }).notNull(),
  password: text('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = sqliteTable('Chat', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  title: text('title').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  visibility: text('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = sqliteTable('Message', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chatId')
    .notNull()
    .references(() => chat.id),
  role: text('role').notNull(),
  content: text('content', { mode: 'json' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = sqliteTable(
  'Vote',
  {
    chatId: text('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: text('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: integer('isUpvoted', { mode: 'boolean' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = sqliteTable(
  'Document',
  {
    id: text('id').notNull().$defaultFn(() => crypto.randomUUID()),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: text('kind', { enum: ['text', 'code', 'spreadsheet'] })
      .notNull()
      .default('text'),
    userId: text('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = sqliteTable(
  'Suggestion',
  {
    id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    documentId: text('documentId').notNull(),
    documentCreatedAt: integer('documentCreatedAt', { mode: 'timestamp' }).notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: integer('isResolved', { mode: 'boolean' }).notNull().default(false),
    userId: text('userId')
      .notNull()
      .references(() => user.id),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const uploadedDocument = sqliteTable('UploadedDocument', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  filename: text('filename').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  uploadedAt: integer('uploadedAt', { mode: 'timestamp' }).notNull(),
  totalPages: integer('totalPages').notNull(),
  fileSize: integer('fileSize').notNull(),
  metadata: text('metadata', { mode: 'json' }),
});

export type UploadedDocument = InferSelectModel<typeof uploadedDocument>;

export const documentChunk = sqliteTable('DocumentChunk', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  documentId: text('documentId')
    .notNull()
    .references(() => uploadedDocument.id),
  chunkIndex: integer('chunkIndex').notNull(),
  pageNumber: integer('pageNumber').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata', { mode: 'json' }),
});

export type DocumentChunk = InferSelectModel<typeof documentChunk>;

export const citation = sqliteTable('Citation', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  messageId: text('messageId')
    .notNull()
    .references(() => message.id),
  sourceType: text('sourceType', { enum: ['document', 'web'] }).notNull(),
  sourceId: text('sourceId'),
  sourceName: text('sourceName').notNull(),
  pageNumber: integer('pageNumber'),
  excerpt: text('excerpt'),
  url: text('url'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export type Citation = InferSelectModel<typeof citation>;

export const researchRun = sqliteTable('ResearchRun', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chatId')
    .notNull()
    .references(() => chat.id),
  model: text('model').notNull(),
  provider: text('provider', { enum: ['openai', 'firecrawl'] }).notNull(),
  startedAt: integer('startedAt', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completedAt', { mode: 'timestamp' }),
  settings: text('settings', { mode: 'json' }),
  status: text('status', { enum: ['running', 'completed', 'failed'] }).notNull(),
});

export type ResearchRun = InferSelectModel<typeof researchRun>;

export const researchStep = sqliteTable('ResearchStep', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  runId: text('runId')
    .notNull()
    .references(() => researchRun.id),
  stepType: text('stepType', { 
    enum: ['reasoning', 'web_search_call', 'code_interpreter', 'output_text', 'search', 'extract', 'analyze', 'synthesis'] 
  }).notNull(),
  payload: text('payload', { mode: 'json' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['pending', 'complete', 'error'] }).notNull(),
});

export type ResearchStep = InferSelectModel<typeof researchStep>;

export const citationVerification = sqliteTable('CitationVerification', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  citationId: text('citationId')
    .notNull()
    .references(() => citation.id),
  verifiedAt: integer('verifiedAt', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['ok', 'broken', 'blocked', 'redirected'] }).notNull(),
  httpStatus: integer('httpStatus'),
  redirectUrl: text('redirectUrl'),
  errorMessage: text('errorMessage'),
});

export type CitationVerification = InferSelectModel<typeof citationVerification>;
