import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useWidgets, useSaveWidgets } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Widget } from '@shared/schema';
import { PollWidget } from './widgets/PollWidget';
import { LiveChatWidget } from './widgets/LiveChatWidget';
import { BlogPostsWidget } from './widgets/BlogPostsWidget';
import { HeatMapWidget } from './widgets/HeatMapWidget';
import PortfolioGalleryWidget from './widgets/PortfolioGalleryWidget';
import ProductShowcaseWidget from './widgets/ProductShowcaseWidget';
import { WorkHistoryWidget } from './WorkHistoryWidget';
import { Plus, Settings, Trash2, Clock, Code, Users, Cloud, Quote, TrendingUp, Calendar, Music, Heart, Mail, Youtube, Type, Image, BarChart3, Megaphone, X, CheckSquare, Timer, QrCode, Share2, Star, DollarSign, Bell, FileText, Maximize2, Minimize2, MessageCircle, ShoppingBag, Briefcase, ExternalLink } from 'lucide-react';

interface WidgetsProps {
  isEditMode: boolean;
}

const WIDGET_TYPES = [
  { value: 'clock', label: 'Clock', icon: Clock, description: 'Digital or analog clocks' },
  { value: 'custom_code', label: 'Custom Code', icon: Code, description: 'HTML/CSS/JavaScript code' },
  { value: 'social_badge', label: 'Social Badge', icon: Users, description: 'Social media follower counts' },
  { value: 'weather', label: 'Weather', icon: Cloud, description: 'Current weather display' },
  { value: 'quote', label: 'Quote', icon: Quote, description: 'Inspirational quotes' },
  { value: 'counter', label: 'Counter', icon: TrendingUp, description: 'Custom counters (visits, downloads)' },
  { value: 'progress_bar', label: 'Progress Bar', icon: TrendingUp, description: 'Progress bars for goals' },
  { value: 'calendar', label: 'Calendar', icon: Calendar, description: 'Mini calendar widget' },
  { value: 'music_player', label: 'Music Player', icon: Music, description: 'Spotify/Apple Music player' },
  { value: 'donation', label: 'Donation', icon: Heart, description: 'Donation links' },
  { value: 'contact_form', label: 'Contact Form', icon: Mail, description: 'Contact form widget' },
  { value: 'embed', label: 'Embed', icon: Youtube, description: 'YouTube, etc. embeds' },
  { value: 'text_block', label: 'Text Block', icon: Type, description: 'Rich text content' },
  { value: 'image_gallery', label: 'Image Gallery', icon: Image, description: 'Image carousel' },
  { value: 'stats', label: 'Stats', icon: BarChart3, description: 'Statistics display' },
  { value: 'announcement', label: 'Announcement', icon: Megaphone, description: 'Announcement banner' },
  { value: 'todo_list', label: 'Todo List', icon: CheckSquare, description: 'Task checklist widget' },
  { value: 'countdown', label: 'Countdown', icon: Timer, description: 'Countdown timer to events' },
  { value: 'qr_code', label: 'QR Code', icon: QrCode, description: 'QR code generator' },
  { value: 'social_links', label: 'Social Links', icon: Share2, description: 'Social media links grid' },
  { value: 'testimonial', label: 'Testimonial', icon: Star, description: 'Customer testimonials' },
  { value: 'pricing_table', label: 'Pricing Table', icon: DollarSign, description: 'Pricing comparison table' },
  { value: 'newsletter', label: 'Newsletter', icon: Bell, description: 'Newsletter signup form' },
  { value: 'recent_posts', label: 'Recent Posts', icon: FileText, description: 'Recent blog posts feed' },
  { value: 'poll', label: 'Poll', icon: BarChart3, description: 'Interactive polls and surveys' },
  { value: 'live_chat', label: 'Live Chat', icon: Users, description: 'Real-time chat widget' },
  { value: 'blog_posts', label: 'Blog Posts', icon: FileText, description: 'Blog posts display' },
  { value: 'heat_map', label: 'Heat Map', icon: TrendingUp, description: 'Click analytics and heat maps' },
  { value: 'portfolio_gallery', label: 'Portfolio Gallery', icon: Image, description: 'Showcase your work with images' },
  { value: 'product_showcase', label: 'Product Showcase', icon: ShoppingBag, description: 'Display and sell products (Coming Soon)' },
  { value: 'work_history', label: 'Work History', icon: Briefcase, description: 'Professional work experience and employment history' },
];

