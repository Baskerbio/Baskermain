# Ozone Integration Guide

This document explains how Basker integrates with AT Protocol's Ozone moderation service for proper, decentralized content moderation.

## Overview

Basker uses the AT Protocol's composable moderation model, integrating with [Ozone](https://github.com/bluesky-social/ozone) for content moderation instead of building a custom admin system.

## Architecture

### 1. Moderation Service (`server/moderation-service.ts`)
- Manages moderator permissions
- Interfaces with AT Protocol moderation APIs
- Handles report creation and resolution
- Connects to Ozone instance

### 2. Permissions Layer
Moderators have granular permissions:
- `canReviewReports`: Review and triage reports
- `canIssueLabels`: Apply content labels
- `canTakedownContent`: Remove content
- `canSuspendAccounts`: Suspend user accounts

### 3. API Endpoints (`server/moderation-routes.ts`)
- `GET /api/moderation/status` - Check moderator status
- `GET /api/moderation/ozone-config` - Get Ozone configuration
- `GET /api/moderation/reports` - List moderation reports
- `POST /api/moderation/reports` - Create new report
- `POST /api/moderation/reports/:id/resolve` - Resolve report
- `GET /api/moderation/moderators` - List moderators
- `POST /api/moderation/moderators` - Add moderator
- `DELETE /api/moderation/moderators/:did` - Remove moderator

## Setting Up Ozone

### Option 1: Use Bluesky's Ozone Instance
For development and testing:
```env
OZONE_URL=https://ozone.bsky.app
PDS_URL=https://bsky.social
```

### Option 2: Self-Host Ozone (Recommended for Production)

1. **Clone Ozone Repository**
```bash
git clone https://github.com/bluesky-social/ozone.git
cd ozone
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```env
# .env
PDS_URL=https://bsky.social
OZONE_SERVER_DID=did:plc:your-ozone-service-did
OZONE_ADMIN_PASSWORD=your-secure-password
DATABASE_URL=postgres://user:password@localhost:5432/ozone
```

4. **Run Ozone**
```bash
npm run start
```

5. **Update Basker Configuration**
```env
# Basker .env
OZONE_URL=http://localhost:3100
PDS_URL=https://bsky.social
```

## Adding Moderators

### Via API
```javascript
POST /api/moderation/moderators
{
  "did": "did:plc:moderator-did",
  "handle": "moderator.bsky.social",
  "permissions": {
    "canReviewReports": true,
    "canIssueLabels": true,
    "canTakedownContent": true,
    "canSuspendAccounts": false
  }
}
```

### Via Code (Initial Setup)
```typescript
import { moderationService } from './server/moderation-service';

moderationService.addModerator(
  'did:plc:moderator-did',
  'moderator.bsky.social',
  {
    canReviewReports: true,
    canIssueLabels: true,
    canTakedownContent: true,
    canSuspendAccounts: true
  },
  'system'
);
```

## Creating Reports

Users can create reports using the AT Protocol's native reporting system:

```javascript
POST /api/moderation/reports
{
  "reasonType": "com.atproto.moderation.defs#reasonSpam",
  "reason": "This content is spam",
  "subject": {
    "uri": "at://did:plc:user/app.bsky.feed.post/abc123",
    "cid": "bafyreiabc123..."
  }
}
```

### Report Types
- `reasonSpam` - Spam content
- `reasonViolation` - Terms violation
- `reasonMisleading` - Misleading information
- `reasonSexual` - Adult/sexual content
- `reasonRude` - Rude or harassing behavior
- `reasonOther` - Other reasons

## Moderating Content

Moderators can take actions on reports:

```javascript
POST /api/moderation/reports/:reportId/resolve
{
  "action": "remove", // "approve" | "remove" | "label" | "suspend"
  "note": "Removed for violating community guidelines"
}
```

## Connecting to Ozone UI

Once your Ozone instance is running, moderators can access the web UI at:
```
http://localhost:3100
```

The Ozone UI provides:
- Report queue management
- Content labeling tools
- Account moderation
- Moderation statistics
- Moderator activity logs

## PDS Admin Integration

For server-level tasks (account creation, invite codes, etc.), you can use the PDS admin functionality:

```bash
# Clone the PDS repository
git clone https://github.com/bluesky-social/atproto.git
cd atproto/packages/pds

# Use pdsadmin CLI
npm run pdsadmin -- <command>
```

Common PDS admin tasks:
- `create-invite-code` - Generate invite codes
- `list-accounts` - View all accounts
- `update-account-status` - Suspend/activate accounts
- `reset-password` - Reset user passwords

## Security Best Practices

1. **Moderator Access Control**
   - Use granular permissions
   - Regularly audit moderator actions
   - Implement 2FA for moderators

2. **Ozone Instance Security**
   - Use HTTPS in production
   - Restrict access to moderators only
   - Keep Ozone updated
   - Regular security audits

3. **Report Handling**
   - Review reports promptly
   - Document moderation decisions
   - Implement appeals process
   - Maintain transparency

## Composable Moderation

The AT Protocol's moderation model is composable and decentralized:

1. **Multiple Moderation Services** - Different services can moderate the same content
2. **User Choice** - Users can choose which moderation services to subscribe to
3. **Transparency** - Moderation actions are recorded on-chain
4. **Appeals** - Users can appeal moderation decisions
5. **Stackable Labels** - Multiple labels can apply to the same content

## Resources

- [Ozone GitHub Repository](https://github.com/bluesky-social/ozone)
- [AT Protocol Moderation Spec](https://atproto.com/specs/moderation)
- [Bluesky Moderation Guide](https://blueskyweb.xyz/blog/moderation)
- [PDS Admin Documentation](https://github.com/bluesky-social/atproto/tree/main/packages/pds)

## Support

For issues or questions about Ozone integration:
1. Check the [Ozone Issues](https://github.com/bluesky-social/ozone/issues)
2. Join the [AT Protocol Discord](https://discord.gg/atproto)
3. Contact Basker support at support@basker.bio
