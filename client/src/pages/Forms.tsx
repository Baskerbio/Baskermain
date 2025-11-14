import React, { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, ClipboardList, Wand2, Trash2, ArrowUp, ArrowDown, Share2, Sparkles } from 'lucide-react';

type FormFieldType = 'short_text' | 'long_text' | 'email' | 'select' | 'checkbox';

interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface BaskerForm {
  id: string;
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  requireLogin: boolean;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

const FORM_TEMPLATES: Array<{ name: string; description: string; fields: FormField[] }> = [
  {
    name: 'Contact intake',
    description: 'Collect a name, email, and customized message.',
    fields: [
      { id: 'contact-name', label: 'Full name', type: 'short_text', required: true, placeholder: 'Jane Doe' },
      { id: 'contact-email', label: 'Email address', type: 'email', required: true, placeholder: 'you@example.com' },
      {
        id: 'contact-message',
        label: 'How can we help?',
        type: 'long_text',
        required: true,
        placeholder: 'Share a bit of context so we can respond faster.',
      },
    ],
  },
  {
    name: 'Event RSVP',
    description: 'Perfect for meetups, workshops, or live shows.',
    fields: [
      { id: 'rsvp-name', label: 'Full name', type: 'short_text', required: true, placeholder: 'Jane Doe' },
      { id: 'rsvp-email', label: 'Email address', type: 'email', required: true, placeholder: 'you@example.com' },
      {
        id: 'rsvp-attending',
        label: 'Are you attending?',
        type: 'select',
        required: true,
        options: ['Yes, I will be there!', 'Maybe—keep me posted', 'Can’t make it this time'],
      },
    ],
  },
  {
    name: 'Feedback pulse',
    description: 'Quick pulse check or satisfaction survey.',
    fields: [
      {
        id: 'feedback-score',
        label: 'How satisfied are you?',
        type: 'select',
        required: true,
        options: ['😍 Love it', '🙂 Pretty good', '😐 Neutral', '🙁 Needs work'],
      },
      {
        id: 'feedback-notes',
        label: 'Tell us more',
        type: 'long_text',
        required: false,
        placeholder: 'What should we improve next?',
      },
    ],
  },
];

const INITIAL_FORMS: BaskerForm[] = [
  {
    id: 'contact-form',
    title: 'Contact Basker Team',
    description: 'Drop us a quick note and we’ll reply within 24 hours.',
    submitLabel: 'Send message',
    successMessage: 'Thanks! We received your message and will be in touch soon.',
    requireLogin: false,
    fields: FORM_TEMPLATES[0].fields,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const FIELD_LABELS: Record<FormFieldType, string> = {
  short_text: 'Short answer',
  long_text: 'Long answer',
  email: 'Email',
  select: 'Dropdown',
  checkbox: 'Toggle',
};

export default function Forms() {
  const [forms, setForms] = useState<BaskerForm[]>(INITIAL_FORMS);
  const [activeFormId, setActiveFormId] = useState<string>(INITIAL_FORMS[0]?.id ?? '');

  const activeForm = useMemo(
    () => forms.find((form) => form.id === activeFormId),
    [forms, activeFormId],
  );

  const createBlankForm = () => {
    const timestamp = Date.now();
    const newForm: BaskerForm = {
      id: `form-${timestamp}`,
      title: 'Untitled form',
      description: 'Tell visitors what this form is for.',
      submitLabel: 'Submit',
      successMessage: 'Thanks for sharing!',
      requireLogin: true,
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms((prev) => [newForm, ...prev]);
    setActiveFormId(newForm.id);
  };

  const applyTemplate = (templateIndex: number) => {
    const template = FORM_TEMPLATES[templateIndex];
    if (!template || !activeForm) return;
    updateActiveForm({
      title: template.name,
      description: template.description,
      fields: template.fields.map((field) => ({
        ...field,
        id: `${field.id}-${Date.now()}`,
      })),
    });
  };

  const updateActiveForm = (updates: Partial<BaskerForm>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === activeFormId
          ? {
              ...form,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : form,
      ),
    );
  };

  const addField = (type: FormFieldType) => {
    if (!activeForm) return;
    const newField: FormField = {
      id: `field-${type}-${Date.now()}`,
      label: FIELD_LABELS[type],
      type,
      required: false,
      placeholder: type === 'checkbox' ? undefined : 'Enter your response',
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
    };
    updateActiveForm({ fields: [...activeForm.fields, newField] });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!activeForm) return;
    updateActiveForm({
      fields: activeForm.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    });
  };

  const removeField = (fieldId: string) => {
    if (!activeForm) return;
    updateActiveForm({
      fields: activeForm.fields.filter((field) => field.id !== fieldId),
    });
  };

  const moveField = (fieldId: string, direction: -1 | 1) => {
    if (!activeForm) return;
    const index = activeForm.fields.findIndex((field) => field.id === fieldId);
    if (index < 0) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= activeForm.fields.length) return;
    const reordered = [...activeForm.fields];
    const [field] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, field);
    updateActiveForm({ fields: reordered });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 relative overflow-hidden">
      <Header />

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 right-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-12 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      </div>

      <main className="relative z-10 pb-24">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center space-y-6">
          <Badge className="mx-auto w-fit bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
            Basker Forms
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Build forms your followers actually want to fill out
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Spin up Jotform-style experiences with presets, custom fields, and Bluesky authentication. Every form can
            live on its own page, embed on your Basker profile as a widget, and sync submissions back to your dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2" onClick={createBlankForm}>
              <Plus className="w-4 h-4" />
              Create blank form
            </Button>
            {FORM_TEMPLATES.map((template, index) => (
              <Button key={template.name} variant="outline" size="lg" onClick={() => applyTemplate(index)}>
                <Wand2 className="w-4 h-4 mr-2" />
                {template.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <Card className="backdrop-blur bg-white/85 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-lg">
            <CardHeader className="flex flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Form designer
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add questions, control validation, and set a custom thank-you state.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {forms.map((form) => (
                  <Button
                    key={form.id}
                    variant={form.id === activeFormId ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFormId(form.id)}
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    {form.title}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeForm ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Form name
                      </label>
                      <Input
                        value={activeForm.title}
                        onChange={(event) => updateActiveForm({ title: event.target.value })}
                        placeholder="Fan feedback"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Submit button text
                      </label>
                      <Input
                        value={activeForm.submitLabel}
                        onChange={(event) => updateActiveForm({ submitLabel: event.target.value })}
                        placeholder="Send it"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <Textarea
                      value={activeForm.description}
                      onChange={(event) => updateActiveForm({ description: event.target.value })}
                      rows={3}
                      placeholder="Tell visitors why this form matters."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Success message
                    </label>
                    <Input
                      value={activeForm.successMessage}
                      onChange={(event) => updateActiveForm({ successMessage: event.target.value })}
                      placeholder="Thanks! We’ll be in touch within a day."
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-800/40 p-4">
                    <Switch
                      id="require-login-switch"
                      checked={activeForm.requireLogin}
                      onCheckedChange={(checked) => updateActiveForm({ requireLogin: checked })}
                    />
                    <div>
                      <label htmlFor="require-login-switch" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Require Bluesky login
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Keep this on if you want every response tied to a verified AT Protocol identity.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => addField('short_text')}>
                        Short answer
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => addField('long_text')}>
                        Long answer
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => addField('email')}>
                        Email
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => addField('select')}>
                        Dropdown
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => addField('checkbox')}>
                        Toggle
                      </Button>
                    </div>

                    {activeForm.fields.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300/80 dark:border-slate-700/80 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No questions yet. Add a field or apply a template to get started.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeForm.fields.map((field, index) => (
                          <Card key={field.id} className="border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-900/40">
                            <CardContent className="space-y-4 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">
                                  Question {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button size="icon" variant="ghost" onClick={() => moveField(field.id, -1)} disabled={index === 0} title="Move up">
                                    <ArrowUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => moveField(field.id, 1)}
                                    disabled={index === activeForm.fields.length - 1}
                                    title="Move down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </Button>
                                  <Switch
                                    id={`required-${field.id}`}
                                    checked={field.required}
                                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                  />
                                  <label htmlFor={`required-${field.id}`} className="text-xs text-slate-500 dark:text-slate-400">
                                    Required
                                  </label>
                                  <Button size="icon" variant="ghost" onClick={() => removeField(field.id)} title="Delete question">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Question text</label>
                                  <Input
                                    value={field.label}
                                    onChange={(event) => updateField(field.id, { label: event.target.value })}
                                    placeholder="What should we know?"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Answer type</label>
                                  <Select
                                    value={field.type}
                                    onValueChange={(value: FormFieldType) =>
                                      updateField(field.id, {
                                        type: value,
                                        options: value === 'select' ? field.options ?? ['Option 1', 'Option 2'] : undefined,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="short_text">Short answer</SelectItem>
                                      <SelectItem value="long_text">Long answer</SelectItem>
                                      <SelectItem value="email">Email</SelectItem>
                                      <SelectItem value="select">Dropdown</SelectItem>
                                      <SelectItem value="checkbox">Toggle</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {field.type !== 'checkbox' && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Helper text</label>
                                  <Input
                                    value={field.placeholder || ''}
                                    onChange={(event) => updateField(field.id, { placeholder: event.target.value })}
                                    placeholder="Let your visitors know what to write."
                                  />
                                </div>
                              )}

                              {field.type === 'select' && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dropdown options</label>
                                  <Textarea
                                    value={(field.options || []).join('\n')}
                                    rows={3}
                                    onChange={(event) =>
                                      updateField(field.id, {
                                        options: event.target.value
                                          .split('\n')
                                          .map((option) => option.trim())
                                          .filter(Boolean),
                                      })
                                    }
                                    placeholder={'Option 1\nOption 2\nOption 3'}
                                  />
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Enter one option per line. Press enter to add more choices.
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Create or select a form to start editing.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/85 dark:bg-slate-900/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Publish & embed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <Tabs defaultValue="share">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="share">Share link</TabsTrigger>
                    <TabsTrigger value="widget">Profile widget</TabsTrigger>
                  </TabsList>
                  <TabsContent value="share" className="space-y-4 pt-4">
                    <p>
                      Each form receives a dedicated Basker URL. Send it to collaborators, embed it in newsletters, or
                      drop it anywhere you would a Jotform link.
                    </p>
                    <div className="rounded-lg border border-dashed border-slate-300/60 dark:border-slate-700/70 p-4 flex flex-col gap-3">
                      <code className="text-xs bg-slate-900/90 text-slate-100 px-3 py-2 rounded-md">
                        https://basker.bio/forms/{activeForm?.id ?? 'your-form'}
                      </code>
                      <Button variant="outline" size="sm" className="w-fit gap-2">
                        <Share2 className="w-4 h-4" />
                        Copy share link
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="widget" className="space-y-4 pt-4">
                    <p>
                      The Form Builder widget pulls the same schema you edit here. Add it from the widget picker, choose
                      this form, and submissions will sync in both places—no duplicate setup.
                    </p>
                    <Button className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Open widget picker
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/85 dark:bg-slate-900/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Submissions (sample data)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  We’re polishing the public submission flow. Until then, submissions from your profile widget appear
                  here instantly—sorted newest to oldest.
                </p>
                <div className="rounded-lg border border-dashed border-slate-300/60 dark:border-slate-700/70 p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Latest submission</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    <strong>@pilot.bsky.social</strong> — “Excited to collaborate on the Solaris project.”
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Received 4 minutes ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