export function Widgets({ isEditMode }: WidgetsProps) {
  const { data: widgets = [] } = useWidgets();
  const { mutate: saveWidgets } = useSaveWidgets();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type: type as any,
      title: `New ${WIDGET_TYPES.find(t => t.value === type)?.label}`,
      enabled: true,
      order: widgets.length,
      size: 'default',
      width: 'full',
      config: getDefaultConfig(type),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedWidgets = [...widgets, newWidget];
    saveWidgets(updatedWidgets, {
      onSuccess: () => {
        toast({
          title: 'Widget added!',
          description: 'Your new widget has been added successfully',
        });
        setShowAddDialog(false);
      },
    });
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    const updatedWidgets = widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
    saveWidgets(updatedWidgets, {
      onSuccess: () => {
        toast({
          title: 'Widget updated!',
          description: 'Your widget has been updated successfully',
        });
        setEditingWidget(null);
      },
    });
  };

  const handleDeleteWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    saveWidgets(updatedWidgets, {
      onSuccess: () => {
        toast({
          title: 'Widget deleted!',
          description: 'Your widget has been deleted successfully',
        });
      },
    });
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-64'; // 256px
      case 'medium': return 'w-80'; // 320px
      case 'large': return 'w-96'; // 384px
      case 'full': return 'w-full';
      default: return 'w-full'; // Default to full width
    }
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'clock':
        return { format: '12h', timezone: 'local', style: 'digital' };
      case 'custom_code':
        return { html: '', css: '', js: '' };
      case 'social_badge':
        return { 
          platform: 'twitter', 
          username: '', 
          showCount: true,
          showIcon: true,
          customColor: '',
          backgroundColor: '',
          size: 'md',
          style: 'rounded',
          links: []
        };
      case 'weather':
        return { 
          location: '', 
          unit: 'celsius',
          apiKey: '',
          apiProvider: 'openweather',
          showDetails: true,
          showForecast: false,
          updateInterval: 15,
          theme: 'auto'
        };
      case 'quote':
        return { text: '', author: '', style: 'modern' };
      case 'counter':
        return { label: 'Visits', count: 0, target: 1000 };
      case 'progress_bar':
        return { label: 'Goal Progress', current: 0, target: 100, unit: '%' };
      case 'calendar':
        return { view: 'month', showEvents: true, events: [] };
      case 'music_player':
        return { platform: 'spotify', trackId: '' };
      case 'donation':
        return { platform: 'paypal', amount: '', message: '' };
      case 'contact_form':
        return { email: 'your@email.com', subject: 'Hello', message: 'Hi there!' };
      case 'embed':
        return { url: '', width: 560, height: 315 };
      case 'text_block':
        return { content: '', style: 'default' };
      case 'image_gallery':
        return { images: [], autoplay: true, interval: 3000 };
      case 'stats':
        return { metrics: [] };
      case 'announcement':
        return { message: '', type: 'info', dismissible: true };
      case 'todo_list':
        return { items: [], title: 'My Tasks' };
      case 'countdown':
        return { targetDate: '', title: 'Countdown', showDays: true, showHours: true, showMinutes: true };
      case 'qr_code':
        return { text: '', size: 200, title: 'QR Code' };
      case 'social_links':
        return { links: [], title: 'Follow Me' };
      case 'testimonial':
        return { text: '', author: '', role: '', avatar: '', rating: 5 };
      case 'pricing_table':
        return { plans: [], title: 'Pricing Plans' };
      case 'newsletter':
        return { title: 'Newsletter', description: 'Subscribe to our newsletter', placeholder: 'Enter your email' };
      case 'recent_posts':
        return { posts: [], title: 'Recent Posts', showCount: 3 };
      case 'poll':
        return { 
          id: `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          question: 'What do you think?', 
          options: [
            { id: 'opt1', text: 'Option 1', votes: 0 },
            { id: 'opt2', text: 'Option 2', votes: 0 }
          ], 
          allowMultiple: false, 
          isActive: true, 
          totalVotes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      case 'live_chat':
        return { 
          title: 'Live Chat', 
          isActive: true, 
          maxMessages: 50, 
          allowAnonymous: true 
        };
      case 'blog_posts':
        return { 
          title: 'Latest Posts', 
          showCount: 3, 
          showExcerpt: true, 
          showTags: true, 
          showDate: true, 
          showViews: true 
        };
      case 'heat_map':
        return { 
          title: 'Analytics', 
          showClicks: true, 
          showViews: true, 
          timeRange: '7d', 
          showTopElements: true 
        };
      case 'portfolio_gallery':
        return {
          title: 'Portfolio',
          showCategories: true,
          showTags: true,
          itemsPerRow: 3,
          showFeatured: true,
          enableLightbox: true
        };
      case 'product_showcase':
        return {
          title: 'Products',
          showPrices: true,
          showCategories: true,
          showStock: true,
          showRatings: true,
          showDiscounts: true,
          itemsPerRow: 3,
          layout: 'grid',
          sortBy: 'featured',
          sortOrder: 'desc',
          filterByCategory: true,
          showFilters: true,
          enableAffiliate: true,
          showPlatform: true,
          products: []
        };
      case 'work_history':
        return {
          title: 'Work History',
          showCompanyLogos: true,
          showEmploymentType: true
        };
      default:
        return {};
    }
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled) return null;

    const config = widget.config || {};
    
    switch (widget.type) {
      case 'clock':
        return <ClockWidget config={config} />;
      case 'custom_code':
        return <CustomCodeWidget config={config} />;
      case 'social_badge':
        return <SocialBadgeWidget config={config} />;
      case 'weather':
        return <WeatherWidget config={config} />;
      case 'quote':
        return <QuoteWidget config={config} />;
      case 'counter':
        return <CounterWidget config={config} />;
      case 'progress_bar':
        return <ProgressBarWidget config={config} />;
      case 'calendar':
        return <CalendarWidget config={config} />;
      case 'music_player':
        return <MusicPlayerWidget config={config} />;
      case 'donation':
        return <DonationWidget config={config} />;
      case 'contact_form':
        return <ContactFormWidget config={config} />;
      case 'embed':
        return <EmbedWidget config={config} />;
      case 'text_block':
        return <TextBlockWidget config={config} />;
      case 'image_gallery':
        return <ImageGalleryWidget config={config} />;
      case 'stats':
        return <StatsWidget config={config} />;
      case 'announcement':
        return <AnnouncementWidget config={config} />;
      case 'todo_list':
        return <TodoListWidget config={config} />;
      case 'countdown':
        return <CountdownWidget config={config} />;
      case 'qr_code':
        return <QRCodeWidget config={config} />;
      case 'social_links':
        return <SocialLinksWidget config={config} />;
      case 'testimonial':
        return <TestimonialWidget config={config} />;
      case 'pricing_table':
        return <PricingTableWidget config={config} />;
      case 'newsletter':
        return <NewsletterWidget config={config} />;
      case 'recent_posts':
        return <RecentPostsWidget config={config} />;
      case 'poll':
        return <PollWidget config={config} isEditMode={isEditMode} />;
      case 'live_chat':
        return <LiveChatWidget config={config} isEditMode={isEditMode} />;
      case 'blog_posts':
        return <BlogPostsWidget config={config} isEditMode={isEditMode} />;
      case 'heat_map':
        return <HeatMapWidget config={config} isEditMode={isEditMode} />;
      case 'portfolio_gallery':
        return <PortfolioGalleryWidget config={config} onConfigChange={(newConfig) => handleUpdateWidget({ ...widget, config: newConfig })} />;
      case 'product_showcase':
        return <ProductShowcaseWidget config={config} isEditMode={isEditMode} onConfigChange={(newConfig) => handleUpdateWidget({ ...widget, config: newConfig })} />;
      case 'work_history':
        return <WorkHistoryWidget />;
      default:
        return <div className="p-4 bg-muted rounded-lg">Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Widgets</h2>
        {isEditMode && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {WIDGET_TYPES.map((widgetType) => {
                  const Icon = widgetType.icon;
                  return (
                    <Card
                      key={widgetType.value}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleAddWidget(widgetType.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-medium">{widgetType.label}</h3>
                            <p className="text-sm text-muted-foreground">{widgetType.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {widgets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No widgets yet</p>
            {isEditMode && (
              <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Widget
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {widgets
            .filter(w => w.enabled)
            .sort((a, b) => a.order - b.order)
            .reduce((acc: Widget[], widget, index) => {
              // Group widgets for side-by-side layout
              if (widget.width === 'half' && index > 0 && widgets[index - 1]?.width === 'half') {
                // This widget should be paired with the previous one
                return acc;
              }
              
              if (widget.width === 'half' && index < widgets.length - 1 && widgets[index + 1]?.width === 'half') {
                // This widget should be paired with the next one
                acc.push(widget);
                return acc;
              }
              
              acc.push(widget);
              return acc;
            }, [])
            .map((widget, index) => {
              const nextWidget = widgets.find(w => w.order === widget.order + 1);
              const isSideBySide = widget.width === 'half' && nextWidget?.width === 'half';
              
              return (
                <div key={widget.id} className={`relative group ${isSideBySide ? 'flex flex-col md:flex-row gap-6' : ''}`}>
                  {/* First widget */}
                  <div className="relative group flex-1">
                    {isEditMode && (
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingWidget(widget)}
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className={`${getSizeClass(widget.size)} mx-auto h-full`}>
                      <Card className="w-full h-full flex flex-col">
                        <CardContent className="pt-8 flex-1">
                          {renderWidget(widget)}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Second widget (if side-by-side) */}
                  {isSideBySide && nextWidget && (
                    <div className="relative group flex-1">
                      {isEditMode && (
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingWidget(nextWidget)}
                            className="h-8 w-8 p-0"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteWidget(nextWidget.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className={`${getSizeClass(nextWidget.size)} mx-auto h-full`}>
                        <Card className="w-full h-full flex flex-col">
                          <CardContent className="pt-8 flex-1">
                            {renderWidget(nextWidget)}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {editingWidget && (
        <WidgetEditor
          widget={editingWidget}
          onSave={handleUpdateWidget}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </div>
  );
}

// Widget Components
function ClockWidget({ config }: { config: any }) {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (config.format === '24h') {
      return date.toLocaleTimeString('en-US', { hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour12: true });
  };

  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold text-primary">
        {formatTime(time)}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {time.toLocaleDateString()}
      </div>
    </div>
  );
}

function CustomCodeWidget({ config }: { config: any }) {
  return (
    <div className="space-y-2">
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: config.html || '<p>Add your custom HTML code in the widget settings.</p>' }}
      />
      {config.css && (
        <style dangerouslySetInnerHTML={{ __html: config.css }} />
      )}
      {config.js && (
        <script dangerouslySetInnerHTML={{ __html: config.js }} />
      )}
    </div>
  );
}

function SocialBadgeWidget({ config }: { config: any }) {
  const platformIcons = {
    twitter: '🐦',
    instagram: '📷',
    youtube: '📺',
    linkedin: '💼',
    github: '💻',
    facebook: '👥',
    tiktok: '🎵',
    discord: '💬',
    twitch: '🎮',
    spotify: '🎵',
    custom: '🔗'
  };

  const platformColors = {
    twitter: 'bg-blue-500',
    instagram: 'bg-pink-500',
    youtube: 'bg-red-500',
    linkedin: 'bg-blue-600',
    github: 'bg-gray-800',
    facebook: 'bg-blue-700',
    tiktok: 'bg-black',
    discord: 'bg-indigo-600',
    twitch: 'bg-purple-600',
    spotify: 'bg-green-500',
    custom: 'bg-gray-500'
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const styleClasses = {
    rounded: 'rounded-lg',
    square: 'rounded-none',
    pill: 'rounded-full'
  };

  return (
    <div className="space-y-2">
      {config.links && config.links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {config.links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[config.size as keyof typeof sizeClasses || 'md']} ${styleClasses[config.style as keyof typeof styleClasses || 'rounded']} flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer`}
              style={{
                backgroundColor: link.backgroundColor || platformColors[link.platform as keyof typeof platformColors]?.replace('bg-', '') + '20',
                color: link.customColor || 'inherit'
              }}
            >
              {config.showIcon && (
                <span className="text-lg">
                  {platformIcons[link.platform as keyof typeof platformIcons] || '🔗'}
                </span>
              )}
              <span className="font-medium">{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className={`w-8 h-8 ${platformColors[config.platform as keyof typeof platformColors] || 'bg-primary'} rounded-full flex items-center justify-center`}>
            <span className="text-white text-lg">
              {platformIcons[config.platform as keyof typeof platformIcons] || '🔗'}
            </span>
          </div>
          <div>
            <div className="font-medium">@{config.username || 'username'}</div>
            {config.showCount && (
              <div className="text-sm text-muted-foreground">
                {Math.floor(Math.random() * 10000)} followers
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherWidget({ config }: { config: any }) {
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌦️', '09n': '🌧️',
    '10d': '🌧️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };

  const fetchWeather = async () => {
    if (!config.location) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Use demo API key if none provided
      const apiKey = config.apiKey || 'demo';
      let apiUrl = '';

      switch (config.apiProvider) {
        case 'openweather':
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.location)}&appid=${apiKey}&units=${config.unit === 'celsius' ? 'metric' : 'imperial'}`;
          break;
        case 'weatherapi':
          apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(config.location)}`;
          break;
        case 'weatherbit':
          apiUrl = `https://api.weatherbit.io/v2.0/current?key=${apiKey}&city=${encodeURIComponent(config.location)}&units=${config.unit === 'celsius' ? 'M' : 'I'}`;
          break;
        default:
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.location)}&appid=${apiKey}&units=metric`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Weather API error');
      
      const data = await response.json();
      
      // Transform data based on API provider
      let transformedData;
      if (config.apiProvider === 'openweather') {
        transformedData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          feelsLike: Math.round(data.main.feels_like)
        };
      } else if (config.apiProvider === 'weatherapi') {
        transformedData = {
          location: data.location.name,
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          pressure: data.current.pressure_mb,
          feelsLike: Math.round(data.current.feelslike_c)
        };
      } else {
        transformedData = {
          location: data.data[0].city_name,
          temperature: Math.round(data.data[0].temp),
          condition: data.data[0].weather.description,
          icon: data.data[0].weather.icon,
          humidity: data.data[0].rh,
          windSpeed: data.data[0].wind_spd,
          pressure: data.data[0].pres,
          feelsLike: Math.round(data.data[0].app_temp)
        };
      }

      setWeatherData(transformedData);
    } catch (err) {
      setError('Weather data unavailable');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (config.location) {
      fetchWeather();
      // Auto-refresh based on interval
      const interval = setInterval(fetchWeather, (config.updateInterval || 15) * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [config.location, config.apiProvider, config.unit]);

  const getTemperatureUnit = () => {
    return config.unit === 'celsius' ? '°C' : config.unit === 'fahrenheit' ? '°F' : 'K';
  };

  if (!config.location) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <Cloud className="w-8 h-8 text-blue-500" />
        <div>
          <div className="font-medium">Weather</div>
          <div className="text-sm text-muted-foreground">Location not set</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        <div>
          <div className="font-medium">Loading weather...</div>
          <div className="text-sm text-muted-foreground">{config.location}</div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
        <Cloud className="w-8 h-8 text-red-500" />
        <div>
          <div className="font-medium">Weather unavailable</div>
          <div className="text-sm text-muted-foreground">{error || 'No data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {weatherIcons[weatherData.icon as keyof typeof weatherIcons] || '☁️'}
        </div>
        <div>
          <div className="font-medium">{weatherData.location}</div>
          <div className="text-sm text-muted-foreground capitalize">
            {weatherData.condition}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold">
            {weatherData.temperature}{getTemperatureUnit()}
          </div>
          <div className="text-xs text-muted-foreground">
            Feels like {weatherData.feelsLike}{getTemperatureUnit()}
          </div>
        </div>
      </div>

      {config.showDetails && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>💧</span>
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💨</span>
            <span>{weatherData.windSpeed} {config.unit === 'celsius' ? 'km/h' : 'mph'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>{weatherData.pressure} hPa</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔄</span>
            <span>Auto-refresh</span>
          </div>
        </div>
      )}
    </div>
  );
}

function QuoteWidget({ config }: { config: any }) {
  console.log('🔍 QuoteWidget - config:', config);
  console.log('🔍 QuoteWidget - config.text:', config?.text);
  return (
    <blockquote className="border-l-4 border-primary pl-4 italic">
      <p className="text-lg mb-2">
        "{config?.text || 'Your inspiring quote here'}"
      </p>
      {config?.author && (
        <cite className="text-sm text-muted-foreground">— {config.author}</cite>
      )}
    </blockquote>
  );
}

function CounterWidget({ config }: { config: any }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary mb-1">
        {config.count || 0}
      </div>
      <div className="text-sm text-muted-foreground">
        {config.label || 'Count'}
      </div>
    </div>
  );
}

function ProgressBarWidget({ config }: { config: any }) {
  const percentage = Math.min(((config.current || 0) / (config.target || 100)) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{config.label || 'Progress'}</span>
        <span>{config.current || 0}/{config.target || 100} {config.unit || ''}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CalendarWidget({ config }: { config: any }) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const events = config?.events || [];
  
  // Get the actual number of days in the current month
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  // Helper function to get events for a specific date
  const getEventsForDate = (day: number) => {
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event: any) => event.date === dateStr);
  };
  
  // Create array for empty cells at the start of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-${i}`} className="text-center p-1"></div>
  ));
  
  // Create array for days of the month
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayEvents = getEventsForDate(day);
    
    return (
      <div key={day} className="relative">
        <div 
          className={`text-center p-1 rounded relative z-10 ${
            day === today.getDate() ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          {day}
        </div>
        {dayEvents.length > 0 && (
          <>
            {/* Dot behind the number */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dayEvents[0].color || '#3b82f6' }}
              />
            </div>
            {/* Clickable layer on top */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              title={`${dayEvents[0].title} - Click for details`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(dayEvents[0]);
              }}
            >
              <div className="w-4 h-4 rounded-full hover:bg-black/10 transition-colors" />
            </div>
          </>
        )}
      </div>
    );
  });
  
  return (
    <>
      <div className="space-y-2">
        <div className="font-medium text-center">{currentMonth}</div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-muted-foreground p-1">
              {day}
            </div>
          ))}
          {emptyCells}
          {monthDays}
        </div>
        {events.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Events:</div>
            {events.slice(0, 3).map((event: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || '#3b82f6' }}
                />
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {events.length > 3 && (
              <div className="text-xs text-muted-foreground">+{events.length - 3} more events</div>
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedEvent?.color || '#3b82f6' }}
              />
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Event Title</Label>
                <p className="text-lg font-semibold">{selectedEvent.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                <p className="text-base">{selectedEvent.date}</p>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MusicPlayerWidget({ config }: { config: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <Music className="w-6 h-6 text-primary" />
      <div className="flex-1">
        <div className="font-medium">Now Playing</div>
        <div className="text-sm text-muted-foreground">
          {config.trackId ? 'Track Name' : 'Connect your music account'}
        </div>
      </div>
      <Button size="sm" variant="outline">
        Play
      </Button>
    </div>
  );
}

function DonationWidget({ config }: { config: any }) {
  return (
    <div className="text-center space-y-3">
      <Heart className="w-8 h-8 text-red-500 mx-auto" />
      <div>
        <div className="font-medium">Support Me</div>
        <div className="text-sm text-muted-foreground">
          {config.message || 'Help support my work'}
        </div>
      </div>
      <Button className="w-full">
        Donate {config.amount && `$${config.amount}`}
      </Button>
    </div>
  );
}

function ContactFormWidget({ config }: { config: any }) {
  const userEmail = config?.email || 'your@email.com';
  
  const handleEmailClick = () => {
    const subject = config?.subject || 'Hello';
    const body = config?.message || 'Hi there!';
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-4 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact Me</h3>
        <p className="text-sm text-muted-foreground">Get in touch with me</p>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Email me at:</p>
          <p className="text-base font-medium">{userEmail}</p>
        </div>
        
        <Button 
          onClick={handleEmailClick} 
          className="w-full"
          variant="outline"
        >
          <Mail className="w-4 h-4 mr-2" />
          Open Email Client
        </Button>
      </div>
    </div>
  );
}

function EmbedWidget({ config }: { config: any }) {
  if (!config.url) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
        Add a URL in the widget settings
      </div>
    );
  }
  
  return (
    <div className="aspect-video">
      <iframe
        src={config.url}
        width={config.width || 560}
        height={config.height || 315}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}

function TextBlockWidget({ config }: { config: any }) {
  return (
    <div className="prose prose-sm max-w-none">
      <div dangerouslySetInnerHTML={{ 
        __html: config.content || '<p>Add your text content in the widget settings.</p>' 
      }} />
    </div>
  );
}

function ImageGalleryWidget({ config }: { config: any }) {
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <Image className="w-8 h-8 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Add images in settings</span>
      </div>
    </div>
  );
}

function StatsWidget({ config }: { config: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">1.2K</div>
        <div className="text-sm text-muted-foreground">Views</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">45</div>
        <div className="text-sm text-muted-foreground">Downloads</div>
      </div>
    </div>
  );
}

function AnnouncementWidget({ config }: { config: any }) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getTypeStyles(config.type || 'info')}`}>
      <div className="flex items-start gap-2">
        <Megaphone className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          {config.message || 'Add your announcement message in the widget settings.'}
        </div>
      </div>
    </div>
  );
}

