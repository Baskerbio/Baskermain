import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkHistory, useCompanies, useSaveWorkHistory, useSaveCompanies, useCompanySearch, useSubmitVerificationRequest, usePublicWorkHistory } from '../hooks/use-atprotocol';
import { useEditMode } from './EditModeProvider';
import { Plus, Edit, Trash2, Building2, Calendar, MapPin, Briefcase, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { WorkHistory, Company } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface WorkHistoryWidgetProps {
  isPublic?: boolean;
  targetDid?: string;
}

export function WorkHistoryWidget({ isPublic = false, targetDid }: WorkHistoryWidgetProps) {
  const { isEditMode } = useEditMode();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkHistory, setEditingWorkHistory] = useState<WorkHistory | null>(null);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    employmentType: 'full-time' as const,
    companyId: '',
  });

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    handle: '',
    description: '',
    website: '',
    logo: '',
    industry: '',
    location: '',
    size: 'medium' as const,
  });

  // Hooks
  const { data: workHistory = [] } = useWorkHistory();
  const { data: publicWorkHistory = [] } = usePublicWorkHistory(isPublic ? targetDid : null);
  const { data: companies = [] } = useCompanies();
  const { data: searchResults = [] } = useCompanySearch(searchQuery);
  const { mutate: saveWorkHistory } = useSaveWorkHistory();
  const { mutate: saveCompanies } = useSaveCompanies();
  const { mutate: submitVerificationRequest } = useSubmitVerificationRequest();

  // Use appropriate work history data
  const effectiveWorkHistory = isPublic ? publicWorkHistory : workHistory;

  const resetForm = () => {
    setFormData({
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      employmentType: 'full-time',
      companyId: '',
    });
    setSelectedCompany(null);
    setSearchQuery('');
    setEditingWorkHistory(null);
  };

  const resetCompanyForm = () => {
    setCompanyFormData({
      name: '',
      handle: '',
      description: '',
      website: '',
      logo: '',
      industry: '',
      location: '',
      size: 'medium',
    });
    setIsCreatingCompany(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Form submission - formData:', formData);
    console.log('🔍 Form submission - selectedCompany:', selectedCompany);
    console.log('🔍 Form submission - companies:', companies);
    
    if (!formData.position || !formData.startDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if a company is selected (either in formData or selectedCompany state)
    const companyId = formData.companyId || selectedCompany?.id;
    console.log('🔍 Form submission - resolved companyId:', companyId);
    
    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Please select a company',
        variant: 'destructive',
      });
      return;
    }

    // Use selectedCompany if available, otherwise find in companies array
    const company = selectedCompany || companies.find(c => c.id === companyId);
    if (!company) {
      toast({
        title: 'Error',
        description: 'Selected company not found. Please try selecting again.',
        variant: 'destructive',
      });
      return;
    }

    const workHistoryItem: WorkHistory = {
      id: editingWorkHistory?.id || `work-${Date.now()}`,
      companyId: companyId,
      position: formData.position,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? undefined : formData.endDate,
      isCurrent: formData.isCurrent,
      location: formData.location,
      employmentType: formData.employmentType,
      isVerified: false,
      verificationStatus: 'unverified',
      createdAt: editingWorkHistory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedWorkHistory = editingWorkHistory
      ? effectiveWorkHistory.map(item => item.id === editingWorkHistory.id ? workHistoryItem : item)
      : [...effectiveWorkHistory, workHistoryItem];

    saveWorkHistory(updatedWorkHistory, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: editingWorkHistory ? 'Work history updated' : 'Work history added',
        });
        resetForm();
        setIsDialogOpen(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to save work history',
          variant: 'destructive',
        });
      },
    });
  };

  const handleDelete = (id: string) => {
    const updatedWorkHistory = effectiveWorkHistory.filter(item => item.id !== id);
    saveWorkHistory(updatedWorkHistory, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Work history deleted',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete work history',
          variant: 'destructive',
        });
      },
    });
  };

  const handleEdit = (workHistoryItem: WorkHistory) => {
    setEditingWorkHistory(workHistoryItem);
    setFormData({
      position: workHistoryItem.position,
      description: workHistoryItem.description || '',
      startDate: workHistoryItem.startDate,
      endDate: workHistoryItem.endDate || '',
      isCurrent: workHistoryItem.isCurrent,
      location: workHistoryItem.location || '',
      employmentType: workHistoryItem.employmentType,
      companyId: workHistoryItem.companyId,
    });
    
    // Set the selected company for editing
    const company = companies.find(c => c.id === workHistoryItem.companyId);
    setSelectedCompany(company || null);
    
    setIsDialogOpen(true);
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyFormData.name) {
      toast({
        title: 'Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return;
    }

    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: companyFormData.name,
      handle: companyFormData.handle,
      description: companyFormData.description,
      website: companyFormData.website,
      logo: companyFormData.logo,
      industry: companyFormData.industry,
      location: companyFormData.location,
      size: companyFormData.size,
      isVerified: false,
      isBlueskyCompany: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCompanies = [...companies, newCompany];
    saveCompanies(updatedCompanies, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Company created',
        });
        resetCompanyForm();
        setIsCompanyDialogOpen(false);
        setSelectedCompany(newCompany);
        setFormData(prev => ({ ...prev, companyId: newCompany.id }));
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create company',
          variant: 'destructive',
        });
      },
    });
  };

  const handleSelectCompany = (company: Company) => {
    // Check if company already exists in our list
    const existingCompany = companies.find(c => c.id === company.id || c.blueskyDid === company.blueskyDid);
    
    if (existingCompany) {
      // Use existing company
      setSelectedCompany(existingCompany);
      setFormData(prev => ({ ...prev, companyId: existingCompany.id }));
    } else {
      // Add new company to our list and set it as selected immediately
      const updatedCompanies = [...companies, company];
      
      // Set the company as selected immediately (optimistic update)
      setSelectedCompany(company);
      setFormData(prev => ({ ...prev, companyId: company.id }));
      
      // Save to backend
      saveCompanies(updatedCompanies, {
        onSuccess: () => {
          // Company is already set as selected, no need to do anything
          console.log('✅ Company saved successfully:', company);
        },
        onError: () => {
          // Revert the optimistic update on error
          setSelectedCompany(null);
          setFormData(prev => ({ ...prev, companyId: '' }));
          toast({
            title: 'Error',
            description: 'Failed to save company selection',
            variant: 'destructive',
          });
        },
      });
    }
    
    setSearchQuery('');
  };

  const handleVerificationRequest = (workHistoryItem: WorkHistory) => {
    const company = companies.find(c => c.id === workHistoryItem.companyId);
    if (!company) return;

    const request = {
      id: `verification-${Date.now()}`,
      workHistoryId: workHistoryItem.id,
      companyId: workHistoryItem.companyId,
      evidence: `Requesting verification for ${workHistoryItem.position} at ${company.name}`,
      documents: [],
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
    };

    submitVerificationRequest(request, {
      onSuccess: () => {
        toast({
          title: 'Verification Request Submitted',
          description: 'Your verification request has been submitted to Verification@basker.bio',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to submit verification request',
          variant: 'destructive',
        });
      },
    });
  };

  const getVerificationBadge = (workHistoryItem: WorkHistory) => {
    switch (workHistoryItem.verificationStatus) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getCompanyLogo = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.logo;
  };

  if (isPublic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {effectiveWorkHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No work history available</p>
          ) : (
            <div className="space-y-4">
              {effectiveWorkHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {getCompanyLogo(item.companyId) ? (
                      <img 
                        src={getCompanyLogo(item.companyId)} 
                        alt={getCompanyName(item.companyId)}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{item.position}</h3>
                      {getVerificationBadge(item)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{getCompanyName(item.companyId)}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.startDate)} - {item.isCurrent ? 'Present' : formatDate(item.endDate || '')}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {effectiveWorkHistory.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {getCompanyLogo(item.companyId) ? (
                  <img 
                    src={getCompanyLogo(item.companyId)} 
                    alt={getCompanyName(item.companyId)}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{item.position}</h3>
                  {getVerificationBadge(item)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{getCompanyName(item.companyId)}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.startDate)} - {item.isCurrent ? 'Present' : formatDate(item.endDate || '')}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>
                )}
              </div>
              {isEditMode && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {item.verificationStatus === 'unverified' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerificationRequest(item)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isEditMode && (
            <>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => resetForm()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Work Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingWorkHistory ? 'Edit Work Experience' : 'Add Work Experience'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Company Selection */}
                    <div className="space-y-2">
                      <Label>Company *</Label>
                      <div className="space-y-2">
                        {/* Selected Company Display */}
                        {selectedCompany && (
                          <div className="p-3 border rounded-lg bg-muted/50 flex items-center gap-3">
                            {selectedCompany.logo && (
                              <img src={selectedCompany.logo} alt="" className="w-8 h-8 rounded-full" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{selectedCompany.name}</p>
                              {selectedCompany.handle && (
                                <p className="text-sm text-muted-foreground">@{selectedCompany.handle}</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(null);
                                setFormData(prev => ({ ...prev, companyId: '' }));
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        )}
                        
                        {/* Search Input */}
                        {!selectedCompany && (
                          <Input
                            placeholder="Search for a company on Bluesky..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        )}
                        
                        {/* Search Results */}
                        {searchQuery && searchResults.length > 0 && !selectedCompany && (
                          <div className="border rounded-lg max-h-40 overflow-y-auto">
                            {searchResults.map((company: any) => (
                              <div
                                key={company.did}
                                className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                                onClick={() => handleSelectCompany({
                                  id: `bluesky-${company.did}`,
                                  name: company.displayName || company.handle,
                                  handle: company.handle,
                                  description: company.description,
                                  logo: company.avatar,
                                  isBlueskyCompany: true,
                                  blueskyDid: company.did,
                                  createdAt: new Date().toISOString(),
                                  updatedAt: new Date().toISOString(),
                                })}
                              >
                                {company.avatar && (
                                  <img src={company.avatar} alt="" className="w-6 h-6 rounded-full" />
                                )}
                                <div>
                                  <p className="font-medium">{company.displayName || company.handle}</p>
                                  <p className="text-sm text-muted-foreground">@{company.handle}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCompanyDialogOpen(true)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Company
                        </Button>
                      </div>
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="e.g., Software Engineer"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your role and responsibilities..."
                        rows={3}
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="month"
                          value={formData.startDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="month"
                          value={formData.endDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                          disabled={formData.isCurrent}
                        />
                      </div>
                    </div>

                    {/* Current Position */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isCurrent"
                        checked={formData.isCurrent}
                        onChange={(e) => setFormData(prev => ({ ...prev, isCurrent: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isCurrent">I currently work here</Label>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingWorkHistory ? 'Update' : 'Add'} Work Experience
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Create Company Dialog */}
              <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Company</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCompany} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyFormData.name}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Acme Corp"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyHandle">Bluesky Handle (optional)</Label>
                      <Input
                        id="companyHandle"
                        value={companyFormData.handle}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, handle: e.target.value }))}
                        placeholder="@acmecorp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Website</Label>
                      <Input
                        id="companyWebsite"
                        value={companyFormData.website}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://acmecorp.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyLogo">Logo URL</Label>
                      <Input
                        id="companyLogo"
                        value={companyFormData.logo}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">Description</Label>
                      <Textarea
                        id="companyDescription"
                        value={companyFormData.description}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the company..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyIndustry">Industry</Label>
                        <Input
                          id="companyIndustry"
                          value={companyFormData.industry}
                          onChange={(e) => setCompanyFormData(prev => ({ ...prev, industry: e.target.value }))}
                          placeholder="e.g., Technology"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyLocation">Location</Label>
                        <Input
                          id="companyLocation"
                          value={companyFormData.location}
                          onChange={(e) => setCompanyFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select
                        value={companyFormData.size}
                        onValueChange={(value) => setCompanyFormData(prev => ({ ...prev, size: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-10)</SelectItem>
                          <SelectItem value="small">Small (11-50)</SelectItem>
                          <SelectItem value="medium">Medium (51-200)</SelectItem>
                          <SelectItem value="large">Large (201-1000)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Create Company
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsCompanyDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}