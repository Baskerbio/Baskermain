import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SocialLink, SocialIconsConfig } from '@shared/schema';
import { Plus } from 'lucide-react';
import { SocialIconsRow } from './SocialIconsRow';
import { SocialIconsStylingMenu } from './SocialIconsStylingMenu';
import { useToast } from '@/hooks/use-toast';

interface SocialIconsEditorProps {
  socialLinks: SocialLink[];
  config?: SocialIconsConfig;
  onSave: (links: SocialLink[], config?: SocialIconsConfig) => void;
  onOpenSettings?: () => void;
}

export function SocialIconsEditor({ socialLinks, config, onSave, onOpenSettings }: SocialIconsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showStylingMenu, setShowStylingMenu] = useState(false);
  const [editingLinks, setEditingLinks] = useState<SocialLink[]>(socialLinks);
  const [editingConfig, setEditingConfig] = useState<SocialIconsConfig>(config || {
    enabled: true,
    placement: 'under-bio',
    style: 'default',
    size: 'medium',
  });
  const [newLink, setNewLink] = useState<Partial<SocialLink>>({
    platform: 'twitter',
    url: '',
    enabled: true,
  });
  const { toast } = useToast();

  // Sync with incoming props
  useEffect(() => {
    setEditingLinks(socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    if (config) {
      setEditingConfig(config);
    }
  }, [config]);

  const updateConfig = (updates: Partial<SocialIconsConfig>) => {
    const newConfig = { ...editingConfig, ...updates };
    setEditingConfig(newConfig);
    onSave(editingLinks, newConfig);
  };

  const handleAddLink = () => {
    if (!newLink.url) return;

    const link: SocialLink = {
      id: Date.now().toString(),
      platform: newLink.platform as any || 'twitter',
      url: newLink.url,
      label: newLink.label,
      order: editingLinks.length,
      enabled: true,
    };

    const updatedLinks = [...editingLinks, link];
    setEditingLinks(updatedLinks);
    onSave(updatedLinks, editingConfig);
    
    toast({
      title: 'Social link added!',
      description: `${newLink.platform} link has been added successfully`,
    });
    
    // Reset form
    setNewLink({
      platform: 'twitter',
      url: '',
      enabled: true,
    });
    setIsAdding(false);
  };

  const handleRemoveLink = (id: string) => {
    const updatedLinks = editingLinks.filter(link => link.id !== id);
    setEditingLinks(updatedLinks);
    onSave(updatedLinks, editingConfig);
    
    toast({
      title: 'Social link removed',
      description: 'The social link has been removed',
    });
  };

  const handleToggleEnabled = (id: string) => {
    const updatedLinks = editingLinks.map(link =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    );
    setEditingLinks(updatedLinks);
    onSave(updatedLinks, editingConfig);
  };

  return (
    <div className="mb-6">
      {/* Preview of current icons with edit button */}
      {editingLinks.length > 0 && (
        <div className="mb-4">
          <SocialIconsRow 
            socialLinks={editingLinks}
            config={editingConfig}
            isEditMode={true}
            onEditStyling={() => setShowStylingMenu(true)}
            onUpdateLink={(updatedLink) => {
              const updatedLinks = editingLinks.map(link =>
                link.id === updatedLink.id ? updatedLink : link
              );
              setEditingLinks(updatedLinks);
              onSave(updatedLinks, editingConfig);
            }}
            onRemoveLink={handleRemoveLink}
            onToggleEnabled={handleToggleEnabled}
          />
        </div>
      )}

      {/* Styling Menu */}
      {showStylingMenu && (
        <div className="mb-4">
          <SocialIconsStylingMenu
            config={editingConfig}
            onConfigChange={(newConfig) => {
              setEditingConfig(newConfig);
              onSave(editingLinks, newConfig);
            }}
            onClose={() => setShowStylingMenu(false)}
          />
        </div>
      )}


      {/* Add new link form */}
      {isAdding ? (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-2">Platform</Label>
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as any })}
                  className="w-full p-2 text-sm border border-border rounded-md bg-background"
                >
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="github">GitHub</option>
                  <option value="twitch">Twitch</option>
                  <option value="discord">Discord</option>
                  <option value="telegram">Telegram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="reddit">Reddit</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="spotify">Spotify</option>
                  <option value="soundcloud">SoundCloud</option>
                  <option value="bandcamp">Bandcamp</option>
                  <option value="patreon">Patreon</option>
                  <option value="kofi">Ko-fi</option>
                  <option value="buymeacoffee">Buy Me a Coffee</option>
                  <option value="venmo">Venmo</option>
                  <option value="cashapp">Cash App</option>
                  <option value="paypal">PayPal</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <Label className="text-sm mb-2">URL</Label>
                <Input
                  placeholder="https://twitter.com/yourname"
                  value={newLink.url || ''}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="text-sm"
                />
              </div>

              {newLink.platform === 'custom' && (
                <div>
                  <Label className="text-sm mb-2">Custom Label</Label>
                  <Input
                    placeholder="e.g., My Portfolio"
                    value={newLink.label || ''}
                    onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddLink}
                  disabled={!newLink.url}
                  className="flex-1"
                >
                  Add Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewLink({ platform: 'twitter', url: '', enabled: true });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
          disabled={editingLinks.length >= 8}
          className="flex items-center gap-2 w-full"
        >
          <Plus className="w-4 h-4" />
          {editingLinks.length === 0 ? 'Add Social Icons' : `Add More (${editingLinks.length}/8)`}
        </Button>
      )}

      {editingLinks.length >= 8 && !isAdding && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Maximum 8 social icons reached
        </p>
      )}

      {editingLinks.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Add social media links to display them in a beautiful icon row
        </p>
      )}
    </div>
  );
}

