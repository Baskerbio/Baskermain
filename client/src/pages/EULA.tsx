import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'wouter';

export default function EULA() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/info">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Info Center
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-8 h-8" />
                End User License Agreement
              </h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="prose prose-sm max-w-none p-8 prose-invert">
            <h2>1. License Grant</h2>
            <p>
              Subject to the terms of this agreement, Basker grants you a limited, non-exclusive, 
              non-transferable license to use the Basker software and services for personal and 
              commercial purposes.
            </p>

            <h2>2. License Restrictions</h2>
            <p>You may not:</p>
            <ul>
              <li>Reverse engineer, decompile, or disassemble the software</li>
              <li>Modify, adapt, or create derivative works</li>
              <li>Distribute, sublicense, or transfer the software</li>
              <li>Remove or alter any proprietary notices</li>
              <li>Use the software for any unlawful purpose</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>
              The software and all related materials are protected by copyright, trademark, and 
              other intellectual property laws. All rights, title, and interest remain with Basker.
            </p>

            <h2>4. User Content</h2>
            <p>
              You retain ownership of content you create using our service. By using our service, 
              you grant us a license to host, display, and process your content as necessary to 
              provide the service.
            </p>

            <h2>5. Updates and Modifications</h2>
            <p>
              We may provide updates, modifications, or new versions of the software. This agreement 
              applies to all such updates and modifications.
            </p>

            <h2>6. Termination</h2>
            <p>
              This license is effective until terminated. We may terminate this license immediately 
              if you fail to comply with any term of this agreement.
            </p>

            <h2>7. Warranty Disclaimer</h2>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL BASKER BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR 
              CONSEQUENTIAL DAMAGES WHATSOEVER ARISING OUT OF THE USE OF OR INABILITY TO USE 
              THE SOFTWARE.
            </p>

            <h2>9. Export Control</h2>
            <p>
              You agree to comply with all applicable export control laws and regulations. You may 
              not export or re-export the software in violation of any such laws.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              This agreement shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>11. Entire Agreement</h2>
            <p>
              This agreement constitutes the entire agreement between you and Basker regarding the 
              use of the software and supersedes all prior agreements.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              For questions about this EULA, contact us at:
            </p>
            <ul>
              <li>Email: legal@basker.bio</li>
              <li>Support: support@basker.bio</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
