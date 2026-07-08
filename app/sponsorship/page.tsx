import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {SiteNav} from '../components/layout/SiteNav';
import {SiteFooter} from '../components/layout/SiteFooter';
import {SponsorCta} from '../components/sponsorship/SponsorCta';
import {SponsorSmileWall} from '../components/sponsorship/SponsorSmileWall';

const HERO_IMAGE = '/sponsorship-hero.png';

export const metadata: Metadata = {
  title: 'Sponsorship - Ugnė',
  description: 'Funding dreams since approximately last Tuesday.',
};

type Sponsor = {
  emoji: string;
  name: string;
  tag: string;
  subtext: string;
  border: string;
};

type SeekingSponsor = {
  name: string;
  offer: string;
};

type Package = {
  tier: string;
  price: string;
  perks: string;
  border: string;
};

type FaqItem = {
  question: string;
  answer: string;
  border: string;
};

type Testimonial = {
  quote: string;
  attribution: string;
  border: string;
};

const SPONSORS: Sponsor[] = [
  {
    emoji: '☕',
    name: 'Coffee',
    tag: 'Official Performance Partner',
    subtext: 'Without coffee: Serve speed 91 km/h. Debugging speed 0 km/h.',
    border: 'border-primary',
  },
  {
    emoji: '❤️',
    name: 'Delusion',
    tag: 'Platinum Sponsor',
    subtext: 'Believes I can still make Wimbledon. Nobody had the heart to tell them.',
    border: 'border-secondary-container',
  },
  {
    emoji: '🐛',
    name: 'Regression testing',
    tag: 'Lifetime Partner',
    subtext: 'Always there to remind me I broke something.',
    border: 'border-tertiary-container',
  },
  {
    emoji: '🎾',
    name: 'Hope',
    tag: 'Official Match Ball Supplier',
    subtext: 'Still bouncing after every double fault.',
    border: 'border-primary',
  },
  {
    emoji: '🍕',
    name: 'Pizza',
    tag: 'Recovery Nutrition',
    subtext: 'Scientifically proven to improve morale. Science not included.',
    border: 'border-secondary-container',
  },
  {
    emoji: '🧊',
    name: 'Ice pack',
    tag: 'Recovery Sponsor',
    subtext: 'Working overtime since 2023.',
    border: 'border-tertiary-container',
  },
  {
    emoji: '☀️',
    name: 'SPF 50+',
    tag: 'Official Skin Protection Partner',
    subtext: 'Saving me from both UV rays and questionable tan lines.',
    border: 'border-primary',
  },
  {
    emoji: '📋',
    name: 'Excuses Ltd.',
    tag: 'Official Statement Provider',
    subtext: 'Wind, Sun, Strings, Mercury Retrograde, QA deployment.',
    border: 'border-secondary-container',
  },
  {
    emoji: '💳',
    name: 'Credit card',
    tag: 'Equipment Financing Partner',
    subtext: "The racket wasn't expensive. The monthly payments are.",
    border: 'border-tertiary-container',
  },
  {
    emoji: '🧦',
    name: 'Lucky Socks',
    tag: 'Performance Enhancer (Probably)',
    subtext: "Won: 8, Lost: 4. Correlation ≠ causation. Don't tell me that.",
    border: 'border-primary',
  },
];

const SEEKING_SPONSORS: SeekingSponsor[] = [
  {name: 'Coffee shop', offer: 'Logo appears in my dreams.'},
  {name: 'Bakery', offer: 'Guaranteed Instagram story.'},
  {name: 'Tennis shop', offer: "I'll pretend your racket improved my game."},
  {name: 'Bug tracker', offer: 'Unlimited emotional support.'},
  {name: 'Physiotherapist', offer: "You'll be busy."},
];

const PACKAGES: Package[] = [
  {tier: 'Bronze', price: '€4.90', perks: 'One cappuccino. I say "Thanks."', border: 'border-primary'},
  {tier: 'Silver', price: '€8.50', perks: 'Large iced latte. I think about you before every match.', border: 'border-secondary-container'},
  {tier: 'Gold', price: '€15', perks: 'Coffee + croissant. Guaranteed 12% confidence boost.', border: 'border-tertiary-container'},
  {tier: 'Platinum', price: '€25', perks: 'Coffee. Lunch. One motivational speech to myself mentioning your company.', border: 'border-primary'},
  {tier: 'Enterprise', price: "Let's talk", perks: "Unlimited coffee. I'll legally change my serve's name to yours.", border: 'border-secondary-container'},
];

