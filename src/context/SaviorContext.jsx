import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { BADGES, rankForScore } from '../data/mockData';

const SaviorCtx = createContext(null);

const STORAGE_KEY = 'savior-ai-prototype-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

const defaultState = {
  user: null, // { name, email, age, ageGroup }
  earthStage: 0, // 0 crisis -> 100 fully recovered
  impactScore: 0,
  credits: 0,
  premium: false,
  scans: [],
  donations: [],
  foodShared: [],
  claimedFood: [],
  earnedBadges: [],
  co2Saved: 0,
  waterSaved: 0,
  redeemedCredits: [], // Track redeemed credits for food delivery
};

export function SaviorProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = loadState() || defaultState;
    return { ...loaded, premium: loaded?.premium ?? false };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const signIn = useCallback((profile) => {
    const ageGroup = profile.age <= 10 ? 'Young Earth Guardian' : profile.age <= 15 ? 'Eco Hero' : 'Planet Warrior';
    setState((s) => ({ ...s, user: { ...profile, ageGroup } }));
  }, []);

  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const bumpEarth = useCallback((amount) => {
    setState((s) => ({ ...s, earthStage: Math.max(0, Math.min(100, s.earthStage + amount)) }));
  }, []);

  const addCredits = useCallback((amount) => {
    setState((s) => ({ ...s, credits: s.credits + amount }));
  }, []);

  const checkBadges = useCallback((s) => {
    const earned = new Set(s.earnedBadges);
    const count = s.scans.length + s.foodShared.length + s.donations.length;
    BADGES.forEach((b, i) => {
      if (
        (b.id === 'seed' && s.scans.length >= 1) ||
        (b.id === 'water' && s.waterSaved >= 100) ||
        (b.id === 'forest' && s.donations.length >= 1) ||
        (b.id === 'ocean' && s.foodShared.length >= 3) ||
        (b.id === 'earth' && s.impactScore >= 500)
      ) earned.add(b.id);
    });
    return Array.from(earned);
  }, []);

  const recordScan = useCallback((scan) => {
    setState((s) => {
      const next = {
        ...s,
        scans: [scan, ...s.scans],
        credits: s.credits + 2,
        impactScore: s.impactScore + Math.round(scan.co2 * 10),
        co2Saved: s.co2Saved + scan.co2,
        waterSaved: s.waterSaved + scan.water,
        earthStage: Math.min(100, s.earthStage + 8),
      };
      next.earnedBadges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const recordFoodShare = useCallback((food) => {
    setState((s) => {
      const next = {
        ...s,
        foodShared: [food, ...s.foodShared],
        credits: s.credits + 10,
        impactScore: s.impactScore + 30,
        earthStage: Math.min(100, s.earthStage + 6),
      };
      next.earnedBadges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const recordFoodClaim = useCallback((food) => {
    setState((s) => {
      const next = {
        ...s,
        claimedFood: [food, ...s.claimedFood],
        credits: s.credits + 1,
        impactScore: s.impactScore + 15,
        earthStage: Math.min(100, s.earthStage + 2),
      };
      next.earnedBadges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const recordDonation = useCallback((donation) => {
    setState((s) => {
      const next = {
        ...s,
        donations: [donation, ...s.donations],
        credits: s.credits + 5,
        impactScore: s.impactScore + Math.round(donation.amount / 20),
        earthStage: Math.min(100, s.earthStage + 10),
      };
      next.earnedBadges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const redeemForPremium = useCallback((planCost) => {
    setState((s) => {
      if (s.credits < planCost) return s;
      return { ...s, credits: s.credits - planCost, premium: true };
    });
  }, []);

  const redeemCreditsForFood = useCallback((credits, app) => {
    setState((s) => {
      if (s.credits < credits) return s;
      const discount = Math.floor(credits / 10); // 10 credits = 1% off
      return {
        ...s,
        credits: s.credits - credits,
        redeemedCredits: [
          ...s.redeemedCredits,
          { credits, discount, app, date: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const rank = rankForScore(state.impactScore + 1500); // seeded so new users see a realistic placement context

  const value = {
    ...state,
    rank,
    signIn, signOut, bumpEarth, addCredits,
    recordScan, recordFoodShare, recordFoodClaim, recordDonation, redeemForPremium,
  };

  return <SaviorCtx.Provider value={value}>{children}</SaviorCtx.Provider>;
}

export function useSavior() {
  const ctx = useContext(SaviorCtx);
  if (!ctx) throw new Error('useSavior must be used inside SaviorProvider');
  return ctx;
}
