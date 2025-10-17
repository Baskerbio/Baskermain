# Basker Platform - Technology Stack

A comprehensive list of all programming languages, frameworks, and technologies used in building the Basker link-in-bio platform.

---

## 📝 Programming Languages

### Core Languages
- **TypeScript** (v5.6.3) - Primary language for entire codebase 
- **JavaScript** (ES2020+) - Used in config files and build scripts
- **HTML5** - Markup structure
- **CSS3** - Styling (via Tailwind CSS)
- **JSON** - Configuration and data schemas
- **SVG** - Custom icons and graphics
- **Markdown** - Documentation files

---

## 🎨 Frontend Technologies

### UI Framework
- **React** (v18.3.1) - Core UI library
- **React DOM** (v18.3.1) - DOM rendering
- **TypeScript JSX/TSX** - Component syntax

### Routing & Navigation
- **Wouter** (v3.3.5) - Lightweight routing library

### Styling & Design System
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework
- **PostCSS** (v8.4.47) - CSS processing
- **Autoprefixer** (v10.4.20) - CSS vendor prefixing
- **Tailwind Animate** (v1.0.7) - Animation utilities
- **Tailwind Typography** (v0.5.15) - Prose styling
- **class-variance-authority** (v0.7.1) - Variant management
- **clsx** (v2.1.1) - Class name utilities
- **tailwind-merge** (v2.6.0) - Tailwind class merging

### UI Component Library
**Radix UI Primitives** - Accessible, unstyled component primitives:
- Accordion, Alert Dialog, Aspect Ratio, Avatar
- Checkbox, Collapsible, Context Menu, Dialog
- Dropdown Menu, Hover Card, Label, Menubar
- Navigation Menu, Popover, Progress, Radio Group
- Scroll Area, Select, Separator, Slider
- Switch, Tabs, Toast, Toggle, Tooltip
- Plus 20+ more components

### Icons & Graphics
- **Lucide React** (v0.453.0) - Icon library (600+ icons)
- **React Icons** (v5.4.0) - Additional icon sets
- **Custom SVG** - Hand-crafted verification badges and graphics

### Animations & Interactions
- **Framer Motion** (v11.13.1) - Advanced animations
- **Embla Carousel** (v8.6.0) - Carousel/slider functionality
- **@hello-pangea/dnd** (v18.0.1) - Drag & drop interactions
- **Vaul** (v1.1.2) - Drawer component

### State Management & Data Fetching
- **TanStack Query (React Query)** (v5.60.5) - Server state management
- **React Context API** - Global state (Auth, Theme, EditMode)
- **React Hooks** - Local component state

### Forms & Validation
- **React Hook Form** (v7.55.0) - Form state management
- **Zod** (v3.24.2) - Schema validation
- **@hookform/resolvers** (v3.10.0) - Form validation resolvers
- **zod-validation-error** (v3.4.0) - Better error messages

### Theme Management
- **next-themes** (v0.4.6) - Dark mode & theme switching

### Charts & Data Visualization
- **Recharts** (v2.15.2) - React charting library
- **Custom SVG Charts** - Heat maps and analytics

### Utilities
- **date-fns** (v3.6.0) - Date manipulation
- **nanoid** (v5.1.6) - Unique ID generation
- **cmdk** (v1.1.1) - Command palette
- **input-otp** (v1.4.2) - OTP input components
- **react-resizable-panels** (v2.1.7) - Resizable layouts
- **react-day-picker** (v8.10.1) - Date picker

---

## 🔧 Backend Technologies

### Runtime & Server
- **Node.js** (v20+) - JavaScript runtime
- **Express.js** (v4.21.2) - Web application framework
- **TypeScript** - Server-side logic

### API & Protocols
- **AT Protocol** (@atproto/api v0.16.11) - Bluesky/decentralized social protocol
- **AT Protocol Ozone** (@atproto/ozone v0.1.146) - Moderation infrastructure
- **REST API** - Custom API endpoints
- **WebSocket** (ws v8.18.0) - Real-time communication

### Database & ORM
- **Drizzle ORM** (v0.39.1) - TypeScript ORM
- **Drizzle Kit** (v0.31.4) - Database migrations
- **Drizzle Zod** (v0.7.0) - Schema integration
- **Neon Database** (@neondatabase/serverless v0.10.4) - Serverless PostgreSQL
- **PostgreSQL** - Primary database (via Neon)

### Authentication & Security
- **Passport.js** (v0.7.0) - Authentication middleware
- **passport-local** (v1.0.0) - Local authentication strategy
- **express-session** (v1.18.1) - Session management
- **connect-pg-simple** (v10.0.0) - PostgreSQL session store
- **memorystore** (v1.6.7) - Memory-based session store
- **Helmet** (v8.1.0) - Security headers
- **CORS** (v2.8.5) - Cross-origin resource sharing

### Validation & Rate Limiting
- **express-validator** (v7.2.1) - Request validation
- **express-rate-limit** (v8.1.0) - API rate limiting
- **Zod** (v3.24.2) - Schema validation

