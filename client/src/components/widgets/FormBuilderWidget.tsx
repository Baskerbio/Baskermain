import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

type FormFieldType = 'short_text' | 'long_text' | 'email' | 'select' | 'checkbox';

interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormBuilderConfig {
  formId: string;
  title: string;
  description?: string;
  requireLogin?: boolean;
  submitButtonLabel?: string;
  successMessage?: string;
  successLinkLabel?: string;
  successLinkUrl?: string;
  fields: FormField[];
}

interface FormBuilderWidgetProps {
  config: FormBuilderConfig;
  widgetId: string;
  isEditMode?: boolean;
}

interface FormSubmission {
  id: string;
  widgetId: string;
  formId: string;
  submittedBy: string | null;
  submittedHandle: string | null;
  submittedDisplayName?: string | null;
  responses: Record<string, any>;
  createdAt: string;
}

export function FormBuilderWidget({ config, widgetId, isEditMode = false }: FormBuilderWidgetProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const enabledFields = config?.fields || [];
  const requireLogin = config?.requireLogin ?? true;

  useEffect(() => {
    if (!config?.fields) return;
    const initialValues: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initialValues[field.id] = false;
      } else {
        initialValues[field.id] = '';
      }
    });
    setFormValues(initialValues);
    setFormErrors({});
    setHasSubmitted(false);
  }, [config?.fields]);

  const { data: submissionsData, refetch } = useQuery({
    queryKey: ['formSubmissions'],
    queryFn: () => atprotocol.getFormSubmissions(),
    enabled: isAuthenticated,
  });

  const submissions: FormSubmission[] = useMemo(() => {
    const all = submissionsData?.submissions || [];
    return all.filter(
      (submission: FormSubmission) =>
        submission.formId === config?.formId && submission.widgetId === widgetId,
    );
  }, [submissionsData?.submissions, config?.formId, widgetId]);

  const saveSubmissionMutation = useMutation({
    mutationFn: async (updatedSubmissions: FormSubmission[]) => {
      await atprotocol.saveFormSubmissions(updatedSubmissions);
    },
    onSuccess: () => {
      setHasSubmitted(true);
      toast({
        title: 'Form submitted',
        description: config?.successMessage || 'Thank you for your submission!',
      });
      refetch();
      resetForm();
    },
    onError: (error: any) => {
      console.error('Failed to submit form:', error);
      toast({
        title: 'Submission failed',
        description: 'We could not submit your form. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    const newValues: Record<string, any> = {};
    config?.fields?.forEach((field) => {
      if (field.type === 'checkbox') {
        newValues[field.id] = false;
      } else {
        newValues[field.id] = '';
      }
    });
    setFormValues(newValues);
    setFormErrors({});
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    config?.fields?.forEach((field) => {
      const value = formValues[field.id];
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!value) {
            errors[field.id] = 'This field is required.';
          }
        } else if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.id] = 'This field is required.';
        }
      }
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.id] = 'Please enter a valid email address.';
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (requireLogin && !isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign into your Bluesky account before submitting this form.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) return;

    const existingSubmissions: FormSubmission[] = submissionsData?.submissions || [];
    const newSubmission: FormSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      widgetId,
      formId: config.formId,
      submittedBy: user?.did || null,
      submittedHandle: user?.handle || null,
      submittedDisplayName: user?.displayName || null,
      responses: { ...formValues },
      createdAt: new Date().toISOString(),
    };

    const updatedSubmissions = [...existingSubmissions, newSubmission];
    saveSubmissionMutation.mutate(updatedSubmissions);
  };

  if (!config?.formId) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Configure this form in the widget settings to start collecting responses.
          </p>
        </CardContent>
      </Card>
    );
  }

  const submissionCount = submissions.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>{config?.title || 'Custom Form'}</span>
          {isEditMode && (
            <Badge variant="outline">{submissionCount} submissions</Badge>
          )}
        </CardTitle>
        {config?.description && (
          <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {requireLogin && !isAuthenticated && (
          <Alert>
            <AlertDescription>
              You must be signed into your Bluesky account to submit this form.
            </AlertDescription>
          </Alert>
        )}

        {hasSubmitted && !isEditMode && (
          <Alert>
            <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{config?.successMessage || 'Thanks for your submission!'}</span>
              {config?.successLinkUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(config.successLinkUrl, '_blank', 'noopener')}
                >
                  {config.successLinkLabel?.trim() || 'View more'}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {enabledFields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No fields configured yet. Add form fields in the widget settings.
            </p>
          )}

          {enabledFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <LabelledText label={field.label} required={field.required} />
              </div>
              {renderFieldInput(field, formValues[field.id], (value) =>
                handleInputChange(field.id, value),
              )}
              {field.placeholder && (
                <p className="text-xs text-muted-foreground">{field.placeholder}</p>
              )}
              {formErrors[field.id] && (
                <p className="text-xs text-destructive">{formErrors[field.id]}</p>
              )}
            </div>
          ))}

          {enabledFields.length > 0 && (
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={saveSubmissionMutation.isLoading || (requireLogin && !isAuthenticated)}
            >
              {saveSubmissionMutation.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {config?.submitButtonLabel || 'Submit'}
                </>
              )}
            </Button>
          )}
        </form>

        {isEditMode && submissionCount > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Recent submissions</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {submissions
                .slice()
                .sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                )
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="border rounded-lg p-3 bg-muted/40 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Submitted{' '}
                        {new Date(submission.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                      {submission.submittedHandle && (
                        <span>@{submission.submittedHandle}</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      {enabledFields.map((field) => (
                        <div key={`${submission.id}-${field.id}`}>
                          <p className="font-medium">{field.label}</p>
                          <p className="text-muted-foreground break-words">
                            {formatResponseValue(field, submission.responses[field.id])}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function renderFieldInput(
  field: FormField,
  value: any,
  onChange: (newValue: any) => void,
) {
  switch (field.type) {
    case 'long_text':
      return (
        <Textarea
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || 'Enter your response'}
          rows={4}
        />
      );
    case 'email':
      return (
        <Input
          type="email"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || 'name@example.com'}
        />
      );
    case 'select':
      return (
        <Select
          value={value ?? ''}
          onValueChange={(selected) => onChange(selected)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <div className="flex items-center gap-3 py-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <span className="text-sm text-muted-foreground">
            {field.placeholder || 'Enable'}
          </span>
        </div>
      );
    case 'short_text':
    default:
      return (
        <Input
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || 'Enter your response'}
        />
      );
  }
}

function formatResponseValue(field: FormField, value: any) {
  if (value === undefined || value === null) return '—';
  if (field.type === 'checkbox') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

function LabelledText({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

