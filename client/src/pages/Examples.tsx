import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, ExternalLink, Link as LinkIcon, Github, Twitter, Globe, Instagram, Youtube, Users, Heart, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { atprotocol } from '../lib/atprotocol';
import { getLinkStyling } from '../lib/link-utils';
import { Header } from '../components/Header';

export default function Examples() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const exampleHandles = ['basker.bio', 'samthibault.bsky.social'];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilePromises = exampleHandles.map(async (handle) => {
          try {
            const [profileData, linksData, notesData, settingsData] = await Promise.all([
              atprotocol.getPublicProfile(handle).catch(() => null),
              atprotocol.getPublicLinks(handle).catch(() => ({ links: [] })),
              atprotocol.getPublicNotes(handle).catch(() => ({ notes: [] })),
              atprotocol.getPublicSettings(handle).catch(() => null)
            ]);
            
            return {
              ...profileData,
              handle,
              links: linksData?.links || [],
              notes: notesData?.notes || [],
              settings: settingsData?.settings || null
            };
          } catch (error) {
            console.error(`Failed to fetch ${handle}:`, error);
            // Return a fallback profile structure
            return {
              handle,
              displayName: handle.split('.')[0].charAt(0).toUpperCase() + handle.split('.')[0].slice(1),
              description: 'Example profile',
              avatar: '',
              banner: '',
              links: [],
              notes: [],
              settings: null
            };
          }
        });

        const fetchedProfiles = await Promise.all(profilePromises);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const getLinkIcon = (url: string) => {
    if (url.includes('github.com')) return <Github className="w-4 h-4" />;
    if (url.includes('twitter.com') || url.includes('x.com')) return <Twitter className="w-4 h-4" />;
    if (url.includes('instagram.com')) return <Instagram className="w-4 h-4" />;
    if (url.includes('youtube.com')) return <Youtube className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Inspiring Profile Examples
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how creators, professionals, and organizations are using Basker to showcase 
            their work, connect with audiences, and build their online presence.
          </p>
        </div>

        {/* Mini Basker Profile Examples */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {loading ? (
            // Loading state
            <>
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">
                    <div className="animate-pulse">
                      <div className="h-32 bg-gray-300 dark:bg-gray-700"></div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full -mt-8 border-4 border-white dark:border-gray-900"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            // Mini Basker profile pages
            profiles.map((profile, index) => (
              <Card key={index} className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
                {/* Mini Profile Header - mimicking the actual Basker profile page */}
                <div className="relative">
                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-r from-yellow-400 to-orange-500 relative rounded-xl overflow-hidden">
                    {profile.banner && (
                      <img 
                        src={profile.banner} 
                        alt="Profile banner" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="p-6 pt-2">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-900 -mt-10 relative z-10">
                        <AvatarImage src={profile.avatar} alt={profile.displayName} />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-2xl font-bold">
                          {profile.displayName?.charAt(0) || profile.handle?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {profile.displayName || profile.handle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          @{profile.handle}
                        </p>
                        {profile.description && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                            {profile.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mini Links Section */}
                    {profile.links && profile.links.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Links
                        </h4>
                        <div className="space-y-2">
                          {profile.links.slice(0, 2).map((link: any, linkIndex: number) => (
                            <a 
                              key={linkIndex} 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Card 
                                className={`hover:shadow-md transition-shadow cursor-pointer ${getLinkStyling(link).shapeClasses} scale-75 origin-left`}
                                style={{
                                  backgroundColor: getLinkStyling(link).backgroundColor,
                                  color: getLinkStyling(link).color,
                                  fontFamily: getLinkStyling(link).fontFamily,
                                }}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                      {getLinkIcon(link.url || link.href || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-foreground truncate text-sm">{link.title}</h4>
                                      {link.description && (
                                        <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </a>
                          ))}
                          {profile.links.length > 2 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                              +{profile.links.length - 2} more links
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mini Notes Section */}
                    {profile.notes && profile.notes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Notes
                        </h4>
                        <div className="space-y-2">
                          {profile.notes.slice(0, 1).map((note: any, noteIndex: number) => (
                            <Card key={noteIndex}>
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary text-xs">📝</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-foreground text-xs leading-relaxed line-clamp-3">
                                      {note.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(note.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {profile.notes.length > 1 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +{profile.notes.length - 1} more notes
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link href={`/${profile.handle}`}>
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Full Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Create Your Own?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of creators, professionals, and organizations who trust Basker 
              to showcase their work and connect with their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8">
                  Create Your Profile
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
