import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserProfile } from '@shared/schema';
import { useStories, useSaveStories, useSettings } from '../hooks/use-atprotocol';
import { atprotocol } from '../lib/atprotocol';
import { Story } from '@shared/schema';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const storyFormSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
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

interface StoriesRingProps {
  profile: UserProfile;
  isEditMode?: boolean;
  isOwnProfile?: boolean;
  targetDid?: string; // For public profiles
  settings?: any; // Pass settings from parent
}

export function StoriesRing({ profile, isEditMode = false, isOwnProfile = false, targetDid, settings: propSettings }: StoriesRingProps) {
  const componentId = Math.random().toString(36).substr(2, 9);
  console.log('🔍 StoriesRing - Component rendered with ID:', componentId, 'props:', { isEditMode, isOwnProfile, targetDid, profileHandle: profile?.handle });
  
  const { data: ownStories = [] } = useStories();
  const { mutate: saveStories } = useSaveStories();
  const { data: settings } = useSettings();
  
  // Use passed settings if available, otherwise use fetched settings
  const effectiveSettings = propSettings || settings;
  const [publicStories, setPublicStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const watchedValues = form.watch();

  // Handle text dragging
  const handleTextMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    form.setValue('textPosition', { x: clampedX, y: clampedY });
  };

  const handlePreviewMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!previewRef.current) return;
        
        const rect = previewRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));
        
        form.setValue('textPosition', { x: clampedX, y: clampedY });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, form]);

  // Use own stories for authenticated user, public stories for public profiles
  const stories = targetDid ? publicStories : ownStories;

  // Load public stories if targetDid is provided
  useEffect(() => {
    if (targetDid) {
      setLoading(true);
      const loadPublicStories = async () => {
        try {
          const data = await atprotocol.getPublicStories(targetDid);
          setPublicStories(data?.stories || []);
        } catch (error) {
          console.error('Failed to load public stories:', error);
          setPublicStories([]);
        } finally {
          setLoading(false);
        }
      };
      loadPublicStories();
    }
  }, [targetDid]);

  const onSubmit = (values: z.infer<typeof storyFormSchema>) => {
    console.log('🔍 StoriesRing - Creating new story with content:', values.content);
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
    console.log('🔍 StoriesRing - New story object:', newStory);

    const updatedStories = [...ownStories, newStory];
    console.log('🔍 StoriesRing - Updated stories array:', updatedStories);
    
    saveStories(updatedStories, {
      onSuccess: () => {
        toast({
          title: 'Story added!',
          description: 'Your story will expire in 24 hours',
        });
        setIsDialogOpen(false);
        form.reset();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to add story',
          variant: 'destructive',
        });
      },
    });
  };

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

  // Filter out expired stories and ensure unique IDs
  const activeStories = stories
    .filter(story => new Date(story.expiresAt) > new Date())
    .filter((story, index, self) => self.findIndex(s => s.id === story.id) === index);
  
  console.log('🔍 StoriesRing - stories:', stories);
  console.log('🔍 StoriesRing - activeStories:', activeStories);
  console.log('🔍 StoriesRing - activeStories length:', activeStories.length);
  console.log('🔍 StoriesRing - activeStories IDs:', activeStories.map(s => s.id));
  console.log('🔍 StoriesRing - isEditMode:', isEditMode, 'isOwnProfile:', isOwnProfile);

  // If no stories and not in edit mode, show just the avatar
  if (activeStories.length === 0 && !isEditMode) {
    console.log('🔍 StoriesRing - No stories and not in edit mode, showing just avatar');
    return (
      <div className="relative inline-block mb-4">
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
      <div className="relative inline-block -mb-12 w-48 h-48 flex items-center justify-center" data-component-id={componentId}>
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
                    {currentStory.content.slice(0, 8)}
                  </span>
                </div>
                
              </button>
            </>
          );
        })(        )}

        {/* Add story button for user's own profile */}
        {isOwnProfile && !targetDid && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="absolute w-8 h-8 rounded-full border-2 border-dashed border-primary bg-background/50 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center text-primary"
                style={{
                  left: '50%',
                  top: '5px',
                  transform: 'translateX(-50%)',
                }}
                data-testid="button-add-story-ring"
              >
                <span className="text-sm font-bold">+</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Story</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Visual Editor</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Live Preview */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Live Preview</h4>
                          <div 
                            ref={previewRef}
                            className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
                            style={{
                              backgroundColor: watchedValues.backgroundColor || '#3b82f6',
                              cursor: isDragging ? 'grabbing' : 'default',
                            }}
                            onMouseMove={handlePreviewMouseMove}
                            onMouseUp={handlePreviewMouseUp}
                          >
                            {watchedValues.imageUrl && (
                              <img 
                                src={watchedValues.imageUrl} 
                                alt="Story preview" 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}
                            
                            {/* Draggable Text */}
                            <div 
                              className="absolute z-10 p-2 select-none"
                              style={{
                                left: `${watchedValues.textPosition?.x || 50}%`,
                                top: `${watchedValues.textPosition?.y || 50}%`,
                                transform: 'translate(-50%, -50%)',
                                color: watchedValues.textColor || '#ffffff',
                                fontSize: `${watchedValues.textStyle?.fontSize || 24}px`,
                                fontWeight: watchedValues.textStyle?.fontWeight || 'normal',
                                textAlign: watchedValues.textStyle?.textAlign || 'center',
                                fontFamily: watchedValues.textStyle?.fontFamily === 'sans' ? 'system-ui, sans-serif' :
                                           watchedValues.textStyle?.fontFamily === 'serif' ? 'Georgia, serif' :
                                           watchedValues.textStyle?.fontFamily === 'mono' ? 'Monaco, monospace' :
                                           watchedValues.textStyle?.fontFamily === 'cursive' ? 'Brush Script MT, cursive' :
                                           'system-ui, sans-serif',
                                backgroundColor: isDragging ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                                borderRadius: '4px',
                                cursor: 'grab',
                                border: '2px dashed rgba(255,255,255,0.5)',
                                transition: isDragging ? 'none' : 'all 0.2s',
                              }}
                              onMouseDown={handleTextMouseDown}
                            >
                              {watchedValues.content || 'Click and drag to position text'}
                            </div>

                            {/* Sticker */}
                            {watchedValues.sticker && watchedValues.sticker !== 'none' && (
                              <div 
                                className="absolute z-20 text-3xl"
                                style={{
                                  right: '16px',
                                  top: '16px',
                                }}
                              >
                                {watchedValues.sticker}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Controls */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Quick Controls</h4>
                          
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What's happening?"
                                    className="min-h-[80px]"
                                    data-testid="textarea-story-content"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/image.jpg"
                                    data-testid="input-story-image"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name="backgroundColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Background</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="color"
                                      data-testid="input-story-bg-color"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="textColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Text Color</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="color"
                                      data-testid="input-story-text-color"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="sticker"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sticker</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a sticker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">No sticker</SelectItem>
                                      <SelectItem value="❤️">❤️ Heart</SelectItem>
                                      <SelectItem value="🔥">🔥 Fire</SelectItem>
                                      <SelectItem value="⭐">⭐ Star</SelectItem>
                                      <SelectItem value="🎉">🎉 Party</SelectItem>
                                      <SelectItem value="💯">💯 100</SelectItem>
                                      <SelectItem value="👍">👍 Thumbs Up</SelectItem>
                                      <SelectItem value="🎯">🎯 Target</SelectItem>
                                      <SelectItem value="🚀">🚀 Rocket</SelectItem>
                                      <SelectItem value="💎">💎 Diamond</SelectItem>
                                      <SelectItem value="🌈">🌈 Rainbow</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="space-y-4">
                      {/* Advanced Text Position Controls */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Text Position (Advanced)</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="textPosition.x"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horizontal Position (%)</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textPosition.y"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vertical Position (%)</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Advanced Text Style Controls */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Text Style (Advanced)</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="textStyle.fontSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Size</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={12}
                                    max={72}
                                    step={2}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textStyle.fontWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Weight</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select weight" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="textStyle.textAlign"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Text Alignment</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select alignment" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textStyle.fontFamily"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Family</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select font" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sans">Sans Serif</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="mono">Monospace</SelectItem>
                                    <SelectItem value="cursive">Cursive</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" data-testid="button-save-story">
                      Add Story
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
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
                <span>Posted {new Date(selectedStory.createdAt).toLocaleDateString()}</span>
                <span>
                  Expires {new Date(selectedStory.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedStory(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                {isOwnProfile && (
                  <Button 
                    onClick={() => {
                      // Delete story logic
                      const updatedStories = stories.filter(s => s.id !== selectedStory.id);
                      saveStories(updatedStories, {
                        onSuccess: () => {
                          toast({
                            title: 'Story deleted',
                            description: 'Your story has been deleted',
                          });
                          setSelectedStory(null);
                          // Adjust current index if needed
                          if (currentStoryIndex >= updatedStories.length && updatedStories.length > 0) {
                            setCurrentStoryIndex(updatedStories.length - 1);
                          }
                        },
                        onError: () => {
                          toast({
                            title: 'Error',
                            description: 'Failed to delete story',
                            variant: 'destructive',
                          });
                        },
                      });
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
