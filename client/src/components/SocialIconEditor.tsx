import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SocialLink } from '@shared/schema';
import { Edit, X, Eye, EyeOff } from 'lucide-react';
import { BrandIcons } from './BrandIcons';

interface SocialIconEditorProps {
  link: SocialLink;
  onUpdate: (updatedLink: SocialLink) => void;
  onRemove: (linkId: string) => void;
  onToggleEnabled: (linkId: string) => void;
}

const PLATFORM_ICONS: Record<string, { color: string; label: string }> = {
  twitter: { color: '#1DA1F2', label: 'Twitter / X' },
  instagram: { color: '#E4405F', label: 'Instagram' },
  facebook: { color: '#1877F2', label: 'Facebook' },
  linkedin: { color: '#0A66C2', label: 'LinkedIn' },
  youtube: { color: '#FF0000', label: 'YouTube' },
  tiktok: { color: '#000000', label: 'TikTok' },
  github: { color: '#181717', label: 'GitHub' },
  twitch: { color: '#9146FF', label: 'Twitch' },
  discord: { color: '#5865F2', label: 'Discord' },
  telegram: { color: '#26A5E4', label: 'Telegram' },
  whatsapp: { color: '#25D366', label: 'WhatsApp' },
  snapchat: { color: '#FFFC00', label: 'Snapchat' },
  reddit: { color: '#FF4500', label: 'Reddit' },
  pinterest: { color: '#E60023', label: 'Pinterest' },
  spotify: { color: '#1DB954', label: 'Spotify' },
  soundcloud: { color: '#FF3300', label: 'SoundCloud' },
  bandcamp: { color: '#629AA9', label: 'Bandcamp' },
  patreon: { color: '#FF424D', label: 'Patreon' },
  kofi: { color: '#FF5E5B', label: 'Ko-fi' },
  buymeacoffee: { color: '#FFDD00', label: 'Buy Me a Coffee' },
  venmo: { color: '#3D95CE', label: 'Venmo' },
  cashapp: { color: '#00C244', label: 'Cash App' },
  paypal: { color: '#00457C', label: 'PayPal' },
  email: { color: '#EA4335', label: 'Email' },
  website: { color: '#6366F1', label: 'Website' },
  custom: { color: '#6B7280', label: 'Link' },
};

export function SocialIconEditor({ link, onUpdate, onRemove, onToggleEnabled }: SocialIconEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    url: link.url,
    label: link.label || '',
    customColor: link.customColor || '',
    customBackgroundColor: link.customBackgroundColor || '',
  });

  const platformInfo = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom;
  const Icon = BrandIcons[link.platform as keyof typeof BrandIcons] || BrandIcons.custom;

  const handleSave = () => {
    const updatedLink: SocialLink = {
      ...link,
      url: editData.url,
      label: editData.label,
      customColor: editData.customColor || undefined,
      customBackgroundColor: editData.customBackgroundColor || undefined,
    };
    onUpdate(updatedLink);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      url: link.url,
      label: link.label || '',
      customColor: link.customColor || '',
      customBackgroundColor: link.customBackgroundColor || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="relative">
      <CardContent className="p-3">
        {/* Icon Preview */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: editData.customBackgroundColor || platformInfo.color + '15',
            }}
          >
            <Icon 
              className="w-5 h-5"
              style={{ color: editData.customColor || platformInfo.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium capitalize truncate">
              {link.platform}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {editData.url}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleEnabled(link.id)}
              className={`h-8 w-8 p-0 ${link.enabled ? 'text-green-600' : 'text-muted-foreground'}`}
              title={link.enabled ? 'Hide icon' : 'Show icon'}
            >
              {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
              title="Edit icon"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(link.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Remove icon"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <Label className="text-xs mb-1 block">URL</Label>
              <Input
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                placeholder="https://twitter.com/yourname"
                className="text-sm"
              />
            </div>

            {link.platform === 'custom' && (
              <div>
                <Label className="text-xs mb-1 block">Custom Label</Label>
                <Input
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="e.g., My Portfolio"
                  className="text-sm"
                />
              </div>
            )}

            {/* Per-icon color customization */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs mb-1 block">Icon Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={editData.customColor || platformInfo.color}
                    onChange={(e) => setEditData({ ...editData, customColor: e.target.value })}
                    className="h-8 w-16 p-0 cursor-pointer"
                  />
                  {editData.customColor && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditData({ ...editData, customColor: '' })}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-xs mb-1 block">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={editData.customBackgroundColor || platformInfo.color + '15'}
                    onChange={(e) => setEditData({ ...editData, customBackgroundColor: e.target.value })}
                    className="h-8 w-16 p-0 cursor-pointer"
                  />
                  {editData.customBackgroundColor && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditData({ ...editData, customBackgroundColor: '' })}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
