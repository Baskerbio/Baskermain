import { BskyAgent, RichText } from '@atproto/api';
import { Link, Note, Story, Group, Settings, Widget, LinksRecord, NotesRecord, StoriesRecord, SettingsRecord, WidgetsRecord, Company, WorkHistory, AdminUser, CompaniesRecord, WorkHistoryRecord, AdminUsersRecord } from '@shared/schema';
import { BASKER_LEXICONS, validateRecord } from './lexicons';

export class ATProtocolClient {
  private agent: BskyAgent;
  private did: string | null = null;
  private session: any | null = null; // To store session data for easier access

  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    });
    
    // Register our custom Lexicon schemas
    this.registerCustomLexicons();
  }

  private registerCustomLexicons() {
    // Note: AT Protocol custom lexicons need to be published and hosted
    // For now, we'll use the existing AT Protocol record types
    // The custom schemas are defined in the public/schemas/ directory
    // and can be hosted on GitHub Pages or similar for proper registration
    
    console.log('Custom Lexicons defined in public/schemas/ directory');
    console.log('To properly register: host schemas at a public URL and reference them');
  }

  async login(identifier: string, password: string) {
    try {
      const response = await this.agent.login({
        identifier,
        password,
      });

      this.did = response.data.did;
      this.session = response.data; // Store session data

      // Store session token securely in memory
      localStorage.setItem('basker_session', JSON.stringify({
        did: response.data.did,
        handle: response.data.handle,
        accessJwt: response.data.accessJwt,
        refreshJwt: response.data.refreshJwt,
      }));

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('basker_session');
    // Clear all user-specific data when logging out
    if (this.did) {
      const dataTypes = ['links', 'notes', 'stories', 'settings', 'widgets'];
      dataTypes.forEach(type => {
        localStorage.removeItem(this.getStorageKey(type));
      });
    }
    this.did = null;
    this.session = null; // Clear session data
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    });
  }

  async restoreSession() {
    const session = localStorage.getItem('basker_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        // Set DID immediately for data access
        this.did = sessionData.did;
        this.session = sessionData; // Restore session data
        console.log('Restored session with DID:', this.did);

        // Try to restore AT Protocol session, but don't fail if it doesn't work
        try {
          await this.agent.resumeSession(sessionData);
          console.log('AT Protocol session restored successfully');
        } catch (error) {
          // If AT Protocol session fails, keep DID for localStorage access
          console.warn('AT Protocol session restore failed, but keeping DID for data access:', error);
        }

        return sessionData;
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('basker_session');
        this.did = null;
        this.session = null; // Clear session data
        throw error;
      }
    }
    return null;
  }

  async getProfile(actor?: string) {
    if (!this.session && !actor) { // Check this.session instead of this.agent.session
      throw new Error('Not authenticated');
    }

    try {
      // Try without subscribedLabelers first to get all labels
      const response = await this.agent.getProfile({
        actor: actor || this.did!,
      });
      
      console.log('✅ getProfile - Profile data:', response.data);
      console.log('✅ getProfile - Labels:', response.data.labels);
      console.log('✅ getProfile - Labels length:', response.data.labels?.length || 0);
      
      return response.data;
    } catch (error) {
      console.log('🔍 getProfile - Trying with atproto-accept-labelers header');
      
      // Try with atproto-accept-labelers header
      const labelers = [
        'did:plc:ar7c4by46qjdydhdev7ndg3c', // Bluesky official labeler
        'did:plc:q6gjnaw2blt4fxgdvzw6w6xx', // Another official labeler
        'did:plc:z72i7hdynmk6r22z27h6tvur'  // Additional labeler
      ];
      
      try {
        const response = await this.agent.getProfile({
          actor: actor || this.did!,
          headers: {
            'atproto-accept-labelers': labelers.join(',')
          }
        });
        
        console.log('✅ getProfile (header) - Profile data:', response.data);
        console.log('✅ getProfile (header) - Labels:', response.data.labels);
        console.log('✅ getProfile (header) - Labels length:', response.data.labels?.length || 0);
        
        return response.data;
      } catch (headerError) {
        console.log('🔍 getProfile - Trying with subscribedLabelers as final fallback');
        
        // Final fallback to subscribedLabelers
        const response = await this.agent.getProfile({
          actor: actor || this.did!,
          subscribedLabelers: labelers,
        });
        
        console.log('✅ getProfile (fallback) - Profile data:', response.data);
        console.log('✅ getProfile (fallback) - Labels:', response.data.labels);
        console.log('✅ getProfile (fallback) - Labels length:', response.data.labels?.length || 0);
        
        return response.data;
      }
    }
  }

  // Public method for getting profiles without authentication
  async getPublicProfile(handle: string) {
    try {
      console.log('🔍 getPublicProfile called for handle:', handle);
      
      // Try using the AT Protocol client directly first
      try {
        console.log('🔍 Trying AT Protocol client approach...');
        const response = await this.agent.getProfile({
          actor: handle,
        });
        
        console.log('✅ AT Protocol client - Profile data:', response.data);
        console.log('✅ AT Protocol client - Labels:', response.data.labels);
        console.log('✅ AT Protocol client - Labels length:', response.data.labels?.length || 0);
        console.log('✅ AT Protocol client - Full response keys:', Object.keys(response.data));
        
        // Check if there are any verification-related fields in the response
        console.log('🔍 Checking for verification fields in AT Protocol response...');
        console.log('🔍 response.data.verified:', response.data.verified);
        console.log('🔍 response.data.isVerified:', response.data.isVerified);
        console.log('🔍 response.data.verification:', response.data.verification);
        console.log('🔍 response.data.verificationStatus:', response.data.verificationStatus);
        console.log('🔍 response.data.blueCheck:', response.data.blueCheck);
        console.log('🔍 response.data.checkmark:', response.data.checkmark);
        console.log('🔍 response.data.Verification:', response.data.Verification);
        
        // Check for any other potential verification fields
        console.log('🔍 Checking all response.data properties for verification:');
        Object.keys(response.data).forEach(key => {
          if (key.toLowerCase().includes('verif') || key.toLowerCase().includes('check') || key.toLowerCase().includes('badge')) {
            console.log(`🔍 Found potential verification field: ${key} =`, response.data[key]);
          }
        });
        
        return response.data;
      } catch (atProtocolError) {
        console.log('🔍 AT Protocol client failed, trying public API...', atProtocolError);
      }
      
      // Try using getProfiles endpoint instead
      try {
        console.log('🔍 Trying getProfiles endpoint...');
        const response = await this.agent.getProfiles({
          actors: [handle],
        });
        
        if (response.data.profiles && response.data.profiles.length > 0) {
          const profileData = response.data.profiles[0];
          console.log('✅ getProfiles - Profile data:', profileData);
          console.log('✅ getProfiles - Labels:', profileData.labels);
          console.log('✅ getProfiles - Labels length:', profileData.labels?.length || 0);
          console.log('✅ getProfiles - Full response keys:', Object.keys(profileData));
          
          // Check if there are any verification-related fields in the response
          console.log('🔍 Checking for verification fields in getProfiles response...');
          console.log('🔍 profileData.verified:', profileData.verified);
          console.log('🔍 profileData.isVerified:', profileData.isVerified);
          console.log('🔍 profileData.verification:', profileData.verification);
          console.log('🔍 profileData.verificationStatus:', profileData.verificationStatus);
          console.log('🔍 profileData.blueCheck:', profileData.blueCheck);
          console.log('🔍 profileData.checkmark:', profileData.checkmark);
          console.log('🔍 profileData.Verification:', profileData.Verification);
          
          // Check for any other potential verification fields
          console.log('🔍 Checking all profileData properties for verification:');
          Object.keys(profileData).forEach(key => {
            if (key.toLowerCase().includes('verif') || key.toLowerCase().includes('check') || key.toLowerCase().includes('badge')) {
              console.log(`🔍 Found potential verification field: ${key} =`, profileData[key]);
            }
          });
          
          return profileData;
        }
      } catch (getProfilesError) {
        console.log('🔍 getProfiles failed, trying public API...', getProfilesError);
      }
      
      // Try multiple approaches to get verification labels
      
      // Approach 1: Try without any labeler headers first (should return all labels by default)
      const url1 = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`;
      console.log('🔍 Trying approach 1 (default) - URL:', url1);
      let response = await fetch(url1);
      
      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Approach 1 - Profile data:', profileData);
        console.log('✅ Approach 1 - Labels:', profileData.labels);
        console.log('✅ Approach 1 - Labels length:', profileData.labels?.length || 0);
        console.log('✅ Approach 1 - Full response keys:', Object.keys(profileData));
        
        // Check if there are any verification-related fields in the response
        console.log('🔍 Checking for verification fields in response...');
        console.log('🔍 profileData.verified:', profileData.verified);
        console.log('🔍 profileData.isVerified:', profileData.isVerified);
        console.log('🔍 profileData.verification:', profileData.verification);
        console.log('🔍 profileData.verificationStatus:', profileData.verificationStatus);
        console.log('🔍 profileData.blueCheck:', profileData.blueCheck);
        console.log('🔍 profileData.checkmark:', profileData.checkmark);
        
        // Check for any other potential verification fields
        console.log('🔍 Checking all profileData properties for verification:');
        Object.keys(profileData).forEach(key => {
          if (key.toLowerCase().includes('verif') || key.toLowerCase().includes('check') || key.toLowerCase().includes('badge')) {
            console.log(`🔍 Found potential verification field: ${key} =`, profileData[key]);
          }
        });
        
        // Return the data even if no labels - the profile data is still valid
        return profileData;
      }
      
      // Approach 2: Try with atproto-accept-labelers header
      const labelers = [
        'did:plc:ar7c4by46qjdydhdev7ndg3c', // Bluesky official labeler
        'did:plc:q6gjnaw2blt4fxgdvzw6w6xx', // Another official labeler
        'did:plc:z72i7hdynmk6r22z27h6tvur'  // Additional labeler
      ];
      const url2 = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`;
      console.log('🔍 Trying approach 2 (with header) - URL:', url2);
      response = await fetch(url2, {
        headers: {
          'atproto-accept-labelers': labelers.join(',')
        }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Approach 2 - Profile data:', profileData);
        console.log('✅ Approach 2 - Labels:', profileData.labels);
        console.log('✅ Approach 2 - Labels length:', profileData.labels?.length || 0);
        return profileData;
      }
      
      // Approach 3: Try with subscribedLabelers parameter (fallback)
      const url3 = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}&subscribedLabelers[]=${labelers.join('&subscribedLabelers[]=')}`;
      console.log('🔍 Trying approach 3 (subscribedLabelers) - URL:', url3);
      response = await fetch(url3);
      
      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Approach 3 - Profile data:', profileData);
        console.log('✅ Approach 3 - Labels:', profileData.labels);
        console.log('✅ Approach 3 - Labels length:', profileData.labels?.length || 0);
        return profileData;
      }
      
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    } catch (error: any) {
      console.error('Failed to get public profile from Bluesky AppView:', error);
      throw error;
    }
  }

  // Direct AT Protocol record management using com.atproto.repo.createRecord
  async createRecord(collection: string, record: any) {
    if (!this.session) throw new Error('Not authenticated');

    const response = await this.agent.api.com.atproto.repo.createRecord({
      repo: this.did!,
      collection,
      record: {
        $type: collection,
        ...record,
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async putRecord(collection: string, rkey: string, record: any) {
    if (!this.session) throw new Error('Not authenticated');

    const response = await this.agent.api.com.atproto.repo.putRecord({
      repo: this.did!,
      collection,
      rkey,
      record: {
        $type: collection,
        ...record,
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async getRecord(collection: string, rkey: string) {
    if (!this.session) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did!,
        collection,
        rkey,
      });

      return response.data.value;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      console.error(`Failed to get record for collection ${collection} with rkey ${rkey}:`, error);
      throw error;
    }
  }

  async deleteRecord(collection: string, rkey: string) {
    if (!this.session) throw new Error('Not authenticated');

    await this.agent.api.com.atproto.repo.deleteRecord({
      repo: this.did!,
      collection,
      rkey,
    });
  }

  // Fallback localStorage methods (temporary until AT Protocol lexicons are implemented)
  // These methods are kept for backward compatibility or specific use cases where AT Protocol might not be preferred.
  private getStorageKey(type: string): string {
    return `basker_${this.did}_${type}`;
  }

  private async saveToLocalStorage(type: string, data: any) {
    if (!this.did) throw new Error('Not authenticated');

    try {
      localStorage.setItem(this.getStorageKey(type), JSON.stringify({
        data,
        lastSaved: new Date().toISOString(),
        did: this.did
      }));
      return { success: true };
    } catch (error) {
      console.error(`Failed to save ${type} to localStorage:`, error);
      throw error;
    }
  }

  private async getFromLocalStorage(type: string) {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const stored = localStorage.getItem(this.getStorageKey(type));
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      if (parsed.did !== this.did) return null; // Data belongs to different user

      return parsed.data;
    } catch (error) {
      console.error(`Failed to load ${type} from localStorage:`, error);
      return null;
    }
  }

  // AT Protocol data persistence using custom collection namespaces
  async getLinks(): Promise<LinksRecord | null> {
    if (!this.did) throw new Error('Not authenticated');
    
    console.log('Getting links for DID:', this.did);

    try {
      // Use our custom collection namespace - no schema validation needed!
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did,
        collection: 'app.basker.links',
        limit: 100,
      });
      
      const records = response.data.records || [];
      
      // Convert records to Link objects
      const links = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        title: record.value.title,
        url: record.value.url,
        description: record.value.description || '',
        icon: record.value.icon || '',
        group: record.value.group || '',
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
        isScheduled: record.value.isScheduled || false,
        scheduledStart: record.value.scheduledStart || '',
        scheduledEnd: record.value.scheduledEnd || '',
        // Customization options
        backgroundColor: record.value.backgroundColor || '',
        textColor: record.value.textColor || '',
        fontFamily: record.value.fontFamily ? record.value.fontFamily.split('|')[0] : 'system',
        fontWeight: record.value.fontFamily ? record.value.fontFamily.split('|')[1] || 'normal' : 'normal',
        containerShape: record.value.containerShape || 'rounded',
        autoTextColor: record.value.autoTextColor !== undefined ? record.value.autoTextColor : true,
        iconColor: record.value.iconColor || '',
        iconBorderWidth: record.value.iconBorderWidth || 0,
        iconBorderColor: record.value.iconBorderColor || '',
        borderColor: record.value.borderColor || '',
        borderWidth: record.value.borderWidth || 0,
        borderStyle: record.value.borderStyle || 'solid',
        pattern: record.value.pattern || 'none',
        patternColor: record.value.patternColor || '',
        pixelTransition: record.value.pixelTransition || false,
        pixelTransitionText: record.value.pixelTransitionText || '',
        pixelTransitionColor: record.value.pixelTransitionColor || '#000000',
        pixelTransitionGridSize: record.value.pixelTransitionGridSize || 7,
        pixelTransitionDuration: record.value.pixelTransitionDuration || 0.3,
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));
      
      // Sort by order
      links.sort((a, b) => a.order - b.order);
      
      console.log('Successfully fetched links from AT Protocol');
      console.log('Raw records from AT Protocol:', records);
      console.log('Converted links:', links);
      
      return { links };
    } catch (error: any) {
      console.error('AT Protocol failed for links:', error);
      return { links: [] };
    }
  }

  async saveLinks(links: Link[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      // Get existing links to compare
      const existingLinks = await this.getLinks();
      const existingRecords = existingLinks?.links || [];
      
      // Delete removed links
      for (const existingLink of existingRecords) {
        const stillExists = links.find(link => link.id === existingLink.id);
        if (!stillExists) {
          await this.agent.api.com.atproto.repo.deleteRecord({
            repo: this.did,
            collection: 'app.basker.links',
            rkey: existingLink.id,
          });
        }
      }
      
      // Create or update links
      for (const link of links) {
        console.log('🔍 Saving link with fontWeight:', link.fontWeight);
        const record = {
          title: link.title,
          url: link.url,
          description: link.description || '',
          icon: link.icon || '',
          group: link.group || '',
          order: link.order || 0,
          enabled: link.enabled !== undefined ? link.enabled : true,
          // Customization options
          backgroundColor: link.backgroundColor || '',
          textColor: link.textColor || '',
          fontFamily: `${link.fontFamily || 'system'}|${link.fontWeight || 'normal'}`,
          containerShape: link.containerShape || 'rounded',
        autoTextColor: link.autoTextColor !== undefined ? link.autoTextColor : true,
        iconColor: link.iconColor || '',
        iconBorderWidth: link.iconBorderWidth || 0,
        iconBorderColor: link.iconBorderColor || '',
        iconBorderShape: link.iconBorderShape || 'rounded',
        borderColor: link.borderColor || '',
        borderWidth: link.borderWidth || 0,
        borderStyle: link.borderStyle || 'solid',
      pattern: link.pattern || 'none',
      patternColor: link.patternColor || '',
      pixelTransition: link.pixelTransition || false,
      pixelTransitionText: link.pixelTransitionText || '',
      pixelTransitionColor: link.pixelTransitionColor || '#000000',
      pixelTransitionGridSize: link.pixelTransitionGridSize || 7,
      pixelTransitionDuration: link.pixelTransitionDuration || 0.3,
          createdAt: link.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        console.log('🔍 Record being saved:', record);
        console.log('🔍 Record fontWeight:', record.fontWeight);
        
        if (link.id && existingRecords.find(existing => existing.id === link.id)) {
          // Update existing record
          console.log('🔍 Updating existing record for link:', link.id);
          try {
            await this.agent.api.com.atproto.repo.putRecord({
              repo: this.did,
              collection: 'app.basker.links',
              rkey: link.id,
              record,
            });
            console.log('🔍 Successfully updated record');
          } catch (error) {
            console.error('🔍 Error updating record:', error);
            throw error;
          }
        } else {
          // Create new record
          console.log('🔍 Creating new record for link:', link.id);
          try {
            await this.agent.api.com.atproto.repo.createRecord({
              repo: this.did,
              collection: 'app.basker.links',
              record,
            });
            console.log('🔍 Successfully created record');
          } catch (error) {
            console.error('🔍 Error creating record:', error);
            throw error;
          }
        }
      }
      
      console.log('Successfully saved links to AT Protocol');
      console.log('Saved links:', links);
    } catch (error: any) {
      console.error('AT Protocol failed for saving links:', error);
      throw new Error(`Failed to save links to AT Protocol: ${error.message}`);
    }
  }

  async getNotes(): Promise<NotesRecord | null> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      // Use our custom collection namespace - no schema validation needed!
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did,
        collection: 'app.basker.notes',
        limit: 100,
      });
      
      console.log('Successfully fetched notes from AT Protocol');
      const records = response.data.records || [];
      
      // Convert records to Note objects
      const notes = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        content: record.value.content,
        isPublic: record.value.isPublic !== false,
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));
      
      return { notes };
    } catch (error: any) {
      console.error('AT Protocol failed for notes:', error);
      return { notes: [] };
    }
  }

  async saveNotes(notes: Note[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      // Get existing notes to compare
      const existingNotes = await this.getNotes();
      const existingRecords = existingNotes?.notes || [];
      
      // Delete removed notes
      for (const existingNote of existingRecords) {
        const stillExists = notes.find(note => note.id === existingNote.id);
        if (!stillExists) {
          await this.agent.api.com.atproto.repo.deleteRecord({
            repo: this.did,
            collection: 'app.basker.notes',
            rkey: existingNote.id,
          });
        }
      }
      
      // Create or update notes
      for (const note of notes) {
        const record = {
          content: note.content,
          createdAt: note.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        if (note.id && existingRecords.find(existing => existing.id === note.id)) {
          // Update existing record
          await this.agent.api.com.atproto.repo.putRecord({
            repo: this.did,
            collection: 'app.basker.notes',
            rkey: note.id,
            record,
          });
        } else {
          // Create new record
          await this.agent.api.com.atproto.repo.createRecord({
            repo: this.did,
            collection: 'app.basker.notes',
            record,
          });
        }
      }
      
      console.log('Successfully saved notes to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving notes:', error);
      throw new Error(`Failed to save notes to AT Protocol: ${error.message}`);
    }
  }

  async getStories(): Promise<StoriesRecord | null> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.stories',
        rkey: 'self',
      });
      
      console.log('Successfully fetched stories from AT Protocol');
      const record = response.data.value as any;
      const allStories = record.stories || [];
      
      // Filter out expired stories
      const now = new Date();
      const activeStories = allStories.filter((story: Story) => {
        const expiresAt = new Date(story.expiresAt);
        return expiresAt > now;
      });
      
      // If we have expired stories, save the filtered list back
      if (activeStories.length !== allStories.length) {
        console.log(`Filtered out ${allStories.length - activeStories.length} expired stories`);
        await this.saveStories(activeStories);
      }
      
      return { stories: activeStories };
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No stories record found in AT Protocol, returning empty array');
        return { stories: [] };
      }
      console.error('AT Protocol failed for stories:', error);
      throw new Error(`Failed to fetch stories from AT Protocol: ${error.message}`);
    }
  }

  async saveStories(stories: Story[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      stories,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.stories',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved stories to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving stories:', error);
      throw new Error(`Failed to save stories to AT Protocol: ${error.message}`);
    }
  }

  // Utility method to clean up expired stories
  async cleanupExpiredStories(): Promise<void> {
    if (!this.did) return;

    try {
      const storiesData = await this.getStories();
      if (storiesData && storiesData.stories.length > 0) {
        const now = new Date();
        const activeStories = storiesData.stories.filter(story => {
          const expiresAt = new Date(story.expiresAt);
          return expiresAt > now;
        });
        
        // If we found expired stories, save the filtered list
        if (activeStories.length !== storiesData.stories.length) {
          console.log(`Cleaning up ${storiesData.stories.length - activeStories.length} expired stories`);
          await this.saveStories(activeStories);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup expired stories:', error);
    }
  }

  // Heat Map Analytics
  async getHeatMapData(): Promise<any> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.heatmap',
        rkey: 'self',
      });
      return response.data.value;
    } catch (error: any) {
      console.log('No heat map data found, returning empty');
      return { heatMapData: [] };
    }
  }

  async saveHeatMapData(heatMapData: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      heatMapData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.heatmap',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved heat map data to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving heat map data:', error);
      throw new Error(`Failed to save heat map data to AT Protocol: ${error.message}`);
    }
  }

  // Poll Management
  async getPolls(): Promise<any> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.polls',
        rkey: 'self',
      });
      return response.data.value;
    } catch (error: any) {
      console.log('No polls found, returning empty');
      return { polls: [] };
    }
  }

  async savePolls(polls: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      polls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.polls',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved polls to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving polls:', error);
      throw new Error(`Failed to save polls to AT Protocol: ${error.message}`);
    }
  }

  // Chat Messages
  async getChatMessages(): Promise<any> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.chat',
        rkey: 'self',
      });
      return response.data.value;
    } catch (error: any) {
      console.log('No chat messages found, returning empty');
      return { messages: [] };
    }
  }

  async saveChatMessages(messages: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.chat',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved chat messages to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving chat messages:', error);
      throw new Error(`Failed to save chat messages to AT Protocol: ${error.message}`);
    }
  }

  // Blog Posts
  async getBlogPosts(): Promise<any> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.blog',
        rkey: 'self',
      });
      return response.data.value;
    } catch (error: any) {
      console.log('No blog posts found, returning empty');
      return { posts: [] };
    }
  }

  async saveBlogPosts(posts: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      posts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.blog',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved blog posts to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving blog posts:', error);
      throw new Error(`Failed to save blog posts to AT Protocol: ${error.message}`);
    }
  }

  async getSettings(): Promise<SettingsRecord | null> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.settings',
        rkey: 'self',
      });
      
      const record = response.data.value as any;
      console.log('✅ Fetched settings from AT Protocol:', {
        socialLinks: record.settings?.socialLinks?.length || 0,
        socialIconsConfig: record.settings?.socialIconsConfig,
        theme: record.settings?.theme?.name,
      });
      return { settings: record.settings || null };
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No settings record found in AT Protocol, returning null');
        return { settings: null };
      }
      console.error('AT Protocol failed for settings:', error);
      throw new Error(`Failed to fetch settings from AT Protocol: ${error.message}`);
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    // Ensure all fields are properly serialized
    const record = {
      settings: JSON.parse(JSON.stringify(settings)), // Deep clone to ensure serialization
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('💾 Saving settings to AT Protocol:', {
      socialLinks: record.settings.socialLinks?.length || 0,
      socialIconsConfig: record.settings.socialIconsConfig,
      theme: record.settings.theme?.name,
    });
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.settings',
        rkey: 'self',
        record,
      });
      console.log('✅ Successfully saved settings to AT Protocol');
    } catch (error: any) {
      console.error('❌ AT Protocol failed for saving settings:', error);
      console.error('Failed record:', record);
      throw new Error(`Failed to save settings to AT Protocol: ${error.message}`);
    }
  }

  async getWidgets(): Promise<WidgetsRecord | null> {
    if (!this.did) throw new Error('Not authenticated');

    console.log('Getting widgets for DID:', this.did);

    try {
      // Use our custom collection namespace - no schema validation needed!
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did,
        collection: 'app.basker.widgets',
        limit: 100,
      });

      const records = response.data.records || [];

      // Convert records to Widget objects
      const widgets = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        type: record.value.type,
        title: record.value.title,
        config: record.value.config || {},
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
        isScheduled: record.value.isScheduled || false,
        scheduledStart: record.value.scheduledStart || '',
        scheduledEnd: record.value.scheduledEnd || '',
        size: record.value.size || 'default',
        width: record.value.width || 'full',
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));

      // Sort by order
      widgets.sort((a, b) => a.order - b.order);

      console.log('Successfully fetched widgets from AT Protocol');
      console.log('Raw records from AT Protocol:', records);
      console.log('Converted widgets:', widgets);

      return { widgets };
    } catch (error: any) {
      console.error('AT Protocol failed for widgets:', error);
      return { widgets: [] };
    }
  }

  async saveWidgets(widgets: Widget[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      // Get existing widgets to compare
      const existingWidgets = await this.getWidgets();
      const existingRecords = existingWidgets?.widgets || [];

      // Delete removed widgets
      for (const existingWidget of existingRecords) {
        const stillExists = widgets.find(widget => widget.id === existingWidget.id);
        if (!stillExists) {
          await this.agent.api.com.atproto.repo.deleteRecord({
            repo: this.did,
            collection: 'app.basker.widgets',
            rkey: existingWidget.id,
          });
        }
      }

      // Create or update widgets
      for (const widget of widgets) {
        const record = {
          type: widget.type,
          title: widget.title,
          config: widget.config || {},
          order: widget.order || 0,
          enabled: widget.enabled !== false,
          size: widget.size || 'default',
          width: widget.width || 'full',
          createdAt: widget.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (widget.id && existingRecords.find(existing => existing.id === widget.id)) {
          // Update existing record
          await this.agent.api.com.atproto.repo.putRecord({
            repo: this.did,
            collection: 'app.basker.widgets',
            rkey: widget.id,
            record,
          });
        } else {
          // Create new record
          await this.agent.api.com.atproto.repo.createRecord({
            repo: this.did,
            collection: 'app.basker.widgets',
            record,
          });
        }
      }

      console.log('Successfully saved widgets to AT Protocol');
      console.log('Saved widgets:', widgets);
    } catch (error: any) {
      console.error('AT Protocol failed for saving widgets:', error);
      throw new Error(`Failed to save widgets to AT Protocol: ${error.message}`);
    }
  }

  getCurrentDid() {
    return this.did;
  }

  // Public methods for fetching other users' data (no authentication required)
  async getPublicLinks(targetDid: string): Promise<LinksRecord | null> {
    console.log('Getting public links for DID:', targetDid);

    try {
      // Create a new agent instance without authentication for public calls
      const publicAgent = new BskyAgent({ service: "https://bsky.social" });
      
      // Use our custom collection namespace - no schema validation needed!
      const response = await publicAgent.api.com.atproto.repo.listRecords({
        repo: targetDid,
        collection: 'app.basker.links',
        limit: 100,
      });

      const records = response.data.records || [];

      // Convert records to Link objects
      const links = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        title: record.value.title,
        url: record.value.url,
        description: record.value.description || '',
        icon: record.value.icon || '',
        group: record.value.group || '',
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
        isScheduled: record.value.isScheduled || false,
        scheduledStart: record.value.scheduledStart || '',
        scheduledEnd: record.value.scheduledEnd || '',
        // Customization options
        backgroundColor: record.value.backgroundColor || '',
        textColor: record.value.textColor || '',
        fontFamily: record.value.fontFamily ? record.value.fontFamily.split('|')[0] : 'system',
        fontWeight: record.value.fontFamily ? record.value.fontFamily.split('|')[1] || 'normal' : 'normal',
        containerShape: record.value.containerShape || 'rounded',
        autoTextColor: record.value.autoTextColor !== undefined ? record.value.autoTextColor : true,
        iconColor: record.value.iconColor || '',
        iconBorderWidth: record.value.iconBorderWidth || 0,
        iconBorderColor: record.value.iconBorderColor || '',
        borderColor: record.value.borderColor || '',
        borderWidth: record.value.borderWidth || 0,
        borderStyle: record.value.borderStyle || 'solid',
        pattern: record.value.pattern || 'none',
        patternColor: record.value.patternColor || '',
        pixelTransition: record.value.pixelTransition || false,
        pixelTransitionText: record.value.pixelTransitionText || '',
        pixelTransitionColor: record.value.pixelTransitionColor || '#000000',
        pixelTransitionGridSize: record.value.pixelTransitionGridSize || 7,
        pixelTransitionDuration: record.value.pixelTransitionDuration || 0.3,
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));

      // Sort by order
      links.sort((a, b) => a.order - b.order);

      console.log('Successfully fetched public links from AT Protocol');
      console.log('Raw records from AT Protocol:', records);
      console.log('Converted links:', links);

      return { links };
    } catch (error: any) {
      console.error('AT Protocol failed for public links:', error);
      return { links: [] };
    }
  }

  async getPublicNotes(targetDid: string): Promise<NotesRecord | null> {
    console.log('Getting public notes for DID:', targetDid);

    try {
      // Create a new agent instance without authentication for public calls
      const publicAgent = new BskyAgent({ service: "https://bsky.social" });
      
      // Use our custom collection namespace - no schema validation needed!
      const response = await publicAgent.api.com.atproto.repo.listRecords({
        repo: targetDid,
        collection: 'app.basker.notes',
        limit: 100,
      });

      const records = response.data.records || [];

      // Convert records to Note objects
      const notes = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        content: record.value.content,
        isPublic: record.value.isPublic !== false,
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));

      // Filter to only public notes
      const publicNotes = notes.filter(note => note.isPublic);

      console.log('Successfully fetched public notes from AT Protocol');
      console.log('Raw records from AT Protocol:', records);
      console.log('All notes:', notes);
      console.log('Public notes:', publicNotes);

      return { notes: publicNotes };
    } catch (error: any) {
      console.error('AT Protocol failed for public notes:', error);
      return { notes: [] };
    }
  }

  async getPublicStories(targetDid: string): Promise<StoriesRecord | null> {
    console.log('Getting public stories for DID:', targetDid);

    try {
      // Create a new agent instance without authentication for public calls
      const publicAgent = new BskyAgent({ service: "https://bsky.social" });
      
      // Use the same approach as getStories - single record with 'self' key
      const response = await publicAgent.api.com.atproto.repo.getRecord({
        repo: targetDid,
        collection: 'app.basker.stories',
        rkey: 'self',
      });

      console.log('Successfully fetched public stories from AT Protocol');
      const record = response.data.value as any;
      const allStories = record.stories || [];
      
      // Filter out expired stories
      const now = new Date();
      const activeStories = allStories.filter((story: Story) => {
        const expiresAt = new Date(story.expiresAt);
        return expiresAt > now;
      });
      
      console.log(`Filtered ${allStories.length - activeStories.length} expired stories from public view`);
      console.log('Raw record from AT Protocol:', record);
      console.log('Active stories array:', activeStories);

      return { stories: activeStories };
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No public stories record found in AT Protocol, returning empty array');
        return { stories: [] };
      }
      console.error('AT Protocol failed for public stories:', error);
      return { stories: [] };
    }
  }

  async getPublicWidgets(targetDid: string): Promise<WidgetsRecord | null> {
    console.log('Getting public widgets for DID:', targetDid);

    try {
      // Create a new agent instance without authentication for public calls
      const publicAgent = new BskyAgent({ service: "https://bsky.social" });
      
      // Use our custom collection namespace - no schema validation needed!
      const response = await publicAgent.api.com.atproto.repo.listRecords({
        repo: targetDid,
        collection: 'app.basker.widgets',
        limit: 100,
      });

      const records = response.data.records || [];

      // Convert records to Widget objects
      const widgets = records.map((record: any) => ({
        id: record.uri.split('/').pop() || '',
        type: record.value.type,
        title: record.value.title,
        config: record.value.config || {},
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
        isScheduled: record.value.isScheduled || false,
        scheduledStart: record.value.scheduledStart || '',
        scheduledEnd: record.value.scheduledEnd || '',
        size: record.value.size || 'default',
        width: record.value.width || 'full',
        createdAt: record.value.createdAt,
        updatedAt: record.value.updatedAt,
      }));

      // Sort by order
      widgets.sort((a, b) => a.order - b.order);

      console.log('Successfully fetched public widgets from AT Protocol');
      console.log('Raw records from AT Protocol:', records);
      console.log('Converted widgets:', widgets);

      return { widgets };
    } catch (error: any) {
      console.error('AT Protocol failed for public widgets:', error);
      return { widgets: [] };
    }
  }

  // Public method for getting other users' settings (no authentication required)
  async getPublicSettings(targetDid: string): Promise<SettingsRecord | null> {
    console.log('Getting public settings for DID:', targetDid);
    try {
      const publicAgent = new BskyAgent({ service: "https://bsky.social" });
      const response = await publicAgent.api.com.atproto.repo.getRecord({
        repo: targetDid,
        collection: 'app.basker.settings',
        rkey: 'self',
      });
      
      const record = response.data.value as any;
      console.log('✅ Fetched public settings from AT Protocol:', {
        socialLinks: record.settings?.socialLinks?.length || 0,
        socialIconsConfig: record.settings?.socialIconsConfig,
        theme: record.settings?.theme?.name,
        fullSettings: record.settings,
      });
      return { settings: record.settings || null };
    } catch (error: any) {
      if (error.status === 404) {
        console.log('No public settings record found in AT Protocol, returning default');
        return { settings: null };
      }
      console.error('AT Protocol failed for public settings:', error);
      return { settings: null };
    }
  }

  // Group management methods
  async saveGroups(groups: Group[]) {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const records: Record<string, any> = {};
      
      for (const group of groups) {
        const recordId = `group-${group.id}`;
        const record = {
          $type: 'app.bsky.actor.profile',
          displayName: `BASKER_GROUP_${group.name}`,
          description: JSON.stringify({
            type: 'group',
            id: group.id,
            name: group.name,
            isOpen: group.isOpen,
            order: group.order,
            titleTextColor: group.titleTextColor || '#ffffff',
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
          }),
        };

        records[recordId] = record;
      }

      // Save all groups as a single record
      const groupsRecord = {
        $type: 'app.bsky.actor.profile',
        displayName: 'BASKER_GROUPS',
        description: JSON.stringify(groups),
      };

      await this.agent.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.bsky.actor.profile',
        rkey: 'groups',
        record: groupsRecord,
      });

      console.log('Groups saved successfully');
      return groups;
    } catch (error) {
      console.error('Failed to save groups:', error);
      throw error;
    }
  }

  async getGroups(): Promise<Group[]> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      console.log('🔍 getGroups called for DID:', this.did);
      const response = await this.agent.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.bsky.actor.profile',
        rkey: 'groups',
      });

      console.log('🔍 getGroups response:', response);

      if (response.data?.value?.description) {
        const groups = JSON.parse(response.data.value.description as string);
        console.log('🔍 getGroups parsed groups:', groups);
        return Array.isArray(groups) ? groups : [];
      }

      console.log('🔍 getGroups no description found');
      return [];
    } catch (error) {
      console.log('🔍 getGroups error:', error);
      return [];
    }
  }

  async getPublicGroups(did: string): Promise<Group[]> {
    try {
      console.log('🔍 getPublicGroups called for DID:', did);
      const response = await this.agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'app.bsky.actor.profile',
        rkey: 'groups',
      });

      console.log('🔍 getPublicGroups response:', response);

      if (response.data?.value?.description) {
        const groups = JSON.parse(response.data.value.description as string);
        console.log('🔍 getPublicGroups parsed groups:', groups);
        return Array.isArray(groups) ? groups : [];
      }

      console.log('🔍 getPublicGroups no description found');
      return [];
    } catch (error) {
      console.log('🔍 getPublicGroups error:', error);
      return [];
    }
  }

  isAuthenticated() {
    // Authentication requires DID - we can fetch data even if agent session is not fully restored
    return !!this.did;
  }

  // Portfolio items
  async getPortfolioItems(): Promise<any[]> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did,
        collection: 'app.basker.portfolio',
        limit: 100,
      });

      return response.data.records.map(record => ({
        ...record.value,
        id: record.uri.split('/').pop() || '',
      }));
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  }

  async savePortfolioItems(items: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.portfolio',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved portfolio items to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving portfolio items:', error);
      throw new Error(`Failed to save portfolio items to AT Protocol: ${error.message}`);
    }
  }

  // Products
  async getProducts(): Promise<any[]> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did,
        collection: 'app.basker.products',
        limit: 100,
      });

      return response.data.records.map(record => ({
        ...record.value,
        id: record.uri.split('/').pop() || '',
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async saveProducts(products: any[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      products,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.products',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved products to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving products:', error);
      throw new Error(`Failed to save products to AT Protocol: ${error.message}`);
    }
  }

  // Work History Methods
  async getCompanies(): Promise<Company[]> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.companies',
        rkey: 'self',
      });
      
      console.log('Successfully fetched companies from AT Protocol');
      return response.data.value?.companies || [];
    } catch (error: any) {
      console.log('No companies found, returning empty array');
      return [];
    }
  }

  async saveCompanies(companies: Company[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      companies,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.companies',
        rkey: 'self',
        record,
      });

      console.log('Successfully saved companies to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving companies:', error);
      throw new Error(`Failed to save companies to AT Protocol: ${error.message}`);
    }
  }

  async getWorkHistory(): Promise<WorkHistory[]> {
    if (!this.did) throw new Error('Not authenticated');

    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did,
        collection: 'app.basker.workhistory',
        rkey: 'self',
      });
      
      console.log('Successfully fetched work history from AT Protocol');
      return response.data.value?.workHistory || [];
    } catch (error: any) {
      console.log('No work history found, returning empty array');
      return [];
    }
  }

  async saveWorkHistory(workHistory: WorkHistory[]): Promise<void> {
    if (!this.did) throw new Error('Not authenticated');

    const record = {
      workHistory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.workhistory',
        rkey: 'self',
        record,
      });

      console.log('Successfully saved work history to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving work history:', error);
      throw new Error(`Failed to save work history to AT Protocol: ${error.message}`);
    }
  }

  // Public work history for viewing other users' profiles
  async getPublicWorkHistory(targetDid: string): Promise<WorkHistory[]> {
    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: targetDid,
        collection: 'app.basker.workhistory',
        rkey: 'self',
      });
      
      console.log('Successfully fetched public work history from AT Protocol');
      return response.data.value?.workHistory || [];
    } catch (error: any) {
      console.log('No public work history found, returning empty array');
      return [];
    }
  }

  // Company search on Bluesky
  async searchCompanies(query: string): Promise<any[]> {
    try {
      const response = await this.agent.api.app.bsky.actor.searchActors({
        q: query,
        limit: 20,
      });
      
      console.log('Successfully searched companies on Bluesky');
      return response.data.actors || [];
    } catch (error: any) {
      console.error('Failed to search companies on Bluesky:', error);
      return [];
    }
  }




  async searchUsers(query: string, limit: number = 20) {
    try {
      const response = await this.agent.api.app.bsky.actor.searchActors({
        term: query,
        limit,
      });

      return response.data.actors.map(actor => ({
        did: actor.did,
        handle: actor.handle,
        displayName: actor.displayName || actor.handle,
        avatar: actor.avatar,
        description: actor.description || '',
        followersCount: actor.followersCount || 0,
        followsCount: actor.followsCount || 0,
        postsCount: actor.postsCount || 0,
        createdAt: actor.indexedAt,
        isModerated: false,
        moderationStatus: 'active' as const,
        moderationNotes: '',
        lastModerationAction: '',
        lastModerationBy: ''
      }));
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  async getAdminUsers() {
    try {
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did!,
        collection: 'app.basker.adminUsers',
        limit: 100,
      });

      return response.data.records.map(record => record.value as any);
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      return [];
    }
  }

  async addAdminUser(did: string, handle: string, permissions: string[]) {
    try {
      const adminUser = {
        did,
        handle,
        permissions,
        addedBy: this.did!,
        addedAt: new Date().toISOString(),
      };

      await this.agent.api.com.atproto.repo.createRecord({
        repo: this.did!,
        collection: 'app.basker.adminUsers',
        record: adminUser,
      });

      return adminUser;
    } catch (error) {
      console.error('Failed to add admin user:', error);
      throw error;
    }
  }

  async removeAdminUser(adminDid: string) {
    try {
      // First, find the record to get its URI
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did!,
        collection: 'app.basker.adminUsers',
        limit: 100,
      });

      const record = response.data.records.find(r => (r.value as any).did === adminDid);
      if (!record) {
        throw new Error('Admin user not found');
      }

      await this.agent.api.com.atproto.repo.deleteRecord({
        repo: this.did!,
        collection: 'app.basker.adminUsers',
        rkey: record.uri.split('/').pop()!,
      });

      return true;
    } catch (error) {
      console.error('Failed to remove admin user:', error);
      throw error;
    }
  }

  async getAdminInvites() {
    try {
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did!,
        collection: 'app.basker.adminInvites',
        limit: 100,
      });

      return response.data.records.map(record => record.value as any);
    } catch (error) {
      console.error('Failed to fetch admin invites:', error);
      return [];
    }
  }

  async createAdminInvite(invitedBy: string, permissions: string[]) {
    try {
      const invite = {
        id: crypto.randomUUID(),
        code: crypto.randomUUID().replace(/-/g, '').toUpperCase(),
        invitedBy,
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        permissions,
        status: 'pending',
      };

      await this.agent.api.com.atproto.repo.createRecord({
        repo: this.did!,
        collection: 'app.basker.adminInvites',
        record: invite,
      });

      return invite;
    } catch (error) {
      console.error('Failed to create admin invite:', error);
      throw error;
    }
  }

  async revokeAdminInvite(inviteId: string) {
    try {
      // First, find the record to get its URI
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did!,
        collection: 'app.basker.adminInvites',
        limit: 100,
      });

      const record = response.data.records.find(r => (r.value as any).id === inviteId);
      if (!record) {
        return false;
      }

      await this.agent.api.com.atproto.repo.deleteRecord({
        repo: this.did!,
        collection: 'app.basker.adminInvites',
        rkey: record.uri.split('/').pop()!,
      });

      return true;
    } catch (error) {
      console.error('Failed to revoke admin invite:', error);
      throw error;
    }
  }

  async followUser(targetDid: string) {
    try {
      const followRecord = {
        subject: targetDid,
        createdAt: new Date().toISOString(),
      };

      const response = await this.agent.api.app.bsky.graph.follow.create({
        repo: this.did!,
        collection: 'app.bsky.graph.follow',
        record: followRecord,
      });

      return response;
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  }

  async unfollowUser(followUri: string) {
    try {
      await this.agent.api.app.bsky.graph.follow.delete({
        repo: this.did!,
        rkey: followUri.split('/').pop()!,
      });

      return true;
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  }

  async getFollows(handle: string, limit: number = 100) {
    try {
      const response = await this.agent.api.app.bsky.graph.getFollows({
        actor: handle,
        limit,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get follows:', error);
      throw error;
    }
  }

  async getFollowers(handle: string, limit: number = 100) {
    try {
      const response = await this.agent.api.app.bsky.graph.getFollowers({
        actor: handle,
        limit,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get followers:', error);
      throw error;
    }
  }

  async getFollowStatus(targetDid: string) {
    try {
      // Get the current user's follows to check if they're following the target
      // Note: API limit is 100, so this only checks the first 100 follows
      const follows = await this.getFollows(this.session?.handle || '', 100);
      const isFollowing = follows.follows.some((follow: any) => follow.did === targetDid);
      
      return {
        isFollowing,
        followUri: isFollowing ? follows.follows.find((follow: any) => follow.did === targetDid)?.uri || null : null,
      };
    } catch (error) {
      console.error('Failed to get follow status:', error);
      return { isFollowing: false, followUri: null };
    }
  }

  // Starter Pack Methods using Basker's own data storage
  async createStarterPack(name: string, description: string, category: string = 'general') {
    try {
      const starterPackRecord = {
        name,
        description,
        category,
        creatorDid: this.did!,
        creatorHandle: this.session?.handle || '',
        createdAt: new Date().toISOString(),
        members: [],
      };

      const response = await this.agent.api.com.atproto.repo.createRecord({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        record: starterPackRecord,
      });

      return response;
    } catch (error) {
      console.error('Failed to create starter pack:', error);
      throw error;
    }
  }

  async addToStarterPack(starterPackUri: string, userDid: string, userHandle: string, userDisplayName?: string, userAvatar?: string) {
    try {
      // First get the current starter pack
      const currentPack = await this.getStarterPack(starterPackUri);
      if (!currentPack) {
        throw new Error('Starter pack not found');
      }

      // Add the new member
      const updatedMembers = [
        ...(currentPack.members || []),
        {
          did: userDid,
          handle: userHandle,
          displayName: userDisplayName,
          avatar: userAvatar,
          addedAt: new Date().toISOString(),
        }
      ];

      const updatedRecord = {
        ...currentPack,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };

      const response = await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        rkey: starterPackUri.split('/').pop() || '',
        record: updatedRecord,
      });

      return response;
    } catch (error) {
      console.error('Failed to add to starter pack:', error);
      throw error;
    }
  }

  async removeFromStarterPack(starterPackUri: string, userDid: string) {
    try {
      // First get the current starter pack
      const currentPack = await this.getStarterPack(starterPackUri);
      if (!currentPack) {
        throw new Error('Starter pack not found');
      }

      // Remove the member
      const updatedMembers = (currentPack.members || []).filter((member: any) => member.did !== userDid);

      const updatedRecord = {
        ...currentPack,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };

      const response = await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        rkey: starterPackUri.split('/').pop() || '',
        record: updatedRecord,
      });

      return response;
    } catch (error) {
      console.error('Failed to remove from starter pack:', error);
      throw error;
    }
  }

  async getStarterPacks(handle: string, limit: number = 100) {
    try {
      const response = await this.agent.api.com.atproto.repo.listRecords({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        limit,
      });

      return {
        starterPacks: response.data.records.map((record: any) => ({
          uri: record.uri,
          name: record.value.name,
          description: record.value.description,
          category: record.value.category,
          members: record.value.members || [],
          createdAt: record.value.createdAt,
          updatedAt: record.value.updatedAt,
          creator: {
            did: record.value.creatorDid,
            handle: record.value.creatorHandle,
          }
        }))
      };
    } catch (error) {
      console.error('Failed to get starter packs:', error);
      throw error;
    }
  }

  async getStarterPack(starterPackUri: string) {
    try {
      const response = await this.agent.api.com.atproto.repo.getRecord({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        rkey: starterPackUri.split('/').pop() || '',
      });

      return response.data.value;
    } catch (error) {
      console.error('Failed to get starter pack:', error);
      throw error;
    }
  }

  async deleteStarterPack(starterPackUri: string) {
    try {
      const response = await this.agent.api.com.atproto.repo.deleteRecord({
        repo: this.did!,
        collection: 'app.linkbio.starterpack',
        rkey: starterPackUri.split('/').pop() || '',
      });

      return response;
    } catch (error) {
      console.error('Failed to delete starter pack:', error);
      throw error;
    }
  }

  async getPublicStarterPacks(handle: string, limit: number = 100) {
    try {
      const publicAgent = new BskyAgent({
        service: 'https://public.api.bsky.app',
      });

      const response = await publicAgent.api.com.atproto.repo.listRecords({
        repo: handle,
        collection: 'app.linkbio.starterpack',
        limit,
      });

      return {
        starterPacks: response.data.records.map((record: any) => ({
          uri: record.uri,
          name: record.value.name,
          description: record.value.description,
          category: record.value.category,
          members: record.value.members || [],
          createdAt: record.value.createdAt,
          updatedAt: record.value.updatedAt,
          creator: {
            did: record.value.creatorDid,
            handle: record.value.creatorHandle,
          }
        }))
      };
    } catch (error) {
      console.error('Failed to get public starter packs:', error);
      throw error;
    }
  }

  async getPublicStarterPack(starterPackUri: string) {
    try {
      const publicAgent = new BskyAgent({
        service: 'https://public.api.bsky.app',
      });

      const response = await publicAgent.api.com.atproto.repo.getRecord({
        repo: starterPackUri.split('/')[4], // Extract handle from URI
        collection: 'app.linkbio.starterpack',
        rkey: starterPackUri.split('/').pop() || '',
      });

      return response.data.value;
    } catch (error) {
      console.error('Failed to get public starter pack:', error);
      throw error;
    }
  }
}

export const atprotocol = new ATProtocolClient();