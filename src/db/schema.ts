import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- ENUMS ---

// Define user roles
export const userRoleEnum = pgEnum("user_role", [
  "petitioner",
  "admin",
  "clerk",
  "speaker",
  "committee",
]);

// Define petition statuses
export const petitionStatusEnum = pgEnum("petition_status", [
  "PENDING",
  "UNDER_REVIEW",
  "FORWARDED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "ARCHIVED",
]);

// --- INTERFACES ---

// Type for uploaded source documents in petitions
export interface SourceDocument {
  id: string; // Unique identifier for the source file
  url: string; // Public URL of the uploaded file
  fileName?: string; // Optional original file name
}

// --- USERS TABLE ---

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .default(
        sql`gen_random_uuid
                ()`,
      )
      .primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    nationalId: text("national_id").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    profilePicUrl: text("profile_pic_url"),
    role: userRoleEnum("role").notNull().default("petitioner"),
    roleDescription: text("role_description"), // Optional field to explain role
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
    nationalIdIdx: uniqueIndex("national_id_idx").on(table.nationalId),
  }),
);

// --- SUBMITTED PETITIONS TABLE ---

export const submittedPetitions = pgTable("submitted_petitions", {
  id: uuid("id")
    .default(
      sql`gen_random_uuid
            ()`,
    )
    .primaryKey(),
  submittedByUserId: uuid("submitted_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  petitionFormUrl: text("petition_form_url").notNull(),

  subjectMatter: text("subject_matter").notNull(), // Added subjectMatter

  sources: jsonb("sources")
    .$type<SourceDocument[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),

  status: petitionStatusEnum("status").notNull().default("PENDING"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Optional for later use:
  // assignedCommitteeId: uuid("assigned_committee_id").references(() => committees.id),
  // resolutionDetails: text("resolution_details"),
});

// --- TYPES ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = (typeof userRoleEnum.enumValues)[number];

export type SubmittedPetition = typeof submittedPetitions.$inferSelect;
export type NewSubmittedPetition = typeof submittedPetitions.$inferInsert;
export type PetitionStatus = (typeof petitionStatusEnum.enumValues)[number];

// --- VERIFICATION STEPS TABLE ---
export const verificationSteps = pgTable("verification_steps", {
  id: uuid("id")
    .default(
      sql`gen_random_uuid
            ()`,
    )
    .primaryKey(),
  petitionId: uuid("petition_id") // Foreign key referencing submitted petitions
    .notNull()
    .references(() => submittedPetitions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- TYPES ---
export type VerificationStep = typeof verificationSteps.$inferSelect;
export type NewVerificationStep = typeof verificationSteps.$inferInsert;
