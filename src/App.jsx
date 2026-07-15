import { useState } from 'react';
import { SaviorProvider } from './context/SaviorContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import WasteLab from './components/WasteLab';
import Leaderboard from './components/Leaderboard';
import EarthCalling from './components/EarthCalling';
import FoodRescue from './components/FoodRescue';
import KidsGuardian from './components/KidsGuardian';
import PremiumModal from './components/PremiumModal';
import FoodRedemptionModal from './components/FoodRedemptionModal';
import VoiceControls from './components/VoiceControls';

function Shell() {
  const [view, setView] = useState('home');
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [foodRedemptionOpen, setFoodRedemptionOpen] = useState(false);
  const [cameraPrompt, setCameraPrompt] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomCursor />
      <Navbar
        view={view}
        setView={setView}
        onOpenPremium={() => setPremiumOpen(true)}
        onOpenFoodRedemption={() => setFoodRedemptionOpen(true)}
      />
      <main className="flex-1">
        {view === 'home' && <Landing setView={setView} />}
        {view === 'lab' && (
          <WasteLab
            onOpenPremium={() => setPremiumOpen(true)}
            cameraPrompt={cameraPrompt}
            onCameraPromptHandled={() => setCameraPrompt(false)}
          />
        )}
        {view === 'leaderboard' && <Leaderboard onOpenPremium={() => setPremiumOpen(true)} />}
        {view === 'earthcalling' && <EarthCalling />}
        {view === 'food' && <FoodRescue onOpenPremium={() => setPremiumOpen(true)} />}
        {view === 'kids' && <KidsGuardian />}
      </main>
      <footer className="text-center text-xs text-mist/30 py-6 border-t border-mist/5">
        🌱 SaveEarth AI — turning everyday actions into real climate impact.
      </footer>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <FoodRedemptionModal open={foodRedemptionOpen} onClose={() => setFoodRedemptionOpen(false)} />
      <VoiceControls setView={setView} onCameraRequest={() => setCameraPrompt(true)} />
    </div>
  );
}

export default function App() {
  return (
    <SaviorProvider>
      <Shell />
    </SaviorProvider>
  );
}
