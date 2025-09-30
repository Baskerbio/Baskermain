import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atprotocol } from '../lib/atprotocol';
import { Link, Note, Story, Group, Settings, Widget, Company, WorkHistory, VerificationRequest } from '@shared/schema';

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
        const stories = Array.isArray(data?.stories) ? data.stories : [];
        console.log('useStories got data:', data);

        // Filter out expired stories
        const now = new Date().toISOString();
        const activeStories = stories.filter((story: Story) => story.expiresAt > now);
        console.log('useStories active stories:', activeStories);
        return activeStories;
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

export function useSettings(enabled: boolean = true) {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  
  return useQuery({
    queryKey: ['settings', did],
    queryFn: async () => {
      try {
        const data = await atprotocol.getSettings();
        return data?.settings || null;
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
      }
    },
    enabled: enabled && isAuthenticated && !!did,
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

export function useSaveWidgets() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (widgets: Widget[]) => {
      console.log('useSaveWidgets mutationFn called with:', widgets);
      return await atprotocol.saveWidgets(widgets);
    },
    onSuccess: (data, variables) => {
      console.log('useSaveWidgets onSuccess called, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['widgets', did] });
      // Also try to set the data directly in the cache
      queryClient.setQueryData(['widgets', did], variables);
    },
    onError: (error) => {
      console.error('useSaveWidgets onError:', error);
    },
  });
}

export function useSaveStories() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (stories: Story[]) => {
      console.log('useSaveStories mutationFn called with:', stories);
      return await atprotocol.saveStories(stories);
    },
    onSuccess: (data, variables) => {
      console.log('useSaveStories onSuccess called, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['stories', did] });
      // Also try to set the data directly in the cache
      queryClient.setQueryData(['stories', did], variables);
    },
    onError: (error) => {
      console.error('useSaveStories onError:', error);
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

// Mutations
export function useSaveLinks() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (links: Link[]) => {
      console.log('🔍 useSaveLinks mutationFn called with:', links.map(l => ({ id: l.id, title: l.title, group: l.group })));
      return atprotocol.saveLinks(links);
    },
    onSuccess: (data, variables) => {
      console.log('🔍 useSaveLinks onSuccess called, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['links', did] });
      // Also try to set the data directly in the cache
      queryClient.setQueryData(['links', did], variables);
    },
    onError: (error) => {
      console.error('🔍 useSaveLinks onError:', error);
    },
  });
}

export function useSaveNotes() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (notes: Note[]) => {
      console.log('useSaveNotes mutationFn called with:', notes);
      return atprotocol.saveNotes(notes);
    },
    onSuccess: (data, variables) => {
      console.log('useSaveNotes onSuccess called, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['notes', did] });
      // Also try to set the data directly in the cache
      queryClient.setQueryData(['notes', did], variables);
    },
    onError: (error) => {
      console.error('useSaveNotes onError:', error);
    },
  });
}

export function useGroups() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  console.log('🔍 useGroups enabled:', isAuthenticated, 'DID:', did);
  
  return useQuery({
    queryKey: ['groups', did],
    queryFn: async () => {
      console.log('🔍 useGroups queryFn called');
      try {
        const groups = await atprotocol.getGroups();
        console.log('🔍 useGroups got data:', groups);
        return groups;
      } catch (error) {
        console.error('🔍 Failed to fetch groups:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveGroups() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (groups: Group[]) => {
      console.log('useSaveGroups mutationFn called with:', groups);
      return atprotocol.saveGroups(groups);
    },
    onSuccess: (data, variables) => {
      console.log('useSaveGroups onSuccess called, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['groups', did] });
      queryClient.setQueryData(['groups', did], variables);
    },
    onError: (error) => {
      console.error('useSaveGroups onError:', error);
    },
  });
}

export function usePublicSettings(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicSettings', targetDid],
    queryFn: async () => {
      if (!targetDid) return null;
      console.log('usePublicSettings queryFn called for DID:', targetDid);
      try {
        const data = await atprotocol.getPublicSettings(targetDid);
        console.log('usePublicSettings got data:', data);
        return data?.settings || null;
      } catch (error) {
        console.error('Failed to fetch public settings:', error);
        return null;
      }
    },
    enabled: !!targetDid,
    initialData: null,
    staleTime: 0, // Force refetch when invalidated
  });
}

// Work History Hooks
export function useCompanies() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  
  return useQuery({
    queryKey: ['companies', did],
    queryFn: async () => {
      try {
        const data = await atprotocol.getCompanies();
        return data || [];
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0,
  });
}

export function useWorkHistory() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  
  return useQuery({
    queryKey: ['workHistory', did],
    queryFn: async () => {
      try {
        const data = await atprotocol.getWorkHistory();
        return data || [];
      } catch (error) {
        console.error('Failed to fetch work history:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0,
  });
}

export function usePublicWorkHistory(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicWorkHistory', targetDid],
    queryFn: async () => {
      if (!targetDid) return [];
      try {
        const data = await atprotocol.getPublicWorkHistory(targetDid);
        return data || [];
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

export function usePublicWidgets(targetDid: string | null) {
  return useQuery({
    queryKey: ['publicWidgets', targetDid],
    queryFn: async () => {
      if (!targetDid) return [];
      try {
        const data = await atprotocol.getPublicWidgets(targetDid);
        return data || [];
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
    enabled: query.trim().length > 2,
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

export function useSubmitVerificationRequest() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async (request: VerificationRequest) => {
      return await atprotocol.submitVerificationRequest(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workHistory', did] });
    },
  });
}

export function useVerificationRequests() {
  const isAuthenticated = atprotocol.isAuthenticated();
  const did = atprotocol.getCurrentDid();
  
  return useQuery({
    queryKey: ['verificationRequests', did],
    queryFn: async () => {
      try {
        const data = await atprotocol.getVerificationRequests();
        return data || [];
      } catch (error) {
        console.error('Failed to fetch verification requests:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!did,
    initialData: [],
    staleTime: 0,
  });
}

export function useUpdateVerificationRequest() {
  const queryClient = useQueryClient();
  const did = atprotocol.getCurrentDid();

  return useMutation({
    mutationFn: async ({ requestId, status, adminNotes }: { requestId: string; status: 'approved' | 'rejected'; adminNotes?: string }) => {
      return await atprotocol.updateVerificationRequest(requestId, status, adminNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationRequests', did] });
    },
  });
}