import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Search, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  // Load trending GIFs on mount
  useEffect(() => {
    if (isOpen && activeTab === 'browse' && gifs.length === 0) {
      loadTrendingGifs();
    }
  }, [isOpen, activeTab]);

  const loadTrendingGifs = async () => {
    setIsLoadingGifs(true);
    try {
      // Using Giphy API - you can get a free API key at developers.giphy.com
      const apiKey = 'VhqtOQ7uy63CbIHzkQ9V2ZsYi6ZHFZ8c'; // Demo key - replace with your own
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=24&rating=g`
      );
      const data = await response.json();
      
      const gifResults: GifResult[] = data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.original.url,
        previewUrl: gif.images.fixed_height.url,
        title: gif.title,
      }));
      
      setGifs(gifResults);
    } catch (error) {
      console.error('Failed to load GIFs:', error);
      toast({
        title: 'Failed to load GIFs',
        description: 'Could not connect to GIF service',
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
      const apiKey = 'VhqtOQ7uy63CbIHzkQ9V2ZsYi6ZHFZ8c';
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=24&rating=g`
      );
      const data = await response.json();
      
      const gifResults: GifResult[] = data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.original.url,
        previewUrl: gif.images.fixed_height.url,
        title: gif.title,
      }));
      
      setGifs(gifResults);
    } catch (error) {
      console.error('Failed to search GIFs:', error);
      toast({
        title: 'Search failed',
        description: 'Could not search GIFs',
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

  const handleUpload = async () => {
    const imageToUpload = selectedGif || selectedImage;
    if (!imageToUpload) return;

    setIsUploading(true);
    try {
      // In a real implementation, you would upload to your storage service
      // For now, we'll simulate the upload and update the user profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateProfile({
        ...user!,
        banner: imageToUpload, // In real app, this would be the uploaded URL
      });

      toast({
        title: 'Banner updated!',
        description: 'Your banner has been updated successfully',
      });
      
      onClose();
      setSelectedImage(null);
      setSelectedGif(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload banner',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="banner-upload-modal">
        <DialogHeader>
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'browse')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="browse">Browse GIFs</TabsTrigger>
          </TabsList>
          
          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 overflow-auto">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border-2 border-primary">
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
                    onClick={handleUpload}
                    className="w-full"
                    disabled={isUploading}
                    data-testid="button-upload-banner"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Set as Banner
                      </>
                    )}
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
                    onClick={() => setSelectedGif(null)}
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by Giphy
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

