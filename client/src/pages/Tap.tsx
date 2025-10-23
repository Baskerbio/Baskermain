import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Share2, 
  Copy, 
  ArrowRight,
  Sparkles,
  Palette,
  Zap,
  Heart,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Printer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Tap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState('blue');

  const handleCopyCardURL = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/tap`);
      toast({
        title: 'Card URL Copied!',
        description: 'Your Tap page URL has been copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const handleShareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Basker Card',
        text: 'Check out my digital business card on Basker!',
        url: `${window.location.origin}/tap`
      });
    } else {
      handleCopyCardURL();
    }
  };

  const handleDownloadCard = () => {
    toast({
      title: 'Download Feature',
      description: 'Card download feature coming soon!',
    });
  };

  const cardVariants = [
    { id: 'blue', name: 'Professional Blue', color: 'from-blue-500 to-blue-600' },
    { id: 'purple', name: 'Creative Purple', color: 'from-purple-500 to-purple-600' },
    { id: 'green', name: 'Tech Green', color: 'from-green-500 to-green-600' },
    { id: 'orange', name: 'Wellness Orange', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Basker</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">The Tap</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCardURL}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareCard}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Link href="/profile">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Digital Business Card</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            The <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Tap</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Your digital business card that fits in your pocket. 
            Share your professional identity with a simple tap.
          </p>
        </div>

        {/* Main Card Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Card Preview */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Your Card</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">Preview and customize your digital business card</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Live Preview
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {/* Card Preview */}
                <div className="flex justify-center mb-6">
                  <div className="physical-card-container">
                    <div className="physical-card-border">
                      <div className={`physical-card physical-card-${selectedCard}`}>
                        {/* Top right corner branding */}
                        <div className="absolute top-3 right-3 text-white/80 text-xs font-mono">BASKER</div>
                        
                        {/* Large name in center */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-2xl font-bold text-center">
                          {user?.displayName || user?.handle || 'YOUR NAME'}
                        </div>
                        
                        {/* Title below name */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white/90 text-xs sm:text-sm text-center">
                          Professional Title
                        </div>
                        
                        {/* Contact info */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-xs sm:text-sm text-center">
                          <div>your@email.com</div>
                          <div className="text-[10px] sm:text-xs mt-1">+1 (555) 123-4567</div>
                        </div>
                        
                        {/* User handle in top left */}
                        <div className="absolute top-2 left-2 text-white/80 text-[10px] sm:text-xs font-mono">
                          @{user?.handle || 'yourhandle.bsky.social'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleDownloadCard} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleShareCard} className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Customization */}
          <div className="space-y-6">
            {/* Style Selection */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Card Styles</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your professional look</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {cardVariants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedCard === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedCard(variant.id)}
                      className="justify-start h-auto p-3"
                    >
                      <div className={`w-4 h-4 rounded mr-3 bg-gradient-to-r ${variant.color}`}></div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{variant.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Features</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">What makes your card special</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mobile optimized</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Shareable link</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Print ready</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Professional design</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your card</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleDownloadCard}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Card
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleShareCard}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Card
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleCopyCardURL}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Card URL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why The Tap Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Why The Tap?</h3>
                <p className="text-gray-600 dark:text-gray-400">Your digital business card for the modern world</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mobile First</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Designed for smartphones and tablets with perfect responsive layouts
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Always Updated</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your information stays current - no more outdated business cards
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multiple design options to match your personal or corporate brand
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
