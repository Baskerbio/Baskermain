import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function VerificationPolicy() {
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
                <Building2 className="w-8 h-8" />
                Verification Policy
              </h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="prose prose-sm max-w-none p-8 prose-invert">
            <h2>1. Overview</h2>
            <p>
              Basker's verification system allows users to verify their work history and employment 
              status. This policy outlines the requirements, process, and standards for verification.
            </p>

            <h2>2. Verification Types</h2>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Unverified</h3>
                  <p className="text-sm text-muted-foreground">
                    Default status for work history entries. User claims employment but hasn't submitted verification.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    Verification request submitted and under review by our admin team.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Verified</h3>
                  <p className="text-sm text-muted-foreground">
                    Employment verified through submitted documentation and admin review.
                  </p>
                </div>
              </div>
            </div>

            <h2>3. Required Documentation</h2>
            <p>To verify employment, you must provide at least one of the following:</p>
            <ul>
              <li><strong>Employment Contract:</strong> Signed contract or offer letter</li>
              <li><strong>Pay Stubs:</strong> Recent salary statements or payment records</li>
              <li><strong>Company Email:</strong> Verification from company email address</li>
              <li><strong>LinkedIn Profile:</strong> Professional profile showing current employment</li>
              <li><strong>Manager Verification:</strong> Contact information for direct supervisor or HR</li>
              <li><strong>Company Directory:</strong> Official company directory listing</li>
            </ul>

            <h2>4. Verification Process</h2>
            <ol>
              <li><strong>Submit Request:</strong> Complete verification form with supporting documents</li>
              <li><strong>Admin Review:</strong> Our team reviews submitted documentation</li>
              <li><strong>Additional Verification:</strong> We may contact employers or request additional proof</li>
              <li><strong>Decision:</strong> Verification approved, rejected, or additional information requested</li>
              <li><strong>Notification:</strong> You receive notification of the decision</li>
            </ol>

            <h2>5. Review Standards</h2>
            <p>Our admin team evaluates verification requests based on:</p>
            <ul>
              <li>Authenticity of submitted documents</li>
              <li>Consistency of information across sources</li>
              <li>Recency of employment (within last 5 years preferred)</li>
              <li>Completeness of documentation</li>
              <li>Verification of company existence and legitimacy</li>
            </ul>

            <h2>6. Processing Time</h2>
            <p>
              Verification requests are typically processed within 5-10 business days. Complex cases 
              may require additional time for thorough review.
            </p>

            <h2>7. Appeals Process</h2>
            <p>
              If your verification is rejected, you may appeal by providing additional documentation 
              or clarification. Appeals are reviewed by senior admin staff.
            </p>

            <h2>8. Privacy and Security</h2>
            <p>
              All verification documents are handled with strict confidentiality and stored securely. 
              We only use submitted information for verification purposes and do not share it with 
              third parties without consent.
            </p>

            <h2>9. False Information</h2>
            <p>
              Submitting false or misleading information for verification purposes will result in 
              immediate rejection and may lead to account suspension or termination.
            </p>

            <h2>10. Verification Maintenance</h2>
            <p>
              Verified status may be reviewed periodically. If employment status changes, users 
              should update their work history accordingly.
            </p>

            <h2>11. Admin Access</h2>
            <p>
              Verification requests are reviewed by authorized admin users including:
            </p>
            <ul>
              <li>@samthibault.bsky.social</li>
              <li>@basker.bio</li>
              <li>Other designated verification staff</li>
            </ul>

            <h2>12. Contact Information</h2>
            <p>
              For verification-related questions or support, contact:
            </p>
            <ul>
              <li>Verification Team: Verification@basker.bio</li>
              <li>General Support: support@basker.bio</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
