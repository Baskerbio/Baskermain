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
        const stories = data?.stories || [];
        
        // Filter out expired stories on the client side as well
        const now = new Date();
        const activeStories = stories.filter(story => {
          const expiresAt = new Date(story.expiresAt);
          return expiresAt > now;
        });
        
        setStories(activeStories);
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

  // Helper function to get border gradient style
  const getBorderGradient = () => {
    const borderType = effectiveSettings?.profileIconBorderType || 'solid';
    const borderWidth = effectiveSettings?.profileIconBorderWidth || 0;
    
    if (borderType === 'solid' || borderWidth === 0) return null;
    
    const gradientColors = effectiveSettings?.profileIconBorderGradientColors || ['#ff0000', '#00ff00', '#0000ff'];
    const [color1, color2, color3] = gradientColors;
    
    if (borderType === 'gradient') {
      return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
    }
    
    if (borderType === 'animated-gradient') {
      const animatedType = effectiveSettings?.profileIconBorderAnimatedType || 'rainbow';
      if (animatedType === 'rainbow') {
        return `conic-gradient(from 0deg, ${color1}, ${color2}, ${color3}, ${color1})`;
      } else if (animatedType === 'pulse') {
        return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
      } else { // flow
        return `linear-gradient(90deg, ${color1}, ${color2}, ${color3})`;
      }
    }
    
    return null;
  };

  // Helper function to get color based on index for even distribution around circle
  // Cycles through the 3 colors evenly: color1, color2, color3, color1, color2, color3...
  const getColorForIndex = (index: number, gradientColors: string[]): string => {
    const [color1, color2, color3] = gradientColors;
    const colorIndex = index % 3;
    if (colorIndex === 0) return color1;
    if (colorIndex === 1) return color2;
    return color3;
  };

  // Helper function to render dashed/dotted border SVG pattern
  const renderBorderPattern = (size: number, borderWidth: number, borderStyle: string, gradientColors: string[]) => {
    if (borderStyle !== 'dashed' && borderStyle !== 'dotted') return null;
    
    const radius = size / 2;
    
    if (borderStyle === 'dashed') {
      const dashLength = borderWidth * 4;
      const gapLength = borderWidth * 2;
      const circumference = 2 * Math.PI * radius;
      const numDashes = Math.floor(circumference / (dashLength + gapLength));
      const dashAngleDeg = (dashLength / circumference) * 360;
      const gapAngleDeg = (gapLength / circumference) * 360;
      
      const paths = Array.from({ length: numDashes }, (_, i) => {
        const startAngleDeg = i * (dashAngleDeg + gapAngleDeg);
        const midAngleDeg = startAngleDeg + dashAngleDeg / 2; // Use middle of dash for color
        const endAngleDeg = startAngleDeg + dashAngleDeg;
        const startRad = (startAngleDeg * Math.PI) / 180;
        const endRad = (endAngleDeg * Math.PI) / 180;
        const largeArc = dashAngleDeg > 180 ? 1 : 0;
        const outerRadius = radius;
        const innerRadius = radius - borderWidth;
        
        const x1 = radius + outerRadius * Math.cos(startRad);
        const y1 = radius + outerRadius * Math.sin(startRad);
        const x2 = radius + outerRadius * Math.cos(endRad);
        const y2 = radius + outerRadius * Math.sin(endRad);
        const x3 = radius + innerRadius * Math.cos(endRad);
        const y3 = radius + innerRadius * Math.sin(endRad);
        const x4 = radius + innerRadius * Math.cos(startRad);
        const y4 = radius + innerRadius * Math.sin(startRad);
        
        // Get color for this dash based on its index - cycles through 3 colors evenly
        const dashColor = getColorForIndex(i, gradientColors);
        
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
            fill={dashColor}
          />
        );
      });
      
      return (
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {paths}
        </svg>
      );
    }
    
    if (borderStyle === 'dotted') {
      const dotRadius = borderWidth * 0.8;
      const spacing = borderWidth * 4;
      const circumference = 2 * Math.PI * (radius - borderWidth / 2);
      const numDots = Math.max(4, Math.floor(circumference / spacing));
      
      const dots = Array.from({ length: numDots }, (_, i) => {
        const angle = (i * 360) / numDots - 90; // Offset by -90 to start from top
        const angleRad = (angle * Math.PI) / 180;
        const x = radius + (radius - borderWidth / 2) * Math.cos(angleRad);
        const y = radius + (radius - borderWidth / 2) * Math.sin(angleRad);
        
        // Get color for this dot based on its index - cycles through 3 colors evenly
        const dotColor = getColorForIndex(i, gradientColors);
        
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={dotRadius}
            fill={dotColor}
          />
        );
      });
      
      return (
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {dots}
        </svg>
      );
    }
    
    return null;
  };

  const borderGradient = getBorderGradient();
  const borderType = effectiveSettings?.profileIconBorderType || 'solid';
  const borderWidth = effectiveSettings?.profileIconBorderWidth || 0;
  const hasGradientBorder = borderWidth > 0 && borderGradient && borderType !== 'solid';
  const animatedType = effectiveSettings?.profileIconBorderAnimatedType || 'rainbow';

  // Helper component to render Avatar with optional gradient border
  const renderAvatar = (size: string = 'w-24 h-24', className: string = '') => {
    if (hasGradientBorder) {
      // Extract size in pixels (w-24 = 96px, w-32 = 128px, etc.)
      const sizeInPx = size === 'w-24 h-24' ? 96 : size === 'w-32 h-32' ? 128 : 96;
      const borderStyle = effectiveSettings?.profileIconBorderStyle || 'solid';
      const gradientColors = effectiveSettings?.profileIconBorderGradientColors || ['#ff0000', '#00ff00', '#0000ff'];
      const isDashedOrDotted = borderStyle === 'dashed' || borderStyle === 'dotted';
      return (
        <div
          className={`${size} relative flex items-center justify-center`}
          style={{
            borderRadius: effectiveSettings?.profileIconBorderRadius !== undefined ? `${effectiveSettings.profileIconBorderRadius}%` : undefined,
            animation: borderType === 'animated-gradient' && animatedType === 'rainbow'
              ? 'gradientRotate 3s linear infinite' 
              : undefined,
          }}
        >
          {/* Gradient background layer - only show if not dashed/dotted */}
          {!isDashedOrDotted && (
            <div
              className="absolute inset-0"
              style={{
                background: borderGradient,
                borderRadius: effectiveSettings?.profileIconBorderRadius !== undefined ? `${effectiveSettings.profileIconBorderRadius}%` : undefined,
                backgroundSize: animatedType === 'pulse' || animatedType === 'flow' ? '200% 200%' : '100% 100%',
                animation: borderType === 'animated-gradient' 
                  ? animatedType === 'pulse'
                    ? 'gradientPulse 2s ease-in-out infinite'
                    : animatedType === 'flow'
                    ? 'gradientFlow 3s linear infinite'
                    : undefined
                  : undefined,
              }}
            />
          )}
          {/* SVG pattern for dashed/dotted styles */}
          {isDashedOrDotted && renderBorderPattern(sizeInPx, borderWidth, borderStyle, gradientColors)}
          {/* Inner gradient layer for double/groove/ridge effects */}
          {(borderStyle === 'double' || borderStyle === 'groove' || borderStyle === 'ridge') && (
            <div
              className="absolute"
              style={{
                background: borderGradient,
                borderRadius: effectiveSettings?.profileIconBorderRadius !== undefined ? `${effectiveSettings.profileIconBorderRadius}%` : undefined,
                backgroundSize: animatedType === 'pulse' || animatedType === 'flow' ? '200% 200%' : '100% 100%',
                width: `calc(100% - ${(borderWidth / 3) * 2}px)`,
                height: `calc(100% - ${(borderWidth / 3) * 2}px)`,
                margin: `${borderWidth / 3}px`,
                animation: borderType === 'animated-gradient' 
                  ? animatedType === 'pulse'
                    ? 'gradientPulse 2s ease-in-out infinite'
                    : animatedType === 'flow'
                    ? 'gradientFlow 3s linear infinite'
                    : undefined
                  : undefined,
              }}
            />
          )}
          {/* Avatar that creates the border effect */}
          <Avatar 
            className={`relative z-10 ${className}`}
            style={{
              borderRadius: effectiveSettings?.profileIconBorderRadius !== undefined ? `${effectiveSettings.profileIconBorderRadius}%` : undefined,
              width: `calc(${sizeInPx}px - ${2 * borderWidth}px)`,
              height: `calc(${sizeInPx}px - ${2 * borderWidth}px)`,
            }}
          >
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

    // Regular avatar without gradient border
    return (
      <Avatar 
        className={`${size} ${className}`}
        style={{
          borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
          borderColor: effectiveSettings?.profileIconBorderColor || (borderWidth > 0 ? '#ffffff' : undefined),
          borderStyle: effectiveSettings?.profileIconBorderStyle,
          borderRadius: effectiveSettings?.profileIconBorderRadius !== undefined ? `${effectiveSettings.profileIconBorderRadius}%` : undefined,
        }}
      >
        <AvatarImage 
          src={effectiveSettings?.customAvatar || profile.avatar} 
          alt={profile.displayName || profile.handle}
          data-testid="img-avatar"
        />
        <AvatarFallback data-testid="text-avatar-fallback">
          {(profile.displayName || profile.handle).charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };

  // If no stories, just show the avatar
  if (activeStories.length === 0) {
    return (
      <div className="relative inline-block mb-0">
        {hasGradientBorder && (
          <style>
            {`
              @keyframes gradientRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes gradientPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes gradientFlow {
                from { background-position: 0% 50%; }
                to { background-position: 200% 50%; }
              }
            `}
          </style>
        )}
        {renderAvatar()}
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
          ${hasGradientBorder ? `
            @keyframes gradientRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes gradientPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes gradientFlow {
              from { background-position: 0% 50%; }
              to { background-position: 200% 50%; }
            }
          ` : ''}
        `}
      </style>
      <div className="relative inline-block -mb-8 w-48 h-48 flex items-center justify-center">
        {/* Avatar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          {renderAvatar('w-24 h-24')}
        </div>

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
