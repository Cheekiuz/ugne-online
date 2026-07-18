'use client';

import {useState} from 'react';
import {BUY_ME_A_COFFEE_URL} from '../../lib/site-links';
import {hasSmiledLocally} from '../../lib/supabase/visitor-id';
import {useSubmitSmile} from './useSubmitSmile';

const buyMeACoffeeButtonClass =
  'bmc-blink-button inline-block px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg uppercase hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto';

export function SponsorCta() {
  const {submitSmile, hasSmiled, resetThankYou} = useSubmitSmile();
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
            No refunds. Only karma.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetThankYou();
            setShowThankYou(false);
          }}
          className="inline-block border-2 border-[#6B7280] text-[#D1D5DB] px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:bg-white/[0.08] hover:border-[#9CA3AF] transition-all"
        >
          Return to being Sponsor again →
        </button>
      </div>
    );
  }

  return (
    <div className="tennis-gradient rounded-xl p-6 sm:p-10 md:p-12 text-center text-on-primary shadow-xl space-y-4">
      <p className="font-headline text-xl sm:text-2xl md:text-3xl font-black uppercase">
        Fund my AI experiments
      </p>
      <a
        href={BUY_ME_A_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBuyMeACoffeeClick}
        className={buyMeACoffeeButtonClass}
      >
        Buy Me a Coffee
      </a>
    </div>
  );
}
