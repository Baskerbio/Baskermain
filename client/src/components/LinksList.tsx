import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, ExternalLink, GripVertical, ChevronDown, Palette, Type, Shapes, Settings, Clock, Link as LinkIcon, Zap, UserPlus, ChevronDown as ChevronDownIcon, ChevronRight, Folder, Square, Box, Diamond, Waves, Circle, Triangle, Star, Hexagon, Heart } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useLinks, useSaveLinks, useGroups, useSaveGroups, useSettings } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Link, Group } from '@shared/schema';
import { getContrastColor, getShapeClasses, getLinkStyling } from '../lib/link-utils';
import PixelTransition from './PixelTransition';
import GlareHover from './GlareHover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const linkFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  icon: z.string().optional(),
  group: z.string().optional(),
  // Scheduling options
  isScheduled: z.boolean().optional(),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  // Customization options
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.enum(['normal', 'bold', 'bolder', 'lighter']).optional(),
  containerShape: z.enum(['rounded', 'square', 'pill', 'rounded-corners', 'diamond', 'ridged', 'wavy']).default('rounded'),
  autoTextColor: z.boolean().default(true),
  iconColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']).optional(),
  iconBorderWidth: z.number().min(0).max(6).optional(),
  iconBorderColor: z.string().optional(),
  iconBorderShape: z.enum(['rounded', 'square', 'circle', 'triangle', 'star', 'hexagon', 'diamond', 'heart']).optional(),
  pattern: z.enum(['none', 'dots', 'lines', 'grid', 'diagonal', 'waves']).optional(),
  patternColor: z.string().optional(),
  pixelTransition: z.boolean().default(false),
  pixelTransitionText: z.string().optional(),
  pixelTransitionColor: z.string().optional(),
  pixelTransitionGridSize: z.number().min(3).max(15).default(7),
  pixelTransitionDuration: z.number().min(0.1).max(2.0).default(0.3),
});

interface LinksListProps {
  isEditMode: boolean;
}


// Font family options
const fontOptions = [
  { value: 'system', label: 'System Default' },
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'lato', label: 'Lato' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'nunito', label: 'Nunito' },
  { value: 'source-sans-pro', label: 'Source Sans Pro' },
  { value: 'raleway', label: 'Raleway' },
];

// Container shape options
const shapeOptions = [
  { value: 'rounded', label: 'Rounded', icon: <Square className="w-4 h-4 rounded" /> },
  { value: 'square', label: 'Square', icon: <Square className="w-4 h-4" /> },
  { value: 'pill', label: 'Pill', icon: <Box className="w-4 h-4 rounded-full" /> },
  { value: 'rounded-corners', label: 'Rounded Corners', icon: <Square className="w-4 h-4 rounded-sm" /> },
  { value: 'diamond', label: 'Diamond', icon: <Diamond className="w-4 h-4" /> },
  { value: 'ridged', label: 'Ridged', icon: <Box className="w-4 h-4" /> },
  { value: 'wavy', label: 'Wavy', icon: <Waves className="w-4 h-4" /> },
];

// Icon border shape options
const iconBorderShapeOptions = [
  { value: 'rounded', label: 'Rounded', icon: <Square className="w-4 h-4 rounded" /> },
  { value: 'square', label: 'Square', icon: <Square className="w-4 h-4" /> },
  { value: 'circle', label: 'Circle', icon: <Circle className="w-4 h-4" /> },
  { value: 'triangle', label: 'Triangle', icon: <Triangle className="w-4 h-4" /> },
  { value: 'star', label: 'Star', icon: <Star className="w-4 h-4" /> },
  { value: 'hexagon', label: 'Hexagon', icon: <Hexagon className="w-4 h-4" /> },
  { value: 'diamond', label: 'Diamond', icon: <Diamond className="w-4 h-4" /> },
  { value: 'heart', label: 'Heart', icon: <Heart className="w-4 h-4" /> },
];



