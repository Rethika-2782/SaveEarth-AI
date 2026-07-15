import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavior } from '../context/SaviorContext';

export default function SignInModal({ open, onClose }) {
  const { signIn } = useSavior();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(24);
  const [loading, setLoading] = useState(false);

  function ageGroupLabel(a) {
    if (a <= 10) return 'Young Earth Guardian 🌱';
    if (a <= 15) return 'Eco Hero 🦸';
    return 'Planet Warrior 🌍';
  }

  function submit(e) {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => {
      signIn({ name, email, age: Number(age) });
      setLoading(false);
      onClose();
    }, 700);
  }

  function googleMock() {
    setLoading(true);
    setTimeout(() => {
      signIn({ name: name || 'Savior Guest', email: email || 'guest@savior.ai', age: Number(age) });
      setLoading(false);
      onClose();
    }, 700);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass rounded-3xl p-8 w-full max-w-md"
            initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-mist mb-1">Become a Savior</h3>
            <p className="text-sm text-mist/60 mb-6">Prototype sign-in — no real account is created.</p>

            <button
              onClick={googleMock}
              className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl bg-paper text-abyss font-semibold py-2.5 hover:bg-mist transition"
            >
              <span className="text-lg">🟢</span> Continue with Google
            </button>
            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-mist/15 flex-1" /><span className="text-xs text-mist/40">or</span><div className="h-px bg-mist/15 flex-1" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
                className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
              <div>
                <label className="text-xs text-mist/60 block mb-1">Age group: {ageGroupLabel(age)}</label>
                <input type="range" min="5" max="60" value={age} onChange={(e) => setAge(e.target.value)} className="w-full accent-spore" />
              </div>
              <button disabled={loading} type="submit"
                className="w-full rounded-xl bg-spore text-abyss font-bold py-2.5 hover:brightness-110 transition disabled:opacity-60">
                {loading ? 'Signing in…' : 'Sign in with Email'}
              </button>
            </form>
            <button onClick={onClose} className="mt-4 text-xs text-mist/40 hover:text-mist/70 w-full text-center">Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
