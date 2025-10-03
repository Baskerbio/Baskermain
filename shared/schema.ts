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
  // Customization options
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
  containerShape: z.enum(['rounded', 'square', 'pill', 'circle']).default('rounded'),
  autoTextColor: z.boolean().default(true), // Auto-detect text color based on background
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

export const heatMapSchema = z.object({
  id: z.string(),
  elementId: z.string(),
  elementType: z.enum(['link', 'widget', 'story', 'button']),
  clicks: z.number().default(0),
  views: z.number().default(0),
  lastClicked: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const pollSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, "Option text is required"),
    votes: z.number().default(0),
  })).min(2, "At least 2 options required"),
  allowMultiple: z.boolean().default(false),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
  totalVotes: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Message is required"),
  senderDid: z.string(),
  senderHandle: z.string(),
  senderAvatar: z.string().optional(),
  isFromOwner: z.boolean().default(false),
  createdAt: z.string(),
});

export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  slug: z.string(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional(),
  views: z.number().default(0),
  featuredImage: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const portfolioItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  linkUrl: z.string().optional(),
  featured: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default("USD"),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  linkUrl: z.string().optional(),
  featured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Company schema
export const companySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Company name is required"),
  handle: z.string().optional(), // Bluesky handle if available
  description: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  isVerified: z.boolean().default(false),
  isBlueskyCompany: z.boolean().default(false), // True if found on Bluesky
  blueskyDid: z.string().optional(), // DID if it's a Bluesky company
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Work History schema
export const workHistorySchema = z.object({
  id: z.string(),
  companyId: z.string(), // Reference to company
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
  startDate: z.string(), // ISO date string
  endDate: z.string().optional(), // ISO date string, null for current position
  isCurrent: z.boolean().default(false),
  location: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).default('full-time'),
  isVerified: z.boolean().default(false), // Verified by admin
  createdAt: z.string(),
  updatedAt: z.string(),
});


// Admin User schema
export const adminUserSchema = z.object({
  did: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  permissions: z.array(z.enum(['verify_work', 'manage_companies', 'view_analytics', 'manage_users'])).default(['verify_work']),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  // Custom Profile Overrides
  customBio: z.string().optional(),
  customAvatar: z.string().optional(),
  // SEO Settings
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  seoImage: z.string().optional(),
  seoAuthor: z.string().optional(),
  seoSiteName: z.string().optional(),
  seoTwitterHandle: z.string().optional(),
  seoFacebookAppId: z.string().optional(),
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
    "poll",            // Interactive polls
    "live_chat",       // Live chat widget
    "blog_posts",      // Blog posts display
    "heat_map",        // Click heat map analytics
    "portfolio_gallery", // Portfolio image gallery
    "product_showcase",  // Product showcase (coming soon)
    "work_history",    // Work history and experience
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

export const companiesRecordSchema = z.object({
  companies: z.array(companySchema),
});

export const workHistoryRecordSchema = z.object({
  workHistory: z.array(workHistorySchema),
});


export const adminUsersRecordSchema = z.object({
  adminUsers: z.array(adminUserSchema),
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
export type CompaniesRecord = z.infer<typeof companiesRecordSchema>;
export type WorkHistoryRecord = z.infer<typeof workHistoryRecordSchema>;
export type AdminUsersRecord = z.infer<typeof adminUsersRecordSchema>;

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;

// Work History types
export type Company = z.infer<typeof companySchema>;
export type WorkHistory = z.infer<typeof workHistorySchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;