export function LinksList({ isEditMode }: LinksListProps) {
  const { data: links = [] } = useLinks();
  const { mutate: saveLinks } = useSaveLinks();
  const { data: groups = [] } = useGroups();
  const typedGroups = Array.isArray(groups) ? groups as Group[] : [];
  const { mutate: saveGroups } = useSaveGroups();
  const { data: settings } = useSettings();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTitleColor, setNewGroupTitleColor] = useState('#ffffff');

  // Get unique groups from links and persistent groups
  const getUniqueGroups = () => {
    const linkGroups = links.map(link => link.group).filter((group): group is string => Boolean(group));
    const persistentGroups = typedGroups.map(group => group.name);
    const allGroups = [...linkGroups, ...persistentGroups];
    const uniqueGroups = Array.from(new Set(allGroups));
    return uniqueGroups;
  };

  const toggleGroup = (groupName: string) => {
    const group = typedGroups.find(g => g.name === groupName);
    if (group) {
      const updatedGroups = typedGroups.map(g => 
        g.name === groupName 
          ? { ...g, isOpen: !g.isOpen, updatedAt: new Date().toISOString() }
          : g
      );
      saveGroups(updatedGroups);
    }
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      isOpen: true,
      order: typedGroups.length,
      titleTextColor: newGroupTitleColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedGroups = [...typedGroups, newGroup];
    saveGroups(updatedGroups, {
      onSuccess: () => {
        toast({
          title: 'Group created!',
          description: `Group "${newGroupName}" is ready to use`,
        });
        setNewGroupName('');
        setIsCreateGroupDialogOpen(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create group',
          variant: 'destructive',
        });
      },
    });
  };

  const moveLinkToGroup = (linkId: string, groupName: string) => {
    const updatedLinks = links.map(link => 
      link.id === linkId 
        ? { ...link, group: groupName, updatedAt: new Date().toISOString() }
        : link
    );
    
    saveLinks(updatedLinks, {
      onSuccess: () => {
        toast({
          title: 'Link moved!',
          description: `Link moved to group "${groupName}"`,
        });
      },
      onError: (error) => {
        console.error('Failed to move link:', error);
        toast({
          title: 'Error',
          description: 'Failed to move link',
          variant: 'destructive',
        });
      },
    });
  };

  const removeLinkFromGroup = (linkId: string) => {
    const updatedLinks = links.map(link => 
      link.id === linkId 
        ? { ...link, group: '', updatedAt: new Date().toISOString() }
        : link
    );
    
    saveLinks(updatedLinks, {
      onSuccess: () => {
        toast({
          title: 'Link removed!',
          description: 'Link removed from group',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to remove link from group',
          variant: 'destructive',
        });
      },
    });
  };

  const form = useForm<z.infer<typeof linkFormSchema>>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      icon: '',
      group: '',
      isScheduled: false,
      scheduledStart: '',
      scheduledEnd: '',
      backgroundColor: '',
      textColor: '',
      fontFamily: 'system',
      fontWeight: 'normal',
      containerShape: 'rounded',
      autoTextColor: true,
      iconColor: '',
      borderColor: '',
      borderWidth: 0,
      borderStyle: 'solid',
      pattern: 'none',
      patternColor: '',
      pixelTransition: false,
      pixelTransitionText: '',
      pixelTransitionColor: '#000000',
      pixelTransitionGridSize: 7,
      pixelTransitionDuration: 0.3,
    },
  });

  // Reset form when editingLink changes
  React.useEffect(() => {
    if (editingLink) {
      form.reset({
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description || '',
        icon: editingLink.icon || '',
        group: editingLink.group || '',
        isScheduled: editingLink.isScheduled || false,
        scheduledStart: editingLink.scheduledStart || '',
        scheduledEnd: editingLink.scheduledEnd || '',
        backgroundColor: editingLink.backgroundColor || '',
        textColor: editingLink.textColor || '',
        fontFamily: editingLink.fontFamily || 'system',
        fontWeight: editingLink.fontWeight || 'normal',
        containerShape: editingLink.containerShape || 'rounded',
        autoTextColor: editingLink.autoTextColor !== undefined ? editingLink.autoTextColor : true,
        iconColor: editingLink.iconColor || '',
        borderColor: editingLink.borderColor || '',
        borderWidth: editingLink.borderWidth || 0,
        borderStyle: editingLink.borderStyle || 'solid',
        iconBorderWidth: editingLink.iconBorderWidth || 0,
        iconBorderColor: editingLink.iconBorderColor || '#000000',
        iconBorderShape: editingLink.iconBorderShape || 'rounded',
        pattern: editingLink.pattern || 'none',
        patternColor: editingLink.patternColor || '',
        pixelTransition: editingLink.pixelTransition || false,
        pixelTransitionText: editingLink.pixelTransitionText || '',
        pixelTransitionColor: editingLink.pixelTransitionColor || '#000000',
        pixelTransitionGridSize: editingLink.pixelTransitionGridSize || 7,
        pixelTransitionDuration: editingLink.pixelTransitionDuration || 0.3,
      });
    } else {
      form.reset({
        title: '',
        url: '',
        description: '',
        icon: '',
        group: '',
        isScheduled: false,
        scheduledStart: '',
        scheduledEnd: '',
        backgroundColor: '',
        textColor: '',
        fontFamily: 'system',
        fontWeight: 'normal',
        containerShape: 'rounded',
        autoTextColor: true,
        iconColor: '',
        borderColor: '',
        borderWidth: 2,
        borderStyle: 'solid',
        iconBorderWidth: settings?.enableIconBorders ? 2 : 0,
        iconBorderColor: '#000000',
        iconBorderShape: 'rounded',
        pattern: 'none',
        patternColor: '',
        pixelTransition: false,
        pixelTransitionText: '',
        pixelTransitionColor: '#000000',
        pixelTransitionGridSize: 7,
        pixelTransitionDuration: 0.3,
      });
    }
  }, [editingLink, form]);

  const onSubmit = (values: z.infer<typeof linkFormSchema>) => {
    console.log('🔍 Form submitted with values:', values);
    console.log('🔍 Border values:', {
      borderWidth: values.borderWidth,
      borderStyle: values.borderStyle,
      borderColor: values.borderColor,
      iconBorderWidth: values.iconBorderWidth,
      iconBorderColor: values.iconBorderColor
    });
    let updatedLinks: Link[];

    if (editingLink) {
      updatedLinks = links.map(link => 
        link.id === editingLink.id 
          ? { 
              ...link, 
              ...values, 
              icon: values.icon === 'none' ? '' : (values.icon || ''),
              group: values.group || '',
              updatedAt: new Date().toISOString() 
            }
          : link
      );
    } else {
      const newLink: Link = {
        id: Date.now().toString(),
        title: values.title,
        url: values.url,
        description: values.description || '',
        icon: values.icon === 'none' ? '' : (values.icon || ''),
        group: values.group || '',
        order: links.length,
        enabled: true,
        isScheduled: values.isScheduled || false,
        scheduledStart: values.scheduledStart,
        scheduledEnd: values.scheduledEnd,
        backgroundColor: values.backgroundColor || '',
        textColor: values.textColor || '',
        fontFamily: values.fontFamily || 'system',
        containerShape: values.containerShape || 'rounded',
        autoTextColor: values.autoTextColor ?? true,
        iconColor: values.iconColor || '',
        borderColor: values.borderColor || '',
        borderWidth: values.borderWidth || 0,
        borderStyle: values.borderStyle || 'solid',
      pattern: values.pattern || 'none',
      patternColor: values.patternColor || '',
      pixelTransition: values.pixelTransition || false,
      pixelTransitionText: values.pixelTransitionText || '',
      pixelTransitionColor: values.pixelTransitionColor || '#000000',
      pixelTransitionGridSize: values.pixelTransitionGridSize || 7,
      pixelTransitionDuration: values.pixelTransitionDuration || 0.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedLinks = [...links, newLink];
    }

    saveLinks(updatedLinks, {
      onSuccess: () => {
        toast({
          title: editingLink ? 'Link updated!' : 'Link added!',
          description: 'Your link has been saved successfully',
        });
        setIsDialogOpen(false);
        setEditingLink(null);
        form.reset({
          title: '',
          url: '',
          description: '',
          icon: '',
          group: '',
          isScheduled: false,
          scheduledStart: '',
          scheduledEnd: '',
          backgroundColor: '',
          textColor: '',
          fontFamily: 'system',
          fontWeight: 'normal',
          containerShape: 'rounded',
          autoTextColor: true,
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save link',
          variant: 'destructive',
        });
      },
    });
  };

  const deleteLink = (linkId: string) => {
    const updatedLinks = links.filter(link => link.id !== linkId);
    saveLinks(updatedLinks, {
      onSuccess: () => {
        toast({
          title: 'Link deleted!',
          description: 'Your link has been deleted successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete link',
          variant: 'destructive',
        });
      },
    });
  };

  const startEdit = (link: Link) => {
    setEditingLink(link);
    form.setValue('title', link.title);
    form.setValue('url', link.url);
    form.setValue('description', link.description || '');
    form.setValue('icon', link.icon || 'none');
    form.setValue('group', link.group || '');
    form.setValue('isScheduled', link.isScheduled || false);
    form.setValue('scheduledStart', link.scheduledStart || '');
    form.setValue('scheduledEnd', link.scheduledEnd || '');
    form.setValue('backgroundColor', link.backgroundColor || '');
    form.setValue('textColor', link.textColor || '');
    form.setValue('fontFamily', link.fontFamily || 'system');
    form.setValue('containerShape', link.containerShape || 'rounded');
    form.setValue('autoTextColor', link.autoTextColor ?? true);
    setIsDialogOpen(true);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIconComponent = (iconClass: string) => {
    if (!iconClass || iconClass === 'none') {
      return <ExternalLink className="w-5 h-5" />;
    }
    
    const iconMap: Record<string, React.ReactNode> = {
      'fab fa-github': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
      'fab fa-twitter': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
      'fab fa-youtube': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
      'fab fa-instagram': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
      'fab fa-linkedin': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
      'fab fa-discord': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
      'fas fa-globe': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
      'fas fa-envelope': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
      'fas fa-heart': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
      'fas fa-music': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
      'fas fa-camera': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.66.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>,
      'fas fa-link': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
    };

    return iconMap[iconClass] || <ExternalLink className="w-5 h-5" />;
  };

  const renderLinkCard = (link: any, isGrouped: boolean = false) => {
    const linkStyling = getLinkStyling(link, settings, settings?.theme);
    console.log('Link card debug:', {
      linkTitle: link.title,
      iconBorderShape: link.iconBorderShape,
      processedIconBorderShape: linkStyling.iconBorderShape
    });
    const linkContent = (
      <div 
        className={`rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer ${linkStyling.shapeClasses}`}
        style={linkStyling}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className={`w-8 h-8 bg-primary/10 flex items-center justify-center ${linkStyling.iconBorderShape}`}
              style={{ 
                color: linkStyling.iconColor || undefined,
                border: linkStyling.iconBorderWidth !== '0px' 
                  ? `${linkStyling.iconBorderWidth} ${linkStyling.iconBorderStyle} ${linkStyling.iconBorderColor}` 
                  : 'none'
              }}
            >
              {getIconComponent(link.icon || 'fas fa-link')}
            </div>
            <div className="flex-1 min-w-0">
              <h4 
                className="font-medium text-foreground truncate" 
                style={{ 
                  fontWeight: linkStyling.fontWeight,
                  color: linkStyling.color || undefined
                }}
              >
                {link.title}
              </h4>
              {link.description && (
                <p 
                  className="text-sm text-muted-foreground truncate"
                  style={{ 
                    fontWeight: linkStyling.fontWeight,
                    color: linkStyling.color || undefined
                  }}
                >
                  {link.description}
                </p>
              )}
              <p className="text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">
                {link.url}
              </p>
            </div>
            <div className="flex-shrink-0">
              <i className="fas fa-external-link-alt text-xs text-muted-foreground"></i>
            </div>
          </div>
        </div>
      </div>
    );

    // If pixel transition is enabled and not in edit mode, add it as an overlay
    if (linkStyling.pixelTransition && !isEditMode) {
      const revealText = linkStyling.pixelTransitionText || link.title;
      return (
        <div className="relative w-full">
          {linkContent}
          <div className="absolute inset-0 pointer-events-none">
            <PixelTransition
              firstContent={
                <div 
                  className="w-full h-full opacity-0"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  {/* Transparent by default, but will show link's background when active */}
                </div>
              }
              secondContent={
                <div 
                  className="w-full h-full flex items-center justify-center p-4 rounded-lg"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  <div className="text-center">
                    <h4 
                      className="font-medium"
                      style={{ color: linkStyling.color || 'var(--foreground)' }}
                    >
                      {revealText}
                    </h4>
                  </div>
                </div>
              }
              gridSize={linkStyling.pixelTransitionGridSize}
              pixelColor={linkStyling.pixelTransitionColor}
              animationStepDuration={linkStyling.pixelTransitionDuration}
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }

    return linkContent;
  };

  const renderDraggableLinkCard = (link: any, provided: any, snapshot: any, isGrouped: boolean = false) => {
    const linkStyling = getLinkStyling(link, settings, settings?.theme);
    const linkContent = (
      <div className="relative">
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`card-hover group relative cursor-pointer rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow ${
            snapshot.isDragging ? 'shadow-lg' : ''
          } ${linkStyling.shapeClasses}`}
          style={linkStyling}
          onClick={() => !isEditMode && openLink(link.url)}
          data-testid={`link-${link.id}`}
        >
          <div className="p-4">
            <div className="flex items-center gap-4">
              {isEditMode && (
                <Button
                  {...provided.dragHandleProps}
                  variant="glass"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              )}
              <div 
                className={`w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 ${linkStyling.iconBorderShape}`}
                style={{ 
                  color: linkStyling.iconColor || undefined,
                  border: linkStyling.iconBorderWidth !== '0px' 
                    ? `${linkStyling.iconBorderWidth} ${linkStyling.iconBorderStyle} ${linkStyling.iconBorderColor}` 
                    : 'none'
                }}
              >
                {getIconComponent(link.icon || 'fas fa-link')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium text-foreground truncate" 
                  style={{ 
                    fontWeight: linkStyling.fontWeight,
                    color: linkStyling.color || undefined
                  }}
                >
                  {link.title}
                </h4>
                {link.description && (
                  <p 
                    className="text-sm text-muted-foreground truncate"
                    style={{ 
                      fontWeight: linkStyling.fontWeight,
                      color: linkStyling.color || undefined
                    }}
                  >
                    {link.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {link.url}
                </p>
              </div>
              {isEditMode && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLink(link);
                      setIsDialogOpen(true);
                    }}
                    data-testid={`edit-link-${link.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLink(link.id);
                    }}
                    data-testid={`delete-link-${link.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {!isEditMode && (
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderRadius="inherit"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-45}
          glareSize={200}
          transitionDuration={600}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    );

    // If pixel transition is enabled and not in edit mode, add it as an overlay
    if (linkStyling.pixelTransition && !isEditMode) {
      const revealText = linkStyling.pixelTransitionText || link.title;
      return (
        <div className="relative w-full">
          {linkContent}
          <div className="absolute inset-0 pointer-events-none">
            <PixelTransition
              firstContent={
                <div 
                  className="w-full h-full opacity-0"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  {/* Transparent by default, but will show link's background when active */}
                </div>
              }
              secondContent={
                <div 
                  className="w-full h-full flex items-center justify-center p-4 rounded-lg"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  <div className="text-center">
                    <h4 
                      className="font-medium"
                      style={{ color: linkStyling.color || 'var(--foreground)' }}
                    >
                      {revealText}
                    </h4>
                  </div>
                </div>
              }
              gridSize={linkStyling.pixelTransitionGridSize}
              pixelColor={linkStyling.pixelTransitionColor}
              animationStepDuration={linkStyling.pixelTransitionDuration}
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }

    return linkContent;
  };

  return (
    <>
    <div className="mb-8 fade-in" data-testid="links-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">My Links</h3>
        {isEditMode && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage Groups
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsCreateGroupDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Group
                </DropdownMenuItem>
                
                {getUniqueGroups().length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                      Existing Groups
                    </div>
                    {getUniqueGroups().map((group) => {
                      const groupData = typedGroups.find(g => g.name === group);
                      const isOpen = groupData ? groupData.isOpen : true;
                      return (
                        <DropdownMenuItem
                          key={group}
                          onClick={() => toggleGroup(group)}
                        >
                          {isOpen ? (
                            <ChevronDownIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2" />
                          )}
                          {group}
                        </DropdownMenuItem>
                      );
                    })}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingLink(null);
              form.reset({
                title: '',
                url: '',
                description: '',
                icon: '',
                group: '',
                isScheduled: false,
                scheduledStart: '',
                scheduledEnd: '',
                backgroundColor: '',
                textColor: '',
                fontFamily: 'system',
                fontWeight: 'normal',
                containerShape: 'rounded',
                autoTextColor: true,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#000000',
        iconBorderWidth: settings?.enableIconBorders ? 2 : 0,
        iconBorderColor: '#000000',
        iconBorderShape: 'rounded',
                pattern: 'none',
                patternColor: '#000000',
                pixelTransition: false,
                pixelTransitionText: '',
                pixelTransitionColor: '#000000',
                pixelTransitionGridSize: 7,
                pixelTransitionDuration: 0.3,
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-add-link"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  {editingLink ? 'Edit Link' : 'Add Link'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Basic
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger value="advanced" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Advanced
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Schedule
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                              <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Link title"
                            data-testid="input-link-title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                              <FormLabel>URL *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            data-testid="input-link-url"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                      </div>
                      
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                            <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                                placeholder="Brief description of your link"
                            data-testid="textarea-link-description"
                                className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                              <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                            <SelectTrigger data-testid="select-link-icon">
                              <SelectValue placeholder="Choose an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Icon</SelectItem>
                              <SelectItem value="fab fa-github">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-github')}
                                  <span>GitHub</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fab fa-twitter">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-twitter')}
                                  <span>Twitter</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fab fa-youtube">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-youtube')}
                                  <span>YouTube</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fab fa-instagram">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-instagram')}
                                  <span>Instagram</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fab fa-linkedin">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-linkedin')}
                                  <span>LinkedIn</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fab fa-discord">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fab fa-discord')}
                                  <span>Discord</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-globe">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-globe')}
                                  <span>Website</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-envelope">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-envelope')}
                                  <span>Email</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-heart">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-heart')}
                                  <span>Heart</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-music">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-music')}
                                  <span>Music</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-camera">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-camera')}
                                  <span>Camera</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fas fa-link">
                                <div className="flex items-center gap-2">
                                  {getIconComponent('fas fa-link')}
                                  <span>Link</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                        
                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => {
                      console.log('🔍 Group field rendered with value:', field.value);
                      return (
                        <FormItem>
                                <FormLabel>Group</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="e.g., Social Media, Projects, etc."
                              data-testid="input-link-group"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      );
                    }}
                  />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-6 mt-6">
                      {/* Colors Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Colors
                          </h3>
                          <FormField
                            control={form.control}
                            name="autoTextColor"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center gap-3">
                                <FormLabel className="text-sm">Auto Text Color</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    size="sm"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="backgroundColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Background</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#ffffff'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#ffffff"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Text</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#000000'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#000000"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="fontWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Weight</FormLabel>
                                <FormControl>
                                  <Select value={field.value || 'normal'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select font weight" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="bold">Bold</SelectItem>
                                      <SelectItem value="bolder">Bolder</SelectItem>
                                      <SelectItem value="lighter">Lighter</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="iconColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Icon Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#000000'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#000000"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="iconBorderWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Icon Border: {field.value || 0}px</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={6}
                                    step={1}
                                    value={[field.value || 0]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="iconBorderColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Icon Border Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#000000'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#000000"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="iconBorderShape"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Icon Border Shape</FormLabel>
                                <FormControl>
                                  <Select value={field.value || 'rounded'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select shape" />
                                    </SelectTrigger>
                                                                         <SelectContent>
                                       {iconBorderShapeOptions.map((option) => (
                                         <SelectItem key={option.value} value={option.value}>
                                           <div className="flex items-center gap-2">
                                             {option.icon}
                                             <span>{option.label}</span>
                                           </div>
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Shape & Typography Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Shapes className="w-5 h-5" />
                          Shape & Typography
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="containerShape"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Container Shape</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value || 'rounded'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a shape" />
                                    </SelectTrigger>
                                                                         <SelectContent>
                                       {shapeOptions.map((shape) => (
                                         <SelectItem key={shape.value} value={shape.value}>
                                           <div className="flex items-center gap-2">
                                             {shape.icon}
                                             <span>{shape.label}</span>
                                           </div>
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="fontFamily"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Family</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value || 'system'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {fontOptions.map((font) => (
                                        <SelectItem key={font.value} value={font.value}>
                                          <span style={{ fontFamily: font.value === 'system' ? 'inherit' : font.value }}>
                                            {font.label}
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Borders Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Borders
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="borderColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#000000'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#000000"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="borderWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Width: {field.value || 0}px</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={8}
                                    step={1}
                                    value={[field.value || 0]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="borderStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Style</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value || 'solid'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose style" />
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
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Background Patterns Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Background Patterns
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="pattern"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pattern Type</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose pattern" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      <SelectItem value="dots">Dots</SelectItem>
                                      <SelectItem value="lines">Lines</SelectItem>
                                      <SelectItem value="grid">Grid</SelectItem>
                                      <SelectItem value="diagonal">Diagonal</SelectItem>
                                      <SelectItem value="waves">Waves</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="patternColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pattern Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="color"
                                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                                      value={field.value || '#000000'}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <Input
                                      placeholder="#000000"
                                      className="flex-1 text-sm"
                                      value={field.value || ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Pixel Transition Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Pixel Transition Effect
                          </h3>
                          <FormField
                            control={form.control}
                            name="pixelTransition"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center gap-3">
                                <FormLabel className="text-sm">Enable</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    size="sm"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {form.watch('pixelTransition') && (
                          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="pixelTransitionText"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Reveal Text</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter text to reveal..."
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="pixelTransitionColor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Pixel Color</FormLabel>
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="color"
                                          className="w-10 h-10 p-1 border rounded cursor-pointer"
                                          value={field.value || '#000000'}
                                          onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <Input
                                          placeholder="#000000"
                                          className="flex-1 text-sm"
                                          value={field.value || ''}
                                          onChange={(e) => field.onChange(e.target.value)}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="pixelTransitionGridSize"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Grid Size: {field.value}</FormLabel>
                                    <FormControl>
                                      <Slider
                                        min={3}
                                        max={15}
                                        step={1}
                                        value={[field.value || 7]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="pixelTransitionDuration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration: {field.value}s</FormLabel>
                                    <FormControl>
                                      <Slider
                                        min={0.1}
                                        max={2.0}
                                        step={0.1}
                                        value={[field.value || 0.3]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Advanced Settings
                        </h3>
                        
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Advanced customization options will be available here in future updates.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Link Scheduling
                        </h3>
                        
                    <FormField
                      control={form.control}
                          name="isScheduled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                  Enable Scheduling
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                                  Show/hide this link based on date and time
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch('isScheduled') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="scheduledStart"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date & Time</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="datetime-local"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Link becomes visible at this time
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="scheduledEnd"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date & Time</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="datetime-local"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Link hides after this time
                                  </FormDescription>
                                  <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-link">
                      {editingLink ? 'Update Link' : 'Add Link'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-link"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          </div>
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="Enter group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createGroup()}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Title Text Color
              </label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="color"
                  className="w-12 h-10 p-1 border rounded"
                  value={newGroupTitleColor}
                  onChange={(e) => setNewGroupTitleColor(e.target.value)}
                />
                <Input
                  placeholder="#ffffff"
                  className="flex-1"
                  value={newGroupTitleColor}
                  onChange={(e) => setNewGroupTitleColor(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the text color for the group title (default: white)
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={createGroup} disabled={!newGroupName.trim()}>
                Create Group
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateGroupDialogOpen(false);
                  setNewGroupName('');
                  setNewGroupTitleColor('#ffffff');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Droppable droppableId="links" isDropDisabled={!isEditMode}>
        {(provided) => (
          <div 
            className="space-y-4" 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            data-testid="links-container"
          >
            {(() => {
              const sortedLinks = links.sort((a, b) => a.order - b.order);
              const groups = getUniqueGroups();
              const linksWithoutGroups = sortedLinks.filter(link => !link.group);
              
              
              let currentIndex = 0;
              
              return (
                <>
                  
                  {/* Show links without groups first */}
                  {linksWithoutGroups.map((link, index) => (
                <Draggable 
                  key={link.id} 
                  draggableId={link.id} 
                      index={currentIndex++}
                  isDragDisabled={!isEditMode}
                >
                  {(provided, snapshot) => (
                    renderDraggableLinkCard(link, provided, snapshot)
                      )}
                    </Draggable>
                  ))}
                  
                  {/* Show grouped links */}
                  {getUniqueGroups().map((groupName) => {
                    const groupLinks = sortedLinks.filter(link => link.group === groupName);
                    const groupData = typedGroups.find(g => g.name === groupName);
                    const isGroupOpen = groupData ? groupData.isOpen : true;
                    
                    return (
                      <div key={groupName}>
                                                 <div 
                           className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                           onClick={() => toggleGroup(groupName)}
                         >
                           {isGroupOpen ? (
                             <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
                           ) : (
                             <ChevronRight className="w-5 h-5 text-muted-foreground" />
                           )}
                           <Folder className="w-4 h-4" style={{ color: groupData?.titleTextColor || '#ffffff' }} />
                           <h4 
                             className="font-medium" 
                             style={{ color: groupData?.titleTextColor || '#ffffff' }}
                           >
                             {groupName}
                           </h4>
                           <span className="text-sm text-muted-foreground">({groupLinks.length})</span>
                         </div>
                        
                        {isGroupOpen && (
                          <div className="ml-4 space-y-4">
                            {groupLinks.map((link) => (
                              <Draggable 
                                key={link.id} 
                                draggableId={link.id} 
                                index={currentIndex++}
                                isDragDisabled={!isEditMode}
                              >
                                {(provided, snapshot) => (
                                  renderDraggableLinkCard(link, provided, snapshot)
                  )}
                </Draggable>
              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })()}
            {provided.placeholder}
            
            {links.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No links yet. {isEditMode ? 'Add your first link!' : ''}</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
    </>
  );
}
