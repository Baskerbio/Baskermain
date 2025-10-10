import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useSaveLinks } from '@/hooks/use-atprotocol';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from '@shared/schema';

export function ImportData() {
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState<'linktree' | 'beacons' | 'json' | null>(null);
  const [jsonData, setJsonData] = useState('');
  const { mutate: saveLinks } = useSaveLinks();
  const { toast } = useToast();

  const handleLinktreeImport = (url: string) => {
    // Linktree URLs are typically: https://linktr.ee/username
    toast({
      title: 'Coming Soon',
      description: 'Linktree import will be available soon. For now, use JSON import.',
    });
  };

  const handleBeaconsImport = (url: string) => {
    // Beacons URLs are typically: https://beacons.ai/username
    toast({
      title: 'Coming Soon',
      description: 'Beacons.ai import will be available soon. For now, use JSON import.',
    });
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${importType === 'linktree' ? 'border-primary' : ''}`}
          onClick={() => setImportType('linktree')}
        >
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Linktree</h3>
            <p className="text-sm text-muted-foreground">Import from Linktree</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${importType === 'beacons' ? 'border-primary' : ''}`}
          onClick={() => setImportType('beacons')}
        >
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Beacons.ai</h3>
            <p className="text-sm text-muted-foreground">Import from Beacons</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-primary ${importType === 'json' ? 'border-primary' : ''}`}
          onClick={() => setImportType('json')}
        >
          <CardContent className="p-6 text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
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
              {importType === 'json' && 'Import JSON Data'}
            </CardTitle>
            <CardDescription>
              {importType === 'json' ? 'Paste your JSON data below' : 'Feature coming soon'}
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
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Direct import from {importType === 'linktree' ? 'Linktree' : 'Beacons.ai'} is coming soon. 
                  For now, please use JSON import to migrate your data.
                </AlertDescription>
              </Alert>
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

