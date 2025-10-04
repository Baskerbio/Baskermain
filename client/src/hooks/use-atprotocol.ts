import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atprotocol } from '../lib/atprotocol';
import { Link, Note, Story, Group, Settings, Widget, Company, WorkHistory } from '@shared/schema';

export function useLinks() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useLinks enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['links', did],
    queryFn: async () => {
      console.log('useLinks queryFn called');
      try {
        const data = await atprotocol.getLinks();
        console.log('useLinks got data:', data);
        return Array.isArray(data?.links) ? data.links : [];
      } catch (error) {
        console.error('Failed to fetch links:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useNotes() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useNotes enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['notes', did],
    queryFn: async () => {
      console.log('useNotes queryFn called');
      try {
        const data = await atprotocol.getNotes();
        console.log('useNotes got data:', data);
        return Array.isArray(data?.notes) ? data.notes : [];
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useStories() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useStories enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['stories', did],
    queryFn: async () => {
      console.log('useStories queryFn called');
      try {
        const data = await atprotocol.getStories();
        console.log('useStories got data:', data);
        return Array.isArray(data?.stories) ? data.stories : [];
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useGroups() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useGroups enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['groups', did],
    queryFn: async () => {
      console.log('useGroups queryFn called');
      try {
        const data = await atprotocol.getGroups();
        console.log('useGroups got data:', data);
        return Array.isArray(data?.groups) ? data.groups : [];
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useSettings(enabled: boolean = true) {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useSettings enabled:', isAuthenticated && enabled, 'DID:', did);
  
  return useQuery({
    queryKey: ['settings', did],
    queryFn: async () => {
      console.log('useSettings queryFn called');
      try {
        const data = await atprotocol.getSettings();
        console.log('useSettings got data:', data);
        return data?.settings || null;
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
      }
    },
    enabled: isAuthenticated && enabled && !!did,
    initialData: null,
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useWidgets() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useWidgets enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['widgets', did],
    queryFn: async () => {
      console.log('useWidgets queryFn called');
      try {
        const data = await atprotocol.getWidgets();
        console.log('useWidgets got data:', data);
        return Array.isArray(data?.widgets) ? data.widgets : [];
      } catch (error) {
        console.error('Failed to fetch widgets:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function usePublicWidgets(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicWidgets', targetDid],
    queryFn: async () => {
      if (!targetDid) return [];
      try {
        const data = await atprotocol.getPublicWidgets(targetDid);
        return data?.widgets || [];
      } catch (error) {
        console.error('Failed to fetch public widgets:', error);
        return [];
      }
    },
    enabled: !!targetDid,
    initialData: [],
    staleTime: 0,
  });
}

export function usePublicSettings(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicSettings', targetDid],
    queryFn: async () => {
      if (!targetDid) return null;
      try {
        const data = await atprotocol.getPublicSettings(targetDid);
        return data?.settings || null;
      } catch (error) {
        console.error('Failed to fetch public settings:', error);
        return null;
      }
    },
    enabled: !!targetDid,
    initialData: null,
    staleTime: 0,
  });
}

export function useSaveLinks() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (links: Link[]) => {
      return await atprotocol.saveLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', did] });
    },
  });
}

export function useSaveNotes() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (notes: Note[]) => {
      return await atprotocol.saveNotes(notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', did] });
    },
  });
}

export function useSaveStories() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (stories: Story[]) => {
      return await atprotocol.saveStories(stories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories', did] });
    },
  });
}

export function useSaveGroups() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (groups: Group[]) => {
      return await atprotocol.saveGroups(groups);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', did] });
    },
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      return await atprotocol.saveSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', did] });
    },
  });
}

export function useSaveWidgets() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (widgets: Widget[]) => {
      return await atprotocol.saveWidgets(widgets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgets', did] });
    },
  });
}

