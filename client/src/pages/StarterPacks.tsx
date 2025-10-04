import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Star, QrCode, Share2, ExternalLink, Heart, MessageCircle, Link as LinkIcon, Palette, Camera, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStarterPacks, useCreateStarterPack, useDeleteStarterPack } from '../hooks/use-atprotocol';
import { Header } from '../components/Header';

interface StarterPackMember {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  addedAt: string;
}

interface StarterPack {
  uri: string;
  name: string;
  description: string;
  category: string;
  members: StarterPackMember[];
  createdAt: string;
  updatedAt: string;
  creator: {
    did: string;
    handle: string;
  };
}

export default function StarterPacks() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPackName, setNewPackName] = useState('');
  const [newPackDescription, setNewPackDescription] = useState('');
  const [newPackCategory, setNewPackCategory] = useState('general');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchHandle, setUserSearchHandle] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const createStarterPackMutation = useCreateStarterPack();
  const deleteStarterPackMutation = useDeleteStarterPack();
  
  // Fetch starter packs from well-known Basker users
  const baskerOfficialPacks = useStarterPacks('basker.bio');
  const samPacks = useStarterPacks('samthibault.bsky.social');
  
  // Combine all starter packs from different sources
  const allPacks = [
    ...(baskerOfficialPacks.data?.starterPacks || []),
    ...(samPacks.data?.starterPacks || [])
  ];
  
  // Filter user's own packs
  const userPacks = allPacks.filter(pack => 
    user && pack.creator.did === user.did
  );
  
  const loading = baskerOfficialPacks.isLoading || samPacks.isLoading;

  const categories = [
    { id: 'all', label: 'All Packs', icon: '🌟' },
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'tech', label: 'Tech', icon: '💻' },
    { id: 'business', label: 'Business', icon: '🚀' }
  ];

  const filteredPacks = selectedCategory === 'all' 
    ? allPacks 
    : allPacks.filter(pack => pack.category === selectedCategory);

  const handleSearchUsers = async () => {
    if (!userSearchHandle.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(userSearchHandle.trim())}&limit=10`);
      const data = await response.json();
      setSearchResults(data.actors || []);
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (user: any) => {
    if (!selectedUsers.includes(user.did)) {
      setSelectedUsers([...selectedUsers, user.did]);
    }
    setUserSearchHandle('');
    setSearchResults([]);
  };

  const handleRemoveUser = (did: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== did));
  };

  const handleCreateStarterPack = async () => {
    if (!newPackName.trim() || !newPackDescription.trim()) return;
    
    // Check if user has reached the 6-pack limit
    if (userPacks.length >= 6) {
      alert('You have reached the maximum limit of 6 starter packs. Please delete an existing pack before creating a new one.');
      return;
    }
    
    try {
      const result = await createStarterPackMutation.mutateAsync({
        name: newPackName,
        description: newPackDescription,
        category: newPackCategory
      });
      
      // Reset form
      setNewPackName('');
      setNewPackDescription('');
      setNewPackCategory('general');
      setSelectedUsers([]);
      setUserSearchHandle('');
      setSearchResults([]);
      setShowCreateForm(false);
      
      // The mutation will automatically refresh the data via React Query
      // so we don't need to manually update the state
    } catch (error) {
      console.error('Failed to create starter pack:', error);
    }
  };

  const handleSharePack = (pack: StarterPack) => {
    const url = `${window.location.origin}/starter-packs/${encodeURIComponent(pack.uri)}`;
    if (navigator.share) {
      navigator.share({
        title: `Basker Starter Pack: ${pack.name}`,
        text: pack.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const handleDeletePack = async (packUri: string) => {
    // Security check: Find the pack and verify ownership
    const packToDelete = userPacks.find(pack => pack.uri === packUri);
    
    if (!packToDelete) {
      alert('Pack not found or you are not authorized to delete it.');
      return;
    }

    if (!user || user.did !== packToDelete.creator.did) {
      alert('You are not authorized to delete this starter pack. Only the pack creator can delete it.');
      return;
    }

    if (confirm('Are you sure you want to delete this starter pack? This action cannot be undone.')) {
      try {
        await deleteStarterPackMutation.mutateAsync(packUri);
        
        // The mutation will automatically refresh the data via React Query
        console.log('Pack deleted successfully');
      } catch (error) {
        console.error('Failed to delete pack:', error);
        alert('Failed to delete starter pack. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Basker Starter Packs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing Basker users organized by interests and communities. 
            Follow curated collections of creators, innovators, and builders.
          </p>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Create New List Button */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-yellow-500" />
                  Your Starter Packs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userPacks.length}/6 packs created
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                disabled={userPacks.length >= 6 && !showCreateForm}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                {userPacks.length >= 6 ? 'Limit Reached' : 'Create Pack'}
              </Button>
            </div>
            {userPacks.length >= 6 && !showCreateForm && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You've reached the maximum of 6 starter packs. Delete an existing pack to create a new one.
                </p>
              </div>
            )}
            
            {showCreateForm && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pack Name
                      </label>
                      <input
                        type="text"
                        value={newPackName}
                        onChange={(e) => setNewPackName(e.target.value)}
                        placeholder="e.g., Creative Professionals"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newPackDescription}
                        onChange={(e) => setNewPackDescription(e.target.value)}
                        placeholder="Describe your starter pack..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newPackCategory}
                        onChange={(e) => setNewPackCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value="general">General</option>
                        <option value="creative">Creative</option>
                        <option value="tech">Tech</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add Users (Optional)
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userSearchHandle}
                            onChange={(e) => setUserSearchHandle(e.target.value)}
                            placeholder="Search for users by handle..."
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                          <Button
                            type="button"
                            onClick={handleSearchUsers}
                            disabled={!userSearchHandle.trim() || isSearching}
                            size="sm"
                          >
                            {isSearching ? 'Searching...' : 'Search'}
                          </Button>
                        </div>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                            {searchResults.map((result) => (
                              <div
                                key={result.did}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleAddUser(result)}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={result.avatar} />
                                  <AvatarFallback>
                                    {result.displayName?.charAt(0) || result.handle.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {result.displayName || result.handle}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    @{result.handle}
                                  </div>
                                </div>
                                <Plus className="w-4 h-4 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Selected Users */}
                        {selectedUsers.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Selected Users ({selectedUsers.length})
                            </div>
                            <div className="space-y-1">
                              {selectedUsers.map((did) => {
                                // For now, we'll show the DID. In a real app, we'd store user info
                                return (
                                  <div key={did} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm">{did}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveUser(did)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                    <Button
                      onClick={handleCreateStarterPack}
                      disabled={!newPackName.trim() || !newPackDescription.trim() || createStarterPackMutation.isPending}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      {createStarterPackMutation.isPending ? 'Creating...' : 'Create Pack'}
                    </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* User's Starter Packs Grid */}
        {user && userPacks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Packs ({userPacks.length}/6)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPacks.map((pack) => (
                <Card key={pack.uri} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <div className="text-lg">{pack.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {pack.members?.length || 0} creators
                        </Badge>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {pack.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={pack.creator.avatar} />
                        <AvatarFallback>
                          {pack.creator.displayName?.charAt(0) || pack.creator.handle.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        by @{pack.creator.handle}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Sample Users */}
                    <div className="space-y-3 mb-4">
                      {pack.members?.slice(0, 3).map((member) => (
                        <div key={member.did} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {(member.displayName || member.handle).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {member.displayName || member.handle}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              @{member.handle}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(pack.members?.length || 0) > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{(pack.members?.length || 0) - 3} more creators
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/starter-packs/${encodeURIComponent(pack.uri)}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Users className="w-4 h-4 mr-2" />
                          View Pack
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSharePack(pack)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePack(pack.uri)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Starter Packs Grid */}
        {filteredPacks.filter(pack => !user || pack.creator.did !== user.did).length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Community Packs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacks.filter(pack => !user || pack.creator.did !== user.did).map((pack) => (
                <Card key={pack.uri} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <div className="text-lg">{pack.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {pack.members?.length || 0} creators
                        </Badge>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {pack.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={pack.creator.avatar} />
                        <AvatarFallback>
                          {pack.creator.displayName?.charAt(0) || pack.creator.handle.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        by @{pack.creator.handle}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Sample Users */}
                    <div className="space-y-3 mb-4">
                      {pack.members?.slice(0, 3).map((member) => (
                        <div key={member.did} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {(member.displayName || member.handle).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {member.displayName || member.handle}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              @{member.handle}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(pack.members?.length || 0) > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{(pack.members?.length || 0) - 3} more creators
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/starter-packs/${encodeURIComponent(pack.uri)}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Users className="w-4 h-4 mr-2" />
                          View Pack
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSharePack(pack)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-0">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Want to be featured in a starter pack?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're always looking for amazing Basker users to highlight. 
                Create great content and engage with the community!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/login">
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    See Examples
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
