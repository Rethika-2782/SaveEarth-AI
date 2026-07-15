import { motion } from 'framer-motion';
import EarthOrb from './EarthOrb';
import { useSavior } from '../context/SaviorContext';
import { ScanLine, Globe2, TrendingUp, Trophy, HeartHandshake, UtensilsCrossed, Sparkles, Mic, Camera } from 'lucide-react';

const FEATURES = [
  { id: 'lab', icon: ScanLine, title: 'Camera Scan Lab', desc: 'Snap a photo or use voice commands to uncover what your waste can become.' },
  { id: 'lab', icon: Globe2, title: 'Real-world solutions', desc: 'See how countries like Canada, Germany and India reuse the same material differently.' },
  { id: 'lab', icon: TrendingUp, title: 'Waste → Wealth', desc: 'Turn scraps into startup ideas with real market and impact insight.' },
  { id: 'leaderboard', icon: Trophy, title: 'Eco League', desc: 'Climb the leaderboard and unlock badges as your impact grows.' },
  { id: 'earthcalling', icon: HeartHandshake, title: 'Earth Calling', desc: 'Support verified NGOs and track the stories behind your impact.' },
  { id: 'food', icon: UtensilsCrossed, title: 'Kind Kitchen', desc: 'Share extra meals, rescue food, and make every plate feel a little brighter.' },
];

export default function Landing({ setView }) {
  const { earthStage, bumpEarth, user } = useSavior();
  const crisis = earthStage <= 25;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
              width: 3 + (i % 4), height: 3 + (i % 4),
              background: crisis ? 'rgba(90,90,80,0.5)' : 'rgba(184,230,0,0.5)',
              animationDelay: `${i * 0.4}s`, animationDuration: `${6 + (i % 5)}s`,
            }} />
        ))}
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.28em] uppercase text-spore/80 border border-spore/30 rounded-full px-3 py-1 mb-6">
            <Sparkles size={12} /> {crisis ? 'Earth care mode' : 'Earth recovery mode'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.08] mb-5">
            Small actions, big planet energy.<br />
            <span className="text-gradient-spore">Welcome to SaveEarth AI.</span>
          </h1>
          <p className="text-mist/70 text-base md:text-lg mb-7 max-w-xl">
            Use your camera, your voice, and a little kindness to turn everyday waste into recovery, food rescue, and real environmental hope.
          </p>
          <div className="flex flex-wrap gap-3 mb-5">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => { bumpEarth(12); setView('lab'); }}
              className="rounded-full bg-spore text-abyss font-bold px-7 py-3 shadow-[0_0_30px_rgba(184,230,0,0.35)]"
            >
              ✨ Start scanning
            </motion.button>
            <button onClick={() => setView('food')} className="rounded-full border border-mist/25 px-7 py-3 font-semibold text-mist/80 hover:bg-mist/10 transition">
              🍲 Visit Kind Kitchen
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-mist/60">
            <span className="rounded-full bg-canopy/70 px-3 py-1.5 flex items-center gap-1"><Camera size={12} /> Camera ready</span>
            <span className="rounded-full bg-canopy/70 px-3 py-1.5 flex items-center gap-1"><Mic size={12} /> Voice controls</span>
            <span className="rounded-full bg-canopy/70 px-3 py-1.5 flex items-center gap-1">🌍 Live impact insights</span>
          </div>
          {user && <p className="mt-4 text-xs text-mist/50">Welcome back, {user.name} — you're a {user.ageGroup}.</p>}
        </div>

        <div className="flex flex-col items-center">
          <EarthOrb stage={earthStage} size={320} />
          <p className="mt-4 text-center text-sm text-mist/60 max-w-xs">
            {crisis
              ? 'Every scan and share helps the planet breathe easier.'
              : 'You are helping the planet smile again. Keep going, hero.'}
          </p>
          <div className="w-full max-w-xs mt-3 h-2 rounded-full bg-canopy overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-lichen to-spore" animate={{ width: `${earthStage}%` }} transition={{ duration: 0.6 }} />
          </div>
          <span className="text-[11px] mt-1 text-mist/40">Earth recovery: {earthStage}%</span>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-2">One planet. Plenty of tiny miracles.</h2>
        <p className="text-center text-mist/60 mb-10 text-sm">Every feature is designed to feel helpful, playful, and surprisingly rewarding.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.button
              key={i}
              onClick={() => setView(f.id)}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="text-left glass rounded-2xl p-5 hover:border-spore/40 transition group"
            >
              <f.icon className="text-spore mb-3 group-hover:scale-110 transition" size={26} />
              <h3 className="font-semibold text-mist mb-1">{f.title}</h3>
              <p className="text-sm text-mist/60">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