export function useCompanies() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useCompanies enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['companies', did],
    queryFn: async () => {
      console.log('useCompanies queryFn called');
      try {
        const data = await atprotocol.getCompanies();
        console.log('useCompanies got data:', data);
        console.log('useCompanies data type:', typeof data);
        console.log('useCompanies data keys:', data ? Object.keys(data) : 'no data');
        
        // Handle both array and object with numeric keys (same as work history)
        let result = [];
        if (Array.isArray(data)) {
          result = data;
        } else if (data && typeof data === 'object') {
          // Convert object with numeric keys to array
          result = Object.values(data);
        } else if (data?.companies && Array.isArray(data.companies)) {
          result = data.companies;
        }
        
        console.log('useCompanies returning:', result);
        return result;
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function useWorkHistory() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('useWorkHistory enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['workHistory', did],
    queryFn: async () => {
      console.log('useWorkHistory queryFn called');
      try {
        const data = await atprotocol.getWorkHistory();
        console.log('useWorkHistory got data:', data);
        console.log('useWorkHistory data type:', typeof data);
        console.log('useWorkHistory data length:', data?.length);
        console.log('useWorkHistory data keys:', data ? Object.keys(data) : 'no data');
        
        // Handle both array and object with numeric keys
        let result = [];
        if (Array.isArray(data)) {
          result = data;
        } else if (data && typeof data === 'object') {
          // Convert object with numeric keys to array
          result = Object.values(data);
        }
        
        console.log('useWorkHistory returning:', result);
        return result;
      } catch (error) {
        console.error('Failed to fetch work history:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0, // Force refetch when invalidated
  });
}

export function usePublicWorkHistory(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicWorkHistory', targetDid],
    queryFn: async () => {
      if (!targetDid) return [];
      try {
        const data = await atprotocol.getPublicWorkHistory(targetDid);
        console.log('usePublicWorkHistory got data:', data);
        
        // Handle both array and object with numeric keys (same as useWorkHistory)
        let result = [];
        if (Array.isArray(data)) {
          result = data;
        } else if (data && typeof data === 'object') {
          // Convert object with numeric keys to array
          result = Object.values(data);
        }
        
        console.log('usePublicWorkHistory returning:', result);
        return result;
      } catch (error) {
        console.error('Failed to fetch public work history:', error);
        return [];
      }
    },
    enabled: !!targetDid,
    initialData: [],
    staleTime: 0,
  });
}

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: ['companySearch', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      try {
        const data = await atprotocol.searchCompanies(query);
        return data || [];
      } catch (error) {
        console.error('Failed to search companies:', error);
        return [];
      }
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveCompanies() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (companies: Company[]) => {
      return await atprotocol.saveCompanies(companies);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', did] });
    },
  });
}

export function useSaveWorkHistory() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (workHistory: WorkHistory[]) => {
      return await atprotocol.saveWorkHistory(workHistory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workHistory', did] });
    },
  });
}


export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['userSearch', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      try {
        const data = await atprotocol.searchUsers(query);
        return data || [];
      } catch (error) {
        console.error('Failed to search users:', error);
        return [];
      }
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useQuery({
    queryKey: ['adminUsers', did],
    queryFn: async () => {
      try {
        const data = await atprotocol.getAdminUsers();
        return data || [];
      } catch (error) {
        console.error('Failed to fetch admin users:', error);
        return [];
      }
    },
    enabled: !!did,
    initialData: [],
  });
}

export function useAddAdminUser() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async ({ did, handle, permissions }: { did: string; handle: string; permissions: string[] }) => {
      console.log('🔍 useAddAdminUser - adding admin via AT Protocol:', { did, handle, permissions });
      await atprotocol.addAdminUser(did, handle, permissions);
      console.log('🔍 useAddAdminUser - add successful');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers', did] });
    },
  });
}

export function useRemoveAdminUser() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (adminDid: string) => {
      return await atprotocol.removeAdminUser(adminDid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers', did] });
    },
  });
}

// Starter Pack Hooks
export function useStarterPacks(handle: string) {
  const isAuthenticated = atprotocol.isAuthenticated();
  
  return useQuery({
    queryKey: ['starterPacks', handle],
    queryFn: async () => {
      if (isAuthenticated) {
        return await atprotocol.getStarterPacks(handle);
      } else {
        return await atprotocol.getPublicStarterPacks(handle);
      }
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStarterPack(starterPackUri: string) {
  const isAuthenticated = atprotocol.isAuthenticated();
  
  return useQuery({
    queryKey: ['starterPack', starterPackUri],
    queryFn: async () => {
      if (isAuthenticated) {
        return await atprotocol.getStarterPack(starterPackUri);
      } else {
        return await atprotocol.getPublicStarterPack(starterPackUri);
      }
    },
    enabled: !!starterPackUri,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateStarterPack() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async ({ name, description, category }: { name: string; description: string; category?: string }) => {
      return await atprotocol.createStarterPack(name, description, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starterPacks'] });
    },
  });
}

export function useAddToStarterPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      starterPackUri, 
      userDid, 
      userHandle, 
      userDisplayName, 
      userAvatar 
    }: { 
      starterPackUri: string; 
      userDid: string; 
      userHandle: string; 
      userDisplayName?: string; 
      userAvatar?: string; 
    }) => {
      return await atprotocol.addToStarterPack(starterPackUri, userDid, userHandle, userDisplayName, userAvatar);
    },
    onSuccess: (_, { starterPackUri }) => {
      queryClient.invalidateQueries({ queryKey: ['starterPack', starterPackUri] });
      queryClient.invalidateQueries({ queryKey: ['starterPacks'] });
    },
  });
}

export function useRemoveFromStarterPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ starterPackUri, userDid }: { starterPackUri: string; userDid: string }) => {
      return await atprotocol.removeFromStarterPack(starterPackUri, userDid);
    },
    onSuccess: (_, { starterPackUri }) => {
      queryClient.invalidateQueries({ queryKey: ['starterPack', starterPackUri] });
      queryClient.invalidateQueries({ queryKey: ['starterPacks'] });
    },
  });
}

export function useDeleteStarterPack() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (starterPackUri: string) => {
      return await atprotocol.deleteStarterPack(starterPackUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['starterPacks', did] });
    },
  });
}
