import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type {LucideIcon} from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Bandage,
  Bug,
  Circle,
  CircleDot,
  Coffee,
  HeartCrack,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react';
import {SiteNav} from '../components/layout/SiteNav';
import {SiteFooter} from '../components/layout/SiteFooter';
import {SideBySideContent, SideBySideHero, SideBySideLayout} from '../components/layout/SideBySideLayout';

const HERO_IMAGE = '/career-statistics-hero.png';

export const metadata: Metadata = {
  title: 'Career Statistics - Ugnė',
  description: "Numbers don't lie. I just adjust them.",
};

type StatVariant = 'numeric' | 'text' | 'redacted' | 'long';

type CareerStat = {
  label: string;
  value: string;
  subtext: string;
  variant: StatVariant;
  border: string;
  icon: LucideIcon;
};

const CAREER_STATS: CareerStat[] = [
  {
    label: 'Bug reports resolved',
    value: '2,341',
    subtext: 'And still shipping (tennis balls).',
    variant: 'numeric',
    border: 'border-primary',
    icon: Bug,
  },
  {
    label: 'Aces',
    value: 'Sometimes',
    subtext: 'When the stars align and the net is feeling generous.',
    variant: 'text',
    border: 'border-secondary-container',
    icon: Circle,
  },
  {
    label: 'Double faults',
    value: 'Redacted',
    subtext: "Some things my coach and I don't talk about.",
    variant: 'redacted',
    border: 'border-tertiary-container',
    icon: HeartCrack,
  },
  {
    label: 'Production bugs introduced',
    value: 'My lawyer advised me not to answer.',
    subtext: "Let's just say: less than the number of coffees I drink.",
    variant: 'long',
    border: 'border-primary',
    icon: Terminal,
  },
  {
    label: 'Balls lost over the fence',
    value: 'Too many',
    subtext: "RIP to those we'll never see again.",
    variant: 'text',
    border: 'border-secondary-container',
    icon: CircleDot,
  },
  {
    label: 'Win rate',
    value: "Depends who's counting",
    subtext: 'Umpires, vibes, and the bounce.',
    variant: 'text',
    border: 'border-tertiary-container',
    icon: Trophy,
  },
];

const MINI_STATS: {value: string; label: string; icon: LucideIcon}[] = [
  {value: '99', label: 'Little injuries', icon: Bandage},
  {value: '1', label: 'Very expensive racket', icon: Activity},
  {value: '∞', label: 'Cups of coffee (est.)', icon: Coffee},
  {value: '0', label: 'Grand slam titles', icon: Sparkles},
  {value: '404', label: 'Lost balls', icon: AlertTriangle},
];

function statValueClassName(variant: StatVariant): string {
  switch (variant) {
    case 'numeric':
      return 'font-headline text-4xl md:text-5xl font-black text-primary tabular-nums';
    case 'text':
      return 'font-headline text-xl md:text-2xl font-black text-primary italic';
    case 'redacted':
      return 'font-headline text-xl md:text-2xl font-black text-primary';
    case 'long':
      return 'font-headline text-base md:text-lg font-black text-primary leading-snug';
  }
}

function StatCard({stat}: {stat: CareerStat}) {
  const Icon = stat.icon;

  return (
    <div
      className={`bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm border-b-4 ${stat.border} flex flex-col gap-3`}
    >
      <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />
      <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">{stat.label}</p>
      {stat.variant === 'redacted' ? (
        <div className="relative inline-block max-w-full">
          <span className={statValueClassName(stat.variant)}>{stat.value}</span>
          <span
            className="absolute inset-0 rounded bg-on-surface/90 blur-[2px]"
            aria-hidden
          />
        </div>
      ) : (
        <span className={statValueClassName(stat.variant)}>{stat.value}</span>
      )}
      <p className="text-on-surface-variant text-sm leading-relaxed">{stat.subtext}</p>
    </div>
  );
}

export default function StatisticsPage() {
  return (
    <>
      <SiteNav currentPage="statistics" />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 page-main-gradient">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8 font-label text-xs uppercase tracking-widest text-primary">
            <span>Statistics that definitely can&apos;t be faked</span>
            <span className="text-on-surface-variant">(Trust me)</span>
          </div>

          <div className="tennis-gradient p-6 sm:p-10 md:p-16 rounded-xl text-center text-on-primary shadow-xl mb-6">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black mb-3">Career Statistics</h1>
            <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold opacity-90 mb-2">
              of a Court Competitor &amp; Bug Hunter
            </p>
            <p className="text-lg opacity-90 font-light italic max-w-xl mx-auto">Numbers don&apos;t lie. I just adjust them.</p>
          </div>

          <SideBySideLayout>
            <SideBySideContent className="space-y-10">
              <blockquote className="bg-surface-container-low rounded-xl p-4 sm:p-6 border-l-2 border-primary italic text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                &ldquo;Statistics are for impressing absolutely nobody.&rdquo;
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {CAREER_STATS.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </div>

              <div className="bg-surface-container-low rounded-xl p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {MINI_STATS.map((mini) => {
                    const MiniIcon = mini.icon;
                    return (
                      <div key={mini.label} className="flex flex-col items-center text-center gap-2">
                        <MiniIcon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />
                        <span className="font-headline text-xl font-black text-primary tabular-nums">
                          {mini.value}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant leading-snug">
                          {mini.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-on-surface-variant text-sm leading-relaxed space-y-1" data-side-by-side-end>
                <p>* Statistics verified by nobody.</p>
                <p>** Performance may vary on clay, grass, hard courts, and Mondays.</p>
              </div>
            </SideBySideContent>

            <SideBySideHero>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-outline-variant/15">
                <Image
                  src={HERO_IMAGE}
                  alt="Ugnė on court — CODE. TEST. TENNIS. REPEAT."
                  width={920}
                  height={1024}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            </SideBySideHero>
          </SideBySideLayout>

          <div className="mt-10 min-[768px]:hidden">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-outline-variant/15 max-w-2xl mx-auto">
              <Image
                src={HERO_IMAGE}
                alt="Ugnė on court — CODE. TEST. TENNIS. REPEAT."
                width={920}
                height={1024}
                className="w-full h-auto"
                sizes="100vw"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
