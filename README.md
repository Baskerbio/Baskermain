# Basker - Decentralized Link-in-Bio Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Baskerbio/Baskermain/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Built on AT Protocol](https://img.shields.io/badge/built%20on-AT%20Protocol-purple.svg)](https://atproto.com/)

Basker is a decentralized link-in-bio platform built on the AT Protocol, allowing users to create beautiful, customizable profile pages with unlimited links, stories, notes, and widgets. Your data belongs to you and works across the entire decentralized network.

## ✨ Features

### 🔗 **Link Management**
- Unlimited links with custom icons and descriptions
- Advanced customization (colors, fonts, shapes)
- Drag-and-drop reordering
- Group organization

### 📝 **Content Widgets**
- **Notes**: Personal notes and thoughts
- **Stories**: Time-limited content with expiration
- **Work History**: Professional experience with company verification
- **Portfolio Gallery**: Showcase your work (coming soon)
- **Product Showcase**: Highlight products (coming soon)

### 🏢 **Verification System**
- Company search and association
- Verification status tracking
- Admin panel for verification management
- Email-based verification requests

### 🎨 **Customization**
- Multiple themes and color schemes
- Custom profile images and bios
- Responsive design for all devices
- Dark mode support

### 🔒 **Security & Privacy**
- Built on AT Protocol for decentralization
- Content Security Policy (CSP) protection
- No data harvesting or tracking
- User data ownership

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Bluesky account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Baskerbio/Baskermain.git
   cd Baskermain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run check

# Database operations
npm run db:push
```

## 📁 Project Structure

```
BaskerBio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and AT Protocol client
├── server/                # Express.js backend
├── shared/                # Shared schemas and types
├── .github/workflows/     # GitHub Actions
└── dist/                  # Built application
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=your_database_url

# AT Protocol
AT_PROTOCOL_SERVICE_URL=https://bsky.social
AT_PROTOCOL_HANDLE=your-handle.bsky.social
AT_PROTOCOL_APP_PASSWORD=your-app-password

# Server
PORT=5000
NODE_ENV=production

# Session
SESSION_SECRET=your_session_secret
```

### AT Protocol Setup

1. Create a Bluesky account at [bsky.app](https://bsky.app)
2. Generate an app password in your Bluesky settings
3. Configure the AT Protocol credentials in your environment

## 🚀 Deployment

### GitHub Actions

The project includes automated deployment via GitHub Actions:

- **Trigger**: Push to `master` branch or version tags
- **Build**: Automated build and test
- **Deploy**: Production deployment (configure your hosting provider)
- **Release**: Automatic release creation on version tags

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting provider

3. **Configure environment variables** on your hosting platform

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [basker.bio](https://basker.bio)
- **Documentation**: [Info Center](https://basker.bio/info)
- **Support**: [support@basker.bio](mailto:support@basker.bio)
- **Verification**: [verification@basker.bio](mailto:verification@basker.bio)

## 🙏 Acknowledgments

- Built on the [AT Protocol](https://atproto.com/)
- Powered by [Bluesky](https://bsky.app)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Version 1.0.0** - Complete platform with work history, verification system, and legal documentation
