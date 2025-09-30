import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useVerificationRequests, useUpdateVerificationRequest } from '../hooks/use-atprotocol';
import { useAdmin } from '../contexts/AdminContext';
import { CheckCircle, XCircle, Clock, User, Building2, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminPanel() {
  const { isAdmin, adminPermissions } = useAdmin();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: verificationRequests = [], isLoading } = useVerificationRequests();
  const { mutate: updateVerificationRequest } = useUpdateVerificationRequest();

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">You don't have admin permissions to access this panel.</p>
        </CardContent>
      </Card>
    );
  }

  const handleApprove = (request: any) => {
    updateVerificationRequest({
      requestId: request.id,
      status: 'approved',
      adminNotes: adminNotes.trim() || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: 'Verification Approved',
          description: 'The work history has been verified successfully.',
        });
        setAdminNotes('');
        setIsDialogOpen(false);
        setSelectedRequest(null);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to approve verification request.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleReject = (request: any) => {
    updateVerificationRequest({
      requestId: request.id,
      status: 'rejected',
      adminNotes: adminNotes.trim() || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: 'Verification Rejected',
          description: 'The verification request has been rejected.',
        });
        setAdminNotes('');
        setIsDialogOpen(false);
        setSelectedRequest(null);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to reject verification request.',
          variant: 'destructive',
        });
      },
    });
  };

  const openRequestDialog = (request: any) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading verification requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Verification Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verificationRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No verification requests found</p>
          ) : (
            <div className="space-y-4">
              {verificationRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">User: {request.userId}</span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Company: {request.companyId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Submitted: {formatDate(request.submittedAt)}</span>
                    </div>
                  </div>

                  {request.evidence && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Evidence:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{request.evidence}</p>
                    </div>
                  )}

                  {request.documents && request.documents.length > 0 && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Documents:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {request.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Document {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.adminNotes && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Admin Notes:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{request.adminNotes}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openRequestDialog(request)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Review
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Verification Request</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">User ID:</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.userId}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Company ID:</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.companyId}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Evidence:</Label>
                <p className="text-sm text-muted-foreground">{selectedRequest.evidence}</p>
              </div>
              
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(selectedRequest)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest)}
                  className="flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
