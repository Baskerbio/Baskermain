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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <Header />
      
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Modern gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Modern Starter Packs Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Starter Packs</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Create Your</span>{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Starter Packs
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover amazing Basker users organized by interests and communities. 
              Follow curated collections of creators, innovators, and builders.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Modern Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105' 
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:scale-105'
              }`}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-500" />
                  Your Starter Packs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userPacks.length}/6 packs created
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                disabled={userPacks.length >= 6 && !showCreateForm}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {userPacks.length >= 6 ? 'Limit Reached' : 'Create Pack'}
              </Button>
            </div>
            {userPacks.length >= 6 && !showCreateForm && (
              <div className="mb-4 p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You've reached the maximum of 6 starter packs. Delete an existing pack to create a new one.
                </p>
              </div>
            )}
            
            {showCreateForm && (
              <Card className="mb-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Pack Name
                      </label>
                      <input
                        type="text"
                        value={newPackName}
                        onChange={(e) => setNewPackName(e.target.value)}
                        placeholder="e.g., Creative Professionals"
                        className="w-full px-4 py-3 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/60 dark:text-white transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Description
                      </label>
                      <textarea
                        value={newPackDescription}
                        onChange={(e) => setNewPackDescription(e.target.value)}
                        placeholder="Describe your starter pack..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/60 dark:text-white transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Category
                      </label>
                      <select
                        value={newPackCategory}
                        onChange={(e) => setNewPackCategory(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/60 dark:text-white transition-all duration-300"
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
                    <div className="flex gap-3">
                    <Button
                      onClick={handleCreateStarterPack}
                      disabled={!newPackName.trim() || !newPackDescription.trim() || createStarterPackMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {createStarterPackMutation.isPending ? 'Creating...' : 'Create Pack'}
                    </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
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
                <Card key={pack.uri} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <span className="text-xl">📋</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{pack.name}</div>
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
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
                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105">
                          <Users className="w-4 h-4 mr-2" />
                          View Pack
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSharePack(pack)}
                        className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePack(pack.uri)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 transition-all duration-300 hover:scale-105"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Community Packs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacks.filter(pack => !user || pack.creator.did !== user.did).map((pack) => (
                <Card key={pack.uri} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <span className="text-xl">📋</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{pack.name}</div>
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
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
                        <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105">
                          <Users className="w-4 h-4 mr-2" />
                          View Pack
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSharePack(pack)}
                        className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
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
          <Card className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Want to be featured in a starter pack?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're always looking for amazing Basker users to highlight. 
                Create great content and engage with the community!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105 shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Button>
                </Link>
                <Link href="/examples" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    See Examples
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>

      {/* Modern CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.9;
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(35px, 35px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes cardHover {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-8px) scale(1.02);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-card-hover {
          animation: cardHover 0.3s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
