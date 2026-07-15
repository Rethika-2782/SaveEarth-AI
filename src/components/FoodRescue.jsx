import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, MapPin, Clock, CheckCircle2, Sparkles, Camera, Check, Crown } from 'lucide-react';
import { FOOD_SEED } from '../data/mockData';
import { useSavior } from '../context/SaviorContext';

export default function FoodRescue({ onOpenPremium }) {
  const { recordFoodShare, recordFoodClaim, foodShared, claimedFood, credits, premium } = useSavior();
  const [listings, setListings] = useState(FOOD_SEED);
  const [form, setForm] = useState({ name: '', qty: '', location: '', price: 'Free' });
  const [given, setGiven] = useState(false);
  const [foodPhoto, setFoodPhoto] = useState(null);
  const [foodQuality, setFoodQuality] = useState('pending');
  const [photoNote, setPhotoNote] = useState('Capture a food photo to check whether it is safe and suitable for rescue.');
  const inputRef = useRef(null);

  const claimedIds = useMemo(() => new Set(claimedFood.map((item) => item.id)), [claimedFood]);

  function analyzeFoodImage(file) {
    if (!file) {
      setFoodPhoto(null);
      setFoodQuality('pending');
      setPhotoNote('No image selected yet. Use the camera or upload a photo to inspect it.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      setFoodPhoto(previewUrl);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 120;
        canvas.height = 120;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

        let brightness = 0;
        let contrast = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          brightness += (r + g + b) / 3;
          contrast += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
        }

        const avgBrightness = brightness / (data.length / 4);
        const avgContrast = contrast / (data.length / 4);
        const isGoodQuality = avgBrightness > 70 && avgBrightness < 220 && avgContrast > 25;
        const quality = isGoodQuality ? 'good' : 'fair';
        setFoodQuality(quality);
        setPhotoNote(isGoodQuality
          ? 'Great quality. The food looks fresh and ready to be listed as free or low-cost rescue.'
          : 'The photo is a bit dim or blurry. It can still be listed, but it will be marked for a small suggested amount.');
        setForm((current) => ({ ...current, price: isGoodQuality ? 'Free' : '₹20' }));
      };
      image.src = previewUrl;
    };
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.location) return;
    const suggestedPrice = foodQuality === 'good' ? 'Free' : '₹20';
    const listing = {
      id: `f-${Date.now()}`,
      name: form.name,
      qty: form.qty || '1 portion',
      location: form.location,
      price: form.price || suggestedPrice,
      freshness: 'Fresh · just listed',
      image: foodPhoto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    };
    setListings((l) => [listing, ...l]);
    recordFoodShare(listing);
    setGiven(true);
    setForm({ name: '', qty: '', location: '', price: 'Free' });
    setFoodPhoto(null);
    setFoodQuality('pending');
    setPhotoNote('Capture a food photo to check whether it is safe and suitable for rescue.');
    setTimeout(() => setGiven(false), 3200);
  }

  function claimListing(id) {
    const listing = listings.find((item) => item.id === id);
    if (!listing || claimedIds.has(id)) return;
    setListings((items) => items.map((item) => item.id === id ? { ...item, claimed: true } : item));
    recordFoodClaim({ id: listing.id, name: listing.name });
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-spore/20 bg-spore/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-spore mb-4">
          <Sparkles size={12} /> Kind Kitchen
        </div>
        <UtensilsCrossed className="mx-auto text-spore mb-2" size={30} />
        <h1 className="text-3xl font-extrabold mb-2">Kind Kitchen</h1>
        <p className="text-mist/60 text-sm max-w-lg mx-auto">Share a little extra, rescue a meal, and turn leftovers into comfort for someone nearby.</p>
      </div>

      {!premium && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center mb-8 border-2 border-ember/30"
        >
          <Crown className="mx-auto text-ember mb-4" size={40} />
          <h2 className="text-2xl font-bold text-mist mb-2">Kind Kitchen is Premium</h2>
          <p className="text-mist/70 mb-6 max-w-md mx-auto">
            Share meals, rescue food, and earn credits with the community. This feature is available for SaveEarth Plus members.
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
          <div className="relative h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!given ? (
              <motion.div key="before" className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="text-5xl">🤲</span>
                <motion.span className="text-6xl" animate={{ x: [0, -6, 0], rotate: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>🥕</motion.span>
                <div className="text-left">
                  <p className="font-semibold text-mist">A plate is waiting to be shared…</p>
                  <p className="text-xs text-mist/50">Post your extra meal and help someone else feel cared for.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="after" className="flex items-center gap-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <motion.span className="text-6xl" initial={{ x: -30 }} animate={{ x: 0 }}>🤲🥕</motion.span>
                <div className="text-left">
                  <p className="font-semibold text-leaf flex items-center gap-1"><CheckCircle2 size={18} /> Shared with care. Someone’s dinner just got brighter.</p>
                  <p className="text-xs text-ember mt-1">+10 credits earned</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          {listings.map((f) => (
            <motion.div key={f.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
              <img src={f.image} alt={f.name} className="w-full h-36 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{f.name}</h3>
                <p className="text-xs text-mist/50 mb-2">{f.qty}</p>
                <div className="flex items-center gap-1 text-xs text-mist/60 mb-1"><MapPin size={12} /> {f.location}</div>
                <div className="flex items-center gap-1 text-xs text-mist/60 mb-3"><Clock size={12} /> {f.freshness}</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-spore">{f.price}</span>
                  <button
                    onClick={() => claimListing(f.id)}
                    disabled={claimedIds.has(f.id)}
                    className={`text-xs rounded-full px-3 py-1.5 font-semibold ${claimedIds.has(f.id) ? 'bg-lichen/30 text-mist/70' : 'bg-spore/90 text-abyss'}`}
                  >
                    {claimedIds.has(f.id) ? 'Claimed' : 'Rescue this'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-6 h-fit space-y-3">
          <h3 className="font-semibold mb-1">Share food with your community</h3>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => analyzeFoodImage(event.target.files[0])} />
          <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-spore/20 bg-canopy/60 px-3 py-2.5 text-sm font-semibold text-spore">
            <Camera size={14} /> Capture food photo
          </button>
          {foodPhoto && <img src={foodPhoto} alt="Food preview" className="h-28 w-full rounded-xl object-cover" />}
          <div className="rounded-xl border border-spore/10 bg-canopy/50 px-3 py-2 text-[11px] text-mist/70">
            <div className="mb-1 flex items-center gap-2 font-semibold text-spore">
              <Sparkles size={12} /> {foodQuality === 'good' ? 'Fresh and shareable' : foodQuality === 'fair' ? 'Good enough for rescue' : 'Quality check pending'}
            </div>
            <p>{photoNote}</p>
          </div>
          <input placeholder="Food name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
          <input placeholder="Quantity (e.g. 4 servings)" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })}
            className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
          <input placeholder="Price (or Free)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-xl bg-canopy/60 border border-spore/15 px-4 py-2.5 text-sm outline-none focus:border-spore/60" />
          <button type="submit" className="w-full rounded-xl bg-spore text-abyss font-bold py-2.5">Share this meal · +10 credits</button>
          <div className="flex items-center justify-between text-[11px] text-mist/40">
            <span>You’ve shared {foodShared.length} meal{foodShared.length === 1 ? '' : 's'} so far.</span>
            <span className="text-spore">{credits} credits</span>
          </div>
        </form>
        </div>
        </>
      )}
    </div>
  );
}
