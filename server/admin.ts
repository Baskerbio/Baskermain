import { Request, Response } from 'express';
import { atProtocolAdmin, isAdmin, getAdminPermissions, checkAdminPermission } from './atprotocol-admin';

// Re-export functions from atprotocol-admin
export { isAdmin, getAdminPermissions, checkAdminPermission };

// Middleware to check admin status
export function requireAdmin(req: Request, res: Response, next: Function) {
  const did = req.headers['x-user-did'] as string;
  
  if (!did) {
    return res.status(401).json({ error: 'User DID required' });
  }
  
  if (!isAdmin(did)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}

// Middleware to check specific admin permission
export function requireAdminPermission(permission: string) {
  return (req: Request, res: Response, next: Function) => {
    const did = req.headers['x-user-did'] as string;
    
    if (!did) {
      return res.status(401).json({ error: 'User DID required' });
    }
    
    if (!checkAdminPermission(did, permission)) {
      return res.status(403).json({ error: `Permission '${permission}' required` });
    }
    
    next();
  };
}

// API endpoints for admin management
export function setupAdminRoutes(app: any) {
  // Test endpoint to verify admin routes are working
  app.get('/api/admin/test', (req: Request, res: Response) => {
    res.json({ message: 'Admin routes are working!', timestamp: new Date().toISOString() });
  });

  // Get admin status
  app.get('/api/admin/status', (req: Request, res: Response) => {
    const did = req.headers['x-user-did'] as string;
    
    if (!did) {
      return res.json({ isAdmin: false, permissions: [] });
    }
    
    res.json({
      isAdmin: isAdmin(did),
      permissions: getAdminPermissions(did)
    });
  });
  
  // Get verification requests
  app.get('/api/admin/verification-requests', requireAdminPermission('verify_work'), async (req: Request, res: Response) => {
    try {
      const requests = await atProtocolAdmin.getVerificationRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get verification requests' });
    }
  });

  // Update verification request
  app.put('/api/admin/verification-requests/:id', requireAdminPermission('verify_work'), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const reviewedBy = req.headers['x-user-did'] as string;
      
      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Valid status required' });
      }
      
      const result = await atProtocolAdmin.updateVerificationRequest(id, status, adminNotes, reviewedBy);
      res.json({ message: 'Verification request updated successfully', request: result.request });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update verification request' });
    }
  });

  // Submit verification request
  app.post('/api/verification-requests', async (req: Request, res: Response) => {
    try {
      const { userId, companyId, evidence, documents } = req.body;
      
      if (!userId || !companyId || !evidence) {
        return res.status(400).json({ error: 'User ID, company ID, and evidence are required' });
      }
      
      const result = await atProtocolAdmin.submitVerificationRequest({
        userId,
        companyId,
        evidence,
        documents
      });
      
      res.json({ message: 'Verification request submitted successfully', request: result.request });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to submit verification request' });
    }
  });

  console.log('✅ Admin routes registered (verification only)');
}
