# Quick Access Guide - Basker Moderation

## ✅ You Have Moderator Access!

Your account (`basker.bio` / `did:plc:uw2cz5hnxy2i6jbmh6t2i7hi`) has **full moderator permissions**.

## 🚀 How to Access Right Now

### Option 1: Web UI (Easiest - Just Built!)

**Go to**: http://localhost:5000/moderation

This will show you:
- Your moderator status
- Your permissions
- Quick links to Ozone
- API documentation
- Resource links

### Option 2: API Endpoints (Working Now)

Your moderation API is already running at `http://localhost:5000/api/moderation/*`

**Test it:**
```bash
# Check your status
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/status

# View moderators
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/moderators

# Get Ozone config
curl -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" http://localhost:5000/api/moderation/ozone-config
```

### Option 3: Self-Host Ozone (Advanced)

**Important**: Ozone is not publicly hosted. You need to run your own instance.

Ozone provides a full moderation dashboard with:
- Viewing reports
- Reviewing content
- Taking moderation actions
- Viewing moderation logs

**Note**: Bluesky does not provide a public Ozone instance. You must self-host it.

### Option 4: Self-Host Ozone (For Production)

**Quick Setup:**
```bash
# 1. Clone Ozone
git clone https://github.com/bluesky-social/ozone.git
cd ozone

# 2. Install
npm install

# 3. Configure (create .env file)
echo "PDS_URL=https://bsky.social" > .env
echo "DATABASE_URL=postgres://localhost:5432/ozone" >> .env

# 4. Run
npm start

# 5. Access at http://localhost:3100
```

## 📋 Your Current Permissions

```json
{
  "canReviewReports": true,        ✅ Review content reports
  "canIssueLabels": true,          ✅ Add warning labels
  "canTakedownContent": true,      ✅ Remove content
  "canSuspendAccounts": true       ✅ Suspend accounts
}
```

## 🎯 Common Tasks

### Add Another Moderator
```bash
curl -X POST http://localhost:5000/api/moderation/moderators \
  -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" \
  -H "Content-Type: application/json" \
  -d '{
    "did": "did:plc:new-moderator-did",
    "handle": "moderator.bsky.social",
    "permissions": {
      "canReviewReports": true,
      "canIssueLabels": false,
      "canTakedownContent": false,
      "canSuspendAccounts": false
    }
  }'
```

### Create a Report
```bash
curl -X POST http://localhost:5000/api/moderation/reports \
  -H "x-user-did: did:plc:uw2cz5hnxy2i6jbmh6t2i7hi" \
  -H "Content-Type: application/json" \
  -d '{
    "reasonType": "com.atproto.moderation.defs#reasonSpam",
    "reason": "This is spam",
    "subject": {
      "uri": "at://did:plc:user/app.bsky.feed.post/abc",
      "cid": "bafyreia..."
    }
  }'
```

## 📚 Full Documentation

- **Access Guide**: [MODERATION_ACCESS_GUIDE.md](MODERATION_ACCESS_GUIDE.md)
- **Ozone Integration**: [OZONE_INTEGRATION.md](OZONE_INTEGRATION.md)
- **Ozone GitHub**: https://github.com/bluesky-social/ozone

## 🆘 Need Help?

1. Check the [Access Guide](MODERATION_ACCESS_GUIDE.md) for detailed instructions
2. Review the [Ozone documentation](https://github.com/bluesky-social/ozone)
3. Contact support@basker.bio

## ⚡ Quick Start Recommendation

**For immediate access**: 
1. Go to http://localhost:5000/moderation (Web UI) - Check your status and permissions
2. Use the Admin Panel at http://localhost:5000/admin - Manage verification requests
3. To get Ozone: Self-host it following the guide above

**For production**: Follow the self-hosted Ozone setup in the full documentation.

---

**Your moderation system is ready to use!** 🎉
