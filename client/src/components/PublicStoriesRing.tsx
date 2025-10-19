import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserProfile } from '@shared/schema';
import { atprotocol } from '../lib/atprotocol';
import { Story } from '@shared/schema';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface PublicStoriesRingProps {
  profile: UserProfile;
  targetDid: string;
  settings?: any; // Public settings for custom avatar
}

const storyFormSchema = z.object({
  content: z.string().min(1, 'Story content is required').max(500, 'Story content must be less than 500 characters'),
  imageUrl: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  textPosition: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }).optional(),
  textStyle: z.object({
    fontSize: z.number().min(12).max(72),
    fontWeight: z.enum(['normal', 'bold']),
    textAlign: z.enum(['left', 'center', 'right']),
    fontFamily: z.enum(['sans', 'serif', 'mono', 'cursive']),
  }).optional(),
  sticker: z.string().optional(),
});

export function PublicStoriesRing({ profile, targetDid, settings: propSettings }: PublicStoriesRingProps) {
  console.log('🔍 PublicStoriesRing - Component rendered with props:', { targetDid, profileHandle: profile?.handle });
  
  const { user } = useAuth();
  const { data: settings } = useSettings();
  const { toast } = useToast();
  
  // Use prop settings if provided (for public profiles), otherwise use authenticated settings
  const effectiveSettings = propSettings || settings;
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isAddStoryDialogOpen, setIsAddStoryDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      content: '',
      imageUrl: '',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      textPosition: { x: 50, y: 50 },
      textStyle: {
        fontSize: 24,
        fontWeight: 'normal',
        textAlign: 'center',
        fontFamily: 'sans',
      },
      sticker: 'none',
    },
  });
  
  // Check if this is the user's own profile (for reference, but button is disabled on public profiles)
  const isOwnProfile = !!(user?.did && targetDid && user.did === targetDid);

  // Handle adding a new story
  const onSubmit = async (values: z.infer<typeof storyFormSchema>) => {
    try {
      const newStory: Story = {
        id: Date.now().toString(),
        content: values.content,
        imageUrl: values.imageUrl || undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        createdAt: new Date().toISOString(),
        backgroundColor: values.backgroundColor,
        textColor: values.textColor,
        textPosition: values.textPosition,
        textStyle: values.textStyle,
        sticker: values.sticker,
      };
      
      await atprotocol.saveStories([...stories, newStory]);
      setStories(prev => [...prev, newStory]);
      setIsAddStoryDialogOpen(false);
      form.reset();
      toast({
        title: 'Story added!',
        description: 'Your story has been posted successfully',
      });
    } catch (error) {
      console.error('Failed to add story:', error);
      toast({
        title: 'Error',
        description: 'Failed to add story. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Load public stories
  useEffect(() => {
    setLoading(true);
    const loadPublicStories = async () => {
      try {
        console.log('🔍 PublicStoriesRing - Loading stories for DID:', targetDid);
        const data = await atprotocol.getPublicStories(targetDid);
        console.log('🔍 PublicStoriesRing - Got data:', data);
        setStories(data?.stories || []);
      } catch (error) {
        console.error('Failed to load public stories:', error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    loadPublicStories();
  }, [targetDid]);

  // Stories are already filtered by the AT Protocol method, so use them directly
  const activeStories = stories;

  // Handle story viewing - always open modal
  const handleStoryClick = () => {
    if (activeStories.length === 0) return;
    
    const currentStory = activeStories[currentStoryIndex];
    setSelectedStory(currentStory);
    // Mark as viewed
    setViewedStories(prev => new Set(prev).add(currentStory.id));
  };

  // Handle story ring click - open modal
  const handleStoryRingClick = () => {
    handleStoryClick();
  };
  
  console.log('🔍 PublicStoriesRing - All stories:', stories);
  console.log('🔍 PublicStoriesRing - Active stories:', activeStories);
  console.log('🔍 PublicStoriesRing - Current time:', new Date());
  if (stories.length > 0) {
    console.log('🔍 PublicStoriesRing - First story expires at:', new Date(stories[0].expiresAt));
    console.log('🔍 PublicStoriesRing - Time until expiry:', new Date(stories[0].expiresAt).getTime() - new Date().getTime());
  }

  // If no stories, just show the avatar
  if (activeStories.length === 0) {
    return (
      <div className="relative inline-block mb-0">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage 
            src={effectiveSettings?.customAvatar || profile.avatar} 
            alt={profile.displayName || profile.handle}
            data-testid="img-avatar"
          />
          <AvatarFallback data-testid="text-avatar-fallback">
            {(profile.displayName || profile.handle).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Calculate story positions around the avatar
  const getStoryPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 55; // Distance from center (behind the avatar)
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      x: x + 96, // Offset to center (container is 192px, so center is 96px)
      y: y + 151, // Moved down 55px from center (96px + 55px)
    };
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientSpin {
            from {
              background: conic-gradient(from 0deg, #fbbf24, #ec4899, #ef4444, #fbbf24, #10b981, #3b82f6, #fbbf24);
            }
            to {
              background: conic-gradient(from 360deg, #fbbf24, #ec4899, #ef4444, #fbbf24, #10b981, #3b82f6, #fbbf24);
            }
          }
        `}
      </style>
      <div className="relative inline-block -mb-8 w-48 h-48 flex items-center justify-center">
        {/* Avatar */}
        <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <AvatarImage 
            src={effectiveSettings?.customAvatar || profile.avatar} 
            alt={profile.displayName || profile.handle}
            data-testid="img-avatar"
          />
          <AvatarFallback data-testid="text-avatar-fallback">
            {(profile.displayName || profile.handle).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Single story ring that cycles through stories */}
        {activeStories.length > 0 && (() => {
          const currentStory = activeStories[currentStoryIndex];
          const timeLeft = new Date(currentStory.expiresAt).getTime() - new Date().getTime();
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          
          // Use the original positioning logic but center it
          const position = getStoryPosition(0, 1); // Center position
          
          return (
            <>
              <button
                onClick={handleStoryRingClick}
                className="absolute rounded-full p-1.5 hover:scale-110 transition-transform cursor-pointer z-0"
                style={{
                  width: '104px',
                  height: '104px',
                  left: position.x,
                  top: position.y,
                  transform: 'translate(-50%, -50%)',
                  background: viewedStories.has(currentStory.id) 
                    ? 'transparent' 
                    : 'conic-gradient(from 0deg, #fbbf24, #ec4899, #ef4444, #fbbf24, #10b981, #3b82f6, #fbbf24)',
                  border: viewedStories.has(currentStory.id) ? '4px solid #9ca3af' : '4px solid transparent',
                  animation: viewedStories.has(currentStory.id) ? 'none' : 'gradientSpin 3s linear infinite',
                }}
                data-testid={`story-ring-${currentStory.id}`}
              >
                <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center text-xs p-1">
                  <span className="truncate text-center leading-tight text-primary font-bold">
                    {currentStory.content?.slice(0, 8) || 'Story'}
                  </span>
                </div>
                
              </button>
            </>
          );
        })()}

        {/* Add Story Button - removed from public profiles */}
        {false && (
          <Dialog open={isAddStoryDialogOpen} onOpenChange={setIsAddStoryDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="absolute rounded-full bg-primary hover:bg-primary/80 text-primary-foreground w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-20"
                style={{
                  left: '50%',
                  top: '-20px',
                  transform: 'translateX(-50%)',
                }}
                data-testid="button-add-story-ring"
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Story</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What's happening?"
                            className="resize-none"
                            rows={4}
                            data-testid="textarea-story-content"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-story">
                      Add Story
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddStoryDialogOpen(false)}
                      data-testid="button-cancel-story"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Story viewer modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Story</DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="space-y-4">
              {/* Story navigation header */}
              {activeStories.length > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const prevIndex = currentStoryIndex === 0 ? activeStories.length - 1 : currentStoryIndex - 1;
                      setCurrentStoryIndex(prevIndex);
                      setSelectedStory(activeStories[prevIndex]);
                    }}
                  >
                    ← Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentStoryIndex + 1} of {activeStories.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextIndex = (currentStoryIndex + 1) % activeStories.length;
                      setCurrentStoryIndex(nextIndex);
                      setSelectedStory(activeStories[nextIndex]);
                    }}
                  >
                    Next →
                  </Button>
                </div>
              )}
              
              <div 
                className="rounded-lg min-h-[200px] relative overflow-hidden"
                style={{
                  backgroundColor: selectedStory.backgroundColor || '#f3f4f6',
                }}
              >
                {selectedStory.imageUrl && (
                  <img 
                    src={selectedStory.imageUrl} 
                    alt="Story" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                {/* Text with custom positioning and styling */}
                <div 
                  className="absolute z-10 p-4"
                  style={{
                    left: `${selectedStory.textPosition?.x || 50}%`,
                    top: `${selectedStory.textPosition?.y || 50}%`,
                    transform: 'translate(-50%, -50%)',
                    color: selectedStory.textColor || '#000000',
                    fontSize: `${selectedStory.textStyle?.fontSize || 24}px`,
                    fontWeight: selectedStory.textStyle?.fontWeight || 'normal',
                    textAlign: selectedStory.textStyle?.textAlign || 'center',
                    fontFamily: selectedStory.textStyle?.fontFamily === 'sans' ? 'system-ui, sans-serif' :
                               selectedStory.textStyle?.fontFamily === 'serif' ? 'Georgia, serif' :
                               selectedStory.textStyle?.fontFamily === 'mono' ? 'Monaco, monospace' :
                               selectedStory.textStyle?.fontFamily === 'cursive' ? 'Brush Script MT, cursive' :
                               'system-ui, sans-serif',
                  }}
                >
                  <p className="m-0">
                    {selectedStory.content || 'No content available'}
                  </p>
                </div>

                {/* Sticker */}
                {selectedStory.sticker && selectedStory.sticker !== 'none' && (
                  <div 
                    className="absolute z-20 text-4xl"
                    style={{
                      right: '20px',
                      top: '20px',
                    }}
                  >
                    {selectedStory.sticker}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Posted {selectedStory.createdAt ? new Date(selectedStory.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                <span>
                  Expires {selectedStory.expiresAt ? new Date(selectedStory.expiresAt).toLocaleDateString() : 'Unknown date'}
                </span>
              </div>
              <Button 
                onClick={() => setSelectedStory(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
