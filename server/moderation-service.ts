import { BskyAgent } from '@atproto/api';

/**
 * Moderation Service
 * Integrates with AT Protocol moderation APIs for proper content moderation
 * following the AT Protocol's composable and decentralized moderation model
 */

export interface ModeratorPermissions {
  canReviewReports: boolean;
  canIssueLabels: boolean;
  canTakedownContent: boolean;
  canSuspendAccounts: boolean;
}

export interface Moderator {
  did: string;
  handle: string;
  permissions: ModeratorPermissions;
  addedBy: string;
  addedAt: string;
}

export class ModerationService {
  private agent: BskyAgent;
  private moderators: Map<string, Moderator> = new Map();

  constructor(serviceUrl: string = 'https://bsky.social') {
    this.agent = new BskyAgent({ service: serviceUrl });
  }

  /**
   * Check if a user is a moderator
   */
  isModerator(did: string): boolean {
    return this.moderators.has(did);
  }

  /**
   * Get moderator permissions
   */
  getModeratorPermissions(did: string): ModeratorPermissions | null {
    const moderator = this.moderators.get(did);
    return moderator ? moderator.permissions : null;
  }

  /**
   * Add a moderator with specific permissions
   */
  addModerator(did: string, handle: string, permissions: ModeratorPermissions, addedBy: string): void {
    this.moderators.set(did, {
      did,
      handle,
      permissions,
      addedBy,
      addedAt: new Date().toISOString()
    });
  }

  /**
   * Remove a moderator
   */
  removeModerator(did: string): boolean {
    return this.moderators.delete(did);
  }

  /**
   * Get all moderators
   */
  getAllModerators(): Moderator[] {
    return Array.from(this.moderators.values());
  }

  /**
   * Create a moderation report
   * Uses AT Protocol's native reporting system
   */
  async createReport(params: {
    reasonType: string;
    reason?: string;
    subject: {
      uri: string;
      cid: string;
    };
    reportedBy: string;
  }) {
    try {
      const response = await this.agent.api.com.atproto.moderation.createReport({
        reasonType: params.reasonType as any,
        reason: params.reason,
        subject: params.subject,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create moderation report:', error);
      throw error;
    }
  }

  /**
   * Get moderation reports
   * This would typically connect to your Ozone instance
   */
  async getReports(params?: {
    subject?: string;
    resolved?: boolean;
    limit?: number;
  }) {
    try {
      // In production, this would query your Ozone moderation service
      // For now, we'll return an empty array as a placeholder
      console.log('Getting moderation reports with params:', params);
      return [];
    } catch (error) {
      console.error('Failed to get moderation reports:', error);
      throw error;
    }
  }

  /**
   * Resolve a moderation report
   * This would connect to your Ozone instance to take action
   */
  async resolveReport(params: {
    reportId: string;
    action: 'approve' | 'remove' | 'label' | 'suspend';
    note?: string;
    moderatorDid: string;
  }) {
    try {
      // Check moderator permissions
      const permissions = this.getModeratorPermissions(params.moderatorDid);
      if (!permissions) {
        throw new Error('User is not a moderator');
      }

      // Verify moderator has permission for the action
      switch (params.action) {
        case 'remove':
          if (!permissions.canTakedownContent) {
            throw new Error('Moderator does not have permission to remove content');
          }
          break;
        case 'suspend':
          if (!permissions.canSuspendAccounts) {
            throw new Error('Moderator does not have permission to suspend accounts');
          }
          break;
        case 'label':
          if (!permissions.canIssueLabels) {
            throw new Error('Moderator does not have permission to issue labels');
          }
          break;
      }

      // In production, this would call your Ozone instance to perform the action
      console.log('Resolving report:', params);
      
      return {
        success: true,
        reportId: params.reportId,
        action: params.action,
        resolvedBy: params.moderatorDid,
        resolvedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to resolve moderation report:', error);
      throw error;
    }
  }

  /**
   * Get Ozone configuration
   * Returns the configuration needed to connect to your Ozone instance
   */
  getOzoneConfig() {
    return {
      ozoneUrl: process.env.OZONE_URL || 'https://ozone.bsky.app',
      serviceUrl: process.env.PDS_URL || 'https://bsky.social',
      // In production, you would configure your own Ozone instance
      // See: https://github.com/bluesky-social/ozone
    };
  }
}

// Export singleton instance
export const moderationService = new ModerationService();

// Initialize default moderator (basker.bio)
moderationService.addModerator(
  'did:plc:uw2cz5hnxy2i6jbmh6t2i7hi',
  'basker.bio',
  {
    canReviewReports: true,
    canIssueLabels: true,
    canTakedownContent: true,
    canSuspendAccounts: true
  },
  'system'
);
