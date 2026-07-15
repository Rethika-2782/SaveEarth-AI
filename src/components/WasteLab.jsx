import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Sparkles, RefreshCw, Crown, Camera, Mic } from 'lucide-react';
import AgentOrchestrator from './AgentOrchestrator';
import { AGENTS, WASTE_LIBRARY, DEFAULT_WASTE } from '../data/mockData';
import { useSavior } from '../context/SaviorContext';

const DEMO_CHIPS = [
  { label: 'Used tyre', file: 'tyre.jpg' },
  { label: 'Old phone', file: 'electronics.jpg' },
  { label: 'Banana peel', file: 'banana-peel.jpg' },
  { label: 'Plastic bottle', file: 'plastic-bottle.jpg' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function matchWaste(nameHint) {
  const lower = nameHint.toLowerCase();
  const found = WASTE_LIBRARY.find((w) => w.keywords.some((k) => lower.includes(k)));
  return found || DEFAULT_WASTE;
}

function buildImageAnalysisResult(imageData) {
  const fallback = DEFAULT_WASTE;
  const buckets = { organic: 0, plastic: 0, electronic: 0, tyre: 0, textile: 0 };
  let brightnessSum = 0;
  let saturationSum = 0;
  let count = 0;

  for (let i = 0; i < imageData.length; i += 16) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];
    if (a < 120) continue;

    const brightness = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const max_val = Math.max(r, g, b);
    const min_val = Math.min(r, g, b);
    brightnessSum += brightness;
    saturationSum += saturation;
    count += 1;

    // Organic (high green content)
    if (g > r * 1.2 && g > b * 1.15) buckets.organic += 1;
    // Plastic (high blue content)
    else if (b > r * 1.15 && b > g * 1.1) buckets.plastic += 1;
    // Electronics: Dark but with varied color components (mixed R, G, B) or metallic look
    else if (brightness < 120 && saturation > 20 && (Math.abs(r - g) > 15 || Math.abs(g - b) > 15 || Math.abs(r - b) > 15)) buckets.electronic += 2;
    // Tyres: Very dark (< 70), very low saturation (< 40), uniform grayish color
    else if (brightness < 70 && saturation < 40) buckets.tyre += 2;
    // Red-ish items
    else if (r > g * 1.1 && r > b * 1.1 && brightness > 80) buckets.electronic += 1;
    // High saturation textiles
    else if (saturation > 90 && brightness > 120) buckets.textile += 1;
    else buckets.organic += 0.3;
  }

  const avgBrightness = count ? brightnessSum / count : 120;
  const avgSaturation = count ? saturationSum / count : 40;
  const dominantKey = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0];

  const presets = {
    organic: {
      wasteType: 'Banana Peel / Fruit Waste',
      condition: 'Organic, biodegradable and easy to upcycle',
      materials: [
        { name: 'Cellulose fibre', pct: 50 },
        { name: 'Starch', pct: 30 },
        { name: 'Pectin', pct: 15 },
      ],
      currentValue: 5,
      futureValue: 220,
      startup: { name: 'PeelPlastic Labs', idea: 'Biodegradable packaging and compostable materials from fruit waste.', investment: '₹80K – ₹2L', revenue: 'Packaging supply to cafés and sustainable brands', customers: 'Food brands, cafes, event planners' },
      co2: 2.1,
      water: 40,
      countries: [
        { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Industrial composting and bio-material processing.' },
        { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Community bioplastic production and composting networks.' },
        { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Direct composting to revive soil for small farms.' },
      ],
    },
    plastic: {
      wasteType: 'Plastic Bottle (PET)',
      condition: 'Single-use plastic with good recycling value',
      materials: [
        { name: 'PET plastic', pct: 90 },
        { name: 'HDPE cap', pct: 8 },
        { name: 'Label film', pct: 2 },
      ],
      currentValue: 2,
      futureValue: 60,
      startup: { name: 'ThreadSpun', idea: 'Turn recycled PET into yarn and eco-fabric for bags and apparel.', investment: '₹2L – ₹6L', revenue: 'Wholesale eco-fabric and recycled textiles', customers: 'Fashion brands, school bag makers' },
      co2: 1.4,
      water: 25,
      countries: [
        { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Bottle-to-bottle recycling loops.' },
        { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Recycled PET yarn for bags and uniforms.' },
        { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Reused and repurposed in low-cost repair loops.' },
      ],
    },
    electronic: {
      wasteType: 'Electronic Waste (Phones, Laptops, Tablets)',
      condition: 'Rich in recoverable metals and components',
      materials: [
        { name: 'Plastics & glass', pct: 45 },
        { name: 'Copper & aluminum', pct: 35 },
        { name: 'Precious metals (Au, Ag, Pd)', pct: 5 },
        { name: 'Other materials', pct: 15 },
      ],
      currentValue: 300,
      futureValue: 4000,
      startup: { name: 'CircuitCycle Innovations', idea: 'Refurbishment and precious-metal recovery from e-waste.', investment: '₹5L – ₹20L', revenue: 'Device resale and recovered-material sales', customers: 'Electronics recyclers, repair shops, manufacturers' },
      co2: 35,
      water: 500,
      countries: [
        { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Certified e-waste refineries.' },
        { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Urban mining and repair networks.' },
        { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Salvage and repair for local electronics.' },
      ],
    },
    tyre: {
      wasteType: 'Used Tyres / Rubber Waste',
      condition: 'Durable and highly recyclable',
      materials: [
        { name: 'Rubber compounds', pct: 70 },
        { name: 'Steel reinforcement', pct: 15 },
        { name: 'Textile fibres & additives', pct: 15 },
      ],
      currentValue: 80,
      futureValue: 1200,
      startup: { name: 'EcoTread Circular', idea: 'Manufacture rubber tiles and road additives from waste tyres.', investment: '₹3L – ₹10L', revenue: 'Supply to construction firms and municipalities', customers: 'Builders, road contractors, parks, sports facilities' },
      co2: 18,
      water: 120,
      countries: [
        { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Rubberised road additives.' },
        { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Flooring and furniture micro-production.' },
        { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Durable repair materials and low-cost seals.' },
      ],
    },
    textile: {
      wasteType: 'Textile / Fabric Waste',
      condition: 'Reusable fabric with strong fibre value',
      materials: [
        { name: 'Cotton / fibre', pct: 60 },
        { name: 'Dyes', pct: 20 },
        { name: 'Thread / trim', pct: 20 },
      ],
      currentValue: 45,
      futureValue: 280,
      startup: { name: 'LoopThread Studio', idea: 'Reweave old textiles into insulation and upcycled fashion.', investment: '₹1L – ₹3L', revenue: 'B2B textile upcycling and DIY kits', customers: 'Craft networks, fashion studios' },
      co2: 3.3,
      water: 70,
      countries: [
        { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Industrial textile-to-fibre recycling.' },
        { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Local garment and craft upcycling.' },
        { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Repurposed cloth for repair networks and shelters.' },
      ],
    },
  };

  const match = presets[dominantKey] || presets.organic;
  const confidence = avgBrightness < 95 && avgSaturation > 55 ? 'High' : avgSaturation > 35 ? 'Medium' : 'Balanced';
  return {
    ...match,
    confidence,
    insight: `The image analysis detected ${dominantKey} signals with ${confidence.toLowerCase()} confidence.`,
  };
}

function mapAgentReport(report) {
  const recoverables = Array.isArray(report?.material?.recoverable) && report.material.recoverable.length
    ? report.material.recoverable.map((item, index) => ({
        name: typeof item === 'string' ? item : item.name || item.material || `Material ${index + 1}`,
        pct: Math.max(10, 100 - index * 10),
      }))
    : [{ name: 'Recoverable fibre', pct: 70 }, { name: 'Reusable core', pct: 30 }];

  return {
    wasteType: report?.vision?.wasteType || 'Mixed circular waste',
    condition: report?.vision?.condition || 'Needs sorting and recovery',
    materials: recoverables,
    currentValue: Number(report?.economy?.currentValue || 0),
    futureValue: Number(report?.economy?.futureValue || 0),
    startup: {
      name: report?.startup?.name || 'Circular startup concept',
      idea: report?.startup?.idea || 'Convert this stream into a practical local product.',
      investment: report?.startup?.investment || 'Flexible micro-budget',
      revenue: report?.startup?.revenueModel || report?.startup?.revenue || 'Local resale and repair',
      customers: report?.startup?.customers || 'Community buyers and SMEs',
    },
    co2: Number(report?.impact?.co2Saved || 0),
    water: Number(report?.impact?.waterSaved || 0),
    countries: [
      { flag: '🇨🇦', code: 'CA', name: 'Canada', tier: 'Developed', use: report?.geo?.canada || 'Industrial recovery and certified processing.' },
      { flag: '🇮🇳', code: 'IN', name: 'India', tier: 'Developing', use: report?.geo?.india || 'Community-scale reuse and repair networks.' },
      { flag: '🇨🇩', code: 'CG', name: 'Congo', tier: 'Resource-limited', use: report?.geo?.congo || 'Low-cost repair and regenerative reuse.' },
    ],
    insight: report?.vision?.confidence
      ? `Live vision + Groq analysis detected ${report.vision.wasteType} with ${report.vision.confidence} confidence.`
      : 'Live AI scan complete with real-world recovery guidance.',
  };
}

export default function WasteLab({ onOpenPremium, cameraPrompt, onCameraPromptHandled }) {
  const { recordScan, premium } = useSavior();
  const [mode, setMode] = useState('scan');
  const [stage, setStage] = useState('idle');
  const [preview, setPreview] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [result, setResult] = useState(null);
  const [problem, setProblem] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Snap a photo of waste and let SaveEarth AI inspect it.');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (cameraPrompt) {
      inputRef.current?.click();
      onCameraPromptHandled?.();
    }
  }, [cameraPrompt, onCameraPromptHandled]);

  function handleFile(file, hint) {
    if (!file) {
      setPreview(null);
      setStatusMessage(hint || 'Using demo prompt');
      runImageAnalysis(null, hint || '');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      setPreview(previewUrl);
      setStatusMessage(`Inspecting ${file.name} with SaveEarth AI...`);
      runImageAnalysis(previewUrl, hint || file.name);
    };
    reader.readAsDataURL(file);
  }

  function runImageAnalysis(imageUrl, hint) {
    setStage('analyzing');
    setIsLoading(true);
    setActiveCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setActiveCount(i);
      if (i >= AGENTS.length) {
        clearInterval(timer);
      }
    }, 240);

    const analyze = async () => {
      if (!imageUrl) {
        const waste = matchWaste(hint || '');
        setResult(waste);
        recordScan(waste);
        setStage('result');
        setIsLoading(false);
        setStatusMessage(`Demo scan complete — ${waste.wasteType}`);
        return;
      }

      try {
        setStatusMessage('Connecting the image to the vision + Groq analysis pipeline…');
        const response = await fetch(`${API_BASE}/api/analyze-waste`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });

        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'OpenAI analysis failed');

        const scanResult = mapAgentReport(payload.report);
        setResult(scanResult);
        recordScan(scanResult);
        setStage('result');
        setIsLoading(false);
        setStatusMessage(`Live AI scan complete — ${scanResult.wasteType}`);
      } catch (error) {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
          const analysis = buildImageAnalysisResult(data);
          const scanResult = {
            wasteType: analysis.wasteType,
            condition: analysis.condition,
            materials: analysis.materials,
            currentValue: analysis.currentValue,
            futureValue: analysis.futureValue,
            startup: analysis.startup,
            co2: analysis.co2,
            water: analysis.water,
            countries: analysis.countries,
            insight: analysis.insight,
          };
          setResult(scanResult);
          recordScan(scanResult);
          setStage('result');
          setIsLoading(false);
          setStatusMessage(`Local scan complete — ${analysis.wasteType}`);
        };
        image.onerror = () => {
          const waste = matchWaste(hint || '');
          setResult(waste);
          recordScan(waste);
          setStage('result');
          setIsLoading(false);
          setStatusMessage('Image loaded but the scanner could not read it. Using a safe fallback instead.');
        };
        image.src = imageUrl;
      }
    };

    setTimeout(analyze, 450);
  }

  function reset() {
    setStage('idle');
    setPreview(null);
    setResult(null);
    setActiveCount(0);
    setStatusMessage('Snap a photo of waste and let SaveEarth AI inspect it.');
  }

  function runReverse() {
    if (!problem.trim()) return;
    const lower = problem.toLowerCase();
    let match = DEFAULT_WASTE;
    if (/(build|construct|floor|road|cheap material)/.test(lower)) match = WASTE_LIBRARY[0];
    else if (/(gold|metal|electronic|device)/.test(lower)) match = WASTE_LIBRARY[1];
    else if (/(packag|plastic free|compost|bio)/.test(lower)) match = WASTE_LIBRARY[2];
    else if (/(fabric|bottle|bag|textile)/.test(lower)) match = WASTE_LIBRARY[3];
    setReverseResult(match);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-spore/20 bg-spore/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-spore mb-4">
          <Sparkles size={12} /> SaveEarth AI Lab
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Scan, understand, and grow impact.</h1>
        <p className="text-mist/60 max-w-xl mx-auto">Use your camera, a quick voice command, or a demo item to reveal its hidden value and planet impact.</p>
        <div className="inline-flex mt-5 rounded-full glass p-1">
          <button onClick={() => setMode('scan')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${mode === 'scan' ? 'bg-spore text-abyss' : 'text-mist/70'}`}>Scan Waste</button>
          <button onClick={() => setMode('reverse')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${mode === 'reverse' ? 'bg-spore text-abyss' : 'text-mist/70'}`}>Reverse Engine</button>
        </div>
      </div>

      {mode === 'scan' && (
        <>
          {stage === 'idle' && (
            <div className="glass rounded-3xl p-8 md:p-12 text-center">
              <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files[0])} />
              <button onClick={() => inputRef.current?.click()} className="mx-auto w-full max-w-md border-2 border-dashed border-spore/30 rounded-2xl py-14 flex flex-col items-center gap-3 hover:border-spore/70 hover:bg-spore/5 transition">
                <UploadCloud size={40} className="text-spore" />
                <p className="font-semibold">Use camera or upload a photo</p>
                <p className="text-xs text-mist/50">PNG or JPG. SaveEarth AI will inspect your image locally and explain its value.</p>
              </button>
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
                <span className="rounded-full bg-canopy/70 px-3 py-1.5 flex items-center gap-1"><Camera size={12} /> Camera mode</span>
                <span className="rounded-full bg-canopy/70 px-3 py-1.5 flex items-center gap-1"><Mic size={12} /> Voice command ready</span>
              </div>
              <p className="text-xs text-mist/40 mt-6 mb-2">Or try a demo item:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {DEMO_CHIPS.map((chip) => (
                  <button key={chip.label} onClick={() => handleFile(null, chip.file)} className="text-xs rounded-full border border-mist/20 px-3 py-1.5 hover:border-spore/50 hover:text-spore transition">
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'analyzing' && (
            <div className="glass rounded-3xl p-8 text-center">
              {preview && <img src={preview} alt="upload preview" className="mx-auto h-28 rounded-xl object-cover mb-4 opacity-80" />}
              <AgentOrchestrator activeCount={activeCount} />
              <p className="mt-2 text-sm text-spore font-medium">
                {isLoading ? 'Processing your image with the on-device analysis engine…' : 'Compiling your result…'}
              </p>
              <p className="text-xs text-mist/40 mt-1">{Math.min(activeCount, AGENTS.length)}/{AGENTS.length} agents complete</p>
              <p className="text-xs text-mist/50 mt-2">{statusMessage}</p>
            </div>
          )}

          {stage === 'result' && result && (
            <ResultPanel result={result} preview={preview} onReset={reset} premium={premium} onOpenPremium={onOpenPremium} />
          )}
        </>
      )}

      {mode === 'reverse' && (
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-3 text-spore"><Sparkles size={18} /><span className="font-semibold text-sm">SaveEarth AI Reverse Engine</span></div>
          <p className="text-mist/60 text-sm mb-4">Tell us the problem and we'll find the waste stream that can solve it.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="e.g. I need cheap building materials"
              className="flex-1 rounded-xl bg-canopy/60 border border-spore/15 px-4 py-3 text-sm outline-none focus:border-spore/60" />
            <button onClick={runReverse} className="rounded-xl bg-spore text-abyss font-bold px-6 py-3">Find a solution</button>
          </div>
          <AnimatePresence>
            {reverseResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-canopy/50 border border-spore/15 p-5">
                <p className="text-xs text-mist/50 mb-1">Suggested waste source</p>
                <h3 className="text-xl font-bold text-spore mb-2">{reverseResult.wasteType}</h3>
                <p className="text-sm text-mist/70">{reverseResult.startup.idea}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ResultPanel({ result, preview, onReset, premium, onOpenPremium }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {preview && <img src={preview} className="w-full md:w-40 h-40 object-cover rounded-2xl" alt="scanned waste" />}
          <div className="flex-1">
            <p className="text-xs text-spore uppercase tracking-widest mb-1">Waste identified</p>
            <h2 className="text-2xl font-bold mb-1">{result.wasteType}</h2>
            <p className="text-sm text-mist/60 mb-4">{result.condition} · {result.insight || 'Local image analysis'}</p>
            <div className="flex flex-wrap gap-2">
              {result.materials.map((material) => (
                <span key={material.name} className="text-xs rounded-full bg-lichen/30 border border-spore/20 px-3 py-1">{material.name} · {material.pct}%</span>
              ))}
            </div>
          </div>
          <button onClick={onReset} className="shrink-0 flex items-center gap-1.5 text-xs text-mist/50 hover:text-mist border border-mist/20 rounded-full px-3 py-1.5">
            <RefreshCw size={13} /> Scan another
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6">
          <p className="text-xs text-mist/50 uppercase tracking-widest mb-3">Money potential</p>
          <div className="flex items-end gap-4">
            <div><p className="text-2xl font-bold text-mist/60">₹{result.currentValue}</p><p className="text-xs text-mist/40">Current value</p></div>
            <span className="text-2xl text-spore mb-1">→</span>
            <div><p className="text-3xl font-extrabold text-spore">₹{result.futureValue}</p><p className="text-xs text-mist/40">After transformation</p></div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-xs text-mist/50 uppercase tracking-widest mb-3">Earth impact</p>
          <div className="flex gap-6">
            <div><p className="text-2xl font-bold text-leaf">{result.co2}kg</p><p className="text-xs text-mist/40">CO₂ saved</p></div>
            <div><p className="text-2xl font-bold text-leaf">{result.water}L</p><p className="text-xs text-mist/40">Water saved</p></div>
          </div>
          <p className="text-xs text-ember mt-3">+2 credits earned for this analysis</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-xs text-mist/50 uppercase tracking-widest mb-4">Global opportunities — same waste, three worlds</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {result.countries.map((country) => (
            <div key={country.name} className="rounded-xl bg-canopy/50 border border-spore/10 p-4">
              <div className="text-3xl mb-2">{country.flag || country.code || '🌍'}</div>
              <p className="font-semibold text-sm">{country.name}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-ember mt-1">{country.code || 'GL'}</p>
              <p className="text-[11px] text-ember uppercase tracking-wide mb-2">{country.tier}</p>
              <p className="text-xs text-mist/60">{country.use}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        {!premium && <div className="absolute inset-0 bg-abyss/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
          <Crown className="text-ember" size={28} />
          <p className="text-sm text-mist/80">Unlock the full startup generator with SaveEarth Plus</p>
          <button onClick={onOpenPremium} className="rounded-full bg-ember text-abyss font-bold px-5 py-2 text-sm">Unlock Premium</button>
        </div>}
        <p className="text-xs text-mist/50 uppercase tracking-widest mb-2">Startup Agent suggestion</p>
        <h3 className="text-xl font-bold text-mist mb-2">{result.startup.name}</h3>
        <p className="text-sm text-mist/70 mb-4">{result.startup.idea}</p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div><p className="text-mist/40">Investment</p><p className="font-semibold text-mist/80">{result.startup.investment}</p></div>
          <div><p className="text-mist/40">Revenue model</p><p className="font-semibold text-mist/80">{result.startup.revenue}</p></div>
          <div><p className="text-mist/40">Customers</p><p className="font-semibold text-mist/80">{result.startup.customers}</p></div>
        </div>
      </div>
    </motion.div>
  );
}
