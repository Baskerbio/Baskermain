import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';

type Feature = {
  title: string;
  description: string;
  images: string[];
  fit?: 'cover' | 'contain';
};

type ActorSuggestion = {
  handle: string;
  displayName: string;
  avatar?: string;
};

const PARTICLE_COUNT = 80;

const HERO_IMAGES = [
  '/userprofile1.png',
  '/userprofile2.png',
  '/userprofile3.png',
];

const FEATURES: Feature[] = [
  {
    title: 'Decentralized Profiles',
    description:
      'Decentralized profiles built on the AT Protocol, fully customizable, completely free, and honestly, just super cool.',
    images: ['/fullprofile1.png', '/fullprofile2.png', '/fullprofile3.png'],
    fit: 'cover',
  },
  {
    title: 'Modular Widgets',
    description:
      'So many widgets!!! Store links, quotes, work history, announcements, spinners, and so many more!',
    images: ['/widgetsfull1.png', '/widgetsfull2.png', '/widgetsfull3.png'],
    fit: 'cover',
  },
  {
    title: 'Basker Solaris Cards',
    description:
      'Physical NFC cards that connect directly to your Basker page, bridging the physical and digital worlds.',
    images: ['/stevecardfront.png', '/roncardfront.png', '/tonycardfront.png'],
    fit: 'contain',
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/10">
      {children}
    </span>
  );
}

function CTAButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 bg-gradient-to-r from-amber-400 via-rose-400 to-violet-500 text-slate-900 font-semibold shadow-lg hover:scale-[1.01] transition-transform">
      {children}
    </button>
  );
}

function IconDot({ active }: { active?: boolean }) {
  return (
    <div
      className={
        'w-2 h-2 rounded-full transition-all ' +
        (active ? 'scale-110 bg-white' : 'bg-white/40')
      }
    />
  );
}

