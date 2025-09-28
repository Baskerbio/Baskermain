import { z } from "zod";

// User profile schema
export const userProfileSchema = z.object({
  did: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
});

// Link schema
export const linkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  icon: z.string().optional(),
  group: z.string().optional(), // Group name for organizing links
  order: z.number().int().min(0),
  enabled: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Note schema
export const noteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Content is required").max(500, "Content too long"),
  isPublic: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Story schema
export const storySchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  textPosition: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }).optional(),
  textStyle: z.object({
    fontSize: z.number().min(12).max(72),
    fontWeight: z.enum(['normal', 'bold']),
    textAlign: z.enum(['left', 'center', 'right']),
    fontFamily: z.enum(['sans', 'serif', 'mono', 'cursive']),
  }).optional(),
  sticker: z.string().optional(),
  expiresAt: z.string(),
  createdAt: z.string(),
});

// Group schema
export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Group name is required"),
  isOpen: z.boolean().default(true),
  order: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Theme schema
export const themeSchema = z.object({
  name: z.enum([
    "light", "dark", "gradient", 
    "halloween", "christmas", "ocean", 
    "sunset", "forest", "cosmic", 
    "neon", "vintage", "minimal", 
    "retro", "modern"
  ]),
  primaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  fontFamily: z.string(),
  layout: z.string(),
  backgroundImage: z.string().optional(),
});

// Settings schema
export const settingsSchema = z.object({
  theme: themeSchema,
  showStories: z.boolean().default(true),
  showNotes: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  enableAnalytics: z.boolean().default(true),
  sectionOrder: z.array(z.enum(["widgets", "notes", "links"])).default(["widgets", "notes", "links"]),
});

// Widget schema with many more types and better configuration
export const widgetSchema = z.object({
  id: z.string(),
  type: z.enum([
    "clock",           // Digital/Analog clocks
    "custom_code",     // HTML/CSS/JS code
    "social_badge",    // Social media follower counts
    "weather",         // Weather widget
    "quote",           // Inspirational quotes
    "counter",         // Custom counters (visits, downloads, etc.)
    "progress_bar",    // Progress bars for goals
    "calendar",        // Mini calendar
    "music_player",    // Spotify/Apple Music player
    "donation",        // Donation links
    "contact_form",    // Contact form
    "embed",           // Generic embed (YouTube, etc.)
    "text_block",      // Rich text content
    "image_gallery",   // Image carousel
    "stats",           // Statistics display
    "announcement",    // Announcement banner
    "todo_list",       // Todo/checklist widget
    "countdown",       // Countdown timer
    "qr_code",         // QR code generator
    "social_links",    // Social media links grid
    "testimonial",     // Customer testimonials
    "pricing_table",   // Pricing comparison table
    "newsletter",      // Newsletter signup
    "recent_posts",    // Recent blog posts
  ]),
  title: z.string().optional(),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
  size: z.enum(["default", "small", "medium", "large", "full"]).default("default"),
  width: z.enum(["half", "full"]).default("full"), // For side-by-side layout
  config: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// AT Protocol record schemas
export const linksRecordSchema = z.object({
  links: z.array(linkSchema),
});

export const notesRecordSchema = z.object({
  notes: z.array(noteSchema),
});

export const storiesRecordSchema = z.object({
  stories: z.array(storySchema),
});

export const settingsRecordSchema = z.object({
  settings: settingsSchema,
});

export const widgetsRecordSchema = z.object({
  widgets: z.array(widgetSchema),
});

// Insert schemas
export const insertLinkSchema = linkSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertNoteSchema = noteSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertStorySchema = storySchema.omit({ id: true, createdAt: true });
export const insertWidgetSchema = widgetSchema.omit({ id: true });

// Types
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Link = z.infer<typeof linkSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Story = z.infer<typeof storySchema>;
export type Group = z.infer<typeof groupSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Widget = z.infer<typeof widgetSchema>;

export type LinksRecord = z.infer<typeof linksRecordSchema>;
export type NotesRecord = z.infer<typeof notesRecordSchema>;
export type StoriesRecord = z.infer<typeof storiesRecordSchema>;
export type SettingsRecord = z.infer<typeof settingsRecordSchema>;
export type WidgetsRecord = z.infer<typeof widgetsRecordSchema>;

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;