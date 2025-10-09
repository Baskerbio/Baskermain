import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Search, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useSaveSettings } from '../hooks/use-atprotocol';

interface BannerUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GifResult {
  id: string;
  url: string;
  previewUrl: string;
  title: string;
}

export function BannerUpload({ isOpen, onClose }: BannerUploadProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { data: settings } = useSettings();
  const { mutate: saveSettings } = useSaveSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  // Image adjustment controls
  const [imageScale, setImageScale] = useState(100);
  const [imagePositionX, setImagePositionX] = useState(50);
  const [imagePositionY, setImagePositionY] = useState(50);
  const [imageRotation, setImageRotation] = useState(0);

  // Load existing banner adjustments when editing current banner
  useEffect(() => {
    if (settings?.bannerAdjustment && imageToEdit === user?.banner) {
      setImageScale(settings.bannerAdjustment.scale || 100);
      setImagePositionX(settings.bannerAdjustment.positionX || 50);
      setImagePositionY(settings.bannerAdjustment.positionY || 50);
      setImageRotation(settings.bannerAdjustment.rotation || 0);
    }
  }, [settings?.bannerAdjustment, imageToEdit, user?.banner]);

  // Load trending GIFs on mount
  useEffect(() => {
    if (isOpen && activeTab === 'browse' && gifs.length === 0) {
      loadTrendingGifs();
    }
  }, [isOpen, activeTab]);

  const loadTrendingGifs = async () => {
    setIsLoadingGifs(true);
    try {
      // Using Tenor API (Google's GIF API) - free public access
      const apiKey = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ'; // Demo key - works without auth
      const response = await fetch(
        `https://tenor.googleapis.com/v2/featured?key=${apiKey}&limit=24&contentfilter=high&media_filter=gif`
      );
      
      if (!response.ok) {
        throw new Error(`Tenor API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Tenor trending response:', data);
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No GIFs found');
      }
      
      const gifResults: GifResult[] = data.results
        .filter((gif: any) => gif.media_formats?.gif?.url) // Filter out invalid entries
        .map((gif: any) => ({
          id: gif.id,
          url: gif.media_formats?.gif?.url || gif.media_formats?.tinygif?.url,
          previewUrl: gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url,
          title: gif.content_description || 'GIF',
        }));
      
      console.log('Loaded GIFs:', gifResults.length);
      console.log('Sample GIF:', gifResults[0]);
      setGifs(gifResults);
    } catch (error: any) {
      console.error('Failed to load GIFs:', error);
      toast({
        title: 'Failed to load GIFs',
        description: error.message || 'Could not connect to GIF service',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const searchGifs = async () => {
    if (!searchQuery.trim()) {
      loadTrendingGifs();
      return;
    }

    setIsLoadingGifs(true);
    try {
      const apiKey = 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ';
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=24&contentfilter=high&media_filter=gif`
      );
      
      if (!response.ok) {
        throw new Error(`Tenor API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Tenor search response:', data);
      
      if (!data.results || data.results.length === 0) {
        toast({
          title: 'No results',
          description: `No GIFs found for "${searchQuery}"`,
        });
        setGifs([]);
        return;
      }
      
      const gifResults: GifResult[] = data.results
        .filter((gif: any) => gif.media_formats?.gif?.url) // Filter out invalid entries
        .map((gif: any) => ({
          id: gif.id,
          url: gif.media_formats?.gif?.url || gif.media_formats?.tinygif?.url,
          previewUrl: gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url,
          title: gif.content_description || 'GIF',
        }));
      
      console.log('Found GIFs:', gifResults.length);
      console.log('Sample GIF:', gifResults[0]);
      setGifs(gifResults);
    } catch (error: any) {
      console.error('Failed to search GIFs:', error);
      toast({
        title: 'Search failed',
        description: error.message || 'Could not search GIFs',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for banners (GIFs can be larger)
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setSelectedGif(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectForEditing = (imageUrl: string) => {
    setImageToEdit(imageUrl);
    setShowEditor(true);
    // Reset adjustments
    setImageScale(100);
    setImagePositionX(50);
    setImagePositionY(50);
    setImageRotation(0);
  };

  const handleUpload = async () => {
    const imageToUpload = selectedGif || selectedImage || imageToEdit;
    if (!imageToUpload) return;

    setIsUploading(true);
    try {
      // Save banner adjustments to settings FIRST and WAIT for completion
      const baseSettings = settings || {
        theme: {
          name: 'dark',
          primaryColor: '#8b5cf6',
          accentColor: '#22c55e',
          backgroundColor: '#0f0f14',
          textColor: '#fafafa',
          fontFamily: 'Inter',
          layout: 'default',
        },
        showStories: true,
        showNotes: true,
        isPublic: true,
        enableAnalytics: true,
        sectionOrder: ['widgets', 'notes', 'links'],
      };
      
      const updatedSettings = {
        ...baseSettings,
        customBanner: imageToUpload, // Save banner URL in settings too!
        bannerAdjustment: {
          scale: imageScale,
          positionX: imagePositionX,
          positionY: imagePositionY,
          rotation: imageRotation,
        },
      };
      
      console.log('💾 Saving banner URL and adjustments to AT Protocol:', {
        bannerUrl: imageToUpload,
        adjustments: updatedSettings.bannerAdjustment,
      });
      console.log('💾 Full settings being saved:', updatedSettings);
      
      // Save EVERYTHING to AT Protocol (banner URL + adjustments)
      await new Promise<void>((resolve, reject) => {
        saveSettings(updatedSettings, {
          onSuccess: () => {
            console.log('✅ Banner and adjustments saved to AT Protocol successfully');
            console.log('✅ Saved settings:', updatedSettings);
            resolve();
          },
          onError: (error) => {
            console.error('❌ Failed to save to AT Protocol:', error);
            reject(error);
          },
        });
      });
      
      console.log('✅ Settings saved, now updating profile in localStorage');
      
      // Also update the banner URL in profile (for immediate display)
      await updateProfile({
        ...user!,
        banner: imageToUpload,
      });
      
      console.log('✅ Banner URL updated in profile');
      
      // Wait a bit for the save to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Banner updated!',
        description: 'Your banner and adjustments have been saved',
      });
      
      onClose();
      setSelectedImage(null);
      setSelectedGif(null);
      setShowEditor(false);
      setImageToEdit(null);
    } catch (error) {
      console.error('❌ Banner upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to save banner adjustments',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      await updateProfile({
        ...user!,
        banner: undefined,
      });

      toast({
        title: 'Banner removed',
        description: 'Your banner has been removed',
      });
      
      onClose();
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove banner',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getImageStyle = () => {
    return {
      transform: `scale(${imageScale / 100}) rotate(${imageRotation}deg)`,
      objectPosition: `${imagePositionX}% ${imagePositionY}%`,
    };
  };

  // If editor is open, show editor view
  if (showEditor && imageToEdit) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-auto" data-testid="banner-editor-modal">
          <DialogHeader>
            <DialogTitle>Adjust Banner Position & Fit</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Large Accurate Preview - Matches actual banner dimensions */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Live Preview (exact banner size)
              </p>
              <div className="relative w-full bg-muted rounded-xl overflow-hidden border-2 border-primary" 
                   style={{ height: '200px' }}> {/* Match ProfileHeader banner height */}
                <img 
                  src={imageToEdit}
                  alt="Banner preview"
                  className="w-full h-full object-cover transition-all duration-100"
                  style={getImageStyle()}
                />
                
                {/* Overlay grid to help with positioning */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }} />
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center justify-between">
                    <span>🔍 Zoom: {imageScale}%</span>
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="300"
                    step="5"
                    value={imageScale}
                    onChange={(e) => setImageScale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>25%</span>
                    <span>300%</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    ↔️ Horizontal: {imagePositionX}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={imagePositionX}
                    onChange={(e) => setImagePositionX(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    ↕️ Vertical: {imagePositionY}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={imagePositionY}
                    onChange={(e) => setImagePositionY(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Top</span>
                    <span>Center</span>
                    <span>Bottom</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    🔄 Rotation: {imageRotation}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={imageRotation}
                    onChange={(e) => setImageRotation(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>-180°</span>
                    <span>0°</span>
                    <span>180°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Quick Presets:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setImageScale(100);
                    setImagePositionX(50);
                    setImagePositionY(50);
                    setImageRotation(0);
                  }}
                >
                  Center
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setImageScale(100);
                    setImagePositionX(50);
                    setImagePositionY(0);
                    setImageRotation(0);
                  }}
                >
                  Top
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setImageScale(150);
                    setImagePositionX(50);
                    setImagePositionY(50);
                    setImageRotation(0);
                  }}
                >
                  Zoom In
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setImageScale(75);
                    setImagePositionX(50);
                    setImagePositionY(50);
                    setImageRotation(0);
                  }}
                >
                  Zoom Out
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleUpload}
                className="flex-1"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting Banner...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Set as Banner
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowEditor(false);
                  setImageToEdit(null);
                }}
                variant="outline"
              >
                Back to Selection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="banner-upload-modal">
        <DialogHeader>
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'browse')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="browse">Browse GIFs</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="edit" disabled={!user?.banner}>Edit Current</TabsTrigger>
          </TabsList>
          
          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 overflow-auto">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full bg-muted rounded-xl overflow-hidden border-2 border-primary" 
                     style={{ height: '200px' }}>
                  {selectedImage || user?.banner ? (
                    <img 
                      src={selectedImage || user?.banner} 
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Upload a banner from your device (max 10MB)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPG, PNG, GIF
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 1500x500px
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>

                {selectedImage && (
                  <Button
                    onClick={() => handleSelectForEditing(selectedImage)}
                    className="w-full"
                    data-testid="button-edit-banner"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Adjust & Set Banner
                  </Button>
                )}

                {user?.banner && (
                  <Button
                    onClick={handleRemove}
                    variant="destructive"
                    className="w-full"
                    disabled={isUploading}
                    data-testid="button-remove-banner"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Banner
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Browse GIFs Tab */}
          <TabsContent value="browse" className="flex-1 overflow-auto">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for GIFs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchGifs()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={searchGifs} disabled={isLoadingGifs}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap gap-2">
                {['Nature', 'Abstract', 'Space', 'Neon', 'Gradient', 'Minimal'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setTimeout(searchGifs, 100);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Selected GIF Preview */}
              {selectedGif && (
                <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border-2 border-primary">
                  <img 
                    src={selectedGif} 
                    alt="Selected GIF"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* GIF Grid */}
              {isLoadingGifs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                  {gifs.map((gif) => (
                    <button
                      key={gif.id}
                      onClick={() => setSelectedGif(gif.url)}
                      className={`
                        relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                        ${selectedGif === gif.url ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'}
                      `}
                    >
                      <img 
                        src={gif.previewUrl} 
                        alt={gif.title}
                        className="w-full h-full object-cover"
                      />
                      {selectedGif === gif.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {gifs.length === 0 && !isLoadingGifs && (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Search for GIFs or browse trending</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedGif && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleSelectForEditing(selectedGif)}
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Adjust & Set Banner
                  </Button>
                  <Button
                    onClick={() => setSelectedGif(null)}
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by Tenor
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Edit Current Banner Tab */}
          <TabsContent value="edit" className="flex-1 overflow-auto">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full bg-muted rounded-xl overflow-hidden border-2 border-primary" 
                     style={{ height: '200px' }}>
                  {user?.banner ? (
                    <img 
                      src={user.banner} 
                      alt="Current banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Adjust your current banner's position and fit
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {user?.banner && (
                  <Button
                    onClick={() => handleSelectForEditing(user.banner!)}
                    className="w-full"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Adjust Current Banner
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* URL Tab */}
          <TabsContent value="url" className="flex-1 overflow-auto">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full bg-muted rounded-xl overflow-hidden border-2 border-primary"
                     style={{ height: '200px' }}>
                  {selectedGif || user?.banner ? (
                    <img 
                      src={selectedGif || user?.banner} 
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Paste a direct link to any image or GIF
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Works with Giphy, Imgur, direct image URLs, etc.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Image/GIF URL</label>
                  <Input
                    placeholder="https://media.giphy.com/media/..."
                    value={selectedGif || ''}
                    onChange={(e) => setSelectedGif(e.target.value)}
                    className="w-full"
                  />
                </div>

                {selectedGif && (
                  <Button
                    onClick={() => handleSelectForEditing(selectedGif)}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Adjust & Set Banner
                  </Button>
                )}

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>How to find GIF URLs:</strong><br />
                    1. Go to giphy.com or tenor.com<br />
                    2. Right-click on any GIF<br />
                    3. Select "Copy image address" or "Copy link"<br />
                    4. Paste here!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

