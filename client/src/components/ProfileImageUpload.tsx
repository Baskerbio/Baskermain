
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileImageUpload({ isOpen, onClose }: ProfileImageUploadProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
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
        avatar: selectedImage, // In real app, this would be the uploaded URL
      });

      toast({
        title: 'Profile image updated!',
        description: 'Your profile image has been updated successfully',
      });
      
      onClose();
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload profile image',
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
        avatar: undefined,
      });

      toast({
        title: 'Profile image removed',
        description: 'Your profile image has been removed',
      });
      
      onClose();
      setSelectedImage(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove profile image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="profile-image-upload-modal">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage 
                src={selectedImage || user?.avatar} 
                alt={user?.displayName || user?.handle}
              />
              <AvatarFallback className="text-2xl">
                {(user?.displayName || user?.handle)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Upload a new profile image (max 5MB)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
                data-testid="button-upload-image"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Update Image
                  </>
                )}
              </Button>
            )}

            {user?.avatar && (
              <Button
                onClick={handleRemove}
                variant="destructive"
                className="w-full"
                disabled={isUploading}
                data-testid="button-remove-image"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Image
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