function TodoListWidget({ config }: { config: any }) {
  const [items, setItems] = useState(config.items || []);
  
  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium">{config.title || 'My Tasks'}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet. Add some in the widget settings.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed || false}
                onChange={() => toggleItem(index)}
                className="rounded"
              />
              <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CountdownWidget({ config }: { config: any }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  React.useEffect(() => {
    if (!config.targetDate) return;
    
    const targetDate = new Date(config.targetDate).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.targetDate]);

  return (
    <div className="text-center space-y-3">
      <h3 className="font-medium">{config.title || 'Countdown'}</h3>
      {config.targetDate ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {config.showDays && (
            <div className="bg-muted p-2 rounded">
              <div className="text-lg font-bold">{timeLeft.days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
          )}
          {config.showHours && (
            <div className="bg-muted p-2 rounded">
              <div className="text-lg font-bold">{timeLeft.hours}</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
          )}
          {config.showMinutes && (
            <div className="bg-muted p-2 rounded">
              <div className="text-lg font-bold">{timeLeft.minutes}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
          )}
          <div className="bg-muted p-2 rounded">
            <div className="text-lg font-bold">{timeLeft.seconds}</div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Set a target date in the widget settings.</p>
      )}
    </div>
  );
}

function QRCodeWidget({ config }: { config: any }) {
  const qrCodeUrl = config.text ? `https://api.qrserver.com/v1/create-qr-code/?size=${config.size || 200}x${config.size || 200}&data=${encodeURIComponent(config.text)}` : '';
  
  return (
    <div className="text-center space-y-3">
      <h3 className="font-medium">{config.title || 'QR Code'}</h3>
      {config.text ? (
        <div className="flex justify-center">
          <img src={qrCodeUrl} alt="QR Code" className="rounded" />
        </div>
      ) : (
        <div className="p-4 bg-muted rounded-lg">
          <QrCode className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Add text to generate QR code</p>
        </div>
      )}
    </div>
  );
}

function SocialLinksWidget({ config }: { config: any }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{config.title || 'Follow Me'}</h3>
      {config.links && config.links.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {config.links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{link.platform}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add social links in the widget settings.</p>
      )}
    </div>
  );
}

