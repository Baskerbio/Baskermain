import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialIconsConfig } from '@shared/schema';
import { Palette } from 'lucide-react';

interface SocialIconsStylingMenuProps {
  config?: SocialIconsConfig;
  onConfigChange: (config: SocialIconsConfig) => void;
  onClose?: () => void;
}

export function SocialIconsStylingMenu({ config, onConfigChange, onClose }: SocialIconsStylingMenuProps) {
  
  const defaultConfig: SocialIconsConfig = {
    enabled: true,
    placement: 'under-bio',
    style: 'default',
    size: 'medium',
  };

  const activeConfig = { ...defaultConfig, ...config };

  const updateConfig = (updates: Partial<SocialIconsConfig>) => {
    const newConfig = { ...activeConfig, ...updates };
    onConfigChange(newConfig);
  };

  return (
    <Card className="w-full shadow-lg">
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
                        ${activeConfig.placement === option.value
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
                        ${activeConfig.style === option.value
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
                        ${activeConfig.size === option.value
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
                      value={activeConfig.backgroundColor || '#ffffff'}
                      onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                      className="h-8 p-0 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Icon</Label>
                    <Input
                      type="color"
                      value={activeConfig.iconColor || '#000000'}
                      onChange={(e) => updateConfig({ iconColor: e.target.value })}
                      className="h-8 p-0 cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Hover</Label>
                    <Input
                      type="color"
                      value={activeConfig.hoverColor || '#6366f1'}
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
                    <Label className="text-xs mb-1 block">Border Width: {activeConfig.borderWidth || 0}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={activeConfig.borderWidth || 0}
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
                        value={activeConfig.borderColor || '#000000'}
                        onChange={(e) => updateConfig({ borderColor: e.target.value })}
                        className="h-8 p-0 cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Border Style</Label>
                      <Select 
                        value={activeConfig.borderStyle || 'solid'} 
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

        {/* Close Button */}
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