const ROI_RETURNS = [
  {label: 'Confidence', value: '+8'},
  {label: 'Energy', value: '+2'},
  {label: 'Better mood', value: '+17'},
  {label: 'ATP ranking', value: '+0'},
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Do you actually have sponsors?',
    answer: 'Emotionally, yes.',
    border: 'border-primary',
  },
  {
    question: 'Can I sponsor you?',
    answer: 'Absolutely.',
    border: 'border-secondary-container',
  },
  {
    question: 'Where does my money go?',
    answer: 'Mostly tennis balls. Some coffee. Possibly more tennis balls.',
    border: 'border-tertiary-container',
  },
  {
    question: 'Is this tax deductible?',
    answer: 'Almost certainly not.',
    border: 'border-primary',
  },
  {
    question: 'Will you win more matches?',
    answer: 'No guarantees.',
    border: 'border-secondary-container',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {quote: 'She definitely drinks coffee.', attribution: 'Local Barista', border: 'border-primary'},
  {quote: 'She keeps buying tennis balls.', attribution: 'Tennis Shop Cashier', border: 'border-secondary-container'},
  {quote: 'Regression caught 17 bugs today.', attribution: 'QA Team', border: 'border-tertiary-container'},
  {quote: 'Still thinks that ball was in.', attribution: 'Opponent', border: 'border-primary'},
];

const OFFICIAL_SPONSORS = ['Coffee', 'Delusion', 'Regression Testing', 'Hope'];
const NON_SPONSORS = ['Nike', 'Wilson', 'Rolex', 'Red Bull'];

function SectionHeading({eyebrow, title}: {eyebrow?: string; title: string}) {
  return (
    <div className="space-y-1">
      {eyebrow ? (
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">{eyebrow}</p>
      ) : null}
      <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">{title}</h2>
    </div>
  );
}