function Carousel({
  images,
  auto = true,
  interval = 4000,
  fit = 'cover',
}: {
  images: string[];
  auto?: boolean;
  interval?: number;
  fit?: 'cover' | 'contain';
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, auto, interval]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
      <img
        src={images[index]}
        alt={`carousel-${index}`}
        className="w-full h-[420px] md:h-[520px] lg:h-[560px] rounded-3xl"
        style={{
          objectFit: fit === 'contain' ? 'contain' : 'cover',
          backgroundColor: fit === 'contain' ? 'rgba(15, 23, 42, 0.6)' : undefined,
          padding: fit === 'contain' ? '1.5rem' : undefined,
        }}
        draggable={false}
      />

      <div className="absolute left-4 bottom-4 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="p-1 rounded-full"
          >
            <IconDot active={i === index} />
          </button>
        ))}
      </div>

      <div className="absolute right-4 top-4 flex gap-2">
        <button
          onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          className="rounded-full p-2 bg-white/10 backdrop-blur-sm"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="rounded-full p-2 bg-white/10 backdrop-blur-sm"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, index) => ({
        id: index,
        size: Math.random() * 5 + 3,
        left: Math.random() * 100,
        top: Math.random() * 120 - 10,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 8,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="landing-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Landing(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ActorSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const term = searchQuery.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?term=${encodeURIComponent(term)}&limit=5`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        const mapped: ActorSuggestion[] = Array.isArray(data?.actors)
          ? data.actors.map((actor: any) => ({
              handle: String(actor.handle || '').replace(/^@/, ''),
              displayName: actor.displayName || actor.handle || '',
              avatar: actor.avatar,
            }))
          : [];
        setSuggestions(mapped);
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Failed to fetch suggestions:', error);
        }
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchQuery]);

  const openProfile = (handle: string) => {
    if (!handle) return;
    const sanitized = handle.replace(/^@/, '').trim();
    if (!sanitized) return;
    window.open(`/${sanitized}`, '_blank');
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (!term && suggestions[0]) {
      openProfile(suggestions[0].handle);
      return;
    }
    openProfile(term);
  };

  const showSuggestions =
    isSearchFocused &&
    (isLoadingSuggestions || suggestions.length > 0 || searchQuery.trim().length >= 2);

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-rose-900 text-white antialiased">
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="g1" cx="30%" cy="20%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="sr" x1="0" x2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#g1)" />

        <g transform="translate(80, 60) rotate(-12)" opacity="0.08">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={i * 40}
              y={-120}
              width={20}
              height={1800}
              fill="url(#sr)"
              transform={`rotate(${i * 6})`}
            />
          ))}
        </g>

        <rect width="100%" height="100%" fill="transparent" />
      </svg>

      <Particles />
      <Header />

      <main className="relative z-20">
        <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge>Built on Bluesky • at-protocol</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Basker — your portable, decentralized link-in-bio
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              Create a beautiful, customizable landing page that lives with your identity on the at-protocol. Free, open, and private — everything a Linktree should have but decentralized.
            </p>

            <div className="flex gap-4 items-center">
              <CTAButton>Sign up with Bluesky</CTAButton>
              <a className="text-sm text-white/70 hover:underline" href="#features">
                See features →
              </a>
            </div>

            <div className="relative max-w-md">
              <form
                className="p-4 rounded-2xl bg-white/3 border border-white/6 flex items-center gap-3"
                onSubmit={handleSearchSubmit}
              >
                <input
                  name="handle"
                  type="text"
                  placeholder="Search Bluesky handle"
                  className="flex-1 bg-transparent placeholder:text-white/50 text-white focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/80 text-slate-900 text-sm font-semibold shadow-md hover:bg-white"
                >
                  Search
                </button>
              </form>

              {showSuggestions && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-lg">
                  {isLoadingSuggestions && (
                    <div className="px-4 py-3 text-xs text-white/60">Searching Bluesky…</div>
                  )}
                  {!isLoadingSuggestions && suggestions.length > 0 && (
                    <div className="py-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.handle}
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            openProfile(suggestion.handle);
                          }}
                        >
                          <img
                            src={suggestion.avatar || '/baskerchristmas.jpg'}
                            alt={suggestion.displayName || suggestion.handle}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-left">
                            <div className="text-sm font-medium text-white">{suggestion.displayName || suggestion.handle}</div>
                            <div className="text-xs text-white/60">@{suggestion.handle}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {!isLoadingSuggestions && suggestions.length === 0 && (
                    <div className="px-4 py-3 text-xs text-white/50">No matches found yet. Try another handle.</div>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-white/70 ml-1 mt-3">Search for any user</div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Carousel images={HERO_IMAGES} />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                {
                  label: 'Decentralized',
                  gradient: 'from-emerald-500/70 via-cyan-500/60 to-sky-500/70',
                },
                {
                  label: 'Free',
                  gradient: 'from-amber-400/70 via-orange-400/60 to-rose-400/70',
                },
                {
                  label: 'Reliable',
                  gradient: 'from-indigo-500/70 via-purple-500/60 to-pink-500/70',
                },
              ].map(({ label, gradient }) => (
                <div
                  key={label}
                  className={`rounded-xl border border-white/15 bg-gradient-to-r ${gradient} px-4 py-6 text-sm font-semibold tracking-wide uppercase text-white shadow-lg`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">Features with character</h2>
          <p className="text-center text-white/70 mt-2 max-w-2xl mx-auto">
            You deserve the best… actually, better than the best, decentralized profiles with free customization, powerful widgets, and optional physical cards (coming soon).
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <article key={index} className="rounded-2xl bg-white/3 p-6 border border-white/6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <Badge>New</Badge>
                </div>
                <p className="mt-3 text-white/75">{feature.description}</p>

                <div className="mt-5">
                  <Carousel images={feature.images} auto={false} fit={feature.fit} />
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-white/6">Try demo</button>
                  <button className="px-4 py-2 rounded-xl bg-white/6">Docs</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-indigo-900/60 px-8 py-14 shadow-2xl">
            <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <Badge>3 steps · zero friction</Badge>
              <h2 className="mt-6 text-3xl md:text-4xl font-bold">How it works</h2>
              <p className="mt-3 text-white/70 text-base md:text-lg">
                Launch a beautiful, decentralized profile in minutes. Everything lives on the AT Protocol so you stay in control.
              </p>
            </div>

            <div className="relative z-10 mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Connect',
                  desc: 'Sign in with your Bluesky handle. No passwords for us to store, nothing to migrate later.',
                  gradient: 'from-emerald-400/40 to-cyan-400/40',
                },
                {
                  step: '02',
                  title: 'Customize',
                  desc: 'Drop in widgets, reorder sections, add custom themes, and make it feel like you.',
                  gradient: 'from-amber-400/40 to-rose-400/40',
                },
                {
                  step: '03',
                  title: 'Share',
                  desc: 'Publish instantly on the AT Protocol. Link it everywhere—or tap one of the Solaris NFC cards.',
                  gradient: 'from-indigo-400/40 to-purple-500/40',
                },
              ].map(({ step, title, desc, gradient }) => (
                <div
                  key={step}
                  className={`rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur`}
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold uppercase text-white/90`}
                  >
                    step {step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="info-links" className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Need deeper info?</h2>
          <p className="mt-3 text-white/70">Jump directly into the Basker Info Center for tutorials, references, and updates.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/info#overview', label: 'Overview · Why Basker?' },
              { href: '/info#quickstart', label: 'Quickstart · Launch in minutes' },
              { href: '/info#widgets', label: 'Widgets · Full library & tips' },
              { href: '/info#verification', label: 'Verification · Badges explained' },
              { href: '/info#solaris', label: 'Solaris Cards · NFC overview' },
              { href: '/info#faq', label: 'FAQ · Troubleshooting & help' },
            ].map((link) => (
              <button
                key={link.href}
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-5 text-sm font-semibold text-white/85 shadow-lg transition hover:bg-white/10 hover:border-white/25 text-left"
                onClick={() => window.open(link.href, '_blank')}
              >
                {link.label}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative mt-16 border-t border-white/10 bg-slate-950/90 text-white">
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
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:border-white/25 text-left"
                onClick={() => window.open('https://bsky.app/profile/basker.bio', '_blank')}
              >
                <svg viewBox="0 0 64 64" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M32 10.3c4.4-5.8 11.2-8.5 18.2-8.5 5.9 0 11.4 1.9 11.4 7.1 0 8.3-8.9 17.7-18.9 22.3 13.4-4.3 21.3 7.8 14.3 14.3-6.6 6.1-15-3.2-24.9-11.4-9.9 8.2-18.3 17.5-24.9 11.4-7-6.5 0.9-18.6 14.3-14.3C8.3 27.1-.6 17.8-.6 9.5c0-5.2 5.5-7.1 11.4-7.1 7 0 13.8 2.7 18.2 8.5z" />
                </svg>
                <span>
                  <span className="block text-xs text-white/50">Bluesky</span>
                  @basker.bio
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:border-white/25 text-left"
                onClick={() => window.open('https://instagram.com/baskerbio', '_blank')}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.2c3.2 0 3.6.01 4.8.07 1.2.06 1.9.27 2.35.45a3.9 3.9 0 0 1 1.54 1.01 3.9 3.9 0 0 1 1.01 1.54c.18.45.39 1.15.45 2.35.06 1.2.07 1.6.07 4.78s-.01 3.58-.07 4.78c-.06 1.2-.27 1.9-.45 2.35a3.9 3.9 0 0 1-1.01 1.54 3.9 3.9 0 0 1-1.54 1.01c-.45.18-1.15.39-2.35.45-1.2.06-1.6.07-4.78.07s-3.58-.01-4.78-.07c-1.2-.06-1.9-.27-2.35-.45a3.9 3.9 0 0 1-1.54-1.01 3.9 3.9 0 0 1-1.01-1.54c-.18-.45-.39-1.15-.45-2.35C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.78c.06-1.2.27-1.9.45-2.35a3.9 3.9 0 0 1 1.01-1.54 3.9 3.9 0 0 1 1.54-1.01c.45-.18 1.15-.39 2.35-.45C8.42 2.2 8.8 2.2 12 2.2zm0 2.1c-3.16 0-3.53.01-4.77.07-.97.04-1.5.2-1.85.33-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.35-.29.88-.33 1.85-.06 1.24-.07 1.61-.07 4.77s.01 3.53.07 4.77c.04.97.2 1.5.33 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.13.88.29 1.85.33 1.24.06 1.61.07 4.77.07s3.53-.01 4.77-.07c.97-.04 1.5-.2 1.85-.33.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.35.29-.88.33-1.85.06-1.24.07-1.61.07-4.77s-.01-3.53-.07-4.77c-.04-.97-.2-1.5-.33-1.85-.18-.47-.4-.8-.75-1.15a2.3 2.3 0 0 0-1.15-.75c-.35-.13-.88-.29-1.85-.33-1.24-.06-1.61-.07-4.77-.07zm0 3.37a4.43 4.43 0 1 1 0 8.86 4.43 4.43 0 0 1 0-8.86zm0 2.1a2.33 2.33 0 1 0 0 4.66 2.33 2.33 0 0 0 0-4.66zm5.64-2.56a1.03 1.03 0 1 1-2.06 0 1.03 1.03 0 0 1 2.06 0zm-1.43 8.74" />
                </svg>
                <span>
                  <span className="block text-xs text-white/50">Instagram</span>
                  @baskerbio
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:border-white/25 text-left"
                onClick={() => window.open('https://www.tiktok.com/@baskerbio', '_blank')}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M21 8.1c-1.5.05-3-.44-4.16-1.4V16c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c.34 0 .67.03 1 .08V12c-.32-.05-.66-.08-1-.08-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V2h3a5 5 0 0 0 5 5v1.1z" />
                </svg>
                <span>
                  <span className="block text-xs text-white/50">TikTok</span>
                  @baskerbio
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-white/70">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Trust &amp; Legal</h3>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#privacy', '_blank')}
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#terms', '_blank')}
                >
                  Terms of Service
                </button>
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#eula', '_blank')}
                >
                  End User License Agreement
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Explore more</h3>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#starter-packs', '_blank')}
                >
                  Starter Packs
                </button>
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#roadmap', '_blank')}
                >
                  Roadmap &amp; updates
                </button>
                <button
                  type="button"
                  className="hover:text-white transition text-left"
                  onClick={() => window.open('/info#support', '_blank')}
                >
                  Support &amp; community
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <span>© {currentYear} baskerbio inc. - All rights reserved</span>
            <span className="text-white/50">Made with ❤️ by the Basker team · Built on the AT Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
