import { Request, Response } from 'express';
import { moderationService } from './moderation-service';

/**
 * Moderation Routes
 * API endpoints for AT Protocol moderation using Ozone
 */

// Middleware to check if user is a moderator
export function requireModerator(req: Request, res: Response, next: Function) {
  const did = req.headers['x-user-did'] as string;
  
  if (!did) {
    return res.status(401).json({ error: 'User DID required' });
  }
  
  if (!moderationService.isModerator(did)) {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  
  next();
}

// Middleware to check specific moderator permission
export function requireModeratorPermission(permission: keyof import('./moderation-service').ModeratorPermissions) {
  return (req: Request, res: Response, next: Function) => {
    const did = req.headers['x-user-did'] as string;
    
    if (!did) {
      return res.status(401).json({ error: 'User DID required' });
    }
    
    const permissions = moderationService.getModeratorPermissions(did);
    if (!permissions || !permissions[permission]) {
      return res.status(403).json({ error: `Permission '${permission}' required` });
    }
    
    next();
  };
}

export function setupModerationRoutes(app: any) {
  // Get moderator status
  app.get('/api/moderation/status', (req: Request, res: Response) => {
    const did = req.headers['x-user-did'] as string;
    
    if (!did) {
      return res.json({ isModerator: false, permissions: null });
    }
    
    const permissions = moderationService.getModeratorPermissions(did);
    res.json({
      isModerator: moderationService.isModerator(did),
      permissions
    });
  });

  // Get Ozone configuration
  app.get('/api/moderation/ozone-config', requireModerator, (req: Request, res: Response) => {
    const config = moderationService.getOzoneConfig();
    res.json(config);
  });

  // Get moderation reports
  app.get('/api/moderation/reports', requireModeratorPermission('canReviewReports'), async (req: Request, res: Response) => {
    try {
      const { subject, resolved, limit } = req.query;
      
      const reports = await moderationService.getReports({
        subject: subject as string,
        resolved: resolved === 'true',
        limit: limit ? parseInt(limit as string) : undefined
      });
      
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get moderation reports' });
    }
  });

  // Create moderation report
  app.post('/api/moderation/reports', async (req: Request, res: Response) => {
    try {
      const { reasonType, reason, subject } = req.body;
      const reportedBy = req.headers['x-user-did'] as string;
      
      if (!reportedBy) {
        return res.status(401).json({ error: 'User DID required' });
      }
      
      if (!reasonType || !subject) {
        return res.status(400).json({ error: 'reasonType and subject required' });
      }
      
      const report = await moderationService.createReport({
        reasonType,
        reason,
        subject,
        reportedBy
      });
      
      res.json({ message: 'Report created successfully', report });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create moderation report' });
    }
  });

  // Resolve moderation report
  app.post('/api/moderation/reports/:reportId/resolve', requireModeratorPermission('canReviewReports'), async (req: Request, res: Response) => {
    try {
      const { reportId } = req.params;
      const { action, note } = req.body;
      const moderatorDid = req.headers['x-user-did'] as string;
      
      if (!action) {
        return res.status(400).json({ error: 'action required' });
      }
      
      const result = await moderationService.resolveReport({
        reportId,
        action,
        note,
        moderatorDid
      });
      
      res.json({ message: 'Report resolved successfully', result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to resolve moderation report' });
    }
  });

  // Get all moderators
  app.get('/api/moderation/moderators', requireModerator, (req: Request, res: Response) => {
    const moderators = moderationService.getAllModerators();
    res.json(moderators);
  });

  // Add moderator
  app.post('/api/moderation/moderators', requireModerator, (req: Request, res: Response) => {
    try {
      const { did, handle, permissions } = req.body;
      const addedBy = req.headers['x-user-did'] as string;
      
      if (!did || !handle) {
        return res.status(400).json({ error: 'did and handle required' });
      }
      
      moderationService.addModerator(did, handle, permissions, addedBy);
      res.json({ message: 'Moderator added successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to add moderator' });
    }
  });

  // Remove moderator
  app.delete('/api/moderation/moderators/:did', requireModerator, (req: Request, res: Response) => {
    try {
      const { did } = req.params;
      
      const success = moderationService.removeModerator(did);
      if (!success) {
        return res.status(404).json({ error: 'Moderator not found' });
      }
      
      res.json({ message: 'Moderator removed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to remove moderator' });
    }
  });

  console.log('✅ Moderation routes registered');
}
