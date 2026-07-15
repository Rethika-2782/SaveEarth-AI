import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LEADERBOARD_SEED, rankForScore } from '../data/mockData';
import { useSavior } from '../context/SaviorContext';

const RANK_COLOR = {
  'Climate Hero': 'text-ember',
  'Earth Protector': 'text-spore',
  'Planet Guardian': 'text-leaf',
};

export default function Leaderboard({ onOpenPremium }) {
  const { user, impactScore, credits, scans, foodShared, donations, co2Saved, claimedFood, premium } = useSavior();
  const liveScore = impactScore + 1500 + credits * 45 + scans.length * 180 + foodShared.length * 160 + donations.length * 220 + claimedFood.length * 90 + co2Saved * 10;
  const seededBoard = LEADERBOARD_SEED.map((entry, index) => ({
    ...entry,
    score: entry.score + (index === 0 ? 80 : index === 1 ? 45 : index === 2 ? 20 : 0),
  }));
  const board = [...seededBoard, { name: user?.name || 'You', score: Math.max(liveScore, 1600), rank: rankForScore(liveScore), country: '🧑‍🚀', me: true }]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: rankForScore(entry.score), position: index + 1 }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <Trophy className="mx-auto text-ember mb-2" size={32} />
        <h1 className="text-3xl font-extrabold mb-2">Global Savior League</h1>
        <p className="text-mist/60 text-sm">Ranked by waste transformed, food rescued, donations & CO₂ saved.</p>
      </div>

      {!premium && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center mb-8 border-2 border-ember/30"
        >
          <Crown className="mx-auto text-ember mb-4" size={40} />
          <h2 className="text-2xl font-bold text-mist mb-2">Eco League is Premium</h2>
          <p className="text-mist/70 mb-6 max-w-md mx-auto">
            Compete on the leaderboard, track your impact ranking, and see where you stand in the global climate action movement.
          </p>
          <button
            onClick={onOpenPremium}
            className="rounded-full bg-gradient-to-r from-ember to-spore text-abyss font-bold px-8 py-3 hover:shadow-lg transition"
          >
            Unlock Premium Access
          </button>
        </motion.div>
      )}

      {premium && (
        <>
          <div className="space-y-0">
            {board.map((p, i) => (
              <motion.div key={`${p.name}-${p.position}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-5 py-4 border-b border-mist/5 last:border-0 ${p.me ? 'bg-spore/10' : ''}`}>
                <div className="w-8 text-center font-mono text-sm text-mist/50">
                  {i < 3 ? <Medal size={18} className={i === 0 ? 'text-ember' : i === 1 ? 'text-mist/70' : 'text-bark'} /> : `#${p.position}`}
                </div>
                <span className="text-xl">{p.country}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${p.me ? 'text-spore' : 'text-mist'}`}>{p.name}{p.me && ' (you)'}</p>
                  <p className={`text-xs ${RANK_COLOR[p.rank]}`}>{p.rank}</p>
                </div>
                <p className="font-mono font-bold text-mist/80">{p.score.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-8 text-center">
            {['Planet Guardian', 'Earth Protector', 'Climate Hero'].map((r) => (
              <div key={r} className="glass rounded-xl p-4">
                <p className={`font-bold ${RANK_COLOR[r]}`}>{r}</p>
                <p className="text-xs text-mist/50 mt-1">
                  {r === 'Planet Guardian' ? 'Every scan and rescue helps you rise' : r === 'Earth Protector' ? '2,200+ impact score and steady action' : '3,800+ impact score and a strong impact streak'}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
