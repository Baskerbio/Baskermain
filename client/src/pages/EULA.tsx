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
            <h2>1. Open Source Foundation</h2>
            <p>
              Basker is built on the AT Protocol, which is an open source decentralized social networking protocol. 
              The underlying technology and protocols used by Basker are open source and available for public use, 
              modification, and distribution under their respective open source licenses.
            </p>

            <h2>2. License Grant</h2>
            <p>
              Subject to the terms of this agreement, Basker grants you a limited, non-exclusive, 
              non-transferable license to use the Basker software and services for personal and 
              commercial purposes. This license is granted in addition to any rights you may have 
              under the open source licenses of the underlying AT Protocol and related technologies.
            </p>

            <h2>3. Intellectual Property Rights</h2>
            <p>
              <strong>Basker Branding and Trademarks:</strong> The "Basker" name, logo, branding elements, 
              and visual identity are proprietary trademarks and intellectual property of Basker. 
              These elements are protected by trademark and copyright laws and may not be used without 
              express written permission.
            </p>
            <p>
              <strong>Open Source Components:</strong> Components of Basker that are based on open source 
              technologies (including the AT Protocol) retain their original open source licenses and 
              may be used, modified, and distributed according to those licenses.
            </p>

            <h2>4. Usage Restrictions</h2>
            <p>While respecting the open source nature of the underlying technology, you may not:</p>
            <ul>
              <li>Use the "Basker" name, logo, or branding without permission</li>
              <li>Create derivative services that could be confused with Basker</li>
              <li>Remove or alter Basker's proprietary notices and branding</li>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to reverse engineer Basker's proprietary implementations beyond what is allowed by open source licenses</li>
            </ul>

            <h2>5. User Content</h2>
            <p>
              You retain ownership of content you create using our service. By using our service, 
              you grant us a license to host, display, and process your content as necessary to 
              provide the service.
            </p>

            <h2>6. Open Source Compliance</h2>
            <p>
              Users who wish to fork, modify, or create derivative works based on Basker's open source 
              components must comply with the applicable open source licenses. Any such activities 
              must not infringe upon Basker's trademark rights or create confusion in the marketplace.
            </p>

            <h2>7. Updates and Modifications</h2>
            <p>
              We may provide updates, modifications, or new versions of the software. This agreement 
              applies to all such updates and modifications. Open source components will continue to 
              be governed by their respective open source licenses.
            </p>

            <h2>8. Termination</h2>
            <p>
              This license is effective until terminated. We may terminate this license immediately 
              if you fail to comply with any term of this agreement, particularly regarding the use 
              of Basker's trademarks and branding.
            </p>

            <h2>9. Warranty Disclaimer</h2>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, AND NON-INFRINGEMENT. THIS DISCLAIMER APPLIES TO BOTH BASKER'S PROPRIETARY 
              COMPONENTS AND THE UNDERLYING OPEN SOURCE TECHNOLOGIES.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL BASKER BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR 
              CONSEQUENTIAL DAMAGES WHATSOEVER ARISING OUT OF THE USE OF OR INABILITY TO USE 
              THE SOFTWARE, INCLUDING DAMAGES ARISING FROM THE USE OF OPEN SOURCE COMPONENTS.
            </p>

            <h2>11. Export Control</h2>
            <p>
              You agree to comply with all applicable export control laws and regulations. You may 
              not export or re-export the software in violation of any such laws.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              This agreement shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>13. Entire Agreement</h2>
            <p>
              This agreement constitutes the entire agreement between you and Basker regarding the 
              use of the software and supersedes all prior agreements, while acknowledging the 
              separate rights and obligations under applicable open source licenses.
            </p>

            <h2>14. Contact Information</h2>
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
