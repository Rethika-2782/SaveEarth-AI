import { useState } from 'react';
import { useSavior } from '../context/SaviorContext';
import SignInModal from './SignInModal';
import { Leaf, Zap, Crown, Menu, X } from 'lucide-react';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'lab', label: 'Scan Lab' },
  { id: 'food', label: 'Kind Kitchen' },
  { id: 'earthcalling', label: 'Earth Calling' },
  { id: 'leaderboard', label: 'Eco League' },
  { id: 'kids', label: 'Guardian Mode' },
];

export default function Navbar({ view, setView, onOpenPremium, onOpenFoodRedemption }) {
  const { user, credits, premium } = useSavior();
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass px-4 md:px-8 py-3 flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center gap-2 shrink-0">
          <span className="text-2xl animate-pulse-glow">🌱</span>
          <span className="font-display font-bold text-lg tracking-tight">SaveEarth<span className="text-gradient-spore"> AI</span></span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${view === n.id ? 'bg-spore text-abyss' : 'text-mist/70 hover:text-mist hover:bg-mist/10'}`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!premium && (
            <button
              onClick={onOpenPremium}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-spore/20 to-ember/20 border border-spore/40 text-spore px-3 py-1.5 text-xs font-bold hover:from-spore/30 hover:to-ember/30 transition"
            >
              <span className="text-lg">+</span> Unlock
            </button>
          )}
          <button
            onClick={onOpenFoodRedemption}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-ember/40 text-ember px-3 py-1.5 text-xs font-semibold hover:bg-ember/10 transition"
          >
            <Zap size={14} className="fill-ember" /> {credits} credits
          </button>
          {premium && (
            <span className="hidden sm:flex items-center gap-1 rounded-full bg-ember/20 text-ember px-2.5 py-1.5 text-xs font-bold"><Crown size={13} /> PLUS</span>
          )}
          {user ? (
            <button onClick={() => setView('kids')} className="hidden sm:flex items-center gap-2 rounded-full bg-canopy/70 border border-spore/20 pl-1 pr-3 py-1 text-sm">
              <span className="w-7 h-7 rounded-full bg-lichen flex items-center justify-center text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button onClick={() => setSignInOpen(true)} className="rounded-full bg-spore text-abyss px-4 py-1.5 text-sm font-bold hover:brightness-110 transition">
              Sign in
            </button>
          )}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden glass px-4 py-3 flex flex-col gap-1 sticky top-[57px] z-40">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { setView(n.id); setMobileOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm ${view === n.id ? 'bg-spore text-abyss font-semibold' : 'text-mist/80'}`}>
              {n.label}
            </button>
          ))}
          {!premium && (
            <button
              onClick={() => { onOpenPremium(); setMobileOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-spore font-semibold flex items-center gap-1.5"
            >
              <span className="text-lg">+</span> Unlock Premium
            </button>
          )}
          <button onClick={() => { onOpenFoodRedemption(); setMobileOpen(false); }} className="text-left px-3 py-2 rounded-lg text-sm text-ember flex items-center gap-1.5"><Zap size={14}/> {credits} credits</button>
        </div>
      )}

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
