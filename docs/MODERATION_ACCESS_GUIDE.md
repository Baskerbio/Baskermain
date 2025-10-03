# How to Access the Moderation System

## Quick Start Guide

### 1. Check Your Moderator Status

First, verify that you have moderator access:

**Via Browser Console:**
```javascript
fetch('http://localhost:5000/api/moderation/status', {
  headers: {
    'x-user-did': 'did:plc:uw2cz5hnxy2i6jbmh6t2i7hi' // Your DID
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

**Expected Response:**
```json
{
  "isModerator": true,
  "permissions": {
    "canReviewReports": true,
    "canIssueLabels": true,
    "canTakedownContent": true,
    "canSuspendAccounts": true
  }
}
```

### 2. Access Moderation Features

#### Option A: Use Basker's Built-in Moderation Panel (Coming Soon)

Navigate to: `http://localhost:5000/moderation`

This will show:
- Moderation reports queue
- Content review interface
- Moderator actions log
- Moderation statistics

#### Option B: Use Ozone (Professional Moderation Dashboard)

Ozone is the official AT Protocol moderation tool with a full-featured UI.

**For Testing (Using Bluesky's Instance):**
1. Go to https://ozone.bsky.app
2. Sign in with your Bluesky credentials
3. You'll see the moderation dashboard if you have moderator permissions

**For Production (Self-Hosted):**

1. Clone and set up Ozone:
```bash
git clone https://github.com/bluesky-social/ozone.git
cd ozone
npm install
```

2. Configure `.env`:
```env
PDS_URL=https://bsky.social
OZONE_SERVER_DID=did:plc:your-ozone-did
OZONE_ADMIN_PASSWORD=your-secure-password
DATABASE_URL=postgres://localhost:5432/ozone
```

3. Start Ozone:
```bash
npm run start
```

4. Access the dashboard:
```
http://localhost:3100
```

### 3. Available API Endpoints

You can also interact directly with the moderation API:

#### Check Moderator Status
```bash
GET http://localhost:5000/api/moderation/status
Headers: x-user-did: your-did-here
```

#### Get Reports
```bash
GET http://localhost:5000/api/moderation/reports
Headers: x-user-did: your-did-here
```

#### Create a Report
```bash
POST http://localhost:5000/api/moderation/reports
Headers: 
  x-user-did: your-did-here
  Content-Type: application/json
Body:
{
  "reasonType": "com.atproto.moderation.defs#reasonSpam",
  "reason": "This is spam content",
  "subject": {
    "uri": "at://did:plc:user/app.bsky.feed.post/abc123",
    "cid": "bafyreiabc123..."
  }
}
```

#### Resolve a Report
```bash
POST http://localhost:5000/api/moderation/reports/:reportId/resolve
Headers: 
  x-user-did: your-did-here
  Content-Type: application/json
Body:
{
  "action": "remove",
  "note": "Content removed for violating guidelines"
}
```

#### List Moderators
```bash
GET http://localhost:5000/api/moderation/moderators
Headers: x-user-did: your-did-here
```

#### Add a Moderator
```bash
POST http://localhost:5000/api/moderation/moderators
Headers: 
  x-user-did: your-did-here
  Content-Type: application/json
Body:
{
  "did": "did:plc:new-moderator",
  "handle": "moderator.bsky.social",
  "permissions": {
    "canReviewReports": true,
    "canIssueLabels": true,
    "canTakedownContent": false,
    "canSuspendAccounts": false
  }
}
```

### 4. Current Moderators

By default, the following account has full moderator access:
- **DID**: `did:plc:uw2cz5hnxy2i6jbmh6t2i7hi`
- **Handle**: `basker.bio`
- **Permissions**: All permissions enabled

### 5. Testing the Moderation System

**Step 1: Check if you're a moderator**
```bash
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/status
```

**Step 2: View all moderators**
```bash
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/moderators
```

**Step 3: Get Ozone configuration**
```bash
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/ozone-config
```

### 6. Troubleshooting

**"Not a moderator" error?**
- Check that your DID is correct
- Verify you're sending the `x-user-did` header
- Check the moderator list

**Cannot access Ozone?**
- Make sure Ozone is running (if self-hosted)
- Check your Ozone configuration
- Verify network connectivity

**Permissions denied?**
- Check your specific permissions with `/api/moderation/status`
- Contact an admin to update your permissions

### 7. Next Steps

1. **Set up Ozone** - For a full moderation dashboard
2. **Add more moderators** - Distribute moderation work
3. **Configure permissions** - Fine-tune access control
4. **Review documentation** - See [OZONE_INTEGRATION.md](OZONE_INTEGRATION.md)

## Quick Reference

### Common Tasks

| Task | Endpoint | Required Permission |
|------|----------|-------------------|
| Check status | `GET /api/moderation/status` | None |
| View reports | `GET /api/moderation/reports` | `canReviewReports` |
| Create report | `POST /api/moderation/reports` | None (anyone) |
| Resolve report | `POST /api/moderation/reports/:id/resolve` | `canReviewReports` |
| List moderators | `GET /api/moderation/moderators` | Moderator |
| Add moderator | `POST /api/moderation/moderators` | Moderator |

### Report Types

- `reasonSpam` - Spam content
- `reasonViolation` - Terms of service violation
- `reasonMisleading` - Misleading information
- `reasonSexual` - Adult/sexual content
- `reasonRude` - Harassment or rude behavior
- `reasonOther` - Other issues

### Moderation Actions

- `approve` - Mark content as acceptable
- `remove` - Remove content
- `label` - Add a warning label
- `suspend` - Suspend user account

## Support

Need help? Check:
- [Ozone Documentation](https://github.com/bluesky-social/ozone)
- [AT Protocol Moderation Spec](https://atproto.com/specs/moderation)
- Contact: support@basker.bio