function SponsorCard({sponsor}: {sponsor: Sponsor}) {
  return (
    <div
      className={`bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm border-b-2 ${sponsor.border} flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-3xl" aria-hidden>
          {sponsor.emoji}
        </span>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">
          {sponsor.tag}
        </span>
      </div>
      <p className="font-headline text-xl md:text-2xl font-black text-primary uppercase">{sponsor.name}</p>
      <p className="text-on-surface-variant text-sm leading-relaxed">{sponsor.subtext}</p>
    </div>
  );
}

function PackageCard({pkg}: {pkg: Package}) {
  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 ${pkg.border} flex flex-col gap-2 ${pkg.tier === 'Enterprise' ? 'sm:col-span-2 lg:col-span-3' : ''}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-headline text-lg font-black text-primary uppercase">{pkg.tier}</p>
        <p className="font-headline text-lg font-black text-primary tabular-nums">{pkg.price}</p>
      </div>
      <p className="text-on-surface-variant text-sm leading-relaxed">{pkg.perks}</p>
    </div>
  );
}

export default function SponsorshipPage() {
  return (
    <>
      <SiteNav currentPage="sponsorship" />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8 font-label text-xs uppercase tracking-widest text-primary">
            <span>Current world ranking: Financially Optimistic.</span>
          </div>

          <div className="tennis-gradient p-6 sm:p-10 md:p-16 rounded-xl text-center text-on-primary shadow-xl mb-6">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black mb-3">Sponsorship Opportunities</h1>
            <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold opacity-90 mb-2">
              Because tennis balls don&apos;t grow on trees
            </p>
            <p className="text-lg opacity-90 font-light italic max-w-xl mx-auto">
              Funding dreams since approximately last Tuesday.
            </p>
          </div>

          <blockquote className="bg-surface-container-low rounded-xl p-4 sm:p-6 border-l-2 border-primary italic text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-12 max-w-3xl">
            &ldquo;I don&apos;t need a title sponsor. I need an iced latte.&rdquo;
          </blockquote>

          <div className="grid lg:grid-cols-[1fr_min(560px,48%)] gap-8 xl:gap-12 items-start">
            <div className="space-y-10">
              <SponsorSmileWall />

              <div className="space-y-6">
                <SectionHeading eyebrow="AKA Life Support System" title="Currently Sponsored By" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {SPONSORS.map((sponsor) => (
                    <SponsorCard key={sponsor.name} sponsor={sponsor} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading title="Looking for New Sponsors" />
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                          <th className="text-left p-4 font-label uppercase tracking-widest text-xs text-on-surface-variant">
                            Sponsor
                          </th>
                          <th className="text-left p-4 font-label uppercase tracking-widest text-xs text-on-surface-variant">
                            What you get
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {SEEKING_SPONSORS.map((row) => (
                          <tr key={row.name} className="even:bg-surface-container-low border-b border-outline-variant/10 last:border-0">
                            <td className="p-4 font-bold text-primary">{row.name}</td>
                            <td className="p-4 text-on-surface-variant">{row.offer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading title="Sponsorship Packages" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PACKAGES.map((pkg) => (
                    <PackageCard key={pkg.tier} pkg={pkg} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading eyebrow="Investor Relations" title="ROI Calculator" />
                <div className="bg-surface-container-low rounded-xl p-6 sm:p-8">
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">
                    Investment: One latte
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {ROI_RETURNS.map((item) => (
                      <div key={item.label} className="flex flex-col items-center text-center gap-1">
                        <span className="font-headline text-2xl font-black text-primary tabular-nums">
                          {item.value}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-on-surface-variant text-xs mt-6">Expected return. Past performance not indicative of future aces.</p>
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading title="Donation Meter" />
                <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="font-headline text-2xl font-black text-primary tabular-nums">82%</span>
                    <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                      Current goal
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-container-high overflow-hidden mb-4">
                    <div className="h-full rounded-full bg-primary" style={{width: '82%'}} />
                  </div>
                  <div className="space-y-1 text-sm text-on-surface-variant">
                    <p>
                      <strong className="text-on-surface">Next milestone:</strong> New overgrip.
                    </p>
                    <p>
                      <strong className="text-on-surface">Stretch goal:</strong> Professional-looking water bottle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading title="Frequently Asked Questions" />
                <div className="space-y-4">
                  {FAQ_ITEMS.map((item) => (
                    <div
                      key={item.question}
                      className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 ${item.border}`}
                    >
                      <p className="font-headline text-base font-bold text-primary mb-2">{item.question}</p>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <SectionHeading eyebrow="100% Real" title="Testimonials" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TESTIMONIALS.map((item) => (
                    <div
                      key={item.attribution}
                      className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 ${item.border}`}
                    >
                      <p className="text-on-surface-variant text-sm leading-relaxed italic mb-3">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                        - {item.attribution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <SponsorCta />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-b-2 border-primary">
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">
                    Official Sponsors
                  </p>
                  <ul className="space-y-2">
                    {OFFICIAL_SPONSORS.map((name) => (
                      <li key={name} className="font-headline font-bold text-primary">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-b-2 border-outline-variant">
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4">
                    Official Non-Sponsors
                  </p>
                  <ul className="space-y-2">
                    {NON_SPONSORS.map((name) => (
                      <li key={name} className="font-headline font-bold text-on-surface-variant line-through opacity-70">
                        {name}
                      </li>
                    ))}
                  </ul>
                  <p className="text-on-surface-variant text-sm italic mt-4">They&apos;re still thinking about it.</p>
                </div>
              </div>

              <div className="text-on-surface-variant text-sm leading-relaxed space-y-1">
                <p>* Tier upgrades accepted in <strong className="font-bold text-on-surface">coconut</strong> milk only.</p>
              </div>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-36">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20">
                <Image
                  src={HERO_IMAGE}
                  alt="Ugnė holding an iced latte and tennis racket — CODE. TEST. TENNIS. REPEAT."
                  width={920}
                  height={1024}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            </aside>
          </div>

          <div className="mt-10 lg:hidden">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20 max-w-2xl mx-auto">
              <Image
                src={HERO_IMAGE}
                alt="Ugnė holding an iced latte and tennis racket — CODE. TEST. TENNIS. REPEAT."
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
