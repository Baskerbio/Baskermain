import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock, Star } from 'lucide-react';

interface ProductShowcaseWidgetProps {
  config: {
    title?: string;
    showPrices?: boolean;
    showCategories?: boolean;
    itemsPerRow?: number;
  };
  onConfigChange: (config: any) => void;
}

export default function ProductShowcaseWidget({ config, onConfigChange }: ProductShowcaseWidgetProps) {
  const {
    title = 'Products',
    showPrices = true,
    showCategories = true,
    itemsPerRow = 3,
  } = config;

  // Mock data for demonstration
  const mockProducts = [
    {
      id: '1',
      name: 'Premium Widget',
      description: 'High-quality widget for all your needs',
      price: 29.99,
      currency: 'USD',
      imageUrl: 'https://via.placeholder.com/300x200?text=Product+1',
      category: 'Widgets',
      featured: true,
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Deluxe Package',
      description: 'Complete solution with everything included',
      price: 99.99,
      currency: 'USD',
      imageUrl: 'https://via.placeholder.com/300x200?text=Product+2',
      category: 'Packages',
      featured: false,
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Coming Soon Item',
      description: 'This amazing product is launching soon!',
      price: 0,
      currency: 'USD',
      imageUrl: 'https://via.placeholder.com/300x200?text=Coming+Soon',
      category: 'Upcoming',
      featured: true,
      isAvailable: false,
    },
  ];

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            Coming Soon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Product Showcase Coming Soon!</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            We're working on an amazing product showcase feature that will let you display and sell your products directly from your profile.
          </p>
        </div>

        {/* Preview Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
          <div className={`grid ${gridCols[itemsPerRow as keyof typeof gridCols]} gap-4`}>
            {mockProducts.map((product) => (
              <div key={product.id} className="group relative border rounded-lg overflow-hidden bg-card">
                <div className="aspect-square overflow-hidden bg-muted">
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
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    {showCategories && product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  {showPrices && product.price > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        ${product.price.toFixed(2)} {product.currency}
                      </span>
                      <Button size="sm" disabled>
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  )}
                  {product.price === 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Coming Soon</span>
                      <Button size="sm" variant="outline" disabled>
                        Notify Me
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Planned Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Product management
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Payment integration
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Inventory tracking
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Order management
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Customer reviews
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Analytics dashboard
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
