import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Star, Share2, ExternalLink, Heart, MessageCircle, Link as LinkIcon, QrCode, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStarterPack, useAddToStarterPack, useRemoveFromStarterPack, useDeleteStarterPack } from '../hooks/use-atprotocol';
import { atprotocol } from '../lib/atprotocol';
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

export default function StarterPackDetail() {
  const { packId } = useParams();
  const { user } = useAuth();
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserHandle, setNewUserHandle] = useState('');
  
  const starterPackUri = packId ? decodeURIComponent(packId) : '';
  
  const { data: pack, isLoading: packLoading } = useStarterPack(starterPackUri);
  const addToStarterPackMutation = useAddToStarterPack();
  const removeFromStarterPackMutation = useRemoveFromStarterPack();
  const deleteStarterPackMutation = useDeleteStarterPack();
  
  const loading = packLoading;

  // Check if current user is the creator of this starter pack
  const isOwner = user?.did === pack?.creator.did;

  const handleFollowUser = (userId: string) => {
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(userId)) {
        newFollowing.delete(userId);
      } else {
        newFollowing.add(userId);
      }
      return newFollowing;
    });
  };

  const handleFollowAll = () => {
    if (!pack?.members) return;
    const allUserIds = pack.members.map(member => member.did);
    setFollowing(new Set(allUserIds));
  };

  const handleAddToStarterPack = async (userDid: string, userHandle: string, userDisplayName?: string, userAvatar?: string) => {
    try {
      await addToStarterPackMutation.mutateAsync({
        starterPackUri: starterPackUri,
        userDid: userDid,
        userHandle: userHandle,
        userDisplayName: userDisplayName,
        userAvatar: userAvatar
      });
    } catch (error) {
      console.error('Failed to add to starter pack:', error);
    }
  };

  const handleRemoveFromStarterPack = async (userDid: string) => {
    // Security check: Only allow pack creator to remove users
    if (!user || !pack || user.did !== pack.creator.did) {
      alert('You are not authorized to remove users from this starter pack. Only the pack creator can manage members.');
      return;
    }

    try {
      await removeFromStarterPackMutation.mutateAsync({
        starterPackUri: starterPackUri,
        userDid: userDid
      });
    } catch (error) {
      console.error('Failed to remove from starter pack:', error);
    }
  };

  const handleDeleteStarterPack = async () => {
    // Security check: Only allow deletion if user is the actual pack creator
    if (!user || !pack || user.did !== pack.creator.did) {
      alert('You are not authorized to delete this starter pack. Only the pack creator can delete it.');
      return;
    }

    try {
      await deleteStarterPackMutation.mutateAsync(starterPackUri);
      // Redirect to starter packs page
      window.location.href = '/starter-packs';
    } catch (error) {
      console.error('Failed to delete starter pack:', error);
      alert('Failed to delete starter pack. Please try again.');
    }
  };

  const handleAddUser = async () => {
    if (!newUserHandle.trim()) return;
    
    // Security check: Only allow pack creator to add users
    if (!user || !pack || user.did !== pack.creator.did) {
      alert('You are not authorized to add users to this starter pack. Only the pack creator can manage members.');
      return;
    }
    
    try {
      // First, get the user's profile to get their DID and other info
      const profile = await atprotocol.getPublicProfile(newUserHandle.trim());
      
      await addToStarterPackMutation.mutateAsync({
        starterPackUri: starterPackUri,
        userDid: profile.did,
        userHandle: profile.handle,
        userDisplayName: profile.displayName,
        userAvatar: profile.avatar
      });
      
      setNewUserHandle('');
      setShowAddUserForm(false);
    } catch (error) {
      console.error('Failed to add user:', error);
      alert('Failed to add user. Please check the handle and try again.');
    }
  };

  const handleSharePack = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Basker Starter Pack: ${pack?.name}`,
        text: pack?.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const handleOpenBluesky = (handle: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open in the Bluesky mobile app first
      const appUrl = `com.bsky.app://profile/${handle}`;
      window.location.href = appUrl;
      
      // Fallback to website if app doesn't open
      setTimeout(() => {
        window.open(`https://bsky.app/profile/${handle}`, '_blank');
      }, 1000);
    } else {
      // Open in website for desktop
      window.open(`https://bsky.app/profile/${handle}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Starter Pack Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The starter pack you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/starter-packs">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Starter Packs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Pack Header */}
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">📋</span>
                <div>
                  <CardTitle className="text-3xl mb-2">{pack?.name}</CardTitle>
                  <p className="text-yellow-100 text-lg">{pack?.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={pack?.creator.avatar} />
                      <AvatarFallback>
                        {pack?.creator.displayName?.charAt(0) || pack?.creator.handle.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-yellow-100">
                      by @{pack?.creator.handle}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSharePack}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Pack
                </Button>
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this starter pack? This action cannot be undone.')) {
                        handleDeleteStarterPack();
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Pack
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="w-4 h-4 mr-1" />
                {pack?.members?.length || 0} creators
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFollowAll}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Follow All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add User Section - Only for owners */}
        {isOwner && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Manage Members
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this starter pack? This action cannot be undone.')) {
                        handleDeleteStarterPack();
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Pack
                  </Button>
                </div>
              </div>
              
              {showAddUserForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User Handle
                    </label>
                    <input
                      type="text"
                      value={newUserHandle}
                      onChange={(e) => setNewUserHandle(e.target.value)}
                      placeholder="e.g., username.bsky.social"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddUser}
                      disabled={!newUserHandle.trim() || addToStarterPackMutation.isPending}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      {addToStarterPackMutation.isPending ? 'Adding...' : 'Add User'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddUserForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        <div className="space-y-4">
          {pack?.members?.map((member) => (
            <Card key={member.did} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {(member.displayName || member.handle).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                      {member.displayName || member.handle}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 truncate">
                      @{member.handle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Added {new Date(member.addedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-4 items-center justify-center">
                    <Link href={`/profile/${member.handle}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant={following.has(member.did) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFollowUser(member.did)}
                      className={following.has(member.did) ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {following.has(member.did) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenBluesky(member.handle)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromStarterPack(member.did)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-0">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Want to join this community?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your own Basker profile and start connecting with these amazing creators!
              </p>
              <Link href="/login">
                <Button size="lg">
                  <Star className="w-5 h-5 mr-2" />
                  Create Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
