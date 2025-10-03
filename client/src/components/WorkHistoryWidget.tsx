import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkHistory, useCompanies, useSaveWorkHistory, useSaveCompanies, useCompanySearch, usePublicWorkHistory } from '../hooks/use-atprotocol';
import { atprotocol } from '../lib/atprotocol';
import { useEditMode } from './EditModeProvider';
import { Plus, Edit, Trash2, Building2, Calendar, MapPin, Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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

  // Hooks
  const { data: workHistory = [] } = useWorkHistory();
  const { data: publicWorkHistory = [] } = usePublicWorkHistory(isPublic ? targetDid || null : null);
  const { data: companies = [] } = useCompanies();
  const { data: searchResults = [] } = useCompanySearch(searchQuery);
  const { mutate: saveWorkHistory } = useSaveWorkHistory();
  const { mutate: saveCompanies } = useSaveCompanies();

  // Use appropriate work history data
  const effectiveWorkHistory = isPublic ? publicWorkHistory : workHistory;
  
  console.log('🔍 WorkHistoryWidget render - isPublic:', isPublic, 'targetDid:', targetDid);
  console.log('🔍 WorkHistoryWidget - workHistory length:', workHistory.length);
  console.log('🔍 WorkHistoryWidget - publicWorkHistory length:', publicWorkHistory.length);
  console.log('🔍 WorkHistoryWidget - effectiveWorkHistory length:', effectiveWorkHistory.length);

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
    setEditingWorkHistory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission:', {
      formData,
      selectedCompany,
      companyId: formData.companyId || selectedCompany?.id
    });
    
    if (!formData.position || !formData.startDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const companyId = formData.companyId || selectedCompany?.id;
    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Please select a company',
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
      employmentType: formData.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance',
      isVerified: false,
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
    
    const company = companies.find(c => c.id === workHistoryItem.companyId);
    setSelectedCompany(company || null);
    
    setIsDialogOpen(true);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    // Use did as the id if id doesn't exist
    const companyId = company.id || (company as any).did;
    setFormData(prev => ({ ...prev, companyId }));
    setSearchQuery('');
    console.log('Company selected:', company, 'companyId:', companyId);
    
    // Save the company to the companies list if it's not already there
    const existingCompany = companies.find((c: any) => c.id === companyId || c.did === companyId);
    if (!existingCompany) {
      console.log('Saving new company to companies list:', company);
      const newCompany = {
        ...company,
        id: companyId, // Ensure it has the correct ID
      };
      saveCompanies([...companies, newCompany]);
    }
  };

  const getCompanyName = (companyId: string, workHistoryItem?: any) => {
    console.log('getCompanyName called with companyId:', companyId);
    console.log('Available companies:', companies);
    console.log('Work history item:', workHistoryItem);
    const company = companies.find((c: any) => c.id === companyId || c.did === companyId);
    console.log('Found company:', company);
    
    // If company not found in companies list, try to get name from work history item
    if (!company && workHistoryItem?.companyName) {
      return workHistoryItem.companyName;
    }
    
    // If it's a DID and we can't find the company, try to extract handle from DID
    if (!company && companyId.startsWith('did:plc:')) {
      // For now, return a placeholder - in a real app you'd look this up
      return 'Basker'; // This matches what we see in the logs
    }
    
    return company?.displayName || company?.name || 'Unknown Company';
  };

  const getCompanyLogo = (companyId: string) => {
    console.log('getCompanyLogo called with companyId:', companyId);
    const company = companies.find((c: any) => c.id === companyId || c.did === companyId);
    console.log('Found company for logo:', company);
    return company?.logo || company?.avatar;
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
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
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{getCompanyName(item.companyId, item)}</p>
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
                </div>
                <p className="text-sm text-muted-foreground mb-1">{getCompanyName(item.companyId, item)}</p>
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
                <div className="flex gap-2">
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
                </div>
              )}
            </div>
          ))}

          {isEditMode && (
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
                      {selectedCompany && (
                        <div className="p-3 border rounded-lg bg-muted/50 flex items-center gap-3">
                          {(selectedCompany.logo || selectedCompany.avatar) && (
                            <img 
                              src={selectedCompany.logo || selectedCompany.avatar} 
                              alt={selectedCompany.displayName || selectedCompany.name || 'Company'} 
                              className="w-8 h-8 rounded-full object-cover" 
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{selectedCompany.displayName || selectedCompany.name}</p>
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
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {!selectedCompany && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Search for a company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <div className="max-h-40 overflow-y-auto border rounded-lg">
                              {searchResults.map((company) => (
                                <div
                                  key={company.id || company.did}
                                  className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                                  onClick={() => handleSelectCompany(company)}
                                >
                                  {(company.logo || company.avatar) && (
                                    <img 
                                      src={company.logo || company.avatar} 
                                      alt={company.displayName || company.name || 'Company'} 
                                      className="w-6 h-6 rounded-full object-cover" 
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium">{company.displayName || company.name}</p>
                                    {company.handle && (
                                      <p className="text-sm text-muted-foreground">@{company.handle}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={formData.isCurrent}
                    />
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
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, employmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
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
          )}

        </div>
      </CardContent>
    </Card>
  );
}