import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, Zap } from 'lucide-react';
import { useSavior } from '../context/SaviorContext';

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$2.99', creditsCost: 10, period: '/month' },
  { id: 'yearly', label: 'Yearly', price: '$19.99', creditsCost: 50, period: '/year', badge: 'Best value' },
];

const PERKS = [
  'Advanced waste transformation ideas (banana peel → bioplastic & more)',
  'Full Startup Generator on every scan',
  'Market demand & pricing insights',
  'Priority NGO matching in Earth Calling',
];

export default function PremiumModal({ open, onClose }) {
  const { credits, premium, redeemForPremium } = useSavior();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }}
            className="glass rounded-3xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1"><Crown className="text-ember" size={22} /><h3 className="text-2xl font-bold">SAVIOR PLUS</h3></div>
            <p className="text-sm text-mist/60 mb-6">{premium ? "You're already a Savior Plus member. Thank you for going further." : 'Unlock the full agent ecosystem — pay in dollars, or redeem the credits you\'ve earned.'}</p>

            <ul className="space-y-2 mb-6">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-mist/75"><Check size={15} className="text-spore mt-0.5 shrink-0" />{p}</li>
              ))}
            </ul>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {PLANS.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-spore/20 bg-canopy/40 p-4 relative">
                  {plan.badge && <span className="absolute -top-2 right-3 text-[10px] bg-ember text-abyss px-2 py-0.5 rounded-full font-bold">{plan.badge}</span>}
                  <p className="text-xs text-mist/50">{plan.label}</p>
                  <p className="text-2xl font-extrabold">{plan.price}<span className="text-xs text-mist/40 font-normal">{plan.period}</span></p>
                  <p className="text-[11px] text-mist/40 mt-1">or {plan.creditsCost} credits</p>
                  <button
                    disabled={premium || credits < plan.creditsCost}
                    onClick={() => redeemForPremium(plan.creditsCost)}
                    className="mt-3 w-full rounded-xl bg-spore text-abyss font-bold py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                    Redeem with credits
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-mist/50 mb-4">
              <span className="flex items-center gap-1"><Zap size={13} className="text-ember" /> Your balance: {credits} credits</span>
              <span>Earn: +2 scan · +10 food share · +5 donation</span>
            </div>

            <button onClick={onClose} className="w-full rounded-xl border border-mist/25 py-2.5 text-sm text-mist/70">Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
