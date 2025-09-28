import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Edit, Settings, LogOut, Copy, Menu, X } from 'lucide-react';
import { ProfileHeader } from '../components/ProfileHeader';
import { Notes } from '../components/Notes';
import { LinksList } from '../components/LinksList';
import { Widgets } from '../components/Widgets';
import { SettingsModal } from '../components/SettingsModal';
import { DragDropProvider } from '../components/DragDropProvider';
import { useAuth } from '../contexts/AuthContext';
import { useEditMode } from '../components/EditModeProvider';
import { useLinks, useSaveLinks, useSettings, useSaveSettings } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { DropResult } from '@hello-pangea/dnd';

export default function Profile() {
  const { user, logout } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const { data: links = [] } = useLinks();
  const { mutate: saveLinks } = useSaveLinks();
  const { data: settings } = useSettings();
  const { mutate: saveSettings } = useSaveSettings();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'Successfully logged out of Basker',
      });
      setShowMobileMenu(false); // Close mobile menu
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const handleCopyProfileURL = async () => {
    if (!user?.handle) return;
    
    try {
      const profileURL = `${window.location.origin}/${user.handle}`;
      await navigator.clipboard.writeText(profileURL);
      toast({
        title: 'Profile URL copied!',
        description: 'Share your profile with others',
      });
      setShowMobileMenu(false); // Close mobile menu
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy profile URL',
        variant: 'destructive',
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle section reordering (from SettingsModal)
    if (result.destination.droppableId === 'section-order') {
      // This is handled by the SettingsModal's handleSectionOrderChange
      // We don't need to do anything here since the SettingsModal handles it
      return;
    }

    // Handle links reordering (from LinksList)
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
      updatedAt: new Date().toISOString(),
    }));

    saveLinks(updatedItems, {
      onSuccess: () => {
        toast({
          title: 'Links reordered',
          description: 'Your links have been reordered successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to reorder links',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
          <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <img 
                  src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                  alt="Basker"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                />
                <h1 className="text-lg sm:text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
              </Link>
              <span className="text-muted-foreground hidden lg:block">|</span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block" data-testid="text-user-handle">
                @{user?.handle}
              </span>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyProfileURL}
                className="flex items-center gap-2 text-sm px-3"
                data-testid="button-copy-url"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleEditMode}
                className="flex items-center gap-2 text-sm px-3"
                data-testid="button-edit-mode"
              >
                <Edit className="w-4 h-4" />
                {isEditMode ? 'Done' : 'Edit'}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="px-3"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="px-3"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden px-2"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-border bg-card">
              <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
                {/* User info */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">
                      {user?.handle?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">@{user?.handle}</div>
                    <div className="text-xs text-muted-foreground">Basker Profile</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyProfileURL}
                    className="w-full justify-start gap-3"
                    data-testid="button-copy-url-mobile"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Profile URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleEditMode();
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start gap-3"
                    data-testid="button-edit-mode-mobile"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditMode ? 'Exit Edit Mode' : 'Edit Profile'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowSettings(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start gap-3"
                    data-testid="button-settings-mobile"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <ProfileHeader />
          {(() => {
            const sectionOrder = settings?.sectionOrder || ['widgets', 'notes', 'links'];
            console.log('🔍 Current section order:', sectionOrder);
            console.log('🔍 Settings:', settings);
            return sectionOrder.map((section, index) => {
              const moveUp = () => {
                if (index === 0) return;
                const newOrder = [...sectionOrder];
                [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                console.log('🔍 Moving section up, new order:', newOrder);
                saveSettings({ ...settings, sectionOrder: newOrder }, {
                  onSuccess: () => {
                    toast({
                      title: 'Section reordered',
                      description: 'Your sections have been reordered successfully',
                    });
                  },
                  onError: () => {
                    toast({
                      title: 'Error',
                      description: 'Failed to reorder sections',
                      variant: 'destructive',
                    });
                  },
                });
              };
              
              const moveDown = () => {
                if (index === sectionOrder.length - 1) return;
                const newOrder = [...sectionOrder];
                [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                console.log('🔍 Moving section down, new order:', newOrder);
                saveSettings({ ...settings, sectionOrder: newOrder }, {
                  onSuccess: () => {
                    toast({
                      title: 'Section reordered',
                      description: 'Your sections have been reordered successfully',
                    });
                  },
                  onError: () => {
                    toast({
                      title: 'Error',
                      description: 'Failed to reorder sections',
                      variant: 'destructive',
                    });
                  },
                });
              };

              let sectionComponent;
              switch (section) {
                case 'widgets':
                  sectionComponent = <Widgets key="widgets" isEditMode={isEditMode} />;
                  break;
                case 'notes':
                  sectionComponent = <Notes key="notes" isEditMode={isEditMode} />;
                  break;
                case 'links':
                  sectionComponent = <LinksList key="links" isEditMode={isEditMode} />;
                  break;
                default:
                  sectionComponent = null;
              }

              return (
                <div key={section} className="relative">
                  {sectionComponent}
                  {isEditMode && (
                    <div className="absolute -left-12 top-4 flex flex-col gap-1">
                      <button
                        onClick={moveUp}
                        disabled={index === 0}
                        className="w-8 h-8 rounded-lg border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-white"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={moveDown}
                        disabled={index === sectionOrder.length - 1}
                        className="w-8 h-8 rounded-lg border-2 border-green-500 bg-green-500 hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-white"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              );
            });
          })()}

          {/* Footer */}
          <footer className="text-center py-8 border-t border-border" data-testid="footer">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <span className="text-sm">Powered by</span>
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-4 h-4 rounded-full"
              />
              <span className="text-sm">basker</span>
              <span className="text-sm text-muted-foreground">© 2025</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Create your own link-in-bio page with basker
            </p>
          </footer>
        </main>

            <SettingsModal 
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)} 
              onDragEnd={onDragEnd}
            />
      </div>
    </DragDropProvider>
  );
}
