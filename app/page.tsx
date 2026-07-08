'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRef, useState} from 'react';
import {ExecutiveDecisionSprite} from './components/executive-decision-sprite/ExecutiveDecisionSprite';
import { SiteFooter } from './components/layout/SiteFooter';
import { SiteNav } from './components/layout/SiteNav';
import { SeriousVisitorsCard } from './components/serious-visitors/SeriousVisitorsCard';

const PERSONA_IMAGE = '/cc34d4a1-65a9-47d8-82e2-ce055bec3b13.jpeg';
const KINETIC_MAIN_IMAGE = '/dcd50533-5c90-4e05-ae9c-1e1640403fbc.jpeg';
const PAGE_LOAD_SOUND = '/audio/211976__qubodup__boom2.flac';
const CHALLENGE_ME_URL = 'https://www.instagram.com/ugne_le_';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    void audioRef.current?.play();
  };

  const playBoomSound = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play();
  };

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src={PAGE_LOAD_SOUND} type="audio/flac" />
      </audio>

      {!hasEntered ? (
        <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background">
          <button
            type="button"
            onClick={handleEnter}
            className="group flex cursor-pointer items-center justify-center rounded-3xl p-10 transition-all duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:scale-[0.98]"
            aria-label="Enter site"
          >
            <span className="material-symbols-outlined select-none text-[clamp(4.5rem,20vmin,12rem)] leading-none text-on-surface transition-colors duration-200 group-hover:text-primary group-hover:drop-shadow-md">
              door_front
            </span>
          </button>
        </div>
      ) : (
        <>
      {/* TopNavBar */}
      <SiteNav currentPage="home" />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-12 lg:gap-y-10 items-center">
            <div className="min-w-0 lg:col-span-5 order-2 lg:order-1">
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-primary leading-[0.95] tracking-tighter mb-4 sm:mb-6 break-words">
                COURT<br/><span className="text-secondary">COMPETITOR.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
                Where technical precision meets kinetic energy. Exploring the parallels between high-stakes QA engineering and the strategic rhythm of the tennis court.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-4 order-1 lg:order-2 flex justify-center">
              <div className="relative mx-auto w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-surface-container-lowest ring-1 ring-outline-variant/20">
                <Image
                  src={PERSONA_IMAGE}
                  alt="Ugnė — court competitor"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
            <div className="min-w-0 lg:col-span-3 order-3 flex flex-col items-center justify-center gap-4 sm:gap-6 lg:items-end lg:justify-end lg:self-end">
              <div className="flex w-full justify-center lg:justify-end max-w-full">
                <ExecutiveDecisionSprite variant="blue" compact />
              </div>
              <div className="bg-primary-container p-6 sm:p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm w-full max-w-[220px] shrink-0">
                <span className="font-headline text-4xl sm:text-5xl font-black text-on-primary-container">40-15</span>
                <span className="font-label uppercase tracking-widest text-sm text-on-primary-container opacity-70 mt-2">Game Point Mindset</span>
              </div>
            </div>
          </div>
        </section>

        {/* Kinetic Gallery — portrait + strategic tiles */}
        <section className="bg-surface-container-low pt-12 pb-12 sm:pt-24 sm:pb-24 mb-12 sm:mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8 sm:mb-12 items-baseline">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold">The Kinetic Drive</h2>
              <div className="h-[2px] flex-grow bg-outline-variant opacity-20"></div>
              <span className="font-label text-tertiary-container bg-tertiary px-4 py-1 rounded-full text-xs uppercase tracking-widest">Active Season</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:min-h-[600px] md:items-stretch">
              <div className="flex min-h-[320px] flex-col overflow-hidden rounded-xl bg-surface-container-lowest md:min-h-0">
                <div className="relative min-h-0 flex-1 basis-0 min-h-[280px]">
                  <Image
                    className="object-cover"
                    alt="Portrait among letter sculpture by the coast"
                    src={KINETIC_MAIN_IMAGE}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="shrink-0 border-t border-outline-variant/20 bg-surface-container-lowest/95 p-6 backdrop-blur-md">
                  <h3 className="font-headline text-xl font-bold text-primary">The Forehand Snap</h3>
                  <p className="mt-2 max-w-md text-sm opacity-80">
                    Execution with a 98% precision rate. Just like a successful production deployment.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2 min-h-[200px] bg-secondary-container rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 tennis-gradient opacity-10"></div>
                  <div className="p-6 sm:p-8 h-full flex flex-col justify-center relative z-10">
                    <span className="text-4xl sm:text-6xl font-headline font-black text-on-secondary-container opacity-20 mb-4">#01</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-on-secondary-container leading-tight">Strategic positioning is 90% of the game.</h3>
                  </div>
                </div>
                <div className="min-h-[200px] bg-surface-container-highest rounded-xl overflow-hidden relative">
                  <Image
                    className="w-full h-full object-cover"
                    alt="Yellow tennis balls organized in a container"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFEWkygmGUL1IUcvF9-gtfbDFUd_wvgg16h5I4pNBBe7Yeppbz08bAY0MPwP6ce9GvpQJVGUirZ04-kANT5abHi4fkx_Yprq5r770LS9hi4gT60Biwn3mh9oxMhicQEGLbpunmyANwlDEWM9MpNabBIMYVouU0WVmTY23trNdNLjFsqEkgPwnRKJ9BrE-grHtCVMiYZgqh5A3YGm1-w4weaxq8FBCp2pLcMnc1IXgT7Bw7sOF4tQ-eK1rZRaKh8lnI5dO7Jfllw8M"
                    fill
                    referrerPolicy="no-referrer"
                  />
                </div>
                <SeriousVisitorsCard />
              </div>
            </div>
          </div>
        </section>

        {/* Favorite Match Moments (Bento Grid) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-16 sm:mb-24">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">Match Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Moment 1 */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm border-b-4 border-primary">
              <div className="flex justify-between mb-6">
                <span className="text-xs font-label uppercase tracking-tighter text-outline">August 2023</span>
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
              </div>
              <h4 className="font-headline text-xl font-bold mb-4 italic">&quot;The Comeback Set&quot;</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Trailing 0-5 in the second set, I focused on micro-adjustments in my serve. Secured the tie-break with a cross-court winner.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Precision</span>
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Grit</span>
              </div>
            </div>
            {/* Moment 2 */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm border-b-4 border-secondary-container">
              <div className="flex justify-between mb-6">
                <span className="text-xs font-label uppercase tracking-tighter text-outline">May 2024</span>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <h4 className="font-headline text-xl font-bold mb-4 italic">&quot;Clay Court Endurance&quot;</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">A 3-hour marathon in the humidity. Testing the limits of stamina and tactical patience. Engineering a victory from defensive play.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Stamina</span>
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Strategy</span>
              </div>
            </div>
            {/* Moment 3 */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-sm border-b-4 border-tertiary-container">
              <div className="flex justify-between mb-6">
                <span className="text-xs font-label uppercase tracking-tighter text-outline">Active</span>
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              </div>
              <h4 className="font-headline text-xl font-bold mb-4 italic">&quot;The Perfect Ace&quot;</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Clocking my fastest serve yet. The culmination of 6 months of biomechanical focus and technical QA on my form.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Power</span>
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] uppercase font-bold text-on-surface-variant">Biomechanics</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferred Courts (Map & List) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-16 sm:mb-24">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="md:w-1/2 h-56 sm:h-72 md:h-auto relative min-h-[14rem]">
              <Image 
                className="w-full h-full object-cover" 
                alt="Overhead view of several green and blue tennis courts" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUaJyFZhoUTJH7yfPKq9ufjZiLRxtnT-AoNShrU8hrZTQ_ZzQLGG_MSTNhynhTLZjr-nKrdyR3tenDf37JRau4r1bdRll65WjhmUpGW1UC5ohpjgrLeWOXuvs05yaungvQGngWOQ4kTKckLuEYH8K_auTIZUhG0oss00jlNm8xOZKZ1ay5lH5reYfwx7LaQW6VmDctEN3DJgk93MCAMtCJyKffC1R5gdELZwPDsBOs-ddTMOO0KSh9OFqTf3qCtcygG4N57G_M1uQ"
                fill
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-1/2 p-6 sm:p-8 md:p-12 bg-surface-container-low flex flex-col justify-center">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-primary">Preferred Courts</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 bg-primary rounded-sm rotate-45 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-lg">SEB Arena</h5>
                    <p className="text-sm text-on-surface-variant">Indoor precision. High-speed hard courts that reward aggressive baseline play.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 bg-secondary rounded-sm rotate-45 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-lg">Bernardinai</h5>
                    <p className="text-sm text-on-surface-variant">
                      Open-air sets beside the Bernardine Garden—fresh air, river light, and the kind of calm focus you only get away from the indoor hum.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="tennis-gradient p-6 sm:p-10 md:p-16 rounded-xl text-center text-on-primary shadow-xl">
            <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">Ready to challenge me?</h3>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-10 max-w-xl mx-auto">Tennis, QA, coffee or arguing about whether that ball was actually out.</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center">
              <button
                type="button"
                onClick={playBoomSound}
                className="bg-on-primary text-primary px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                Think again
              </button>
              <Link
                href="/statistics/"
                className="border-2 border-on-primary text-on-primary px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-on-primary/10 transition-all w-full sm:w-auto"
              >
                View Statistics
              </Link>
              <Link
                href="/sponsorship/"
                className="border-2 border-on-primary text-on-primary px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-on-primary/10 transition-all w-full sm:w-auto"
              >
                💰 Sponsorship Opportunities
              </Link>
              <a
                href={CHALLENGE_ME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-error text-on-error px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                Challenge me
              </a>
            </div>
          </div>
          <div className="flex justify-center mt-8 sm:mt-12 max-w-full">
            <ExecutiveDecisionSprite variant="red" />
          </div>
        </section>
      </main>

      <SiteFooter />
        </>
      )}
    </>
  );
}
