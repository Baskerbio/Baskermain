import { BskyAgent } from '@atproto/api';

export interface VerificationRequest {
  id: string;
  userId: string;
  companyId: string;
  evidence: string;
  documents?: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Admin DIDs - should be in environment variables in production
const ADMIN_DIDS = [
  'did:plc:uw2cz5hnxy2i6jbmh6t2i7hi', // @basker.bio
  // Add your DID here
];

const verificationRequests: VerificationRequest[] = [];

export function isAdmin(did: string): boolean {
  return ADMIN_DIDS.includes(did);
}

export function getAdminPermissions(did: string): string[] {
  if (!isAdmin(did)) {
    return [];
  }
  
  // All admins get verification permissions
  return ['verify_work'];
}

export function checkAdminPermission(did: string, permission: string): boolean {
  const permissions = getAdminPermissions(did);
  return permissions.includes(permission);
}

// AT Protocol admin functions
export class ATProtocolAdmin {
  private agent: BskyAgent;
  private isAuthenticated: boolean = false;

  constructor(serviceUrl: string = 'https://bsky.social') {
    this.agent = new BskyAgent({ service: serviceUrl });
    this.authenticate();
  }

  private async authenticate() {
    try {
      // Use environment variables for admin credentials
      const adminHandle = process.env.ADMIN_HANDLE || 'basker.bio';
      const adminPassword = process.env.ADMIN_PASSWORD || '';
      
      if (adminPassword) {
        await this.agent.login({
          identifier: adminHandle,
          password: adminPassword,
        });
        this.isAuthenticated = true;
        console.log('✅ AT Protocol admin client authenticated');
      } else {
        console.log('⚠️ No admin password set, using unauthenticated client');
      }
    } catch (error) {
      console.error('❌ Failed to authenticate AT Protocol admin client:', error);
    }
  }

  // Get user profile by DID
  async getUserProfile(did: string) {
    try {
      const profile = await this.agent.api.app.bsky.actor.getProfile({ actor: did });
      return profile.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  // Get user profile by handle
  async getUserProfileByHandle(handle: string) {
    try {
      const profile = await this.agent.api.app.bsky.actor.getProfile({ actor: handle });
      return profile.data;
    } catch (error) {
      console.error('Failed to get user profile by handle:', error);
      throw error;
    }
  }

  // Get verification requests (would be stored as AT Protocol records)
  async getVerificationRequests() {
    console.log('🔍 getVerificationRequests called, returning:', verificationRequests.length, 'requests');
    console.log('🔍 verificationRequests:', verificationRequests);
    // In production, this would query AT Protocol records
    return verificationRequests;
  }

  // Update verification request status
  async updateVerificationRequest(requestId: string, status: 'approved' | 'rejected', adminNotes?: string, reviewedBy?: string) {
    try {
      const request = verificationRequests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Verification request not found');
      }

      request.status = status;
      request.adminNotes = adminNotes;
      request.reviewedBy = reviewedBy;
      request.reviewedAt = new Date().toISOString();

      // In production, this would update AT Protocol records
      return { success: true, request };
    } catch (error) {
      console.error('Failed to update verification request:', error);
      throw error;
    }
  }

  // Submit verification request
  async submitVerificationRequest(request: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>) {
    try {
      const newRequest: VerificationRequest = {
        ...request,
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      console.log('🔍 Adding verification request to array:', newRequest);
      verificationRequests.push(newRequest);
      console.log('🔍 verificationRequests array now has:', verificationRequests.length, 'requests');
      
      // In production, this would create AT Protocol records
      return { success: true, request: newRequest };
    } catch (error) {
      console.error('Failed to submit verification request:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const atProtocolAdmin = new ATProtocolAdmin();