import React, { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Send, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface NewsletterDraft {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  updatedAt: string;
}

const INITIAL_DRAFTS: NewsletterDraft[] = [
  {
    id: 'welcome-kit',
    title: 'Welcome Kit',
    subject: '👋 Say hi to your new Basker.bio page',
    content: 'Introduce your brand, highlight your profile modules, and invite readers to explore more.',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'launch-week',
    title: 'Launch Week Highlights',
    subject: '🚀 What shipped this week at Basker',
    content: 'A ready-to-edit template for sharing product launches, new widgets, and forms.',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  },
];

const PRESET_BLOCKS = [
  {
    heading: 'Hero Announcement',
    body: 'Lead with a bold intro and link readers directly to your latest widget or Solaris card.',
  },
  {
    heading: 'Three Things to Share',
    body: 'Use bullet points to highlight new links, a featured form, and this week’s shout-out.',
  },
  {
    heading: 'Call to Action',
    body: 'Invite readers to claim a Solaris card, subscribe to your RSS feed, or join a community call.',
  },
];

export default function Newsletter() {
  const [drafts, setDrafts] = useState<NewsletterDraft[]>(INITIAL_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState(INITIAL_DRAFTS[0]?.id ?? '');
  const [isSending, setIsSending] = useState(false);

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === activeDraftId),
    [drafts, activeDraftId],
  );

  const handleCreateDraft = () => {
    const timestamp = Date.now();
    const newDraft: NewsletterDraft = {
      id: `draft-${timestamp}`,
      title: 'Untitled Newsletter',
      subject: 'Your subject line',
      content: '',
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    setActiveDraftId(newDraft.id);
  };

  const updateActiveDraft = (updates: Partial<NewsletterDraft>) => {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.id === activeDraftId ? { ...draft, ...updates, updatedAt: new Date().toISOString() } : draft,
      ),
    );
  };

  const handleSendPreview = async () => {
    setIsSending(true);
    setTimeout(() => setIsSending(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 relative overflow-hidden">
      <Header />

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-16 left-1/4 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      </div>

      <main className="relative z-10 pb-24">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center space-y-6">
          <Badge className="mx-auto w-fit bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Newsletter Creator
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Keep your Basker audience looped in—no outside tooling required
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Draft, preview, and send updates straight from your Basker dashboard. Every newsletter can be shared via
            email and embedded as a widget on your public profile.
          </p>
          <Button size="lg" className="gap-2" onClick={handleCreateDraft}>
            <Plus className="w-4 h-4" />
            Start a new newsletter
          </Button>
        </section>

        <section className="max-w-6xl mx-auto px-6 grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <Card className="backdrop-blur bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/70 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Compose newsletter
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Write your update and preview it in real time.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSendPreview} disabled={!activeDraft || isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send test email
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-3">
                {drafts.map((draft) => (
                  <Button
                    key={draft.id}
                    variant={draft.id === activeDraftId ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                    onClick={() => setActiveDraftId(draft.id)}
                  >
                    <Pencil className="w-4 h-4" />
                    {draft.title}
                  </Button>
                ))}
              </div>

              {activeDraft ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Internal title
                      </label>
                      <Input
                        value={activeDraft.title}
                        onChange={(event) => updateActiveDraft({ title: event.target.value })}
                        placeholder="Weekly Basker Update"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Subject line
                      </label>
                      <Input
                        value={activeDraft.subject}
                        onChange={(event) => updateActiveDraft({ subject: event.target.value })}
                        placeholder="New widgets, Solaris drops, and more"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Body content
                    </label>
                    <Textarea
                      value={activeDraft.content}
                      onChange={(event) => updateActiveDraft({ content: event.target.value })}
                      rows={12}
                      placeholder="Type your newsletter. Use headings, bullet points, and embed profile widgets with shortcodes like [[featured-widget]]."
                    />
                  </div>

                  <Tabs defaultValue="blocks" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="blocks">Suggested blocks</TabsTrigger>
                      <TabsTrigger value="tips">Audience tips</TabsTrigger>
                    </TabsList>
                    <TabsContent value="blocks" className="mt-4 grid gap-3 sm:grid-cols-3">
                      {PRESET_BLOCKS.map((block) => (
                        <Card
                          key={block.heading}
                          className="cursor-pointer border-dashed hover:border-blue-400 transition-colors"
                          onClick={() =>
                            updateActiveDraft({
                              content: `${activeDraft.content}\n\n### ${block.heading}\n${block.body}`,
                            })
                          }
                        >
                          <CardContent className="p-4 space-y-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{block.heading}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{block.body}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    <TabsContent value="tips" className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <p className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Keep paragraphs short and link back to the widgets or forms you mention.
                      </p>
                      <p className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Add a CTA to your Solaris cards or merch when relevant.
                      </p>
                      <p className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Repurpose sections as Highlights or Announcements on your profile.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Select a draft or create a new one to get started.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/80 dark:bg-slate-900/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-white">
                  Live preview
                  <Badge variant="outline" className="text-xs">
                    Widget ready
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {activeDraft?.subject || 'Your subject line shows up here'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {!activeDraft?.content?.trim()
                      ? 'Type your content to see a preview of the newsletter widget.'
                      : activeDraft.content.split('\n').slice(0, 3).join('\n')}
                  </p>
                </div>
                <Button className="w-full sm:w-auto gap-2">
                  <Sparkles className="w-4 h-4" />
                  Publish & sync to profile widget
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When you publish, this newsletter becomes available via email and the Newsletter widget inside your
                  Basker widget picker. Add it to any section of your profile to capture more subscribers.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/80 dark:bg-slate-900/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Where does the widget live?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Every newsletter you ship can appear as a dedicated widget on your Basker.bio page. The widget supports
                  custom headlines, gradient backgrounds, and integrates with the same subscriber list used here.
                </p>
                <p>
                  Want to keep things simple? Use the Newsletter widget in the profile editor and paste your external
                  provider link. When you’re ready for the full Basker flow, publish from this page and the widget
                  updates automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

