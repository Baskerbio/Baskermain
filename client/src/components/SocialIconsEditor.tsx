import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialLink, SocialIconsConfig } from '@shared/schema';
import { Plus, X, GripVertical, Palette } from 'lucide-react';
import { SocialIconsRow } from './SocialIconsRow';
import { useToast } from '@/hooks/use-toast';

interface SocialIconsEditorProps {
  socialLinks: SocialLink[];
  config?: SocialIconsConfig;
  onSave: (links: SocialLink[], config?: SocialIconsConfig) => void;
  onOpenSettings?: () => void;
}

export function SocialIconsEditor({ socialLinks, config, onSave, onOpenSettings }: SocialIconsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
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
      {/* Preview of current icons - always show as clean icon row */}
      {editingLinks.length > 0 && (
        <div className="mb-4">
          <SocialIconsRow 
            socialLinks={editingLinks}
            config={editingConfig}
            isEditMode={false}
          />
        </div>
      )}

      {/* Style Options - Always Visible with Clear Header */}
      {editingLinks.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Social Icons Styling
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize the appearance of your social media icons
              </p>
            </div>

            <div className="space-y-4">
                {/* Placement */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Placement</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'under-bio', label: 'Under Bio' },
                      { value: 'under-avatar', label: 'Under Avatar' },
                      { value: 'above-sections', label: 'Above Content' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateConfig({ placement: option.value as any })}
                        className={`
                          px-2 py-1.5 text-xs rounded border transition-colors
                          ${editingConfig.placement === option.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-border'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Icon Style</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'rounded', label: 'Round' },
                      { value: 'square', label: 'Square' },
                      { value: 'minimal', label: 'Minimal' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateConfig({ style: option.value as any })}
                        className={`
                          px-2 py-1.5 text-xs rounded border transition-colors
                          ${editingConfig.style === option.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-border'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Icon Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateConfig({ size: option.value as any })}
                        className={`
                          px-2 py-1.5 text-xs rounded border transition-colors
                          ${editingConfig.size === option.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-border'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Colors (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs mb-1 block">Background</Label>
                      <Input
                        type="color"
                        value={editingConfig.backgroundColor || '#ffffff'}
                        onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                        className="h-8 p-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Icon</Label>
                      <Input
                        type="color"
                        value={editingConfig.iconColor || '#000000'}
                        onChange={(e) => updateConfig({ iconColor: e.target.value })}
                        className="h-8 p-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Hover</Label>
                      <Input
                        type="color"
                        value={editingConfig.hoverColor || '#6366f1'}
                        onChange={(e) => updateConfig({ hoverColor: e.target.value })}
                        className="h-8 p-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateConfig({ 
                      backgroundColor: undefined, 
                      iconColor: undefined, 
                      hoverColor: undefined 
                    })}
                    className="text-xs mt-2 h-7"
                  >
                    Reset to Default Colors
                  </Button>
                </div>

                {/* Border Styling */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-sm font-medium mb-3 block">Border Styling</Label>
                  
                  <div className="space-y-3">
                    {/* Border Width */}
                    <div>
                      <Label className="text-xs mb-1 block">Border Width: {editingConfig.borderWidth || 0}px</Label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={editingConfig.borderWidth || 0}
                        onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Border Color and Style */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Border Color</Label>
                        <Input
                          type="color"
                          value={editingConfig.borderColor || '#000000'}
                          onChange={(e) => updateConfig({ borderColor: e.target.value })}
                          className="h-8 p-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Border Style</Label>
                        <Select 
                          value={editingConfig.borderStyle || 'solid'} 
                          onValueChange={(value: any) => updateConfig({ borderStyle: value })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="dashed">Dashed</SelectItem>
                            <SelectItem value="dotted">Dotted</SelectItem>
                            <SelectItem value="double">Double</SelectItem>
                            <SelectItem value="groove">Groove</SelectItem>
                            <SelectItem value="ridge">Ridge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateConfig({ 
                        borderWidth: undefined,
                        borderColor: undefined, 
                        borderStyle: undefined
                      })}
                      className="text-xs h-7"
                    >
                      Reset Border Styling
                    </Button>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
      )}

      {/* List of social links for editing */}
      {editingLinks.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              {editingLinks.map((link) => (
                <div 
                  key={link.id} 
                  className="p-3 rounded-md border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize truncate">
                        {link.platform}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleEnabled(link.id)}
                      className={`text-xs ${link.enabled ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      {link.enabled ? 'Visible' : 'Hidden'}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Per-icon color customization */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t">
                    <div>
                      <Label className="text-xs mb-1 block">Icon Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={link.customColor || '#000000'}
                          onChange={(e) => {
                            const updatedLinks = editingLinks.map(l =>
                              l.id === link.id ? { ...l, customColor: e.target.value } : l
                            );
                            setEditingLinks(updatedLinks);
                            onSave(updatedLinks, editingConfig);
                          }}
                          className="h-8 w-16 p-0 cursor-pointer"
                        />
                        {link.customColor && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedLinks = editingLinks.map(l =>
                                l.id === link.id ? { ...l, customColor: undefined } : l
                              );
                              setEditingLinks(updatedLinks);
                              onSave(updatedLinks, editingConfig);
                            }}
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
                          value={link.customBackgroundColor || '#ffffff'}
                          onChange={(e) => {
                            const updatedLinks = editingLinks.map(l =>
                              l.id === link.id ? { ...l, customBackgroundColor: e.target.value } : l
                            );
                            setEditingLinks(updatedLinks);
                            onSave(updatedLinks, editingConfig);
                          }}
                          className="h-8 w-16 p-0 cursor-pointer"
                        />
                        {link.customBackgroundColor && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedLinks = editingLinks.map(l =>
                                l.id === link.id ? { ...l, customBackgroundColor: undefined } : l
                              );
                              setEditingLinks(updatedLinks);
                              onSave(updatedLinks, editingConfig);
                            }}
                            className="h-8 w-8 p-0 text-xs"
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

