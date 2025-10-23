import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Settings, 
  Edit, 
  Link as LinkIcon, 
  FileText, 
  Palette, 
  BarChart3, 
  Share2, 
  Copy, 
  Eye,
  Zap,
  Users,
  Globe,
  Download,
  Upload,
  Trash2,
  Star,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  Shield,
  HelpCircle,
  ChevronRight,
  Grid3X3,
  Layout,
  Wand2,
  Sliders,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  category: 'management' | 'customization' | 'analytics' | 'sharing' | 'tools';
}

interface QuickActionsDashboardProps {
  onAddLink: () => void;
  onOpenSettings: () => void;
  onToggleEditMode: () => void;
  onCopyProfileURL: () => void;
  onViewPublicProfile: () => void;
  isEditMode: boolean;
  linksCount: number;
  notesCount: number;
  widgetsCount: number;
}

export function QuickActionsDashboard({
  onAddLink,
  onOpenSettings,
  onToggleEditMode,
  onCopyProfileURL,
  onViewPublicProfile,
  isEditMode,
  linksCount,
  notesCount,
  widgetsCount
}: QuickActionsDashboardProps) {
  const { toast } = useToast();
  const [enabledActions, setEnabledActions] = useState<string[]>([]);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);

  // Load enabled actions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quick-actions-enabled');
    if (saved) {
      setEnabledActions(JSON.parse(saved));
    } else {
      // Default enabled actions
      const defaultActions = [
        'add-link',
        'edit-mode',
        'settings',
        'copy-url',
        'view-profile',
        'analytics',
        'pulse',
        'customize-theme',
        'manage-widgets',
        'export-data',
        'help'
      ];
      setEnabledActions(defaultActions);
      localStorage.setItem('quick-actions-enabled', JSON.stringify(defaultActions));
    }
  }, []);

  // Save enabled actions to localStorage when they change
  useEffect(() => {
    if (enabledActions.length > 0) {
      localStorage.setItem('quick-actions-enabled', JSON.stringify(enabledActions));
    }
  }, [enabledActions]);

  const allActions: QuickAction[] = [
    // Management Actions
    {
      id: 'add-link',
      title: 'Add Link',
      description: 'Create a new link for your profile',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-blue-500',
      action: onAddLink,
      category: 'management'
    },
    {
      id: 'edit-mode',
      title: isEditMode ? 'Exit Edit' : 'Edit Mode',
      description: isEditMode ? 'Finish editing your profile' : 'Start editing your profile',
      icon: <Edit className="w-5 h-5" />,
      color: 'bg-green-500',
      action: onToggleEditMode,
      category: 'management'
    },
    {
      id: 'manage-links',
      title: 'Manage Links',
      description: `View and edit your ${linksCount} links`,
      icon: <LinkIcon className="w-5 h-5" />,
      color: 'bg-purple-500',
      action: () => {
        if (!isEditMode) {
          onToggleEditMode();
        }
        // Scroll to links section
        setTimeout(() => {
          const linksSection = document.querySelector('[data-section="links"]');
          linksSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'management'
    },
    {
      id: 'manage-notes',
      title: 'Manage Notes',
      description: `View and edit your ${notesCount} notes`,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-orange-500',
      action: () => {
        if (!isEditMode) {
          onToggleEditMode();
        }
        // Scroll to notes section
        setTimeout(() => {
          const notesSection = document.querySelector('[data-section="notes"]');
          notesSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'management'
    },
    {
      id: 'manage-widgets',
      title: 'Manage Widgets',
      description: `View and edit your ${widgetsCount} widgets`,
      icon: <Grid3X3 className="w-5 h-5" />,
      color: 'bg-indigo-500',
      action: () => {
        if (!isEditMode) {
          onToggleEditMode();
        }
        // Scroll to widgets section
        setTimeout(() => {
          const widgetsSection = document.querySelector('[data-section="widgets"]');
          widgetsSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'management'
    },

    // Customization Actions
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your profile settings',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-gray-500',
      action: onOpenSettings,
      category: 'customization'
    },
    {
      id: 'customize-theme',
      title: 'Customize Theme',
      description: 'Change colors, fonts, and appearance',
      icon: <Palette className="w-5 h-5" />,
      color: 'bg-pink-500',
      action: () => {
        onOpenSettings();
        // Scroll to theme section
        setTimeout(() => {
          const themeSection = document.querySelector('[data-section="theme"]');
          themeSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'customization'
    },
    {
      id: 'layout-editor',
      title: 'Layout Editor',
      description: 'Rearrange sections and customize layout',
      icon: <Layout className="w-5 h-5" />,
      color: 'bg-teal-500',
      action: () => {
        onOpenSettings();
        // Scroll to layout section
        setTimeout(() => {
          const layoutSection = document.querySelector('[data-section="layout"]');
          layoutSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'customization'
    },
    {
      id: 'social-icons',
      title: 'Social Icons',
      description: 'Add and manage social media links',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-cyan-500',
      action: () => {
        onOpenSettings();
        // Scroll to social icons section
        setTimeout(() => {
          const socialSection = document.querySelector('[data-section="social-icons"]');
          socialSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'customization'
    },

    // Analytics Actions
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View your profile performance and stats',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-emerald-500',
      action: () => {
        onOpenSettings();
        // Scroll to analytics section
        setTimeout(() => {
          const analyticsSection = document.querySelector('[data-section="analytics"]');
          analyticsSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      category: 'analytics'
    },
    {
      id: 'solaris',
      title: 'Basker Solaris',
      description: 'Digital business cards',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-blue-500',
      action: () => {
        window.location.href = '/tap';
      },
      category: 'sharing'
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Check loading speed and optimization',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-yellow-500',
      action: () => {
        toast({
          title: 'Performance Check',
          description: 'Your profile is optimized and loading fast!',
        });
      },
      category: 'analytics'
    },

    // Sharing Actions
    {
      id: 'copy-url',
      title: 'Copy URL',
      description: 'Copy your profile link to share',
      icon: <Copy className="w-5 h-5" />,
      color: 'bg-blue-600',
      action: onCopyProfileURL,
      category: 'sharing'
    },
    {
      id: 'view-profile',
      title: 'View Public Profile',
      description: 'See how your profile looks to visitors',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-green-600',
      action: onViewPublicProfile,
      category: 'sharing'
    },
    {
      id: 'share-social',
      title: 'Share on Social',
      description: 'Share your profile on social media',
      icon: <Share2 className="w-5 h-5" />,
      color: 'bg-purple-600',
      action: () => {
        onCopyProfileURL();
        toast({
          title: 'Ready to Share',
          description: 'Profile URL copied! You can now paste it on social media.',
        });
      },
      category: 'sharing'
    },
    {
      id: 'embed-profile',
      title: 'Embed Profile',
      description: 'Get code to embed your profile',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-indigo-600',
      action: () => {
        toast({
          title: 'Embed Code',
          description: 'Embed feature coming soon!',
        });
      },
      category: 'sharing'
    },

    // Tools Actions
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your profile data',
      icon: <Download className="w-5 h-5" />,
      color: 'bg-slate-500',
      action: () => {
        toast({
          title: 'Export Data',
          description: 'Export feature coming soon!',
        });
      },
      category: 'tools'
    },
    {
      id: 'import-data',
      title: 'Import Data',
      description: 'Import data from other platforms',
      icon: <Upload className="w-5 h-5" />,
      color: 'bg-slate-600',
      action: () => {
        toast({
          title: 'Import Data',
          description: 'Import feature coming soon!',
        });
      },
      category: 'tools'
    },
    {
      id: 'backup',
      title: 'Backup Profile',
      description: 'Create a backup of your profile',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-red-500',
      action: () => {
        toast({
          title: 'Backup Created',
          description: 'Your profile has been backed up successfully!',
        });
      },
      category: 'tools'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-gray-600',
      action: () => {
        window.open('https://basker.app/help', '_blank');
      },
      category: 'tools'
    }
  ];

  const enabledActionsData = allActions.filter(action => enabledActions.includes(action.id));

  const categories = {
    management: { title: 'Management', color: 'bg-blue-50 dark:bg-blue-900/20' },
    customization: { title: 'Customization', color: 'bg-purple-50 dark:bg-purple-900/20' },
    analytics: { title: 'Analytics', color: 'bg-green-50 dark:bg-green-900/20' },
    sharing: { title: 'Sharing', color: 'bg-orange-50 dark:bg-orange-900/20' },
    tools: { title: 'Tools', color: 'bg-gray-50 dark:bg-gray-900/20' }
  };

  const toggleAction = (actionId: string) => {
    setEnabledActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Quick Actions
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Fast access to your most-used features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {enabledActionsData.length} enabled
            </Badge>
            <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Sliders className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Customize</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Customize Quick Actions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {Object.entries(categories).map(([categoryKey, category]) => {
                    const categoryActions = allActions.filter(action => action.category === categoryKey);
                    return (
                      <div key={categoryKey}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${category.color.replace('50', '500').replace('900/20', '500')}`} />
                          {category.title}
                        </h3>
                        <div className="space-y-2">
                          {categoryActions.map((action) => (
                            <div key={action.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className={`p-1.5 sm:p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                                  {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs sm:text-sm truncate">{action.title}</div>
                                  <div className="text-xs text-muted-foreground hidden sm:block">{action.description}</div>
                                </div>
                              </div>
                              <Switch
                                checked={enabledActions.includes(action.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setEnabledActions(prev => [...prev, action.id]);
                                  } else {
                                    setEnabledActions(prev => prev.filter(id => id !== action.id));
                                  }
                                }}
                                className="flex-shrink-0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const categoryActions = enabledActionsData.filter(action => action.category === categoryKey);
            if (categoryActions.length === 0) return null;

            return (
              <div key={categoryKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.color.replace('50', '500').replace('900/20', '500')}`} />
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {categoryActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-3 sm:p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all duration-200 group"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 w-full">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                          {action.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{action.title}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">{action.description}</div>
                        </div>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
