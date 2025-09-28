// path: src/components/SettingsModal.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings, useSaveSettings } from '../hooks/use-atprotocol';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, Theme } from '@shared/schema';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDragEnd?: (result: any) => void;
}

// Default values
const DEFAULT_SECTIONS: ('widgets' | 'notes' | 'links')[] = ['widgets', 'notes', 'links'];

// Theme definitions
const THEMES: Record<string, Theme> = {
  light: {
    name: 'light' as const,
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    layout: 'default',
  },
  dark: {
    name: 'dark' as const,
    primaryColor: '#8b5cf6',
    accentColor: '#22c55e',
    backgroundColor: '#0f0f14',
    textColor: '#fafafa',
    fontFamily: 'Inter',
    layout: 'default',
  },
  gradient: {
    name: 'gradient' as const,
    primaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    fontFamily: 'Inter',
    layout: 'default',
  },
  halloween: {
    name: 'halloween' as const,
    primaryColor: '#f97316',
    accentColor: '#ef4444',
    backgroundColor: '#0f0f0f',
    textColor: '#fbbf24',
    fontFamily: 'Inter',
    layout: 'default',
  },
  christmas: {
    name: 'christmas' as const,
    primaryColor: '#dc2626',
    accentColor: '#16a34a',
    backgroundColor: '#1e293b',
    textColor: '#f8fafc',
    fontFamily: 'Inter',
    layout: 'default',
  },
  ocean: {
    name: 'ocean' as const,
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    backgroundColor: '#0f172a',
    textColor: '#e0f2fe',
    fontFamily: 'Inter',
    layout: 'default',
  },
  sunset: {
    name: 'sunset' as const,
    primaryColor: '#f59e0b',
    accentColor: '#ef4444',
    backgroundColor: '#1c1917',
    textColor: '#fef3c7',
    fontFamily: 'Inter',
    layout: 'default',
  },
  forest: {
    name: 'forest' as const,
    primaryColor: '#22c55e',
    accentColor: '#84cc16',
    backgroundColor: '#0f1419',
    textColor: '#f0fdf4',
    fontFamily: 'Inter',
    layout: 'default',
  },
  cosmic: {
    name: 'cosmic' as const,
    primaryColor: '#a855f7',
    accentColor: '#ec4899',
    backgroundColor: '#0f0b1f',
    textColor: '#f3f4f6',
    fontFamily: 'Inter',
    layout: 'default',
  },
  neon: {
    name: 'neon' as const,
    primaryColor: '#00ff88',
    accentColor: '#ff0080',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontFamily: 'Inter',
    layout: 'default',
  },
  vintage: {
    name: 'vintage' as const,
    primaryColor: '#b45309',
    accentColor: '#d97706',
    backgroundColor: '#fef3c7',
    textColor: '#451a03',
    fontFamily: 'Inter',
    layout: 'default',
  },
  minimal: {
    name: 'minimal' as const,
    primaryColor: '#374151',
    accentColor: '#6b7280',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    fontFamily: 'Inter',
    layout: 'default',
  },
  retro: {
    name: 'retro' as const,
    primaryColor: '#ef4444',
    accentColor: '#3b82f6',
    backgroundColor: '#fef3c7',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    layout: 'default',
  },
  modern: {
    name: 'modern' as const,
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    fontFamily: 'Inter',
    layout: 'default',
  },
};

const DEFAULT_THEME: Partial<Theme> = THEMES.dark;

const DEFAULT_FORM_DATA: Partial<Settings> = {
  theme: DEFAULT_THEME as Theme,
  showStories: true,
  showNotes: true,
  isPublic: true,
  enableAnalytics: true,
  sectionOrder: DEFAULT_SECTIONS,
};

