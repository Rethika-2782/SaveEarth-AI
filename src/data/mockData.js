// ---- AI Agent roster (matches the 10-agent Savior Orchestrator architecture) ----
export const AGENTS = [
  { id: 'vision', name: 'Vision Agent', emoji: '👁️', task: 'Detecting the object in your photo…' },
  { id: 'material', name: 'Material Agent', emoji: '🧬', task: 'Finding hidden resources…' },
  { id: 'economy', name: 'Economy Agent', emoji: '💰', task: 'Calculating real-world value…' },
  { id: 'geo', name: 'Geo Agent', emoji: '🌎', task: 'Mapping global opportunities…' },
  { id: 'startup', name: 'Startup Agent', emoji: '🚀', task: 'Generating a business idea…' },
  { id: 'impact', name: 'Impact Agent', emoji: '🌱', task: 'Measuring Earth benefit…' },
  { id: 'ngo', name: 'NGO Agent', emoji: '🤝', task: 'Matching aligned NGOs…' },
  { id: 'food', name: 'Food Agent', emoji: '🍞', task: 'Cross-checking food-safety angle…' },
  { id: 'guardian', name: 'Guardian Agent', emoji: '🛡️', task: 'Preparing a kid-friendly summary…' },
  { id: 'world', name: 'World Agent', emoji: '🌍', task: 'Checking related global events…' },
];

