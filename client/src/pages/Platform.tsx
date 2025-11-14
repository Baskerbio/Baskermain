import React from 'react';
import { Link } from 'wouter';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Sparkles, ClipboardList, Mail, BarChart3, Rocket, Shield, Palette, Users, Settings, Rss, Megaphone, PenSquare, Images, FileText } from 'lucide-react';

const FEATURES = [
  {
    title: 'My Profile',
    description: 'Jump straight into editing your Basker.bio profile and widgets.',
    href: '/profile',
    icon: Sparkles,
  },
  {
    title: 'Auto-Generated Social Feeds',
    description: 'This adds a section on a user’s profile that automatically shows their newest posts from places like Bluesky. The user connects their account once, and Basker keeps the feed updated.',
    href: '/profile?action=enter-edit',
    icon: Rss,
  },
  {
    title: 'Status Widget',
    description: 'This is a small text message the user can set on their profile so visitors know what they are currently doing or offering.',
    href: '/profile?action=enter-edit',
    icon: Megaphone,
  },
  {
    title: 'Microblog Widget',
    description: 'This lets users write short posts directly inside Basker. The posts appear in a simple feed and can optionally be sent to Bluesky.',
    href: '/profile?action=enter-edit',
    icon: PenSquare,
  },
  {
    title: 'Portfolio & Gallery System (Coming Soon)',
    description: 'This lets users upload images and display their work in a clean gallery with titles or descriptions.',
    href: null,
    icon: Images,
  },
  {
    title: 'Newsletter Creator (Coming Soon)',
    description: 'Draft newsletters inside Basker and sync them to your profile widget.',
    href: null,
    icon: Mail,
  },
  {
    title: 'Forms',
    description: 'Build Jotform-style forms and collect submissions with ease.',
    href: '/forms',
    icon: ClipboardList,
  },
  {
    title: 'Analytics',
    description: 'Track visits, link engagement, and widget performance.',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Quick Actions',
    description: 'Speed through common updates with a command-style dashboard.',
    href: '/profile?action=enter-edit',
    icon: Rocket,
  },
  {
    title: 'Solaris NFC Cards',
    description: 'Physical cards that tap directly to your Basker profile.',
    href: '/solaris',
    icon: Shield,
  },
  {
    title: 'Theme Studio',
    description: 'Dial in colors, gradients, containers, and more.',
    href: '/profile?action=open-settings-theme',
    icon: Palette,
  },
  {
    title: 'Social Integrations',
    description: 'Sync badges, handles, and verification from across the web.',
    href: '/info#social',
    icon: Users,
  },
  {
    title: 'Starter Packs',
    description: 'Curated layouts that launch a complete presence in minutes.',
    href: '/starter-packs',
    icon: Layers,
  },
  {
    title: 'Developer Hub',
    description: 'Submit custom widgets and extend Basker with open tooling.',
    href: '/submit-widget',
    icon: Settings,
  },
];

export default function Platform() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 relative overflow-hidden">
      <Header />

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="flex flex-col gap-6 text-center">
            <div className="mx-auto flex items-center gap-3 rounded-full border border-blue-200/60 dark:border-blue-900/40 bg-white/70 dark:bg-slate-900/50 px-5 py-2 shadow-lg shadow-blue-500/5">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Platform</Badge>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">Everything Basker offers, in one place</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              A complete platform for decentralized creators, teams, and communities
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Basker unifies profiles, widgets, forms, newsletters, analytics, Solaris NFC cards, and more—powered by the open AT Protocol.
              Explore each capability below.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <Card className="border border-slate-200/70 dark:border-slate-800/60 shadow-xl shadow-blue-500/5">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    const content = (
                      <Button
                        variant="outline"
                        className={`w-full h-full rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/60 text-left p-5 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all duration-200 flex flex-col items-start gap-3 shadow-sm hover:shadow-md whitespace-normal ${feature.href ? '' : 'pointer-events-none opacity-70'}`}
                      >
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 p-3">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-lg font-semibold text-slate-900 dark:text-white leading-tight break-words">{feature.title}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">{feature.description}</span>
                      </Button>
                    );

                    return feature.href ? (
                      <Link key={feature.title} href={feature.href}>
                        {content}
                      </Link>
                    ) : (
                      <div key={feature.title}>{content}</div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Profiles, widgets, and automations in sync</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Every feature integrates with your Basker.bio presence. Create once, reuse anywhere—your forms, newsletters, and widgets stay in lockstep on
              web, mobile, and physical Solaris cards.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/60 p-6 sm:p-8 shadow-lg">
              <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
Here is everything again in simple plain text with no formatting at all.

1. Auto-Generated Social Feeds Widget:

   This adds a section on a user’s profile that automatically shows their newest posts from places like Bluesky. The user connects their account once, and Basker keeps the feed updated. They do not have to manually add anything. Their profile always looks active and fresh.

2. Status Widget:

   This is a small text message the user can set on their profile. Examples: “Commissions open”, “Streaming now”, “On vacation”, “New video out”. It shows at the top of their page and lets visitors know what the user is currently doing or offering.

3. Microblog Widget:

   This lets users write short posts directly inside Basker, similar to micro updates or mini tweets. These posts are saved using the AT Protocol. They appear in a simple feed on the user’s profile. They can choose to also send these posts to Bluesky if they want.

4. Portfolio or Gallery System:

   This lets users upload images and display their work in a clean gallery. It can be used by artists, designers, photographers, or anyone who wants to show projects. Each image can have a title or description. Visitors can click images to view them larger.

5. Resume Builder:

   This is a tool that uses the user’s existing work history widget and turns it into a clean, professional resume page. The user can add skills and contact info, and the resume builder puts it all together automatically. It will have its own button on the platform page. This makes it easy for users to instantly generate a full resume using the information they already added to their Basker profile.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