export function SettingsModal({ isOpen, onClose, onDragEnd }: SettingsModalProps) {
  const { data: settings } = useSettings();
  const { mutate: saveSettings } = useSaveSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Settings>(() => ({
    // cast because Settings type comes from shared schema; ensure required fields exist
    theme: DEFAULT_THEME as Theme,
    showStories: true,
    showNotes: true,
    isPublic: true,
    enableAnalytics: true,
    sectionOrder: DEFAULT_SECTIONS,
  } as Settings));

  // Merge settings from backend with defaults so we never lose sections or theme fields
  useEffect(() => {
    if (!settings) return;

    console.log('🔍 SettingsModal - Loading settings:', settings);

    const loadedOrder = Array.isArray((settings as any).sectionOrder) ? (settings as any).sectionOrder : [];
    const mergedOrder = [
      ...loadedOrder,
      ...DEFAULT_SECTIONS.filter(s => !loadedOrder.includes(s)),
    ] as ('widgets' | 'notes' | 'links')[];

    const mergedTheme = {
      ...(DEFAULT_THEME || {}),
      ...(settings.theme || {}),
    } as Theme;

    // Merge top-level defaults too
    const mergedForm = {
      ...(DEFAULT_FORM_DATA as object),
      ...(settings as object),
      theme: mergedTheme,
      sectionOrder: mergedOrder,
    } as Settings;

    setFormData(mergedForm);
  }, [settings]);

  console.log('🔍 SettingsModal - formData:', formData);
  console.log('🔍 SettingsModal - sectionOrder:', formData.sectionOrder);
  console.log('🔍 SettingsModal - sectionOrder length:', formData.sectionOrder?.length);

  const handleSave = () => {
    // make sure we don't drop default sections on save
    const mergedOrder = [
      ...(formData.sectionOrder || []),
      ...DEFAULT_SECTIONS.filter(s => !(formData.sectionOrder || []).includes(s)),
    ] as ('widgets' | 'notes' | 'links')[];

    const saveData = {
      ...formData,
      sectionOrder: mergedOrder,
    } as Settings;

    console.log('🔍 Saving settings:', saveData);

    saveSettings(saveData, {
      onSuccess: () => {
        // Update theme context
        if (saveData.theme) {
          setTheme(saveData.theme);
        }
        toast({
          title: 'Settings saved!',
          description: 'Your preferences have been updated',
        });
        onClose();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save settings',
          variant: 'destructive',
        });
      },
    });
  };


  const updateTheme = (themeName: string) => {
    const theme = THEMES[themeName as keyof typeof THEMES] || THEMES.dark;
    setFormData(prev => ({
      ...prev,
      theme: theme as Theme,
    }));
  };

  const updateThemeProperty = (updates: Partial<Theme>) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...(prev.theme || THEMES.dark),
        ...updates,
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto" data-testid="settings-modal">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 p-1">

          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Theme</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {Object.entries(THEMES).map(([key, theme]) => (
                <div key={key} className="relative">
                  <input
                    type="radio"
                    name="theme"
                    value={key}
                    id={`theme-${key}`}
                    className="sr-only peer"
                    checked={(formData.theme?.name || '') === key}
                    onChange={() => updateTheme(key)}
                  />
                  <label
                    htmlFor={`theme-${key}`}
                    className="block p-3 border-2 border-border peer-checked:border-primary rounded-lg cursor-pointer hover:border-muted-foreground transition-colors"
                    data-testid={`theme-${key}`}
                  >
                    <div 
                      className="rounded-md p-2 mb-2 h-16 flex flex-col justify-end"
                      style={{ backgroundColor: theme.backgroundColor }}
                    >
                      <div 
                        className="h-2 rounded mb-1" 
                        style={{ backgroundColor: theme.textColor }}
                      ></div>
                      <div 
                        className="h-1 rounded mb-1" 
                        style={{ backgroundColor: theme.primaryColor }}
                      ></div>
                      <div 
                        className="h-1 rounded" 
                        style={{ backgroundColor: theme.accentColor }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium text-center capitalize">{key}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Color Customization */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={formData.theme?.primaryColor || '#fbbf24'}
                    onChange={(e) => updateThemeProperty({ primaryColor: e.target.value })}
                    className="w-12 h-10 p-0 border cursor-pointer"
                    data-testid="input-primary-color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.theme?.primaryColor || '#fbbf24'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Accent Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={formData.theme?.accentColor || '#22c55e'}
                    onChange={(e) => updateThemeProperty({ accentColor: e.target.value })}
                    className="w-12 h-10 p-0 border cursor-pointer"
                    data-testid="input-accent-color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.theme?.accentColor || '#22c55e'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const resetTheme: Theme = {
                      name: 'dark' as const,
                      primaryColor: '#fbbf24',
                      accentColor: '#22c55e',
                      backgroundColor: '#0f0f14',
                      textColor: '#fafafa',
                      fontFamily: 'Inter',
                      layout: 'default',
                    };
                    setTheme(resetTheme);
                    setFormData(prev => ({ ...prev, theme: resetTheme }));
                    toast({
                      title: 'Theme reset!',
                      description: 'Colors reset to new yellow default',
                    });
                  }}
                  className="flex-1"
                >
                  Reset to Default
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('basker_theme');
                    window.location.reload();
                  }}
                  className="flex-1"
                >
                  Clear Cache & Reload
                </Button>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Background Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={formData.theme?.backgroundColor || '#0f0f14'}
                    onChange={(e) => updateThemeProperty({ backgroundColor: e.target.value })}
                    className="w-12 h-10 p-0 border cursor-pointer"
                    data-testid="input-background-color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.theme?.backgroundColor || '#0f0f14'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Text Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={formData.theme?.textColor || '#fafafa'}
                    onChange={(e) => updateThemeProperty({ textColor: e.target.value })}
                    className="w-12 h-10 p-0 border cursor-pointer"
                    data-testid="input-text-color"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.theme?.textColor || '#fafafa'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background & Layout */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Background & Layout</h3>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Background Image URL
                </Label>
                <Input
                  placeholder="https://example.com/background.jpg"
                  value={(formData.theme as any)?.backgroundImage || ''}
                  onChange={(e) => updateThemeProperty({ backgroundImage: e.target.value })}
                  data-testid="input-background-image"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Add a background image URL
                </p>

                {(formData.theme as any)?.backgroundImage && (
                  // lightweight preview
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(formData.theme as any).backgroundImage}
                    alt="Background preview"
                    className="mt-2 h-28 w-full object-cover rounded border"
                    onError={(e) => {
                      // hide broken image preview by clearing src
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Font Family
                </Label>
                <select
                  value={formData.theme?.fontFamily || 'Inter'}
                  onChange={(e) => updateThemeProperty({ fontFamily: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  data-testid="select-font-family"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Layout Style
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {['default', 'centered', 'minimal'].map((layout) => (
                    <div key={layout} className="relative">
                      <input
                        type="radio"
                        name="layout"
                        value={layout}
                        id={`layout-${layout}`}
                        className="sr-only peer"
                        checked={(formData.theme?.layout || '') === layout}
                        onChange={() => updateThemeProperty({ layout })}
                      />
                      <label
                        htmlFor={`layout-${layout}`}
                        className="block p-3 border-2 border-border peer-checked:border-primary rounded-lg cursor-pointer hover:border-muted-foreground transition-colors text-center"
                        data-testid={`layout-${layout}`}
                      >
                        <div className="text-sm font-medium capitalize">{layout}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Layout Settings */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Layout</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Show Stories</Label>
                  <p className="text-xs text-muted-foreground">Display temporary content at the top</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).showStories)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showStories: checked }))}
                  data-testid="switch-show-stories"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Show Notes</Label>
                  <p className="text-xs text-muted-foreground">Display quick notes section</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).showNotes)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showNotes: checked }))}
                  data-testid="switch-show-notes"
                />
              </div>
            </div>
          </div>
          

          {/* Privacy & Behavior Settings */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Privacy & Behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Public Profile</Label>
                  <p className="text-xs text-muted-foreground">Allow others to discover your basker page</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).isPublic)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  data-testid="switch-public-profile"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Analytics</Label>
                  <p className="text-xs text-muted-foreground">Track link clicks and page views</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).enableAnalytics)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableAnalytics: checked }))}
                  data-testid="switch-analytics"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Search Engine Indexing</Label>
                  <p className="text-xs text-muted-foreground">Allow search engines to index your page</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).allowIndexing || false)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowIndexing: checked } as any))}
                  data-testid="switch-allow-indexing"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Show Visit Count</Label>
                  <p className="text-xs text-muted-foreground">Display total page views to visitors</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).showViewCount || false)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showViewCount: checked } as any))}
                  data-testid="switch-show-view-count"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Link Click Tracking</Label>
                  <p className="text-xs text-muted-foreground">Track when visitors click your links</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).trackLinkClicks || false)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trackLinkClicks: checked } as any))}
                  data-testid="switch-track-link-clicks"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Custom Domain</Label>
                  <p className="text-xs text-muted-foreground">Use your own domain name</p>
                </div>
                <Switch
                  checked={Boolean((formData as any).enableCustomDomain || false)}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableCustomDomain: checked } as any))}
                  data-testid="switch-custom-domain"
                />
              </div>
              
              {(formData as any).enableCustomDomain && (
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    Custom Domain
                  </Label>
                  <Input
                    placeholder="yourdomain.com"
                    value={(formData as any).customDomain || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDomain: e.target.value } as any))}
                    data-testid="input-custom-domain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-6 border-t">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid="button-save-settings"
          >
            Save Changes
          </Button>
          <Button 
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-settings"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
