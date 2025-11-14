import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ScrollText, CheckCircle2, Ban, Users } from 'lucide-react';

export default function PlatformGuidelines() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 relative overflow-hidden">
      <Header />

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 -left-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      <main className="relative z-10 pb-24">
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center space-y-6">
          <Badge className="mx-auto w-fit bg-gradient-to-r from-amber-500 to-blue-500 text-white">
            Platform Guidelines
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Keep Basker human, safe, and trustworthy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Basker builds on the open Bluesky ecosystem. These rules protect the community, respect Blueskys policies, and keep the network authentic.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 grid gap-6">
          <Card className="border border-blue-200/60 dark:border-blue-800/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-500" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Follow Blueskys network rules
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>Every Basker profile lives on the AT Protocol and Bluesky network. You must comply with Blueskys official community guidelines to keep your account in good standing.</p>
            </CardContent>
          </Card>

          <Card className="border border-amber-200/60 dark:border-amber-800/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <ScrollText className="w-6 h-6 text-amber-500" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Real people onlyno AI personas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>Basker is for authentic humans. Fake profiles, AI-generated accounts, automated posts, or prompt-driven personas are not allowed. Automation and artificial content can distort the ecosystem and mislead real users.</p>
              <p>Freedom of expression applies to real people, not to automated systems or AI scripts.</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200/60 dark:border-emerald-800/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Be accurate and truthful
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>Use your real name (or a consistent creator identity) and share information that represents you honestly. Misrepresentation erodes trust and may lead to removal.</p>
            </CardContent>
          </Card>

          <Card className="border border-rose-200/60 dark:border-rose-800/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <Ban className="w-6 h-6 text-rose-500" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Zero tolerance for harm
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>Harassment, targeted abuse, spam, or any activity that harms the community is prohibited. Basker may remove offending content and suspend accounts that break these rules.</p>
            </CardContent>
          </Card>

          <Card className="border border-purple-200/60 dark:border-purple-800/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-500" />
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Agreement to these policies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>By using Basker, you confirm that youll follow these policies and uphold the safety and authenticity of the network.</p>
              <p>If you spot violations, contact our support team so we can review and take action.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
