import React from 'react';

const infoLinks = [
  { href: '/info#overview', label: 'Overview · Why Basker?' },
  { href: '/info#quickstart', label: 'Quickstart · Launch in minutes' },
  { href: '/info#widgets', label: 'Widgets · Full library & tips' },
  { href: '/info#verification', label: 'Verification · Badges explained' },
  { href: '/info#solaris', label: 'Solaris Cards · NFC overview' },
  { href: '/info#faq', label: 'FAQ · Troubleshooting & help' },
];

const trustLinks = [
  { href: '/info#privacy', label: 'Privacy Policy' },
  { href: '/info#terms', label: 'Terms of Service' },
  { href: '/info#eula', label: 'End User License Agreement' },
];

const exploreLinks = [
  { href: '/info#starter-packs', label: 'Starter Packs' },
  { href: '/info#roadmap', label: 'Roadmap & updates' },
  { href: '/info#support', label: 'Support & community' },
];

const socialLinks = [
  {
    platform: 'Bluesky',
    handle: '@basker.bio',
    href: 'https://bsky.app/profile/basker.bio',
    icon: (
      <svg viewBox="0 0 64 64" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M32 10.3c4.4-5.8 11.2-8.5 18.2-8.5 5.9 0 11.4 1.9 11.4 7.1 0 8.3-8.9 17.7-18.9 22.3 13.4-4.3 21.3 7.8 14.3 14.3-6.6 6.1-15-3.2-24.9-11.4-9.9 8.2-18.3 17.5-24.9 11.4-7-6.5 0.9-18.6 14.3-14.3C8.3 27.1-.6 17.8-.6 9.5c0-5.2 5.5-7.1 11.4-7.1 7 0 13.8 2.7 18.2 8.5z" />
      </svg>
    ),
  },
  {
    platform: 'Instagram',
    handle: '@baskerbio',
    href: 'https://instagram.com/baskerbio',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M12 2.2c3.2 0 3.6.01 4.8.07 1.2.06 1.9.27 2.35.45a3.9 3.9 0 0 1 1.54 1.01 3.9 3.9 0 0 1 1.01 1.54c.18.45.39 1.15.45 2.35.06 1.2.07 1.6.07 4.78s-.01 3.58-.07 4.78c-.06 1.2-.27 1.9-.45 2.35a3.9 3.9 0 0 1-1.01 1.54 3.9 3.9 0 0 1-1.54 1.01c-.45.18-1.15.39-2.35.45-1.2.06-1.6.07-4.78.07s-3.58-.01-4.78-.07c-1.2-.06-1.9-.27-2.35-.45a3.9 3.9 0 0 1-1.54-1.01 3.9 3.9 0 0 1-1.01-1.54c-.18-.45-.39-1.15-.45-2.35C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.78c.06-1.2.27-1.9.45-2.35a3.9 3.9 0 0 1 1.01-1.54 3.9 3.9 0 0 1 1.54-1.01c.45-.18 1.15-.39 2.35-.45C8.42 2.2 8.8 2.2 12 2.2zm0 2.1c-3.16 0-3.53.01-4.77.07-.97.04-1.5.2-1.85.33-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.35-.29.88-.33 1.85-.06 1.24-.07 1.61-.07 4.77s.01 3.53.07 4.77c.04.97.2 1.5.33 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.13.88.29 1.85.33 1.24.06 1.61.07 4.77.07s3.53-.01 4.77-.07c.97-.04 1.5-.2 1.85-.33.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.35.29-.88.33-1.85.06-1.24.07-1.61.07-4.77s-.01-3.53-.07-4.77c-.04-.97-.2-1.5-.33-1.85-.18-.47-.4-.8-.75-1.15a2.3 2.3 0 0 0-1.15-.75c-.35-.13-.88-.29-1.85-.33-1.24-.06-1.61-.07-4.77-.07zm0 3.37a4.43 4.43 0 1 1 0 8.86 4.43 4.43 0 0 1 0-8.86zm0 2.1a2.33 2.33 0 1 0 0 4.66 2.33 2.33 0 0 0 0-4.66zm5.64-2.56a1.03 1.03 0 1 1-2.06 0 1.03 1.03 0 0 1 2.06 0zm-1.43 8.74" />
      </svg>
    ),
  },
  {
    platform: 'TikTok',
    handle: '@baskerbio',
    href: 'https://www.tiktok.com/@baskerbio',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M21 8.1c-1.5.05-3-.44-4.16-1.4V16c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c.34 0 .67.03 1 .08V12c-.32-.05-.66-.08-1-.08-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V2h3a5 5 0 0 0 5 5v1.1z" />
      </svg>
    ),
  },
];

export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={
        className ??
        'relative mt-16 border-t border-white/10 bg-slate-950/90 text-white'
      }
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-900/40 via-slate-900/40 to-blue-900/40" />
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-white/10 to-transparent blur-3xl opacity-40" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/baskerchristmas.jpg"
              alt="Basker logo"
              className="w-14 h-14 rounded-full border border-white/20 shadow-2xl object-cover"
            />
            <div>
              <div className="text-xl font-semibold">Basker</div>
              <div className="text-sm text-white/70">Decentralized link-in-bio platform</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Build once, own forever. Basker keeps your profile portable across the AT Protocol, with rich widgets, custom branding, and optional Solaris NFC cards.
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Stay in touch</h3>
          <div className="mt-5 flex flex-col gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:border-white/25"
              >
                {link.icon}
                <span>
                  <span className="block text-xs text-white/50">{link.platform}</span>
                  {link.handle}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-sm text-white/70">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Trust &amp; Legal</h3>
            <div className="mt-4 flex flex-col gap-2">
              {trustLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Explore more</h3>
            <div className="mt-4 flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-8 max-w-7xl mx-auto">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 text-center">Need deeper info?</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {infoLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-5 text-sm font-semibold text-white/85 shadow-lg transition hover:bg-white/10 hover:border-white/25"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <span>© {currentYear} baskerbio inc. - All rights reserved</span>
          <span className="text-white/50">Made with ❤️ by the Basker team · Built on the AT Protocol</span>
        </div>
      </div>
    </footer>
  );
}
