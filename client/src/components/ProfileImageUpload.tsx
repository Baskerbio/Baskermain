
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useSaveSettings } from '../hooks/use-atprotocol';

interface ProfileImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileImageUpload({ isOpen, onClose }: ProfileImageUploadProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { data: settings } = useSettings();
  const { mutate: saveSettings } = useSaveSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Profile icon border styling controls
  const [profileIconBorderWidth, setProfileIconBorderWidth] = useState(0);
  const [profileIconBorderColor, setProfileIconBorderColor] = useState('#000000');
  const [profileIconBorderStyle, setProfileIconBorderStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'>('solid');
  const [profileIconBorderRadius, setProfileIconBorderRadius] = useState(50); // Default to fully rounded (circle)
  const [profileIconBorderType, setProfileIconBorderType] = useState<'solid' | 'gradient' | 'animated-gradient'>('solid');
  const [profileIconBorderGradientColors, setProfileIconBorderGradientColors] = useState<string[]>(['#ff0000', '#00ff00', '#0000ff']); // Default gradient colors
  const [profileIconBorderAnimatedType, setProfileIconBorderAnimatedType] = useState<'rainbow' | 'pulse' | 'flow'>('rainbow');

  // Load existing profile icon border settings when component opens
  useEffect(() => {
    if (isOpen && settings) {
      setProfileIconBorderWidth(settings.profileIconBorderWidth || 0);
      setProfileIconBorderColor(settings.profileIconBorderColor || '#000000');
      setProfileIconBorderStyle((settings.profileIconBorderStyle as 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge') || 'solid');
      setProfileIconBorderRadius(settings.profileIconBorderRadius ?? 50); // Default to 50 (fully rounded)
      setProfileIconBorderType((settings.profileIconBorderType as 'solid' | 'gradient' | 'animated-gradient') || 'solid');
      setProfileIconBorderGradientColors(settings.profileIconBorderGradientColors || ['#ff0000', '#00ff00', '#0000ff']);
      setProfileIconBorderAnimatedType((settings.profileIconBorderAnimatedType as 'rainbow' | 'pulse' | 'flow') || 'rainbow');
    }
  }, [isOpen, settings]);

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

      // Save profile icon border settings
      if (settings) {
        const updatedSettings = {
          ...settings,
          profileIconBorderWidth: profileIconBorderWidth,
          profileIconBorderColor: profileIconBorderColor,
          profileIconBorderStyle: profileIconBorderStyle as 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge',
          profileIconBorderRadius: profileIconBorderRadius,
          profileIconBorderType: profileIconBorderType,
          profileIconBorderGradientColors: profileIconBorderGradientColors,
          profileIconBorderAnimatedType: profileIconBorderAnimatedType,
        } as any;
        
        saveSettings(updatedSettings, {
          onSuccess: () => {
            console.log('✅ Profile icon border settings saved');
          },
          onError: (error) => {
            console.error('❌ Failed to save profile icon border settings:', error);
          },
        });
      }

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

  // Helper function to get border gradient style
  const getBorderGradient = () => {
    if (profileIconBorderType === 'solid' || profileIconBorderWidth === 0) return null;
    
    const [color1, color2, color3] = profileIconBorderGradientColors;
    
    if (profileIconBorderType === 'gradient') {
      return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
    }
    
    if (profileIconBorderType === 'animated-gradient') {
      if (profileIconBorderAnimatedType === 'rainbow') {
        return `conic-gradient(from 0deg, ${color1}, ${color2}, ${color3}, ${color1})`;
      } else if (profileIconBorderAnimatedType === 'pulse') {
        return `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
      } else { // flow
        return `linear-gradient(90deg, ${color1}, ${color2}, ${color3})`;
      }
    }
    
    return null;
  };

  // Helper function to get color based on index for even distribution around circle
  // Cycles through the 3 colors evenly: color1, color2, color3, color1, color2, color3...
  const getColorForIndex = (index: number): string => {
    const [color1, color2, color3] = profileIconBorderGradientColors;
    const colorIndex = index % 3;
    if (colorIndex === 0) return color1;
    if (colorIndex === 1) return color2;
    return color3;
  };

  // Helper function to render dashed/dotted border SVG pattern
  const renderBorderPattern = (size: number) => {
    if (profileIconBorderStyle !== 'dashed' && profileIconBorderStyle !== 'dotted') return null;
    
    const radius = size / 2;
    const borderWidth = profileIconBorderWidth;
    
    if (profileIconBorderStyle === 'dashed') {
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
        const dashColor = getColorForIndex(i);
        
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
    
    if (profileIconBorderStyle === 'dotted') {
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
        const dotColor = getColorForIndex(i);
        
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
  const hasGradientBorder = profileIconBorderWidth > 0 && borderGradient && profileIconBorderType !== 'solid';
  const isDashedOrDotted = profileIconBorderStyle === 'dashed' || profileIconBorderStyle === 'dotted';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="profile-image-upload-modal">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        
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
        
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {hasGradientBorder ? (
              <div
                className="w-32 h-32 relative flex items-center justify-center"
                style={{
                  borderRadius: `${profileIconBorderRadius}%`,
                  animation: profileIconBorderType === 'animated-gradient' && profileIconBorderAnimatedType === 'rainbow'
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
                      borderRadius: `${profileIconBorderRadius}%`,
                      backgroundSize: profileIconBorderAnimatedType === 'pulse' || profileIconBorderAnimatedType === 'flow' ? '200% 200%' : '100% 100%',
                      animation: profileIconBorderType === 'animated-gradient' 
                        ? profileIconBorderAnimatedType === 'pulse'
                          ? 'gradientPulse 2s ease-in-out infinite'
                          : profileIconBorderAnimatedType === 'flow'
                          ? 'gradientFlow 3s linear infinite'
                          : undefined
                        : undefined,
                    }}
                  />
                )}
                {/* SVG pattern for dashed/dotted styles */}
                {isDashedOrDotted && renderBorderPattern(128)}
                {/* Inner gradient layer for double/groove/ridge effects */}
                {(profileIconBorderStyle === 'double' || profileIconBorderStyle === 'groove' || profileIconBorderStyle === 'ridge') && (
                  <div
                    className="absolute"
                    style={{
                      background: borderGradient,
                      borderRadius: `${profileIconBorderRadius}%`,
                      backgroundSize: profileIconBorderAnimatedType === 'pulse' || profileIconBorderAnimatedType === 'flow' ? '200% 200%' : '100% 100%',
                      width: `calc(100% - ${(profileIconBorderWidth / 3) * 2}px)`,
                      height: `calc(100% - ${(profileIconBorderWidth / 3) * 2}px)`,
                      margin: `${profileIconBorderWidth / 3}px`,
                      animation: profileIconBorderType === 'animated-gradient' 
                        ? profileIconBorderAnimatedType === 'pulse'
                          ? 'gradientPulse 2s ease-in-out infinite'
                          : profileIconBorderAnimatedType === 'flow'
                          ? 'gradientFlow 3s linear infinite'
                          : undefined
                        : undefined,
                    }}
                  />
                )}
                {/* Avatar that creates the border effect */}
                <Avatar 
                  className="relative z-10"
                  style={{
                    width: `calc(128px - ${2 * profileIconBorderWidth}px)`,
                    height: `calc(128px - ${2 * profileIconBorderWidth}px)`,
                    borderRadius: `${profileIconBorderRadius}%`,
                  }}
                >
                  <AvatarImage 
                    src={selectedImage || user?.avatar} 
                    alt={user?.displayName || user?.handle}
                  />
                  <AvatarFallback className="text-2xl">
                    {(user?.displayName || user?.handle)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Avatar 
                className="w-32 h-32"
                style={{
                  borderWidth: profileIconBorderWidth > 0 ? `${profileIconBorderWidth}px` : undefined,
                  borderColor: profileIconBorderWidth > 0 ? profileIconBorderColor : undefined,
                  borderStyle: profileIconBorderWidth > 0 ? profileIconBorderStyle : undefined,
                  borderRadius: profileIconBorderRadius ? `${profileIconBorderRadius}%` : undefined,
                }}
              >
                <AvatarImage 
                  src={selectedImage || user?.avatar} 
                  alt={user?.displayName || user?.handle}
                />
                <AvatarFallback className="text-2xl">
                  {(user?.displayName || user?.handle)?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            
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

          {/* Profile Icon Border Styling */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Profile Icon Border Styling
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Border Width: {profileIconBorderWidth}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={profileIconBorderWidth}
                    onChange={(e) => setProfileIconBorderWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Border Radius: {profileIconBorderRadius}%</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={profileIconBorderRadius}
                    onChange={(e) => setProfileIconBorderRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              {profileIconBorderType === 'solid' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Border Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profileIconBorderColor}
                      onChange={(e) => setProfileIconBorderColor(e.target.value)}
                      className="h-10 w-16 p-0 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={profileIconBorderColor}
                      onChange={(e) => setProfileIconBorderColor(e.target.value)}
                      className="flex-1 px-2 py-2 border rounded"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Border Style</label>
                <select
                  value={profileIconBorderStyle}
                  onChange={(e) => setProfileIconBorderStyle(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Border Type</label>
                <select
                  value={profileIconBorderType}
                  onChange={(e) => setProfileIconBorderType(e.target.value as 'solid' | 'gradient' | 'animated-gradient')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient (3 Colors)</option>
                  <option value="animated-gradient">Animated Gradient</option>
                </select>
              </div>
              {profileIconBorderType === 'gradient' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium block">Gradient Colors (3 colors)</label>
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground w-16">Color {index + 1}:</label>
                      <input
                        type="color"
                        value={profileIconBorderGradientColors[index] || '#000000'}
                        onChange={(e) => {
                          const newColors = [...profileIconBorderGradientColors];
                          newColors[index] = e.target.value;
                          setProfileIconBorderGradientColors(newColors);
                        }}
                        className="h-10 w-16 p-0 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={profileIconBorderGradientColors[index] || '#000000'}
                        onChange={(e) => {
                          const newColors = [...profileIconBorderGradientColors];
                          newColors[index] = e.target.value;
                          setProfileIconBorderGradientColors(newColors);
                        }}
                        className="flex-1 px-2 py-2 border rounded"
                        placeholder="#000000"
                      />
                    </div>
                  ))}
                </div>
              )}
              {profileIconBorderType === 'animated-gradient' && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">Gradient Colors (3 colors)</label>
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground w-16">Color {index + 1}:</label>
                        <input
                          type="color"
                          value={profileIconBorderGradientColors[index] || '#000000'}
                          onChange={(e) => {
                            const newColors = [...profileIconBorderGradientColors];
                            newColors[index] = e.target.value;
                            setProfileIconBorderGradientColors(newColors);
                          }}
                          className="h-10 w-16 p-0 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={profileIconBorderGradientColors[index] || '#000000'}
                          onChange={(e) => {
                            const newColors = [...profileIconBorderGradientColors];
                            newColors[index] = e.target.value;
                            setProfileIconBorderGradientColors(newColors);
                          }}
                          className="flex-1 px-2 py-2 border rounded"
                          placeholder="#000000"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Animation Type</label>
                    <select
                      value={profileIconBorderAnimatedType}
                      onChange={(e) => setProfileIconBorderAnimatedType(e.target.value as 'rainbow' | 'pulse' | 'flow')}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="rainbow">Rainbow (Rotating)</option>
                      <option value="pulse">Pulse (Fade)</option>
                      <option value="flow">Flow (Directional)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4">
              <Button
                onClick={async () => {
                  if (settings) {
                    const updatedSettings = {
                      ...settings,
                      profileIconBorderWidth: profileIconBorderWidth,
                      profileIconBorderColor: profileIconBorderColor,
                      profileIconBorderStyle: profileIconBorderStyle as 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge',
                      profileIconBorderRadius: profileIconBorderRadius,
                      profileIconBorderType: profileIconBorderType,
                      profileIconBorderGradientColors: profileIconBorderGradientColors,
                      profileIconBorderAnimatedType: profileIconBorderAnimatedType,
                    } as any;
                    
                    saveSettings(updatedSettings, {
                      onSuccess: () => {
                        toast({
                          title: 'Border settings saved!',
                          description: 'Your profile icon border settings have been saved',
                        });
                      },
                      onError: () => {
                        toast({
                          title: 'Error',
                          description: 'Failed to save border settings',
                          variant: 'destructive',
                        });
                      },
                    });
                  }
                }}
                variant="outline"
                className="w-full"
                disabled={isUploading}
              >
                Save Border Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