function TestimonialWidget({ config }: { config: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < (config.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <blockquote className="text-sm italic">
        "{config.text || 'Add your testimonial text in the widget settings.'}"
      </blockquote>
      <div className="flex items-center gap-2">
        {config.avatar && (
          <img src={config.avatar} alt={config.author} className="w-8 h-8 rounded-full" />
        )}
        <div>
          <div className="font-medium text-sm">{config.author || 'Customer'}</div>
          {config.role && (
            <div className="text-xs text-muted-foreground">{config.role}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PricingTableWidget({ config }: { config: any }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{config.title || 'Pricing Plans'}</h3>
      {config.plans && config.plans.length > 0 ? (
        <div className="space-y-2">
          {config.plans.map((plan: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.description}</div>
                </div>
                <div className="text-lg font-bold">{plan.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add pricing plans in the widget settings.</p>
      )}
    </div>
  );
}

function NewsletterWidget({ config }: { config: any }) {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium">{config.title || 'Newsletter'}</h3>
        <p className="text-sm text-muted-foreground">{config.description || 'Subscribe to our newsletter'}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="email"
          placeholder={config.placeholder || 'Enter your email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
      </form>
    </div>
  );
}

function RecentPostsWidget({ config }: { config: any }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{config.title || 'Recent Posts'}</h3>
      {config.posts && config.posts.length > 0 ? (
        <div className="space-y-2">
          {config.posts.slice(0, config.showCount || 3).map((post: any, index: number) => (
            <div key={index} className="p-2 border rounded-lg">
              <div className="font-medium text-sm">{post.title}</div>
              <div className="text-xs text-muted-foreground">{post.date}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add recent posts in the widget settings.</p>
      )}
    </div>
  );
}

// Widget Editor Component
function WidgetEditor({ 
  widget, 
  onSave, 
  onClose 
}: { 
  widget: Widget; 
  onSave: (widget: Widget) => void; 
  onClose: () => void; 
}) {
  const [editedWidget, setEditedWidget] = useState(widget);

  // Update editedWidget when widget prop changes
  React.useEffect(() => {
    setEditedWidget(widget);
  }, [widget]);

  const handleSave = () => {
    onSave({
      ...editedWidget,
      updatedAt: new Date().toISOString(),
    });
  };

  const renderConfigEditor = () => {
    switch (widget.type) {
      case 'clock':
        return (
          <div className="space-y-4">
            <div>
              <Label>Time Format</Label>
              <Select 
                value={editedWidget.config?.format || '12h'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, format: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'custom_code':
        return (
          <div className="space-y-4">
            <div>
              <Label>HTML</Label>
              <Textarea
                value={editedWidget.config?.html || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, html: e.target.value }
                  }))
                }
                rows={4}
                placeholder="<div>Your HTML code here</div>"
              />
            </div>
            <div>
              <Label>CSS</Label>
              <Textarea
                value={editedWidget.config?.css || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, css: e.target.value }
                  }))
                }
                rows={4}
                placeholder="/* Your CSS code here */"
              />
            </div>
            <div>
              <Label>JavaScript</Label>
              <Textarea
                value={editedWidget.config?.js || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, js: e.target.value }
                  }))
                }
                rows={4}
                placeholder="// Your JavaScript code here"
              />
            </div>
          </div>
        );
      
      case 'social_badge':
        return (
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <Select 
                value={editedWidget.config?.platform || 'twitter'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, platform: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={editedWidget.config?.username || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, username: e.target.value }
                  }))
                }
                placeholder="@username"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showCount"
                checked={editedWidget.config?.showCount !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, showCount: checked }
                  }))
                }
              />
              <Label htmlFor="showCount">Show follower count</Label>
            </div>
          </div>
        );
      
      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <Label>Quote Text</Label>
              <Textarea
                value={editedWidget.config?.text || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, text: e.target.value }
                  }))
                }
                rows={3}
                placeholder="Enter your inspiring quote here..."
              />
            </div>
            <div>
              <Label>Author (optional)</Label>
              <Input
                value={editedWidget.config?.author || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, author: e.target.value }
                  }))
                }
                placeholder="Quote author"
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select 
                value={editedWidget.config?.style || 'modern'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, style: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'weather':
        return (
          <div className="space-y-4">
            <div>
              <Label>Location</Label>
              <Input
                value={editedWidget.config?.location || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, location: e.target.value }
                  }))
                }
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <Label>API Provider</Label>
              <Select 
                value={editedWidget.config?.apiProvider || 'openweather'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, apiProvider: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openweather">OpenWeatherMap (Free tier available)</SelectItem>
                  <SelectItem value="weatherapi">WeatherAPI (Free tier available)</SelectItem>
                  <SelectItem value="weatherbit">Weatherbit (Free tier available)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>API Key (Optional - uses demo keys if not provided)</Label>
              <Input
                value={editedWidget.config?.apiKey || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, apiKey: e.target.value }
                  }))
                }
                placeholder="Your API key (optional)"
                type="password"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get free API keys from: OpenWeatherMap, WeatherAPI, or Weatherbit
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Temperature Unit</Label>
                <Select 
                  value={editedWidget.config?.unit || 'celsius'} 
                  onValueChange={(value) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, unit: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Update Interval (minutes)</Label>
                <Select 
                  value={editedWidget.config?.updateInterval?.toString() || '15'} 
                  onValueChange={(value) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, updateInterval: parseInt(value) }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Display Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedWidget.config?.showDetails || false}
                    onChange={(e) => 
                      setEditedWidget(prev => ({
                        ...prev,
                        config: { ...prev.config, showDetails: e.target.checked }
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Show detailed weather information</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedWidget.config?.showForecast || false}
                    onChange={(e) => 
                      setEditedWidget(prev => ({
                        ...prev,
                        config: { ...prev.config, showForecast: e.target.checked }
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Show forecast (if available)</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'counter':
        return (
          <div className="space-y-4">
            <div>
              <Label>Counter Label</Label>
              <Input
                value={editedWidget.config?.label || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, label: e.target.value }
                  }))
                }
                placeholder="e.g., Downloads, Visits"
              />
            </div>
            <div>
              <Label>Current Count</Label>
              <Input
                type="number"
                value={editedWidget.config?.count || 0}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, count: parseInt(e.target.value) || 0 }
                  }))
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Target Count (optional)</Label>
              <Input
                type="number"
                value={editedWidget.config?.target || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, target: parseInt(e.target.value) || 0 }
                  }))
                }
                placeholder="1000"
              />
            </div>
          </div>
        );
      
      case 'progress_bar':
        return (
          <div className="space-y-4">
            <div>
              <Label>Progress Label</Label>
              <Input
                value={editedWidget.config?.label || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, label: e.target.value }
                  }))
                }
                placeholder="e.g., Goal Progress"
              />
            </div>
            <div>
              <Label>Current Value</Label>
              <Input
                type="number"
                value={editedWidget.config?.current || 0}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, current: parseInt(e.target.value) || 0 }
                  }))
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label>Target Value</Label>
              <Input
                type="number"
                value={editedWidget.config?.target || 100}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, target: parseInt(e.target.value) || 100 }
                  }))
                }
                placeholder="100"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={editedWidget.config?.unit || '%'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, unit: e.target.value }
                  }))
                }
                placeholder="%"
              />
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label>Calendar View</Label>
              <Select 
                value={editedWidget.config?.view || 'month'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, view: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showEvents"
                checked={editedWidget.config?.showEvents !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, showEvents: checked }
                  }))
                }
              />
              <Label htmlFor="showEvents">Show events</Label>
            </div>
            
            <div>
              <Label>Custom Events</Label>
              <div className="space-y-3 mt-2">
                {(editedWidget.config?.events || []).map((event: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={event.title || ''}
                        onChange={(e) => {
                          const newEvents = [...(editedWidget.config?.events || [])];
                          newEvents[index] = { ...newEvents[index], title: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, events: newEvents }
                          }));
                        }}
                        placeholder="Event title"
                      />
                      <Input
                        type="date"
                        value={event.date || ''}
                        onChange={(e) => {
                          const newEvents = [...(editedWidget.config?.events || [])];
                          newEvents[index] = { ...newEvents[index], date: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, events: newEvents }
                          }));
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Color:</Label>
                        <Input
                          type="color"
                          value={event.color || '#3b82f6'}
                          onChange={(e) => {
                            const newEvents = [...(editedWidget.config?.events || [])];
                            newEvents[index] = { ...newEvents[index], color: e.target.value };
                            setEditedWidget(prev => ({
                              ...prev,
                              config: { ...prev.config, events: newEvents }
                            }));
                          }}
                          className="w-12 h-8 p-0 border cursor-pointer"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newEvents = (editedWidget.config?.events || []).filter((_: any, i: number) => i !== index);
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, events: newEvents }
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newEvents = [...(editedWidget.config?.events || []), {
                      title: '',
                      date: '',
                      color: '#3b82f6'
                    }];
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, events: newEvents }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'music_player':
        return (
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <Select 
                value={editedWidget.config?.platform || 'spotify'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, platform: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="apple_music">Apple Music</SelectItem>
                  <SelectItem value="youtube">YouTube Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Track ID or URL</Label>
              <Input
                value={editedWidget.config?.trackId || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, trackId: e.target.value }
                  }))
                }
                placeholder="Track ID or URL"
              />
            </div>
          </div>
        );
      
      case 'donation':
        return (
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <Select 
                value={editedWidget.config?.platform || 'paypal'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, platform: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="ko_fi">Ko-fi</SelectItem>
                  <SelectItem value="buy_me_coffee">Buy Me a Coffee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (optional)</Label>
              <Input
                value={editedWidget.config?.amount || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, amount: e.target.value }
                  }))
                }
                placeholder="$5"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Input
                value={editedWidget.config?.message || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, message: e.target.value }
                  }))
                }
                placeholder="Support my work"
              />
            </div>
          </div>
        );
      
      case 'contact_form':
        return (
          <div className="space-y-4">
            <div>
              <Label>Your Email Address</Label>
              <Input
                type="email"
                value={editedWidget.config?.email || 'your@email.com'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, email: e.target.value }
                  }))
                }
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label>Default Subject</Label>
              <Input
                value={editedWidget.config?.subject || 'Hello'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, subject: e.target.value }
                  }))
                }
                placeholder="Hello"
              />
            </div>
            <div>
              <Label>Default Message</Label>
              <Textarea
                value={editedWidget.config?.message || 'Hi there!'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, message: e.target.value }
                  }))
                }
                placeholder="Hi there!"
                rows={3}
              />
            </div>
          </div>
        );
      
      case 'embed':
        return (
          <div className="space-y-4">
            <div>
              <Label>Embed URL</Label>
              <Input
                value={editedWidget.config?.url || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, url: e.target.value }
                  }))
                }
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  type="number"
                  value={editedWidget.config?.width || 560}
                  onChange={(e) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, width: parseInt(e.target.value) || 560 }
                    }))
                  }
                  placeholder="560"
                />
              </div>
              <div>
                <Label>Height</Label>
                <Input
                  type="number"
                  value={editedWidget.config?.height || 315}
                  onChange={(e) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, height: parseInt(e.target.value) || 315 }
                    }))
                  }
                  placeholder="315"
                />
              </div>
            </div>
          </div>
        );
      
      case 'text_block':
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                value={editedWidget.config?.content || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, content: e.target.value }
                  }))
                }
                rows={6}
                placeholder="Enter your text content here..."
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select 
                value={editedWidget.config?.style || 'default'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, style: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'image_gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URLs (one per line)</Label>
              <Textarea
                value={editedWidget.config?.images?.join('\n') || ''}
                onChange={(e) => {
                  const images = e.target.value.split('\n').filter(url => url.trim());
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, images }
                  }));
                }}
                rows={4}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoplay"
                checked={editedWidget.config?.autoplay !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, autoplay: checked }
                  }))
                }
              />
              <Label htmlFor="autoplay">Autoplay</Label>
            </div>
            <div>
              <Label>Autoplay Interval (ms)</Label>
              <Input
                type="number"
                value={editedWidget.config?.interval || 3000}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, interval: parseInt(e.target.value) || 3000 }
                  }))
                }
                placeholder="3000"
              />
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-4">
            <div>
              <Label>Stat 1 Label</Label>
              <Input
                value={editedWidget.config?.stat1Label || 'Views'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, stat1Label: e.target.value }
                  }))
                }
                placeholder="Views"
              />
            </div>
            <div>
              <Label>Stat 1 Value</Label>
              <Input
                value={editedWidget.config?.stat1Value || '1.2K'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, stat1Value: e.target.value }
                  }))
                }
                placeholder="1.2K"
              />
            </div>
            <div>
              <Label>Stat 2 Label</Label>
              <Input
                value={editedWidget.config?.stat2Label || 'Downloads'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, stat2Label: e.target.value }
                  }))
                }
                placeholder="Downloads"
              />
            </div>
            <div>
              <Label>Stat 2 Value</Label>
              <Input
                value={editedWidget.config?.stat2Value || '45'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, stat2Value: e.target.value }
                  }))
                }
                placeholder="45"
              />
            </div>
          </div>
        );
      
      case 'announcement':
        return (
          <div className="space-y-4">
            <div>
              <Label>Announcement Text</Label>
              <Input
                value={editedWidget.config?.text || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, text: e.target.value }
                  }))
                }
                placeholder="Enter your announcement..."
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select 
                value={editedWidget.config?.type || 'info'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, type: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="dismissible"
                checked={editedWidget.config?.dismissible !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, dismissible: checked }
                  }))
                }
              />
              <Label htmlFor="dismissible">Dismissible</Label>
            </div>
          </div>
        );
      
      case 'todo_list':
        return (
          <div className="space-y-4">
            <div>
              <Label>List Title</Label>
              <Input
                value={editedWidget.config?.title || 'My Tasks'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="My Tasks"
              />
            </div>
            <div>
              <Label>Todo Items (one per line)</Label>
              <Textarea
                value={editedWidget.config?.items?.map((item: any) => item.text).join('\n') || ''}
                onChange={(e) => {
                  const items = e.target.value.split('\n').filter(text => text.trim()).map(text => ({
                    text: text.trim(),
                    completed: false
                  }));
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, items }
                  }));
                }}
                rows={4}
                placeholder="Task 1&#10;Task 2&#10;Task 3"
              />
            </div>
          </div>
        );
      
      case 'countdown':
        return (
          <div className="space-y-4">
            <div>
              <Label>Countdown Title</Label>
              <Input
                value={editedWidget.config?.title || 'Countdown'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Countdown"
              />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input
                type="datetime-local"
                value={editedWidget.config?.targetDate || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, targetDate: e.target.value }
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showDays"
                  checked={editedWidget.config?.showDays !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showDays: checked }
                    }))
                  }
                />
                <Label htmlFor="showDays">Show Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showHours"
                  checked={editedWidget.config?.showHours !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showHours: checked }
                    }))
                  }
                />
                <Label htmlFor="showHours">Show Hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showMinutes"
                  checked={editedWidget.config?.showMinutes !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showMinutes: checked }
                    }))
                  }
                />
                <Label htmlFor="showMinutes">Show Minutes</Label>
              </div>
            </div>
          </div>
        );
      
      case 'qr_code':
        return (
          <div className="space-y-4">
            <div>
              <Label>QR Code Title</Label>
              <Input
                value={editedWidget.config?.title || 'QR Code'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="QR Code"
              />
            </div>
            <div>
              <Label>Text to Encode</Label>
              <Textarea
                value={editedWidget.config?.text || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, text: e.target.value }
                  }))
                }
                rows={3}
                placeholder="Enter text, URL, or data to encode"
              />
            </div>
            <div>
              <Label>QR Code Size (pixels)</Label>
              <Input
                type="number"
                value={editedWidget.config?.size || 200}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, size: parseInt(e.target.value) || 200 }
                  }))
                }
                placeholder="200"
              />
            </div>
          </div>
        );
      
      case 'social_links':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={editedWidget.config?.title || 'Follow Me'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Follow Me"
              />
            </div>
            <div>
              <Label>Social Links</Label>
              <div className="space-y-3 mt-2">
                {(editedWidget.config?.links || []).map((link: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={link.platform || ''}
                        onChange={(e) => {
                          const newLinks = [...(editedWidget.config?.links || [])];
                          newLinks[index] = { ...newLinks[index], platform: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, links: newLinks }
                          }));
                        }}
                        placeholder="Platform name"
                      />
                      <Input
                        value={link.url || ''}
                        onChange={(e) => {
                          const newLinks = [...(editedWidget.config?.links || [])];
                          newLinks[index] = { ...newLinks[index], url: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, links: newLinks }
                          }));
                        }}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newLinks = (editedWidget.config?.links || []).filter((_: any, i: number) => i !== index);
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, links: newLinks }
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newLinks = [...(editedWidget.config?.links || []), {
                      platform: '',
                      url: ''
                    }];
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, links: newLinks }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'testimonial':
        return (
          <div className="space-y-4">
            <div>
              <Label>Testimonial Text</Label>
              <Textarea
                value={editedWidget.config?.text || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, text: e.target.value }
                  }))
                }
                rows={3}
                placeholder="Enter the testimonial text..."
              />
            </div>
            <div>
              <Label>Author Name</Label>
              <Input
                value={editedWidget.config?.author || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, author: e.target.value }
                  }))
                }
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label>Author Role/Title</Label>
              <Input
                value={editedWidget.config?.role || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, role: e.target.value }
                  }))
                }
                placeholder="CEO, Company Name"
              />
            </div>
            <div>
              <Label>Avatar URL (optional)</Label>
              <Input
                value={editedWidget.config?.avatar || ''}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, avatar: e.target.value }
                  }))
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <Label>Rating (1-5 stars)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={editedWidget.config?.rating || 5}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, rating: parseInt(e.target.value) || 5 }
                  }))
                }
                placeholder="5"
              />
            </div>
          </div>
        );
      
      case 'pricing_table':
        return (
          <div className="space-y-4">
            <div>
              <Label>Table Title</Label>
              <Input
                value={editedWidget.config?.title || 'Pricing Plans'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Pricing Plans"
              />
            </div>
            <div>
              <Label>Pricing Plans</Label>
              <div className="space-y-3 mt-2">
                {(editedWidget.config?.plans || []).map((plan: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={plan.name || ''}
                        onChange={(e) => {
                          const newPlans = [...(editedWidget.config?.plans || [])];
                          newPlans[index] = { ...newPlans[index], name: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, plans: newPlans }
                          }));
                        }}
                        placeholder="Plan name"
                      />
                      <Input
                        value={plan.description || ''}
                        onChange={(e) => {
                          const newPlans = [...(editedWidget.config?.plans || [])];
                          newPlans[index] = { ...newPlans[index], description: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, plans: newPlans }
                          }));
                        }}
                        placeholder="Plan description"
                      />
                      <Input
                        value={plan.price || ''}
                        onChange={(e) => {
                          const newPlans = [...(editedWidget.config?.plans || [])];
                          newPlans[index] = { ...newPlans[index], price: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, plans: newPlans }
                          }));
                        }}
                        placeholder="$99/month"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newPlans = (editedWidget.config?.plans || []).filter((_: any, i: number) => i !== index);
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, plans: newPlans }
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newPlans = [...(editedWidget.config?.plans || []), {
                      name: '',
                      description: '',
                      price: ''
                    }];
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, plans: newPlans }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pricing Plan
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <Label>Newsletter Title</Label>
              <Input
                value={editedWidget.config?.title || 'Newsletter'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Newsletter"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editedWidget.config?.description || 'Subscribe to our newsletter'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, description: e.target.value }
                  }))
                }
                rows={2}
                placeholder="Subscribe to our newsletter"
              />
            </div>
            <div>
              <Label>Email Placeholder</Label>
              <Input
                value={editedWidget.config?.placeholder || 'Enter your email'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, placeholder: e.target.value }
                  }))
                }
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      
      case 'recent_posts':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={editedWidget.config?.title || 'Recent Posts'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Recent Posts"
              />
            </div>
            <div>
              <Label>Number of Posts to Show</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={editedWidget.config?.showCount || 3}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, showCount: parseInt(e.target.value) || 3 }
                  }))
                }
                placeholder="3"
              />
            </div>
            <div>
              <Label>Recent Posts</Label>
              <div className="space-y-3 mt-2">
                {(editedWidget.config?.posts || []).map((post: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={post.title || ''}
                        onChange={(e) => {
                          const newPosts = [...(editedWidget.config?.posts || [])];
                          newPosts[index] = { ...newPosts[index], title: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, posts: newPosts }
                          }));
                        }}
                        placeholder="Post title"
                      />
                      <Input
                        type="date"
                        value={post.date || ''}
                        onChange={(e) => {
                          const newPosts = [...(editedWidget.config?.posts || [])];
                          newPosts[index] = { ...newPosts[index], date: e.target.value };
                          setEditedWidget(prev => ({
                            ...prev,
                            config: { ...prev.config, posts: newPosts }
                          }));
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newPosts = (editedWidget.config?.posts || []).filter((_: any, i: number) => i !== index);
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, posts: newPosts }
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newPosts = [...(editedWidget.config?.posts || []), {
                      title: '',
                      date: ''
                    }];
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, posts: newPosts }
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Post
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'poll':
        return (
          <div className="space-y-4">
            <div>
              <Label>Poll Question</Label>
              <Input
                value={editedWidget.config?.question || 'What do you think?'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, question: e.target.value }
                  }))
                }
                placeholder="What do you think?"
              />
            </div>
            <div>
              <Label>Poll Options</Label>
              <div className="space-y-2">
                {(editedWidget.config?.options || []).map((option: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.text || ''}
                      onChange={(e) => {
                        const newOptions = [...(editedWidget.config?.options || [])];
                        newOptions[index] = { ...newOptions[index], text: e.target.value };
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, options: newOptions }
                        }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = (editedWidget.config?.options || []).filter((_: any, i: number) => i !== index);
                        setEditedWidget(prev => ({
                          ...prev,
                          config: { ...prev.config, options: newOptions }
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(editedWidget.config?.options || []), {
                      id: `opt_${Date.now()}`,
                      text: `Option ${(editedWidget.config?.options || []).length + 1}`,
                      votes: 0
                    }];
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, options: newOptions }
                    }));
                  }}
                >
                  Add Option
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowMultiple"
                checked={editedWidget.config?.allowMultiple || false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, allowMultiple: checked }
                  }))
                }
              />
              <Label htmlFor="allowMultiple">Allow multiple selections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={editedWidget.config?.isActive !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, isActive: checked }
                  }))
                }
              />
              <Label htmlFor="isActive">Poll is active</Label>
            </div>
          </div>
        );
      
      case 'live_chat':
        return (
          <div className="space-y-4">
            <div>
              <Label>Chat Title</Label>
              <Input
                value={editedWidget.config?.title || 'Live Chat'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Live Chat"
              />
            </div>
            <div>
              <Label>Max Messages to Store</Label>
              <Input
                type="number"
                min="10"
                max="200"
                value={editedWidget.config?.maxMessages || 50}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, maxMessages: parseInt(e.target.value) || 50 }
                  }))
                }
                placeholder="50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={editedWidget.config?.isActive !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, isActive: checked }
                  }))
                }
              />
              <Label htmlFor="isActive">Chat is active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allowAnonymous"
                checked={editedWidget.config?.allowAnonymous !== false}
                onCheckedChange={(checked) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, allowAnonymous: checked }
                  }))
                }
              />
              <Label htmlFor="allowAnonymous">Allow anonymous visitors to chat</Label>
            </div>
          </div>
        );
      
      case 'blog_posts':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={editedWidget.config?.title || 'Latest Posts'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Latest Posts"
              />
            </div>
            <div>
              <Label>Number of Posts to Show</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={editedWidget.config?.showCount || 3}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, showCount: parseInt(e.target.value) || 3 }
                  }))
                }
                placeholder="3"
              />
            </div>
            <div className="space-y-3">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showExcerpt"
                  checked={editedWidget.config?.showExcerpt !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showExcerpt: checked }
                    }))
                  }
                />
                <Label htmlFor="showExcerpt">Show excerpt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showTags"
                  checked={editedWidget.config?.showTags !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showTags: checked }
                    }))
                  }
                />
                <Label htmlFor="showTags">Show tags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showDate"
                  checked={editedWidget.config?.showDate !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showDate: checked }
                    }))
                  }
                />
                <Label htmlFor="showDate">Show date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showViews"
                  checked={editedWidget.config?.showViews !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showViews: checked }
                    }))
                  }
                />
                <Label htmlFor="showViews">Show view count</Label>
              </div>
            </div>
          </div>
        );
      
      case 'heat_map':
        return (
          <div className="space-y-4">
            <div>
              <Label>Widget Title</Label>
              <Input
                value={editedWidget.config?.title || 'Analytics'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Analytics"
              />
            </div>
            <div className="space-y-3">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showClicks"
                  checked={editedWidget.config?.showClicks !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showClicks: checked }
                    }))
                  }
                />
                <Label htmlFor="showClicks">Show click data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showViews"
                  checked={editedWidget.config?.showViews !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showViews: checked }
                    }))
                  }
                />
                <Label htmlFor="showViews">Show view data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showTopElements"
                  checked={editedWidget.config?.showTopElements !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showTopElements: checked }
                    }))
                  }
                />
                <Label htmlFor="showTopElements">Show top elements</Label>
              </div>
            </div>
            <div>
              <Label>Default Time Range</Label>
              <Select
                value={editedWidget.config?.timeRange || '7d'}
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, timeRange: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'portfolio_gallery':
        return (
          <div className="space-y-4">
            <div>
              <Label>Widget Title</Label>
              <Input
                value={editedWidget.config?.title || 'Portfolio'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Portfolio"
              />
            </div>
            <div className="space-y-3">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCategories"
                  checked={editedWidget.config?.showCategories !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showCategories: checked }
                    }))
                  }
                />
                <Label htmlFor="showCategories">Show categories</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showTags"
                  checked={editedWidget.config?.showTags !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showTags: checked }
                    }))
                  }
                />
                <Label htmlFor="showTags">Show tags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showFeatured"
                  checked={editedWidget.config?.showFeatured !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showFeatured: checked }
                    }))
                  }
                />
                <Label htmlFor="showFeatured">Show featured filter</Label>
              </div>
            </div>
            <div>
              <Label>Items Per Row</Label>
              <Select
                value={editedWidget.config?.itemsPerRow?.toString() || '3'}
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, itemsPerRow: parseInt(value) }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 item per row</SelectItem>
                  <SelectItem value="2">2 items per row</SelectItem>
                  <SelectItem value="3">3 items per row</SelectItem>
                  <SelectItem value="4">4 items per row</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'product_showcase':
        return (
          <div className="space-y-4">
            <div>
              <Label>Widget Title</Label>
              <Input
                value={editedWidget.config?.title || 'Products'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Products"
              />
            </div>
            <div className="space-y-3">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showPrices"
                  checked={editedWidget.config?.showPrices !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showPrices: checked }
                    }))
                  }
                />
                <Label htmlFor="showPrices">Show prices</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCategories"
                  checked={editedWidget.config?.showCategories !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showCategories: checked }
                    }))
                  }
                />
                <Label htmlFor="showCategories">Show categories</Label>
              </div>
            </div>
            <div>
              <Label>Items Per Row</Label>
              <Select
                value={editedWidget.config?.itemsPerRow?.toString() || '3'}
                onValueChange={(value) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, itemsPerRow: parseInt(value) }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 item per row</SelectItem>
                  <SelectItem value="2">2 items per row</SelectItem>
                  <SelectItem value="3">3 items per row</SelectItem>
                  <SelectItem value="4">4 items per row</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'work_history':
        return (
          <div className="space-y-4">
            <div>
              <Label>Widget Title</Label>
              <Input
                value={editedWidget.config?.title || 'Work History'}
                onChange={(e) => 
                  setEditedWidget(prev => ({
                    ...prev,
                    config: { ...prev.config, title: e.target.value }
                  }))
                }
                placeholder="Work History"
              />
            </div>
            <div className="space-y-3">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCompanyLogos"
                  checked={editedWidget.config?.showCompanyLogos !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showCompanyLogos: checked }
                    }))
                  }
                />
                <Label htmlFor="showCompanyLogos">Show company logos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showEmploymentType"
                  checked={editedWidget.config?.showEmploymentType !== false}
                  onCheckedChange={(checked) => 
                    setEditedWidget(prev => ({
                      ...prev,
                      config: { ...prev.config, showEmploymentType: checked }
                    }))
                  }
                />
                <Label htmlFor="showEmploymentType">Show employment type</Label>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-muted-foreground">
            Configuration options for this widget type will be added soon.
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Widget: {widget.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Widget Title</Label>
            <Input
              value={editedWidget.title || ''}
              onChange={(e) => 
                setEditedWidget(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter widget title"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={editedWidget.enabled}
              onCheckedChange={(enabled) => 
                setEditedWidget(prev => ({ ...prev, enabled }))
              }
            />
            <Label htmlFor="enabled">Widget enabled</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Widget Size</Label>
              <Select 
                value={editedWidget.size || 'default'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({ ...prev, size: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (Auto)</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Layout Width</Label>
              <Select 
                value={editedWidget.width || 'full'} 
                onValueChange={(value) => 
                  setEditedWidget(prev => ({ ...prev, width: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Width</SelectItem>
                  <SelectItem value="half">Half Width (Side-by-side)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {renderConfigEditor()}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}