import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useSaveLinks } from '@/hooks/use-atprotocol';
import { Upload, FileText, AlertCircle, CheckCircle2, Linkedin, Globe, Youtube, Github, Mail, Phone, MapPin, Calendar, Users, Heart, MessageCircle, Share2, Link2, Zap, Star, Plus } from 'lucide-react';
import { Link } from '@shared/schema';

export function ImportData() {
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState<'linktree' | 'beacons' | 'biolink' | 'taplink' | 'linkedin' | 'manual' | 'json' | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [platformUrl, setPlatformUrl] = useState('');
  const [manualLinks, setManualLinks] = useState([{ title: '', url: '', description: '' }]);
  const { mutate: saveLinks } = useSaveLinks();
  const { toast } = useToast();

  const handleLinktreeImport = (url: string) => {
    setImporting(true);
    
    // Simulate Linktree import - in real implementation, you'd scrape the page
    setTimeout(() => {
      const mockLinks: Link[] = [
        {
          id: `linktree_${Date.now()}_1`,
          title: 'Website',
          url: 'https://example.com',
          description: 'My personal website',
          icon: 'globe',
          group: 'Main',
          order: 0,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `linktree_${Date.now()}_2`,
          title: 'Instagram',
          url: 'https://instagram.com/username',
          description: 'Follow me on Instagram',
          icon: 'instagram',
          group: 'Social',
          order: 1,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#E4405F',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      saveLinks(mockLinks, {
        onSuccess: () => {
          toast({
            title: 'Linktree Import Successful!',
            description: `Imported ${mockLinks.length} links from Linktree`,
          });
          setPlatformUrl('');
          setImportType(null);
        },
        onError: () => {
    toast({
            title: 'Import Failed',
            description: 'Failed to import from Linktree',
            variant: 'destructive',
          });
        },
      });
      setImporting(false);
    }, 2000);
  };

  const handleBeaconsImport = (url: string) => {
    setImporting(true);
    
    // Simulate Beacons.ai import
    setTimeout(() => {
      const mockLinks: Link[] = [
        {
          id: `beacons_${Date.now()}_1`,
          title: 'Portfolio',
          url: 'https://portfolio.example.com',
          description: 'Check out my work',
          icon: 'briefcase',
          group: 'Work',
          order: 0,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#6366F1',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `beacons_${Date.now()}_2`,
          title: 'YouTube',
          url: 'https://youtube.com/@username',
          description: 'Subscribe to my channel',
          icon: 'youtube',
          group: 'Content',
          order: 1,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#FF0000',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      saveLinks(mockLinks, {
        onSuccess: () => {
          toast({
            title: 'Beacons.ai Import Successful!',
            description: `Imported ${mockLinks.length} links from Beacons.ai`,
          });
          setPlatformUrl('');
          setImportType(null);
        },
        onError: () => {
          toast({
            title: 'Import Failed',
            description: 'Failed to import from Beacons.ai',
            variant: 'destructive',
          });
        },
      });
      setImporting(false);
    }, 2000);
  };

  const handleBiolinkImport = (url: string) => {
    setImporting(true);
    
    // Simulate Bio.link import
    setTimeout(() => {
      const mockLinks: Link[] = [
        {
          id: `biolink_${Date.now()}_1`,
          title: 'Portfolio',
          url: 'https://portfolio.example.com',
          description: 'Check out my work',
          icon: 'briefcase',
          group: 'Work',
          order: 0,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#6366F1',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `biolink_${Date.now()}_2`,
          title: 'Contact',
          url: 'mailto:hello@example.com',
          description: 'Get in touch',
          icon: 'mail',
          group: 'Contact',
          order: 1,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#10B981',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `biolink_${Date.now()}_3`,
          title: 'Blog',
          url: 'https://blog.example.com',
          description: 'Read my latest posts',
          icon: 'file-text',
          group: 'Content',
          order: 2,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#F59E0B',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      saveLinks(mockLinks, {
        onSuccess: () => {
          toast({
            title: 'Bio.link Import Successful!',
            description: `Imported ${mockLinks.length} links from Bio.link`,
          });
          setPlatformUrl('');
          setImportType(null);
        },
        onError: () => {
          toast({
            title: 'Import Failed',
            description: 'Failed to import from Bio.link',
            variant: 'destructive',
          });
        },
      });
      setImporting(false);
    }, 2000);
  };

  const handleTaplinkImport = (url: string) => {
    setImporting(true);
    
    // Simulate TapLink import
    setTimeout(() => {
      const mockLinks: Link[] = [
        {
          id: `taplink_${Date.now()}_1`,
          title: 'Shop',
          url: 'https://shop.example.com',
          description: 'Browse my products',
          icon: 'shopping-bag',
          group: 'Business',
          order: 0,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#EC4899',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `taplink_${Date.now()}_2`,
          title: 'Services',
          url: 'https://services.example.com',
          description: 'View my services',
          icon: 'star',
          group: 'Business',
          order: 1,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#8B5CF6',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `taplink_${Date.now()}_3`,
          title: 'Book Call',
          url: 'https://calendly.com/example',
          description: 'Schedule a meeting',
          icon: 'calendar',
          group: 'Contact',
          order: 2,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#06B6D4',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      saveLinks(mockLinks, {
        onSuccess: () => {
          toast({
            title: 'TapLink Import Successful!',
            description: `Imported ${mockLinks.length} links from TapLink`,
          });
          setPlatformUrl('');
          setImportType(null);
        },
        onError: () => {
          toast({
            title: 'Import Failed',
            description: 'Failed to import from TapLink',
            variant: 'destructive',
          });
        },
      });
      setImporting(false);
    }, 2000);
  };

  const handleLinkedInImport = (url: string) => {
    setImporting(true);
    
    // Simulate LinkedIn profile import
    setTimeout(() => {
      const mockLinks: Link[] = [
        {
          id: `linkedin_${Date.now()}_1`,
          title: 'LinkedIn Profile',
          url: url,
          description: 'Connect with me on LinkedIn',
          icon: 'linkedin',
          group: 'Professional',
          order: 0,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#0077B5',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `linkedin_${Date.now()}_2`,
          title: 'Resume',
          url: `${url}/resume`,
          description: 'Download my resume',
          icon: 'file-text',
          group: 'Professional',
          order: 1,
          enabled: true,
          isScheduled: false,
          backgroundColor: '#6B7280',
          textColor: '#ffffff',
          fontFamily: 'system',
          containerShape: 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      saveLinks(mockLinks, {
        onSuccess: () => {
          toast({
            title: 'LinkedIn Import Successful!',
            description: `Imported ${mockLinks.length} links from LinkedIn`,
          });
          setPlatformUrl('');
          setImportType(null);
        },
        onError: () => {
          toast({
            title: 'Import Failed',
            description: 'Failed to import from LinkedIn',
            variant: 'destructive',
          });
        },
      });
      setImporting(false);
    }, 2000);
  };

  const handleManualImport = () => {
    const validLinks = manualLinks.filter(link => link.title && link.url);
    
    if (validLinks.length === 0) {
      toast({
        title: 'No Valid Links',
        description: 'Please add at least one link with a title and URL',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);
    
    const links: Link[] = validLinks.map((link, index) => ({
      id: `manual_${Date.now()}_${index}`,
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: '',
      group: 'Manual',
      order: index,
      enabled: true,
      isScheduled: false,
      backgroundColor: '#3B82F6',
      textColor: '#ffffff',
      fontFamily: 'system',
      containerShape: 'rounded',
      autoTextColor: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    saveLinks(links, {
      onSuccess: () => {
        toast({
          title: 'Manual Import Successful!',
          description: `Imported ${links.length} links manually`,
        });
        setManualLinks([{ title: '', url: '', description: '' }]);
        setImportType(null);
      },
      onError: () => {
    toast({
          title: 'Import Failed',
          description: 'Failed to save manual links',
          variant: 'destructive',
        });
      },
    });
    setImporting(false);
  };

  const addManualLink = () => {
    setManualLinks([...manualLinks, { title: '', url: '', description: '' }]);
  };

  const removeManualLink = (index: number) => {
    if (manualLinks.length > 1) {
      setManualLinks(manualLinks.filter((_, i) => i !== index));
    }
  };

  const updateManualLink = (index: number, field: 'title' | 'url' | 'description', value: string) => {
    const updated = [...manualLinks];
    updated[index][field] = value;
    setManualLinks(updated);
  };

  const handleJSONImport = () => {
    setImporting(true);
    
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validate and transform the data
      let links: Link[] = [];
      
      if (Array.isArray(parsed)) {
        // Direct array of links
        links = parsed.map((item, index) => ({
          id: `imported_${Date.now()}_${index}`,
          title: item.title || item.name || 'Imported Link',
          url: item.url || item.link || '',
          description: item.description || '',
          icon: item.icon || '',
          group: item.group || item.category || '',
          order: index,
          enabled: item.enabled !== false,
          isScheduled: false,
          backgroundColor: item.backgroundColor || item.bgColor || '',
          textColor: item.textColor || '',
          fontFamily: item.fontFamily || 'system',
          containerShape: item.containerShape || 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      } else if (parsed.links && Array.isArray(parsed.links)) {
        // Object with links array
        links = parsed.links.map((item: any, index: number) => ({
          id: `imported_${Date.now()}_${index}`,
          title: item.title || item.name || 'Imported Link',
          url: item.url || item.link || '',
          description: item.description || '',
          icon: item.icon || '',
          group: item.group || item.category || '',
          order: index,
          enabled: item.enabled !== false,
          isScheduled: false,
          backgroundColor: item.backgroundColor || item.bgColor || '',
          textColor: item.textColor || '',
          fontFamily: item.fontFamily || 'system',
          containerShape: item.containerShape || 'rounded',
          autoTextColor: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }

      // Validate that we have valid links
      if (links.length === 0) {
        throw new Error('No valid links found in JSON');
      }

      // Check that all links have required fields
      const invalidLinks = links.filter(link => !link.url);
      if (invalidLinks.length > 0) {
        throw new Error(`${invalidLinks.length} links are missing URLs`);
      }

      // Save the links
      saveLinks(links, {
        onSuccess: () => {
          toast({
            title: 'Import Successful!',
            description: `Imported ${links.length} links successfully`,
          });
          setJsonData('');
          setImportType(null);
        },
        onError: (error) => {
          toast({
            title: 'Import Failed',
            description: 'Failed to save imported links',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: error instanceof Error ? error.message : 'Please check your JSON format',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Import Data</h2>
        <p className="text-muted-foreground">
          Import your links from other platforms or from a JSON file
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'linktree' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('linktree')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Linktree</h3>
            <p className="text-sm text-muted-foreground">Import from Linktree</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'beacons' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('beacons')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Beacons.ai</h3>
            <p className="text-sm text-muted-foreground">Import from Beacons</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'biolink' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('biolink')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Bio.link</h3>
            <p className="text-sm text-muted-foreground">Import from Bio.link</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'taplink' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('taplink')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">TapLink</h3>
            <p className="text-sm text-muted-foreground">Import from TapLink</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'linkedin' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('linkedin')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">LinkedIn</h3>
            <p className="text-sm text-muted-foreground">Import from LinkedIn</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'manual' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('manual')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Manual Entry</h3>
            <p className="text-sm text-muted-foreground">Add links manually</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary hover:scale-105 ${importType === 'json' ? 'border-primary bg-primary/5' : ''}`}
          onClick={() => setImportType('json')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">JSON File</h3>
            <p className="text-sm text-muted-foreground">Import JSON data</p>
          </CardContent>
        </Card>
      </div>

      {importType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {importType === 'linktree' && 'Import from Linktree'}
              {importType === 'beacons' && 'Import from Beacons.ai'}
              {importType === 'biolink' && 'Import from Bio.link'}
              {importType === 'taplink' && 'Import from TapLink'}
              {importType === 'linkedin' && 'Import from LinkedIn'}
              {importType === 'manual' && 'Manual Link Entry'}
              {importType === 'json' && 'Import JSON Data'}
            </CardTitle>
            <CardDescription>
              {importType === 'json' ? 'Paste your JSON data below' : 
               importType === 'manual' ? 'Add your links manually' :
               'Enter your profile URL to import links'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {importType === 'json' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jsonData">JSON Data</Label>
                  <Textarea
                    id="jsonData"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    placeholder={`Paste your JSON here, example:\n[\n  {\n    "title": "My Website",\n    "url": "https://example.com",\n    "description": "Check out my site"\n  }\n]`}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>JSON Format:</strong> Upload an array of objects with at least <code>title</code> and <code>url</code> fields.
                    Optional fields: <code>description</code>, <code>icon</code>, <code>group</code>, <code>backgroundColor</code>, <code>textColor</code>
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleJSONImport} 
                  disabled={!jsonData || importing}
                  className="w-full"
                >
                  {importing ? 'Importing...' : 'Import Links'}
                </Button>
              </>
            ) : importType === 'manual' ? (
              <>
                <div className="space-y-4">
                  {manualLinks.map((link, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Link {index + 1}</h4>
                        {manualLinks.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeManualLink(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`title-${index}`}>Title *</Label>
                          <Input
                            id={`title-${index}`}
                            value={link.title}
                            onChange={(e) => updateManualLink(index, 'title', e.target.value)}
                            placeholder="e.g., My Website"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`url-${index}`}>URL *</Label>
                          <Input
                            id={`url-${index}`}
                            value={link.url}
                            onChange={(e) => updateManualLink(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            type="url"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                        <Input
                          id={`description-${index}`}
                          value={link.description}
                          onChange={(e) => updateManualLink(index, 'description', e.target.value)}
                          placeholder="Brief description of this link"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addManualLink}
                    className="w-full"
                  >
                    + Add Another Link
                  </Button>
                </div>

                <Button 
                  onClick={handleManualImport} 
                  disabled={importing}
                  className="w-full"
                >
                  {importing ? 'Importing...' : 'Import Links'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="platformUrl">Profile URL</Label>
                  <Input
                    id="platformUrl"
                    value={platformUrl}
                    onChange={(e) => setPlatformUrl(e.target.value)}
                    placeholder={
                      importType === 'linktree' ? 'https://linktr.ee/username' :
                      importType === 'beacons' ? 'https://beacons.ai/username' :
                      importType === 'biolink' ? 'https://bio.link/username' :
                      importType === 'taplink' ? 'https://taplink.cc/username' :
                      importType === 'linkedin' ? 'https://linkedin.com/in/username' :
                      'Enter your profile URL'
                    }
                    type="url"
                  />
                </div>

              <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                    <strong>Demo Mode:</strong> This will import sample links to demonstrate the functionality. 
                    In a real implementation, this would scrape your actual profile data.
                </AlertDescription>
              </Alert>

                <Button 
                  onClick={() => {
                    if (importType === 'linktree') handleLinktreeImport(platformUrl);
                    else if (importType === 'beacons') handleBeaconsImport(platformUrl);
                    else if (importType === 'biolink') handleBiolinkImport(platformUrl);
                    else if (importType === 'taplink') handleTaplinkImport(platformUrl);
                    else if (importType === 'linkedin') handleLinkedInImport(platformUrl);
                  }}
                  disabled={!platformUrl || importing}
                  className="w-full"
                >
                  {importing ? 'Importing...' : 'Import Links'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!importType && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Select an import method above to get started. Your existing links will not be affected.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

