import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Search, Gift, Award } from 'lucide-react';
import { CAMPAIGNS } from '../data/mockData';
import { useSavior } from '../context/SaviorContext';
import Certificate from './Certificate';

const STEPS = [
  { icon: Search, title: '1. Discover', desc: 'Browse verified NGO campaigns for disasters, reforestation & rescue work near you.' },
  { icon: ShieldCheck, title: '2. Verify', desc: 'Every campaign shown here carries a verified badge before it can raise funds.' },
  { icon: Gift, title: '3. Donate', desc: 'Give any amount — even ₹50 helps. You earn 5 credits per donation.' },
  { icon: Award, title: '4. Receive proof', desc: 'Get a personal Savior Impact Certificate you can keep or share.' },
];

export default function EarthCalling() {
  const { user, recordDonation, donations } = useSavior();
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [donateFor, setDonateFor] = useState(null);
  const [amount, setAmount] = useState(500);
  const [certificate, setCertificate] = useState(null);

  function confirmDonate() {
    setCampaigns((cs) => cs.map((c) => c.id === donateFor.id ? { ...c, collected: c.collected + Number(amount) } : c));
    recordDonation({ campaignId: donateFor.id, campaign: donateFor.title, amount: Number(amount) });
    setCertificate({ campaign: donateFor.title, amount, date: new Date().toLocaleDateString() });
    setDonateFor(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <HeartHandshake className="mx-auto text-spore mb-2" size={30} />
        <h1 className="text-3xl font-extrabold mb-2">Earth Calling</h1>
        <p className="text-mist/60 text-sm max-w-lg mx-auto">Not sure how to help? Here's the simplest path from "I want to help" to real impact.</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-12">
        {STEPS.map((s) => (
          <div key={s.title} className="glass rounded-2xl p-4 text-center">
            <s.icon className="mx-auto text-spore mb-2" size={22} />
            <p className="text-sm font-semibold mb-1">{s.title}</p>
            <p className="text-xs text-mist/55">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {campaigns.map((c) => {
          const pct = Math.min(100, Math.round((c.collected / c.goal) * 100));
          return (
            <motion.div key={c.id} layout className="glass rounded-2xl overflow-hidden">
              <img src={c.image} alt={c.title} className="w-full h-40 object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wide text-ember">{c.category}</span>
                  {c.verified && <span className="text-[11px] flex items-center gap-1 text-leaf"><ShieldCheck size={12} /> Verified</span>}
                </div>
                <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                <p className="text-xs text-mist/50 mb-2">{c.ngo} · {c.location}</p>
                <p className="text-sm text-mist/70 mb-4">{c.story}</p>
                <div className="h-2 rounded-full bg-canopy overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-lichen to-spore" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-mist/50 mb-4">
                  <span>₹{c.collected.toLocaleString()} raised</span>
                  <span>{pct}% of ₹{c.goal.toLocaleString()}</span>
                </div>
                <button onClick={() => { setDonateFor(c); setAmount(500); }}
                  className="w-full rounded-xl bg-spore text-abyss font-bold py-2.5">Donate now</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-mist/40 mt-8">You've made {donations.length} donation{donations.length === 1 ? '' : 's'} through Earth Calling.</p>

      {donateFor && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setDonateFor(null)}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">Donate to</h3>
            <p className="text-sm text-spore mb-4">{donateFor.title}</p>
            <div className="flex gap-2 mb-4">
              {[100, 500, 1000, 2500].map((v) => (
                <button key={v} onClick={() => setAmount(v)} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${amount === v ? 'bg-spore text-abyss' : 'bg-canopy/60 text-mist/70'}`}>₹{v}</button>
              ))}
            </div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60 mb-4" />
            <button onClick={confirmDonate} className="w-full rounded-xl bg-spore text-abyss font-bold py-2.5 mb-2">Confirm donation · +5 credits</button>
            <button onClick={() => setDonateFor(null)} className="w-full text-xs text-mist/40">Cancel</button>
          </motion.div>
        </div>
      )}

      {certificate && (
        <Certificate name={user?.name || 'A Planet Savior'} campaign={certificate.campaign} amount={certificate.amount} date={certificate.date} onClose={() => setCertificate(null)} />
      )}
    </div>
  );
}
