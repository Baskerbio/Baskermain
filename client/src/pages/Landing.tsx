import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

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
              Create a beautiful, customizable Basker profile that lives on the AT Protocol with your Bluesky identity—open, portable, completely free, and miles ahead of every Linktree clone.
            </p>

            <div className="flex gap-4 items-center">
              <CTAButton>Sign up with Bluesky</CTAButton>
              <a className="text-sm text-white/70 hover:underline" href="#features">
                See features →
              </a>
                </div>
            
            <div className="relative max-w-md">
              <form
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 rounded-2xl bg-white/3 border border-white/6 p-4"
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
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/80 text-slate-900 text-sm font-semibold shadow-md hover:bg-white"
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

          </div>

          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Carousel images={HERO_IMAGES} />
                    </div>
                    
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
                  className={`rounded-xl border border-white/15 bg-gradient-to-r ${gradient} px-5 py-6 text-sm font-semibold text-white shadow-lg`}
                >
                  <span className="block text-center text-base sm:text-sm tracking-wide">{label}</span>
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
                </div>
                <p className="mt-3 text-white/75">{feature.description}</p>

                <div className="mt-5">
                  <Carousel images={feature.images} auto={false} fit={feature.fit} />
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
      </main>

      <Footer />
    </div>
  );
}
