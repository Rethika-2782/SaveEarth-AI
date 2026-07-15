import { motion } from 'framer-motion';
import { BADGES, MISSIONS } from '../data/mockData';
import { useSavior } from '../context/SaviorContext';
import EarthOrb from './EarthOrb';

export default function KidsGuardian() {
  const { user, earnedBadges, earthStage, impactScore } = useSavior();
  const isKid = user && user.age <= 15;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="text-center md:text-left">
          <span className="inline-block text-xs tracking-widest uppercase text-spore/80 border border-spore/30 rounded-full px-3 py-1 mb-4">
            Guardian Mode
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            {isKid ? `Hi ${user.name.split(' ')[0]}, ready for today's mission?` : 'Guardian Mode — built for young Saviors'}
          </h1>
          <div className="glass rounded-2xl p-4 text-left">
            <p className="text-sm text-mist/80 italic">
              {earthStage < 25 && '"I\'m not feeling my best right now… but I know you can help me heal."'}
              {earthStage >= 25 && earthStage < 60 && '"I can already feel it getting better. Keep going, Guardian!"'}
              {earthStage >= 60 && '"Thank you, Guardian — you helped me heal!" 🌍💚'}
            </p>
          </div>
        </div>
        <div className="flex justify-center"><EarthOrb stage={earthStage} size={240} /></div>
      </div>

      <h2 className="text-xl font-bold mb-4">Today's missions</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {MISSIONS.map((m) => (
          <div key={m.id} className="glass rounded-2xl p-5 flex gap-4 items-start">
            <span className="text-3xl">{m.emoji}</span>
            <div>
              <p className="font-semibold text-sm mb-1">{m.title}</p>
              <p className="text-xs text-ember">{m.reward}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Your badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {BADGES.map((b) => {
          const earned = earnedBadges.includes(b.id);
          return (
            <motion.div key={b.id} whileHover={{ y: -4 }}
              className={`rounded-2xl p-4 text-center border ${earned ? 'glass border-spore/50' : 'bg-canopy/30 border-mist/10 opacity-50'}`}>
              <div className={`text-4xl mb-2 ${earned ? '' : 'grayscale'}`}>{b.emoji}</div>
              <p className="text-xs font-semibold">{b.name}</p>
              <p className="text-[10px] text-mist/50 mt-1">{b.desc}</p>
              {earned && <p className="text-[10px] text-spore mt-1 font-bold">EARNED ✓</p>}
            </motion.div>
          );
        })}
      </div>
      <p className="text-center text-xs text-mist/40">Impact score: {impactScore} · {earnedBadges.length}/{BADGES.length} badges collected</p>
    </div>
  );
}