// ---- Waste knowledge base the "Vision/Material/Economy" agents draw from ----
export const WASTE_LIBRARY = [
  {
    keywords: ['tyre', 'tire', 'tyre', 'rubber'],
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
    co2: 18, water: 120,
    countries: [
      { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Shredded into road-surfacing asphalt additive (rubberised roads).' },
      { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Upcycled into eco-furniture and playground flooring micro-startups.' },
      { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Repurposed as durable footwear soles and water storage seals.' },
    ],
  },
  {
    keywords: ['electronic', 'electronics', 'e-waste', 'phone', 'laptop', 'circuit', 'battery', 'tablet'],
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
    co2: 35, water: 500,
    countries: [
      { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Sent to certified e-waste refineries for precious-metal recovery.' },
      { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Informal urban-mining clusters extract copper & gold by hand.' },
      { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Rare-earth components salvaged and resold into local electronics repair.' },
    ],
  },
  {
    keywords: ['banana', 'peel', 'fruit', 'banana-peel'],
    wasteType: 'Banana Peel / Fruit Waste',
    condition: 'Organic, biodegradable and rich in useful biopolymers',
    materials: [
      { name: 'Cellulose fibre', pct: 50 },
      { name: 'Starch', pct: 30 },
      { name: 'Pectin', pct: 15 },
    ],
    currentValue: 5,
    futureValue: 220,
    startup: { name: 'PeelPlastic Labs', idea: 'Biodegradable packaging and compostable materials from fruit waste.', investment: '₹80K – ₹2L', revenue: 'Packaging supply to cafés and sustainable brands', customers: 'Food brands, cafés, event planners' },
    co2: 2.1, water: 40,
    countries: [
      { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Industrial composting facilities turn it into commercial fertiliser.' },
      { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Home-grown bioplastic & natural-dye micro startups.' },
      { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Composted directly to enrich subsistence-farming soil.' },
    ],
  },
  {
    keywords: ['bottle', 'plastic'],
    wasteType: 'Plastic Bottle (PET)',
    condition: 'Single-use, recyclable',
    materials: [
      { name: 'PET plastic', pct: 90 },
      { name: 'HDPE cap', pct: 8 },
      { name: 'Label film', pct: 2 },
    ],
    currentValue: 2,
    futureValue: 60,
    startup: { name: 'ThreadSpun', idea: 'Recycled-PET yarn spun into eco-fabric for bags and apparel.', investment: '₹2L – ₹6L', revenue: 'Wholesale eco-fabric to apparel brands', customers: 'Sustainable fashion labels, bag makers' },
    co2: 1.4, water: 25,
    countries: [
      { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Bottle-to-bottle recycling loops back into new PET packaging.' },
      { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Shredded into polyester yarn for bags and school uniforms.' },
      { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Reused directly as low-cost building bricks (eco-bricks).' },
    ],
  },
];

export const DEFAULT_WASTE = {
  keywords: ['general'],
  wasteType: 'Mixed Household Waste',
  condition: 'Assorted, sortable',
  materials: [
    { name: 'Organic matter', pct: 40 },
    { name: 'Recyclable plastic', pct: 30 },
    { name: 'Paper / cardboard', pct: 20 },
    { name: 'Miscellaneous', pct: 10 },
  ],
  currentValue: 40,
  futureValue: 340,
  startup: { name: 'SortLoop Depot', idea: 'Neighbourhood sorting micro-hub that routes each material to the right recycler.', investment: '₹1L – ₹3L', revenue: 'Sorting fee + resale of separated recyclables', customers: 'Residential societies, local municipalities' },
  co2: 3.4, water: 55,
  countries: [
    { code: '🇨🇦', name: 'Canada', tier: 'Developed', use: 'Automated material-recovery facilities sort at scale.' },
    { code: '🇮🇳', name: 'India', tier: 'Developing', use: 'Community sorting hubs feed local recyclers.' },
    { code: '🇨🇩', name: 'Congo', tier: 'Resource-limited', use: 'Manually sorted for direct reuse and resale.' },
  ],
};

// ---- NGO Campaigns for "Earth Calling" ----
export const CAMPAIGNS = [
  {
    id: 'c1', ngo: 'GreenRoots Foundation', title: 'Wayanad Landslide Recovery', category: 'Disaster Relief',
    location: 'Wayanad, Kerala, India', goal: 500000, collected: 318500, verified: true,
    image: 'wayanaad.jpg',
    story: 'Helping rebuild homes and restore farmland for families displaced by the landslides.',
  },
  {
    id: 'c2', ngo: 'Amazon Guardians', title: 'Forest Fire Recovery', category: 'Reforestation',
    location: 'Amazon Basin, Brazil', goal: 800000, collected: 452000, verified: true,
    image: 'forest-fire.jpg',
    story: 'Replanting native trees and supporting fire-watch teams to prevent future outbreaks.',
  },
  {
    id: 'c3', ngo: 'Blue Wave Relief', title: 'Coastal Flood Response', category: 'Disaster Relief',
    location: 'Chennai, Tamil Nadu, India', goal: 350000, collected: 129000, verified: true,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    story: 'Emergency food, clean water and shelter kits for families hit by seasonal flooding.',
  },
  {
    id: 'c4', ngo: 'Paws & Planet', title: 'Wildlife Rescue Network', category: 'Animal Rescue',
    location: 'Multiple regions', goal: 250000, collected: 98000, verified: true,
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80',
    story: 'Rescuing and rehabilitating animals displaced by habitat loss and climate disasters.',
  },
];

// ---- Global crisis feed for the World Agent ----
export const WORLD_EVENTS = [
  { id: 'w1', title: 'Wildfires spread across the Amazon basin', tag: 'Forest Fire', why: 'Threatens biodiversity and accelerates carbon release.', help: 'Support reforestation campaigns in Earth Calling.' },
  { id: 'w2', title: 'Monsoon floods displace thousands in South Asia', tag: 'Flood', why: 'Homes, crops, and clean-water access are lost overnight.', help: 'Donate to verified flood-relief NGOs.' },
  { id: 'w3', title: 'Landslide risk rises in Western Ghats', tag: 'Landslide', why: 'Deforestation and heavy rainfall are weakening hillsides.', help: 'Fund slope-stabilising reforestation projects.' },
];

// ---- Leaderboard seed ----
export const LEADERBOARD_SEED = [
  { name: 'Aarav K.', score: 4820, rank: 'Climate Hero', country: '🇮🇳' },
  { name: 'Maya T.', score: 4310, rank: 'Climate Hero', country: '🇨🇦' },
  { name: 'Noah P.', score: 3990, rank: 'Earth Protector', country: '🇺🇸' },
  { name: 'Zuri M.', score: 3520, rank: 'Earth Protector', country: '🇨🇩' },
  { name: 'Elena S.', score: 3105, rank: 'Earth Protector', country: '🇪🇸' },
  { name: 'Kenji I.', score: 2740, rank: 'Planet Guardian', country: '🇯🇵' },
  { name: 'Fatima A.', score: 2390, rank: 'Planet Guardian', country: '🇦🇪' },
];

export function rankForScore(score) {
  if (score >= 3800) return 'Climate Hero';
  if (score >= 2200) return 'Earth Protector';
  return 'Planet Guardian';
}

// ---- Food listings for Savior Share, with real food photography ----
export const FOOD_SEED = [
  { id: 'f1', name: 'Homemade Vegetable Curry', qty: '4 servings', location: 'Anna Nagar, Chennai', price: 'Free', freshness: 'Fresh · cooked today', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80' },
  { id: 'f2', name: 'Sourdough Bread Loaf', qty: '1 loaf', location: 'Koramangala, Bengaluru', price: '₹30', freshness: 'Best today', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80' },
  { id: 'f3', name: 'Fresh Fruit Basket', qty: '2 kg mixed', location: 'Bandra, Mumbai', price: 'Free', freshness: 'Fresh · 2 days left', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80' },
  { id: 'f4', name: 'Rice & Dal Meal Boxes', qty: '10 boxes', location: 'Salt Lake, Kolkata', price: 'Free', freshness: 'Fresh · cooked today', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
];

// ---- Kids badges ----
export const BADGES = [
  { id: 'seed', name: 'Seed Saver', emoji: '🌱', desc: 'Complete your first waste scan', threshold: 1 },
  { id: 'water', name: 'Water Guardian', emoji: '💧', desc: 'Save 100L of water through actions', threshold: 2 },
  { id: 'forest', name: 'Forest Protector', emoji: '🌳', desc: 'Donate to a reforestation campaign', threshold: 3 },
  { id: 'ocean', name: 'Ocean Hero', emoji: '🌊', desc: 'Share 3 food listings', threshold: 4 },
  { id: 'earth', name: 'Earth Savior', emoji: '🌍', desc: 'Reach 500 impact score', threshold: 5 },
];

export const MISSIONS = [
  { id: 'm1', title: 'Scan your first piece of waste', reward: '🌱 Seed Saver badge + 20 pts', emoji: '📷' },
  { id: 'm2', title: 'Share a meal on Savior Share', reward: '🌊 Ocean Hero progress + 10 credits', emoji: '🍞' },
  { id: 'm3', title: 'Help Earth Calling with a donation', reward: '🌳 Forest Protector progress', emoji: '💚' },
  { id: 'm4', title: 'Reach top 10 on the Global Savior League', reward: 'Exclusive Earth Savior badge', emoji: '🏆' },
];
