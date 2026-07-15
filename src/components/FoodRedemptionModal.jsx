import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Copy, Check } from 'lucide-react';
import { useSavior } from '../context/SaviorContext';
import { useState } from 'react';

const FOOD_APPS = [
  { id: 'swiggy', name: 'Swiggy', icon: '🛵', color: 'from-orange-500 to-orange-600' },
  { id: 'zomato', name: 'Zomato', icon: '🍕', color: 'from-red-500 to-red-600' },
  { id: 'dunzodunzo', name: 'Dunzo', icon: '📦', color: 'from-blue-500 to-blue-600' },
  { id: 'instamart', name: 'Instamart', icon: '🏪', color: 'from-yellow-500 to-yellow-600' },
  { id: 'blinkit', name: 'Blinkit', icon: '⚡', color: 'from-yellow-400 to-yellow-600' },
];

export default function FoodRedemptionModal({ open, onClose }) {
  const { credits, redeemCreditsForFood } = useSavior();
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedCredits, setSelectedCredits] = useState(10);
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);

  const discount = Math.floor(selectedCredits / 10);
  const canRedeem = credits >= selectedCredits && selectedCredits >= 10;

  const handleRedeem = () => {
    if (!selectedApp || !canRedeem) return;

    // Generate coupon code
    const code = `SAVE${Math.floor(Math.random() * 100000)}`;
    setCouponCode(code);

    // Record redemption
    redeemCreditsForFood(selectedCredits, selectedApp);

    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedApp(null);
      setSelectedCredits(10);
      setCouponCode('');
      onClose();
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[101] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            className="glass rounded-3xl p-8 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Gift className="text-spore" size={24} />
                <h3 className="text-2xl font-bold">Redeem for Food</h3>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-mist/10 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {!couponCode ? (
              <>
                <p className="text-sm text-mist/60 mb-6">
                  Convert your credits into discounts on food delivery apps. <br />
                  <strong className="text-spore">10 credits = 1% off</strong> your next meal
                </p>

                {/* Credit Selector */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-mist/70 block mb-2">
                    How many credits to redeem?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max={credits}
                      step="10"
                      value={selectedCredits}
                      onChange={(e) => setSelectedCredits(Number(e.target.value))}
                      className="flex-1 h-2 bg-canopy rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      min="10"
                      max={credits}
                      step="10"
                      value={selectedCredits}
                      onChange={(e) => setSelectedCredits(Math.max(10, Number(e.target.value)))}
                      className="w-16 bg-canopy/70 border border-spore/30 rounded-lg px-2 py-1 text-xs text-center"
                    />
                  </div>
                  <p className="text-xs text-mist/50 mt-2">
                    You have <strong>{credits} credits</strong> • This will give you <strong className="text-spore">{discount}% off</strong>
                  </p>
                </div>

                {/* Food App Selection */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-mist/70 block mb-3">
                    Choose your delivery app:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {FOOD_APPS.map((app) => (
                      <motion.button
                        key={app.id}
                        onClick={() => setSelectedApp(app.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-xl transition ${
                          selectedApp === app.id
                            ? `bg-gradient-to-br ${app.color} text-white shadow-lg`
                            : 'bg-canopy/70 border border-mist/20 text-mist/70 hover:border-spore/30'
                        }`}
                      >
                        <div className="text-2xl mb-1">{app.icon}</div>
                        <div className="text-[11px] font-semibold">{app.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Redeem Button */}
                <motion.button
                  whileHover={canRedeem ? { scale: 1.02 } : {}}
                  whileTap={canRedeem ? { scale: 0.98 } : {}}
                  onClick={handleRedeem}
                  disabled={!canRedeem}
                  className={`w-full py-3 rounded-xl font-bold transition ${
                    canRedeem
                      ? 'bg-gradient-to-r from-spore to-lichen text-abyss shadow-lg hover:shadow-xl'
                      : 'bg-canopy/50 text-mist/40 cursor-not-allowed'
                  }`}
                >
                  {canRedeem
                    ? `Redeem ${selectedCredits} credits for ${discount}% off`
                    : 'Need at least 10 credits'}
                </motion.button>

                <p className="text-xs text-mist/50 text-center mt-4">
                  After redeeming, you'll get a coupon code to use on your app.
                </p>
              </>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <h4 className="text-xl font-bold text-spore mb-2">Coupon Generated!</h4>
                <p className="text-sm text-mist/70 mb-6">
                  You've unlocked <strong className="text-spore text-lg">{discount}% off</strong> on your next meal
                </p>

                {/* Coupon Code Display */}
                <div className="bg-canopy/70 border-2 border-spore/30 rounded-xl p-4 mb-4">
                  <p className="text-xs text-mist/50 mb-2">Your coupon code:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-2xl font-mono font-bold text-spore">{couponCode}</code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-spore/20 rounded-lg transition"
                    >
                      {copied ? (
                        <Check size={18} className="text-spore" />
                      ) : (
                        <Copy size={18} className="text-mist/50" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-mist/60 mb-4">
                  Ready to order from <strong>{FOOD_APPS.find(a => a.id === selectedApp)?.name}</strong>?
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-2 rounded-lg bg-spore/20 text-spore font-semibold hover:bg-spore/30 transition"
                >
                  Awesome! Let's close this
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
