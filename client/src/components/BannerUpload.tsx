import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BannerUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BannerUpload({ isOpen, onClose }: BannerUploadProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // In a real implementation, you would upload to your storage service
      // For now, we'll simulate the upload and update the user profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateProfile({
        ...user!,
        banner: selectedImage, // In real app, this would be the uploaded URL
      });

      toast({
        title: 'Banner updated!',
        description: 'Your banner image has been updated successfully',
      });
      
      onClose();
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload banner image',
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
      <DialogContent className="max-w-2xl" data-testid="banner-upload-modal">
        <DialogHeader>
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>
        
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
                Upload a new banner image (max 10MB)
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
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Update Banner
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
      </DialogContent>
    </Dialog>
  );
}

