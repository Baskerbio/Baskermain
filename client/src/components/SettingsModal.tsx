// path: src/components/SettingsModal.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings, useSaveSettings } from '../hooks/use-atprotocol';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Settings, Theme } from '@shared/schema';
import { ImportData } from './ImportData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDragEnd?: (result: any) => void;
  scrollToSection?: string; // Section ID to scroll to when opened
}

// Default values
const DEFAULT_SECTIONS: ('widgets' | 'notes' | 'links')[] = ['widgets', 'notes', 'links'];

// Theme definitions with comprehensive color options
const THEMES: Record<string, Theme> = {
  light: {
    name: 'light' as const,
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    cardBackground: '#f9fafb',
    cardText: '#1f2937',
    headingColor: '#111827',
    mutedTextColor: '#6b7280',
    borderColor: '#e5e7eb',
    fontFamily: 'Inter',
    layout: 'default',
  },
  dark: {
    name: 'dark' as const,
    primaryColor: '#8b5cf6',
    accentColor: '#22c55e',
    backgroundColor: '#0f0f14',
    textColor: '#fafafa',
    cardBackground: '#1a1a1f',
    cardText: '#fafafa',
    headingColor: '#ffffff',
    mutedTextColor: '#a1a1aa',
    borderColor: '#27272a',
    fontFamily: 'Inter',
    layout: 'default',
  },
  gradient: {
    name: 'gradient' as const,
    primaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    cardBackground: '#312e81',
    cardText: '#ffffff',
    headingColor: '#fae8ff',
    mutedTextColor: '#c4b5fd',
    borderColor: '#4c1d95',
    fontFamily: 'Inter',
    layout: 'default',
  },
  halloween: {
    name: 'halloween' as const,
    primaryColor: '#f97316',
    accentColor: '#ef4444',
    backgroundColor: '#0f0f0f',
    textColor: '#fbbf24',
    cardBackground: '#1c1c1c',
    cardText: '#fbbf24',
    headingColor: '#fb923c',
    mutedTextColor: '#a16207',
    borderColor: '#422006',
    fontFamily: 'Inter',
    layout: 'default',
  },
  christmas: {
    name: 'christmas' as const,
    primaryColor: '#dc2626',
    accentColor: '#16a34a',
    backgroundColor: '#1e293b',
    textColor: '#f8fafc',
    cardBackground: '#334155',
    cardText: '#f8fafc',
    headingColor: '#fecaca',
    mutedTextColor: '#cbd5e1',
    borderColor: '#475569',
    fontFamily: 'Inter',
    layout: 'default',
  },
  ocean: {
    name: 'ocean' as const,
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    backgroundColor: '#0f172a',
    textColor: '#e0f2fe',
    cardBackground: '#1e293b',
    cardText: '#e0f2fe',
    headingColor: '#bae6fd',
    mutedTextColor: '#7dd3fc',
    borderColor: '#334155',
    fontFamily: 'Inter',
    layout: 'default',
  },
  sunset: {
    name: 'sunset' as const,
    primaryColor: '#f59e0b',
    accentColor: '#ef4444',
    backgroundColor: '#1c1917',
    textColor: '#fef3c7',
    cardBackground: '#292524',
    cardText: '#fef3c7',
    headingColor: '#fde68a',
    mutedTextColor: '#fcd34d',
    borderColor: '#44403c',
    fontFamily: 'Inter',
    layout: 'default',
  },
  forest: {
    name: 'forest' as const,
    primaryColor: '#22c55e',
    accentColor: '#84cc16',
    backgroundColor: '#0f1419',
    textColor: '#f0fdf4',
    cardBackground: '#1a2328',
    cardText: '#f0fdf4',
    headingColor: '#bbf7d0',
    mutedTextColor: '#86efac',
    borderColor: '#14532d',
    fontFamily: 'Inter',
    layout: 'default',
  },
  cosmic: {
    name: 'cosmic' as const,
    primaryColor: '#a855f7',
    accentColor: '#ec4899',
    backgroundColor: '#0f0b1f',
    textColor: '#f3f4f6',
    cardBackground: '#1e1535',
    cardText: '#f3f4f6',
    headingColor: '#e9d5ff',
    mutedTextColor: '#d8b4fe',
    borderColor: '#4c1d95',
    fontFamily: 'Inter',
    layout: 'default',
  },
  neon: {
    name: 'neon' as const,
    primaryColor: '#00ff88',
    accentColor: '#ff0080',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    cardBackground: '#0a0a0a',
    cardText: '#ffffff',
    headingColor: '#00ff88',
    mutedTextColor: '#cccccc',
    borderColor: '#00ff8844',
    fontFamily: 'Inter',
    layout: 'default',
  },
  vintage: {
    name: 'vintage' as const,
    primaryColor: '#b45309',
    accentColor: '#d97706',
    backgroundColor: '#fef3c7',
    textColor: '#451a03',
    cardBackground: '#fef9e7',
    cardText: '#451a03',
    headingColor: '#78350f',
    mutedTextColor: '#92400e',
    borderColor: '#fde047',
    fontFamily: 'Inter',
    layout: 'default',
  },
  minimal: {
    name: 'minimal' as const,
    primaryColor: '#374151',
    accentColor: '#6b7280',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    cardBackground: '#f9fafb',
    cardText: '#111827',
    headingColor: '#000000',
    mutedTextColor: '#9ca3af',
    borderColor: '#e5e7eb',
    fontFamily: 'Inter',
    layout: 'default',
  },
  retro: {
    name: 'retro' as const,
    primaryColor: '#ef4444',
    accentColor: '#3b82f6',
    backgroundColor: '#fef3c7',
    textColor: '#1f2937',
    cardBackground: '#fff7ed',
    cardText: '#1f2937',
    headingColor: '#dc2626',
    mutedTextColor: '#6b7280',
    borderColor: '#fed7aa',
    fontFamily: 'Inter',
    layout: 'default',
  },
  modern: {
    name: 'modern' as const,
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    cardBackground: '#1e293b',
    cardText: '#f1f5f9',
    headingColor: '#e0e7ff',
    mutedTextColor: '#cbd5e1',
    borderColor: '#334155',
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
  enableIconBorders: false,
  sectionOrder: DEFAULT_SECTIONS,
  socialLinks: [],
  socialIconsConfig: {
    enabled: false,
    placement: 'under-bio',
    style: 'default',
    size: 'medium',
  },
};

export function SettingsModal({ isOpen, onClose, onDragEnd, scrollToSection }: SettingsModalProps) {
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
    enableIconBorders: false,
    sectionOrder: DEFAULT_SECTIONS,
    socialLinks: [],
    socialIconsConfig: {
      enabled: false,
      placement: 'under-bio',
      style: 'default',
      size: 'medium',
    },
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
      // Ensure social links arrays exist
      socialLinks: (settings as any).socialLinks || [],
      socialIconsConfig: {
        enabled: false,
        placement: 'under-bio',
        style: 'default',
        size: 'medium',
        ...(settings as any).socialIconsConfig,
      },
    } as Settings;

    console.log('🔍 SettingsModal - Merged form data:', {
      socialLinks: mergedForm.socialLinks?.length,
      socialIconsConfig: mergedForm.socialIconsConfig,
    });

    setFormData(mergedForm);
  }, [settings]);

  // Scroll to section when modal opens
  useEffect(() => {
    if (isOpen && scrollToSection) {
      // Wait for modal to render
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [isOpen, scrollToSection]);

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
      // Explicitly include social links fields
      socialLinks: formData.socialLinks || [],
      socialIconsConfig: formData.socialIconsConfig || {
        enabled: false,
        placement: 'under-bio',
        style: 'default',
        size: 'medium',
      },
    } as Settings;

    console.log('💾 Saving settings to AT Protocol:', {
      socialLinks: saveData.socialLinks?.length,
      socialIconsConfig: saveData.socialIconsConfig,
      fullData: saveData,
    });

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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden" data-testid="settings-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Profile Settings
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Customize your Basker profile appearance, content, and privacy settings
          </p>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <TabsList className="flex flex-col lg:flex-col h-auto w-full lg:w-64 p-1 bg-muted/50">
                <TabsTrigger 
                  value="appearance" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Appearance</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Content</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Social Links</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Privacy & SEO</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span>Advanced</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
              <div className="h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-6">

                  {/* Appearance Tab */}
                  <TabsContent value="appearance" className="space-y-6" data-section="theme">
                    {/* Theme Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-3">Theme</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
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
                    className="block p-2 border-2 border-border peer-checked:border-primary rounded-lg cursor-pointer hover:border-muted-foreground transition-colors"
                    data-testid={`theme-${key}`}
                  >
                    <div 
                      className="rounded-md p-1.5 mb-1.5 h-12 flex flex-col justify-end"
                      style={{ backgroundColor: theme.backgroundColor }}
                    >
                      <div 
                        className="h-1.5 rounded mb-0.5" 
                        style={{ backgroundColor: theme.textColor }}
                      ></div>
                      <div 
                        className="h-0.5 rounded mb-0.5" 
                        style={{ backgroundColor: theme.primaryColor }}
                      ></div>
                      <div 
                        className="h-0.5 rounded" 
                        style={{ backgroundColor: theme.accentColor }}
                      ></div>
                    </div>
                    <p className="text-[10px] font-medium text-center capitalize">{key}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Color Customization */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Basic Colors</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.primaryColor || '#fbbf24'}
                    onChange={(e) => updateThemeProperty({ primaryColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                    data-testid="input-primary-color"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.primaryColor || '#fbbf24'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Accent Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.accentColor || '#22c55e'}
                    onChange={(e) => updateThemeProperty({ accentColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                    data-testid="input-accent-color"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.accentColor || '#22c55e'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Background Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.backgroundColor || '#0f0f14'}
                    onChange={(e) => updateThemeProperty({ backgroundColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                    data-testid="input-background-color"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.backgroundColor || '#0f0f14'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Text Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.textColor || '#fafafa'}
                    onChange={(e) => updateThemeProperty({ textColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                    data-testid="input-text-color"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.textColor || '#fafafa'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Color Customization */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Advanced Colors</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Card Background
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.cardBackground || '#1a1a1f'}
                    onChange={(e) => updateThemeProperty({ cardBackground: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.cardBackground || '#1a1a1f'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Card Text
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.cardText || '#fafafa'}
                    onChange={(e) => updateThemeProperty({ cardText: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.cardText || '#fafafa'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Heading Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.headingColor || '#ffffff'}
                    onChange={(e) => updateThemeProperty({ headingColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.headingColor || '#ffffff'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Muted Text Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.mutedTextColor || '#a1a1aa'}
                    onChange={(e) => updateThemeProperty({ mutedTextColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.mutedTextColor || '#a1a1aa'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Link Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.linkColor || formData.theme?.primaryColor || '#8b5cf6'}
                    onChange={(e) => updateThemeProperty({ linkColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.linkColor || formData.theme?.primaryColor || '#8b5cf6'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Link Hover Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.linkHoverColor || formData.theme?.accentColor || '#22c55e'}
                    onChange={(e) => updateThemeProperty({ linkHoverColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.linkHoverColor || formData.theme?.accentColor || '#22c55e'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Border Color
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.borderColor || '#27272a'}
                    onChange={(e) => updateThemeProperty({ borderColor: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.borderColor || '#27272a'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Button Background
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.buttonBackground || formData.theme?.primaryColor || '#8b5cf6'}
                    onChange={(e) => updateThemeProperty({ buttonBackground: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.buttonBackground || formData.theme?.primaryColor || '#8b5cf6'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Button Text
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.buttonText || '#ffffff'}
                    onChange={(e) => updateThemeProperty({ buttonText: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.buttonText || '#ffffff'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Input Background
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={formData.theme?.inputBackground || '#27272a'}
                    onChange={(e) => updateThemeProperty({ inputBackground: e.target.value })}
                    className="w-10 h-8 p-0 border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.theme?.inputBackground || '#27272a'}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const resetTheme: Theme = THEMES.dark;
                    setTheme(resetTheme);
                    setFormData(prev => ({ ...prev, theme: resetTheme }));
                    toast({
                      title: 'Theme reset!',
                      description: 'All colors reset to dark theme defaults',
                    });
                  }}
                  className="flex-1"
                >
                  Reset All Colors
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
                  </TabsContent>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-8" data-section="layout">
                    {/* Custom Profile */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Custom Profile</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Custom Bio
                          </Label>
                          <textarea
                            value={(formData as any).customBio || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, customBio: e.target.value } as any))}
                            placeholder="Write a custom bio for your Basker profile (overrides Bluesky bio)"
                            className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            maxLength={500}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(formData as any).customBio?.length || 0}/500 characters
                          </p>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Custom Avatar URL
                          </Label>
                          <Input
                            value={(formData as any).customAvatar || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, customAvatar: e.target.value } as any))}
                            placeholder="https://example.com/your-avatar.jpg"
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Custom avatar image URL (overrides Bluesky avatar)
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ 
                                ...prev, 
                                customBio: '', 
                                customAvatar: '' 
                              } as any));
                            }}
                            className="flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Resync with Bluesky
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Social Links Tab */}
                  <TabsContent value="social" className="space-y-8" data-section="social-icons">
                    {/* Social Icons Row */}
                    <div id="social-icons-section">
                      <h3 className="text-lg font-medium text-foreground mb-4">Social Icons Row</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-foreground">Enable Social Icons</Label>
                            <p className="text-xs text-muted-foreground">Display social media icons under your bio</p>
                          </div>
                          <Switch
                            checked={Boolean((formData as any).socialIconsConfig?.enabled || false)}
                            onCheckedChange={(checked) => setFormData(prev => ({
                              ...prev,
                              socialIconsConfig: {
                                ...(prev as any).socialIconsConfig,
                                enabled: checked,
                              }
                            } as any))}
                          />
                        </div>

                        {(formData as any).socialIconsConfig?.enabled && (
                          <>
                            {/* Icon Placement */}
                            <div>
                              <Label className="block text-sm font-medium text-foreground mb-2">
                                Placement
                              </Label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: 'under-bio', label: 'Under Bio' },
                                  { value: 'under-avatar', label: 'Under Avatar' },
                                  { value: 'above-sections', label: 'Above Sections' },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      socialIconsConfig: {
                                        ...(prev as any).socialIconsConfig,
                                        placement: option.value,
                                      }
                                    } as any))}
                                    className={`
                                      px-3 py-2 text-sm rounded-md border transition-colors
                                      ${(formData as any).socialIconsConfig?.placement === option.value
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-foreground border-border hover:bg-muted'
                                      }
                                    `}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Icon Style */}
                            <div>
                              <Label className="block text-sm font-medium text-foreground mb-2">
                                Icon Style
                              </Label>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  { value: 'default', label: 'Default' },
                                  { value: 'rounded', label: 'Rounded' },
                                  { value: 'square', label: 'Square' },
                                  { value: 'minimal', label: 'Minimal' },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      socialIconsConfig: {
                                        ...(prev as any).socialIconsConfig,
                                        style: option.value,
                                      }
                                    } as any))}
                                    className={`
                                      px-3 py-2 text-sm rounded-md border transition-colors
                                      ${(formData as any).socialIconsConfig?.style === option.value
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-foreground border-border hover:bg-muted'
                                      }
                                    `}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Icon Size */}
                            <div>
                              <Label className="block text-sm font-medium text-foreground mb-2">
                                Icon Size
                              </Label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: 'small', label: 'Small' },
                                  { value: 'medium', label: 'Medium' },
                                  { value: 'large', label: 'Large' },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      socialIconsConfig: {
                                        ...(prev as any).socialIconsConfig,
                                        size: option.value,
                                      }
                                    } as any))}
                                    className={`
                                      px-3 py-2 text-sm rounded-md border transition-colors
                                      ${(formData as any).socialIconsConfig?.size === option.value
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-foreground border-border hover:bg-muted'
                                      }
                                    `}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Custom Colors */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label className="block text-sm font-medium text-foreground mb-2">
                                  Background
                                </Label>
                                <Input
                                  type="color"
                                  value={(formData as any).socialIconsConfig?.backgroundColor || '#ffffff'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    socialIconsConfig: {
                                      ...(prev as any).socialIconsConfig,
                                      backgroundColor: e.target.value,
                                    }
                                  } as any))}
                                  className="w-full h-10 p-0 border cursor-pointer"
                                />
                              </div>
                              
                              <div>
                                <Label className="block text-sm font-medium text-foreground mb-2">
                                  Icon Color
                                </Label>
                                <Input
                                  type="color"
                                  value={(formData as any).socialIconsConfig?.iconColor || '#000000'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    socialIconsConfig: {
                                      ...(prev as any).socialIconsConfig,
                                      iconColor: e.target.value,
                                    }
                                  } as any))}
                                  className="w-full h-10 p-0 border cursor-pointer"
                                />
                              </div>
                              
                              <div>
                                <Label className="block text-sm font-medium text-foreground mb-2">
                                  Hover Color
                                </Label>
                                <Input
                                  type="color"
                                  value={(formData as any).socialIconsConfig?.hoverColor || '#6366f1'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    socialIconsConfig: {
                                      ...(prev as any).socialIconsConfig,
                                      hoverColor: e.target.value,
                                    }
                                  } as any))}
                                  className="w-full h-10 p-0 border cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Social Links Manager */}
                            <div className="border-t pt-4 mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-medium text-foreground">
                                  Social Links (Max 8)
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentLinks = (formData as any).socialLinks || [];
                                    if (currentLinks.length >= 8) {
                                      toast({
                                        title: 'Limit reached',
                                        description: 'You can add maximum 8 social links',
                                        variant: 'destructive',
                                      });
                                      return;
                                    }
                                    setFormData(prev => ({
                                      ...prev,
                                      socialLinks: [
                                        ...currentLinks,
                                        {
                                          id: Date.now().toString(),
                                          platform: 'twitter',
                                          url: '',
                                          order: currentLinks.length,
                                          enabled: true,
                                        }
                                      ]
                                    } as any));
                                  }}
                                  disabled={((formData as any).socialLinks || []).length >= 8}
                                >
                                  + Add Social Link
                                </Button>
                              </div>

                              <div className="space-y-3">
                                {((formData as any).socialLinks || []).map((link: any, index: number) => (
                                  <div key={link.id} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                                    <div className="flex-1 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label className="text-xs text-muted-foreground mb-1">Platform</Label>
                                          <select
                                            value={link.platform}
                                            onChange={(e) => {
                                              const newLinks = [...((formData as any).socialLinks || [])];
                                              newLinks[index] = { ...newLinks[index], platform: e.target.value };
                                              setFormData(prev => ({ ...prev, socialLinks: newLinks } as any));
                                            }}
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
                                        
                                        <div className="flex items-end gap-2">
                                          <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground mb-1">Enabled</Label>
                                            <Switch
                                              checked={link.enabled}
                                              onCheckedChange={(checked) => {
                                                const newLinks = [...((formData as any).socialLinks || [])];
                                                newLinks[index] = { ...newLinks[index], enabled: checked };
                                                setFormData(prev => ({ ...prev, socialLinks: newLinks } as any));
                                              }}
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const newLinks = ((formData as any).socialLinks || []).filter((_: any, i: number) => i !== index);
                                              setFormData(prev => ({ ...prev, socialLinks: newLinks } as any));
                                            }}
                                            className="text-destructive hover:text-destructive"
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <Input
                                        placeholder="https://..."
                                        value={link.url}
                                        onChange={(e) => {
                                          const newLinks = [...((formData as any).socialLinks || [])];
                                          newLinks[index] = { ...newLinks[index], url: e.target.value };
                                          setFormData(prev => ({ ...prev, socialLinks: newLinks } as any));
                                        }}
                                        className="text-sm"
                                      />
                                      
                                      {link.platform === 'custom' && (
                                        <Input
                                          placeholder="Custom label (optional)"
                                          value={link.label || ''}
                                          onChange={(e) => {
                                            const newLinks = [...((formData as any).socialLinks || [])];
                                            newLinks[index] = { ...newLinks[index], label: e.target.value };
                                            setFormData(prev => ({ ...prev, socialLinks: newLinks } as any));
                                          }}
                                          className="text-sm"
                                        />
                                      )}
                                    </div>
                                  </div>
                                ))}
                                
                                {((formData as any).socialLinks || []).length === 0 && (
                                  <div className="text-center py-6 text-sm text-muted-foreground">
                                    No social links added yet. Click "Add Social Link" to get started.
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Privacy & SEO Tab */}
                  <TabsContent value="privacy" className="space-y-8" data-section="analytics">
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
                            <Label className="text-sm font-medium text-foreground">Icon Borders</Label>
                            <p className="text-xs text-muted-foreground">Enable icon borders for new links by default</p>
                          </div>
                          <Switch
                            checked={Boolean((formData as any).enableIconBorders)}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableIconBorders: checked }))}
                            data-testid="switch-icon-borders"
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

                    {/* SEO Optimizer */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">SEO Optimizer</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Page Title
                          </Label>
                          <Input
                            value={(formData as any).seoTitle || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value } as any))}
                            placeholder="Your Name - Portfolio & Links"
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            The title that appears in search results (50-60 characters recommended)
                          </p>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Meta Description
                          </Label>
                          <textarea
                            value={(formData as any).seoDescription || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value } as any))}
                            placeholder="Discover my portfolio, latest projects, and connect with me through my curated links and content."
                            className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            maxLength={160}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {(formData as any).seoDescription?.length || 0}/160 characters
                          </p>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Keywords (comma-separated)
                          </Label>
                          <Input
                            value={(formData as any).seoKeywords?.join(', ') || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) 
                            } as any))}
                            placeholder="portfolio, web developer, designer, links"
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Keywords that describe your content and help with search discovery
                          </p>
                        </div>

                        <div>
                          <Label className="block text-sm font-medium text-foreground mb-2">
                            Social Media Image URL
                          </Label>
                          <Input
                            value={(formData as any).seoImage || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, seoImage: e.target.value } as any))}
                            placeholder="https://example.com/your-social-image.jpg"
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Image that appears when your page is shared on social media (1200x630px recommended)
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-2">
                              Author Name
                            </Label>
                            <Input
                              value={(formData as any).seoAuthor || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, seoAuthor: e.target.value } as any))}
                              placeholder="Your Name"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-2">
                              Site Name
                            </Label>
                            <Input
                              value={(formData as any).seoSiteName || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, seoSiteName: e.target.value } as any))}
                              placeholder="BaskerBio"
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-2">
                              Twitter Handle
                            </Label>
                            <Input
                              value={(formData as any).seoTwitterHandle || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, seoTwitterHandle: e.target.value } as any))}
                              placeholder="@yourusername"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label className="block text-sm font-medium text-foreground mb-2">
                              Facebook App ID
                            </Label>
                            <Input
                              value={(formData as any).seoFacebookAppId || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, seoFacebookAppId: e.target.value } as any))}
                              placeholder="123456789012345"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    </TabsContent>

                    {/* Advanced Tab */}
                    <TabsContent value="advanced" className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">Advanced Settings</h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">Import/Export Data</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Import settings from other platforms or export your current configuration
                            </p>
                            <ImportData />
                          </div>
                          
                          <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">Reset Settings</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Reset all settings to default values
                            </p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const resetTheme: Theme = THEMES.dark;
                                  setTheme(resetTheme);
                                  setFormData(prev => ({ ...prev, theme: resetTheme }));
                                  toast({
                                    title: 'Theme reset!',
                                    description: 'All colors reset to dark theme defaults',
                                  });
                                }}
                                className="flex items-center gap-2"
                              >
                                Reset Theme
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  localStorage.removeItem('basker_theme');
                                  window.location.reload();
                                }}
                                className="flex items-center gap-2"
                              >
                                Clear Cache & Reload
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
        
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
