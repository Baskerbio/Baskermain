import { BskyAgent, RichText } from '@atproto/api';
import { Link, Note, Story, Group, Settings, Widget, LinksRecord, NotesRecord, StoriesRecord, SettingsRecord, WidgetsRecord } from '@shared/schema';
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

    const response = await this.agent.getProfile({
      actor: actor || this.did!,
    });

    return response.data;
  }

  // Public method for getting profiles without authentication
  async getPublicProfile(handle: string) {
    try {
      // Use Bluesky's public AppView API (no authentication required)
      // This is how the Bluesky web interface works for public profiles
      const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`);
      
      if (response.ok) {
        const profileData = await response.json();
        console.log('Successfully got public profile data from Bluesky AppView:', profileData);
        return profileData;
      } else {
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
      }
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
        icon: record.value.icon || '',
        group: record.value.group || '',
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
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
        const record = {
          title: link.title,
          url: link.url,
          icon: link.icon || '',
          group: link.group || '',
          order: link.order || 0,
          createdAt: link.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        if (link.id && existingRecords.find(existing => existing.id === link.id)) {
          // Update existing record
          await this.agent.api.com.atproto.repo.putRecord({
            repo: this.did,
            collection: 'app.basker.links',
            rkey: link.id,
            record,
          });
        } else {
          // Create new record
          await this.agent.api.com.atproto.repo.createRecord({
            repo: this.did,
            collection: 'app.basker.links',
            record,
          });
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
      return { stories: record.stories || [] };
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
      
      console.log('Successfully fetched settings from AT Protocol');
      const record = response.data.value as any;
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

    const record = {
      settings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await this.agent.api.com.atproto.repo.putRecord({
        repo: this.did,
        collection: 'app.basker.settings',
        rkey: 'self',
        record,
      });
      console.log('Successfully saved settings to AT Protocol');
    } catch (error: any) {
      console.error('AT Protocol failed for saving settings:', error);
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
        icon: record.value.icon || '',
        group: record.value.group || '',
        order: record.value.order || 0,
        enabled: record.value.enabled !== false,
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
      const stories = record.stories || [];
      console.log('Raw record from AT Protocol:', record);
      console.log('Stories array:', stories);

      return { stories };
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
      
      console.log('Successfully fetched public settings from AT Protocol');
      const record = response.data.value as any;
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
}

export const atprotocol = new ATProtocolClient();