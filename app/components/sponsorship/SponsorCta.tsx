'use client';

import Link from 'next/link';
import {useState} from 'react';
import {BUY_ME_A_COFFEE_URL} from '../../lib/site-links';
import {hasSmiledLocally} from '../../lib/supabase/visitor-id';
import {useSubmitSmile} from './useSubmitSmile';

const buyMeACoffeeButtonClass =
  'inline-block bg-on-primary text-primary px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg uppercase hover:scale-105 active:scale-95 transition-all w-full sm:w-auto';

export function SponsorCta() {
  const {submitSmile, hasSmiled, saveWarning, resetThankYou} = useSubmitSmile();
  const [showThankYou, setShowThankYou] = useState(() => hasSmiledLocally());

  const handleSponsorClick = async () => {
    await submitSmile();
    setShowThankYou(true);
  };

  const handleBuyMeACoffeeClick = () => {
    void handleSponsorClick();
  };

  if (showThankYou || hasSmiled) {
    return (
      <div className="tennis-gradient rounded-xl p-6 sm:p-10 md:p-12 text-center text-on-primary shadow-xl space-y-6">
        <div>
          <p className="font-headline text-2xl sm:text-3xl md:text-4xl font-black mb-3 uppercase">Thank you!</p>
          <p className="text-lg opacity-90 leading-relaxed">
            You&apos;re officially part of the team. Legends start somewhere.
          </p>
          <p className="text-base opacity-80 mt-2">Your contribution means the world.</p>
        </div>
        <div className="bg-on-primary/10 rounded-xl p-8 max-w-md mx-auto space-y-4">
          <div>
            <p className="font-label text-xs uppercase tracking-widest opacity-70 mb-2">Minimum sponsorship</p>
            <p className="font-headline text-2xl md:text-3xl font-black italic">One iced latte.</p>
          </div>
          <div>
            <p className="font-label text-xs uppercase tracking-widest opacity-70 mb-2">Maximum sponsorship</p>
            <p className="font-headline text-2xl md:text-3xl font-black italic">A private tennis court.</p>
          </div>
        </div>
        <p className="text-sm opacity-90 max-w-md mx-auto leading-relaxed">
          All contributions are deeply appreciated, caffeinated, and put to good use.
        </p>
        <p className="text-base font-bold opacity-90">We&apos;ll happily accept either.</p>
        {saveWarning ? (
          <p className="text-sm opacity-80 italic">Couldn&apos;t save your smile right now — but thank you anyway.</p>
        ) : null}
        <a
          href={BUY_ME_A_COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={buyMeACoffeeButtonClass}
        >
          Buy Me a Coffee
        </a>
        <Link
          href="/sponsorship/"
          onClick={() => {
            resetThankYou();
            setShowThankYou(false);
          }}
          className="inline-block border-2 border-on-primary text-on-primary px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-on-primary/10 transition-all"
        >
          Return to being Sponsor again →
        </Link>
      </div>
    );
  }

  return (
    <div className="tennis-gradient rounded-xl p-6 sm:p-10 md:p-12 text-center text-on-primary shadow-xl space-y-4">
      <p className="font-headline text-xl sm:text-2xl md:text-3xl font-black uppercase">Become a Sponsor</p>
      <a
        href={BUY_ME_A_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBuyMeACoffeeClick}
        className={buyMeACoffeeButtonClass}
      >
        Buy Me a Coffee
      </a>
      <p className="text-sm opacity-90 italic max-w-xs mx-auto">
        Help a player dream bigger. And hit stronger.
      </p>
      <p className="text-xs opacity-75">
        Also adds your smile to the{' '}
        <Link href="/say-cheese/" className="underline underline-offset-2 hover:opacity-100">
          Say Cheese
        </Link>{' '}
        wall.
      </p>
    </div>
  );
}
