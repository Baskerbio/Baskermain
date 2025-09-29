import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { atprotocol } from '@/lib/atprotocol';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  tags: string[];
  linkUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioGalleryWidgetProps {
  config: {
    title?: string;
    showCategories?: boolean;
    showTags?: boolean;
    itemsPerRow?: number;
    showFeatured?: boolean;
    enableLightbox?: boolean;
  };
  onConfigChange: (config: any) => void;
}

export default function PortfolioGalleryWidget({ config, onConfigChange }: PortfolioGalleryWidgetProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    title = 'Portfolio',
    showCategories = true,
    showTags = true,
    itemsPerRow = 3,
    showFeatured = true,
    enableLightbox = true,
  } = config;

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setIsLoading(true);
      const items = await atprotocol.getPortfolioItems();
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePortfolioItems = async (items: PortfolioItem[]) => {
    try {
      await atprotocol.savePortfolioItems(items);
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error saving portfolio items:', error);
    }
  };

  const handleAddItem = async (itemData: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: PortfolioItem = {
      ...itemData,
      id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = [...portfolioItems, newItem];
    await savePortfolioItems(updatedItems);
    setIsDialogOpen(false);
  };

  const handleEditItem = async (itemData: PortfolioItem) => {
    const updatedItems = portfolioItems.map(item =>
      item.id === itemData.id ? { ...itemData, updatedAt: new Date().toISOString() } : item
    );
    await savePortfolioItems(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedItems = portfolioItems.filter(item => item.id !== itemId);
    await savePortfolioItems(updatedItems);
  };

  const getCategories = () => {
    const categories = portfolioItems
      .map(item => item.category)
      .filter(Boolean)
      .filter((category, index, self) => self.indexOf(category) === index);
    return categories;
  };

  const filteredItems = portfolioItems.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return item.featured;
    return item.category === selectedCategory;
  });

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading portfolio...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        {showCategories && getCategories().length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {showFeatured && (
              <Button
                variant={selectedCategory === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('featured')}
              >
                Featured
              </Button>
            )}
            {getCategories().map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No portfolio items yet</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </div>
        ) : (
          <div className={`grid ${gridCols[itemsPerRow as keyof typeof gridCols]} gap-4`}>
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {showTags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.linkUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => window.open(item.linkUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Project
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Item Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </DialogTitle>
            </DialogHeader>
            <PortfolioItemForm
              item={editingItem}
              onSave={editingItem ? handleEditItem : handleAddItem}
              onCancel={() => {
                setEditingItem(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

interface PortfolioItemFormProps {
  item?: PortfolioItem | null;
  onSave: (item: any) => void;
  onCancel: () => void;
}

function PortfolioItemForm({ item, onSave, onCancel }: PortfolioItemFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    category: item?.category || '',
    tags: item?.tags.join(', ') || '',
    linkUrl: item?.linkUrl || '',
    featured: item?.featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Web Design, Photography"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div>
        <Label htmlFor="linkUrl">Project Link</Label>
        <Input
          id="linkUrl"
          value={formData.linkUrl}
          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
          placeholder="https://example.com/project"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, design, portfolio"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured">Featured item</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
}
