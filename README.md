# Basker - Decentralized Link-in-Bio Platform

[![Version](https://img.shields.io/badge/version-2.1.0.0-blue.svg)](https://github.com/Baskerbio/Baskermain/releases)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![Built on AT Protocol](https://img.shields.io/badge/built%20on-AT%20Protocol-purple.svg)](https://atproto.com/)

Basker is a comprehensive decentralized link-in-bio platform built on the AT Protocol, providing users with a complete ecosystem for creating professional profile pages. The platform emphasizes data ownership, decentralization, and user control while offering advanced customization and moderation capabilities.

## 🏗️ Architecture Overview

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Protocol**: AT Protocol (Bluesky)
- **Styling**: Tailwind CSS + Radix UI
- **Deployment**: GitHub Actions + Render

### **Core Principles**
- **Decentralization**: Built on AT Protocol for true data ownership
- **Privacy-First**: No data harvesting or tracking
- **Open Standards**: Interoperable with the broader AT Protocol ecosystem
- **User Control**: Complete control over personal data and content

## 🚀 Platform Features

### **Content Management System**
- **Unlimited Links**: Custom icons, descriptions, and advanced styling
- **Stories System**: Time-limited content with automatic expiration
- **Notes & Blogging**: Personal content creation and management
- **Work History**: Professional experience with company verification
- **Widget System**: Extensible content widgets and integrations

### **Advanced Customization**
- **Theme Engine**: Multiple themes with custom color schemes
- **Layout System**: Flexible section ordering and positioning
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG compliant with keyboard navigation

### **Moderation & Administration**
- **Ozone Integration**: Professional moderation using AT Protocol's Ozone
- **Composable Moderation**: Decentralized, transparent moderation model
- **Company Verification**: Automated work history verification system
- **Admin Panel**: Comprehensive moderation and user management tools

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 14+
- Git
- Bluesky account (for AT Protocol integration)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Baskerbio/Baskermain.git
   cd Baskermain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb basker_dev
   
   # Run database migrations
   npm run db:push
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### **Development Commands**

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Type checking
npm run check           # TypeScript type checking
npm run lint            # ESLint code linting

# Database
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio
npm run db:generate     # Generate migrations

# Testing
npm run test            # Run test suite
npm run test:watch      # Watch mode testing
```

## 📁 Project Structure

```
Baskermain/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components (Radix)
│   │   │   ├── widgets/     # Content widget components
│   │   │   └── ...           # Feature-specific components
│   │   ├── pages/            # Route-based page components
│   │   ├── contexts/         # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and AT Protocol client
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Static assets
│   └── dist/                 # Built frontend
├── server/                   # Express.js backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database operations
│   └── admin.ts             # Admin panel routes
├── shared/                   # Shared code between client/server
│   └── schema.ts            # Zod schemas and types
├── docs/                     # Documentation
│   ├── TECHNOLOGY_STACK.md  # Technical architecture
│   ├── OZONE_INTEGRATION.md # Moderation system docs
│   └── VERIFICATION_IMPLEMENTATION.md
├── scripts/                  # Utility scripts
├── drizzle.config.ts        # Database configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

## 🔧 Configuration

### **Environment Variables**

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/basker

# AT Protocol Configuration
AT_PROTOCOL_SERVICE_URL=https://bsky.social
AT_PROTOCOL_HANDLE=your-handle.bsky.social
AT_PROTOCOL_APP_PASSWORD=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret

# Optional: Analytics and Monitoring
ANALYTICS_ENABLED=true
LOG_LEVEL=info
```

### **AT Protocol Integration**

The platform integrates with the AT Protocol for decentralized data storage and user authentication:

1. **Account Setup**: Users authenticate via Bluesky accounts
2. **Data Storage**: All user data is stored on the AT Protocol network
3. **Interoperability**: Content works across the entire AT Protocol ecosystem
4. **Moderation**: Leverages AT Protocol's Ozone moderation tools

## 🚀 Deployment

### **Production Build**

```bash
# Build the application
npm run build

# The dist/ folder contains the production build
# Deploy this to your hosting provider
```

### **Database Deployment**

```bash
# Push schema to production database
npm run db:push

# Generate and run migrations
npm run db:generate
npm run db:migrate
```

### **Environment Setup**

1. **Database**: Set up PostgreSQL instance
2. **AT Protocol**: Configure Bluesky integration
3. **Environment**: Set production environment variables
4. **SSL**: Configure HTTPS for production
5. **Monitoring**: Set up logging and error tracking

## 🔒 Security & Privacy

### **Data Protection**
- **Content Security Policy**: Comprehensive CSP headers
- **HTTPS Enforcement**: All traffic encrypted
- **Session Security**: Secure session management
- **Input Validation**: Comprehensive input sanitization

### **Privacy Features**
- **No Tracking**: No analytics or user tracking
- **Data Ownership**: Users own their data completely
- **Decentralization**: Data stored on AT Protocol network
- **Transparency**: Open about data handling practices

## 📊 Monitoring & Analytics

### **Built-in Analytics**
- **User Engagement**: Link click tracking
- **Performance Metrics**: Page load times and interactions
- **Heat Maps**: Visual user interaction data
- **Custom Events**: Trackable user actions

### **Admin Tools**
- **User Management**: Comprehensive user administration
- **Content Moderation**: Ozone integration for content review
- **System Health**: Server and database monitoring
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow coding standards and conventions
4. **Test thoroughly**: Ensure all tests pass
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**: Detailed description of changes

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage required
- **Documentation**: Clear code comments and documentation

## 📚 Documentation

- **[Technology Stack](docs/TECHNOLOGY_STACK.md)**: Detailed technical architecture
- **[Ozone Integration](docs/OZONE_INTEGRATION.md)**: Moderation system documentation
- **[Verification System](docs/VERIFICATION_IMPLEMENTATION.md)**: Work history verification
- **[Quick Access Guide](docs/QUICK_ACCESS.md)**: Developer quick reference

## 🔗 External Resources

- **AT Protocol**: [atproto.com](https://atproto.com/)
- **Bluesky**: [bsky.app](https://bsky.app)
- **Radix UI**: [radix-ui.com](https://www.radix-ui.com/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team/)

## 📄 License

This project is **private and proprietary**. All rights reserved. This code is not open source and is not available for public use or distribution.

## 🆘 Support

For technical support and questions:
- **Email**: [dev@basker.bio](mailto:dev@basker.bio)
- **Documentation**: Internal documentation system
- **Issues**: Private issue tracking system

---

**Version 2.1.0.0** - Complete decentralized platform with advanced moderation, verification, and customization capabilities.