---

## 🛠️ Build Tools & Development

### Build System
- **Vite** (v5.4.20) - Build tool & dev server
- **@vitejs/plugin-react** (v4.7.0) - React plugin for Vite
- **esbuild** (v0.25.0) - Fast JavaScript bundler
- **TSX** (v4.20.5) - TypeScript executor

### TypeScript
- **TypeScript** (v5.6.3) - Static type checking
- **@types/*** - Type definitions for various libraries

### Code Quality
- **TypeScript Strict Mode** - Enabled for type safety
- **ESLint** (implicit) - Code linting
- **Prettier** (implicit) - Code formatting

### Environment & Utilities
- **cross-env** (v10.0.0) - Cross-platform environment variables

---

## 📦 External Services & APIs

### Bluesky/AT Protocol
- **Bluesky Social API** - Profile data, follows, posts
- **AT Protocol Records** - Custom data collections
- **Custom Lexicons** - App-specific schemas

### Third-Party Integrations
- **Spotify API** - Music embeds
- **Apple Music** - Music embeds
- **SoundCloud** - Music embeds
- **YouTube** - Video/music embeds
- **GitHub API** - Activity widgets
- **Ko-fi** - Support widgets
- **Weather APIs** - Weather widgets

---

## 🗄️ Data Storage & Schema

### Schema Definition
- **Zod Schemas** - Type-safe runtime validation
- **JSON Schemas** - AT Protocol lexicon definitions
- **TypeScript Types** - Compile-time type safety

### Storage Locations
- **AT Protocol Records** - Primary data storage (decentralized)
- **PostgreSQL (Neon)** - Session storage and admin data
- **LocalStorage** - Client-side caching and offline support

---

## 🎮 Special Features & Libraries

### Interactive Widgets
- **Mini Games** - Tetris, 2048, Memory, Snake
- **Drag & Drop** - Link reordering, widget management
- **Audio Player** - HTML5 Audio API
- **Carousel/Slider** - Image galleries, before/after comparisons
- **Charts** - Analytics and heat maps
- **Spinning Wheel** - Prize wheel animations

### Performance & Optimization
- **Code Splitting** - Dynamic imports
- **Lazy Loading** - Component and image lazy loading
- **React Query Caching** - Optimistic updates and cache management
- **Debouncing** - Input optimization

---

## 📋 Configuration Files

| File | Purpose | Language |
|------|---------|----------|
| `package.json` | Dependencies & scripts | JSON |
| `tsconfig.json` | TypeScript configuration | JSON |
| `vite.config.ts` | Build configuration | TypeScript |
| `tailwind.config.ts` | Tailwind CSS configuration | TypeScript |
| `postcss.config.js` | PostCSS configuration | JavaScript |
| `drizzle.config.ts` | Database ORM configuration | TypeScript |
| `components.json` | UI component configuration | JSON |
| `render.yaml` | Deployment configuration | YAML |

---

## 📊 Project Statistics

### File Breakdown as of As of 10/01/25
- **113+ TypeScript/TSX files** - Components, pages, utilities
- **21 TypeScript files** - Server logic, libraries, configuration
- **47 UI Component files** - Reusable UI primitives
- **18 Widget files** - Custom interactive widgets
- **20+ Page files** - Application routes and views
- **4 Mini-game files** - Browser games
- **JSON Schema files** - AT Protocol lexicons

### Lines of Code (Estimated)
- **Frontend**: ~15,000+ lines (React/TypeScript)
- **Backend**: ~2,000+ lines (Express/TypeScript)
- **Shared**: ~500+ lines (Schemas/Types)
- **Total**: ~17,500+ lines of code

---

## 🌐 Web Standards & APIs

- **HTML5 Audio API** - Music player
- **Canvas API** - Games and graphics
- **SVG** - Custom icons and shapes
- **Web Storage API** - LocalStorage, SessionStorage
- **Fetch API** - HTTP requests
- **WebSocket API** - Real-time features
- **CSS Custom Properties** - Dynamic theming
- **Responsive Design** - Mobile-first approach

---

## 🚀 Deployment & Infrastructure

- **Render.com** - Deployment platform (from render.yaml)
- **Node.js Environment** - Production runtime
- **Environment Variables** - Configuration management
- **YAML** - Deployment configuration

---

## 📖 Documentation

- **Markdown** - All documentation
- **JSDoc Comments** - Code documentation
- **TypeScript Types** - Self-documenting code

---

## Summary

**Primary Stack**: **TypeScript + React + Express + AT Protocol + PostgreSQL**

The Basker platform is built as a modern, type-safe, full-stack TypeScript application with:
- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Radix UI
- **Backend**: Express.js with TypeScript and Drizzle ORM
- **Data**: AT Protocol for decentralized storage + PostgreSQL for admin features
- **Deployment**: Optimized for serverless/edge deployment

All code is strictly typed with TypeScript, validated with Zod schemas, and built using modern web standards for maximum performance and developer experience.

