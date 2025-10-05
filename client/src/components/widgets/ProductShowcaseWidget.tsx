import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Settings,
  CreditCard,
  Store,
  Package,
  Tag,
  DollarSign,
  Link as LinkIcon,
  Image as ImageIcon,
  ShoppingCart,
  Heart,
  Eye,
  Share2,
  Zap,
  Crown,
  Award,
  TrendingUp
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  isAvailable: boolean;
  inStock: boolean;
  stockCount?: number;
  tags: string[];
  platform: 'stripe' | 'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'custom';
  platformUrl: string;
  platformProductId?: string;
  affiliateUrl?: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductShowcaseWidgetProps {
  config: {
    title: string;
    showPrices: boolean;
    showCategories: boolean;
    showStock: boolean;
    showRatings: boolean;
    showDiscounts: boolean;
    itemsPerRow: number;
    layout: 'grid' | 'list' | 'carousel';
    sortBy: 'name' | 'price' | 'date' | 'rating' | 'featured';
    sortOrder: 'asc' | 'desc';
    filterByCategory: boolean;
    showFilters: boolean;
    enableAffiliate: boolean;
    showPlatform: boolean;
  };
  isEditMode?: boolean;
  onConfigChange?: (config: any) => void;
}

export default function ProductShowcaseWidget({ config, isEditMode = false, onConfigChange }: ProductShowcaseWidgetProps) {
  const [products, setProducts] = useState<Product[]>(config.products || []);

  // Sync products with config when it changes
  useEffect(() => {
    if (config.products) {
      setProducts(config.products);
    }
  }, [config.products]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    currency: 'USD',
    imageUrl: '',
    category: '',
    platform: 'custom',
    platformUrl: '',
    platformProductId: '',
    affiliateUrl: '',
    tags: '',
    stockCount: '',
    rating: '',
    reviewCount: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>(config.sortBy || 'featured');
  const [sortOrder, setSortOrder] = useState<string>(config.sortOrder || 'desc');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'stripe': return CreditCard;
      case 'shopify': return Store;
      case 'woocommerce': return Package;
      case 'etsy': return Store;
      case 'amazon': return Store;
      case 'custom': return LinkIcon;
      default: return Store;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'stripe': return 'text-blue-600 bg-blue-50';
      case 'shopify': return 'text-green-600 bg-green-50';
      case 'woocommerce': return 'text-purple-600 bg-purple-50';
      case 'etsy': return 'text-orange-600 bg-orange-50';
      case 'amazon': return 'text-yellow-600 bg-yellow-50';
      case 'custom': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      currency: 'USD',
      imageUrl: '',
      category: '',
      platform: 'custom',
      platformUrl: '',
      platformProductId: '',
      affiliateUrl: '',
      tags: '',
      stockCount: '',
      rating: '',
      reviewCount: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      currency: product.currency,
      imageUrl: product.imageUrl,
      category: product.category,
      platform: product.platform,
      platformUrl: product.platformUrl,
      platformProductId: product.platformProductId || '',
      affiliateUrl: product.affiliateUrl || '',
      tags: product.tags.join(', '),
      stockCount: product.stockCount?.toString() || '',
      rating: product.rating?.toString() || '',
      reviewCount: product.reviewCount?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) return;

    const newProduct: Product = {
      id: editingProduct?.id || `product_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      currency: formData.currency,
      imageUrl: formData.imageUrl,
      category: formData.category,
      featured: false,
      isAvailable: true,
      inStock: true,
      stockCount: formData.stockCount ? parseInt(formData.stockCount) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      platform: formData.platform as any,
      platformUrl: formData.platformUrl,
      platformProductId: formData.platformProductId,
      affiliateUrl: formData.affiliateUrl,
      discount: formData.originalPrice ? Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100) : undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : undefined,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }
    
    setProducts(updatedProducts);
    
    // Save to config
    if (onConfigChange) {
      onConfigChange({
        ...config,
        products: updatedProducts
      });
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    
    // Save to config
    if (onConfigChange) {
      onConfigChange({
        ...config,
        products: updatedProducts
      });
    }
  };

  const handleProductClick = (product: Product) => {
    const url = product.affiliateUrl || product.platformUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case 'price':
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        case 'rating':
          return sortOrder === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0);
        case 'featured':
          return sortOrder === 'asc' ? (a.featured ? 1 : 0) - (b.featured ? 1 : 0) : (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'date':
        default:
          return sortOrder === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (isEditMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Product Showcase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Products ({products.length})</span>
              <Button size="sm" onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="space-y-2">
              {products.map((product) => {
                const PlatformIcon = getPlatformIcon(product.platform);
                return (
                  <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${getPlatformColor(product.platform)}`}>
                          <PlatformIcon className="w-3 h-3 mr-1" />
                          {product.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ${product.price} {product.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Premium Digital Course"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Education, Fashion, Art"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your product"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="29.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Original Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                        placeholder="39.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Image URL</Label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="shopify">Shopify</SelectItem>
                        <SelectItem value="woocommerce">WooCommerce</SelectItem>
                        <SelectItem value="etsy">Etsy</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="custom">Custom Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Platform URL *</Label>
                    <Input
                      value={formData.platformUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, platformUrl: e.target.value }))}
                      placeholder="https://buy.stripe.com/example or https://mystore.com/product"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Affiliate URL (Optional)</Label>
                    <Input
                      value={formData.affiliateUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, affiliateUrl: e.target.value }))}
                      placeholder="https://affiliate-link.com/product"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="digital, course, premium"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveProduct} className="flex-1">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          {config.title || 'Products'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters and Sorting */}
          {config.showFilters && (
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(c => c !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Products Grid */}
          <div className={`grid ${gridCols[config.itemsPerRow as keyof typeof gridCols]} gap-4`}>
            {filteredProducts.map((product) => {
              const PlatformIcon = getPlatformIcon(product.platform);
              const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              
              return (
                <div 
                  key={product.id} 
                  className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 left-2" variant="default">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {discount > 0 && (
                      <Badge className="absolute top-2 right-2" variant="destructive">
                        -{discount}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">
                          <Package className="h-3 w-3 mr-1" />
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm line-clamp-1 flex-1">{product.name}</h4>
                      {config.showPlatform && (
                        <Badge variant="outline" className={`text-xs ${getPlatformColor(product.platform)}`}>
                          <PlatformIcon className="w-3 h-3 mr-1" />
                          {product.platform}
                        </Badge>
                      )}
                    </div>
                    
                    {config.showCategories && product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    {config.showRatings && product.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.rating} ({product.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                    
                    {config.showStock && product.stockCount !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                      </div>
                    )}
                    
                    {config.showPrices && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            ${product.price.toFixed(2)} {product.currency}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {product.platform === 'custom' ? 'View' : 'Buy'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
