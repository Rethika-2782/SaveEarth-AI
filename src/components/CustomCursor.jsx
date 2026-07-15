import { useEffect, useRef } from 'react';
import { useSavior } from '../context/SaviorContext';

const SPROUTS = ['🌱', '🍃', '✨'];

export default function CustomCursor() {
  const dotRef = useRef(null);
  const lastSprout = useRef(0);
  const { earthStage } = useSavior();

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    function onMove(e) {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;

      const now = Date.now();
      if (earthStage > 15 && now - lastSprout.current > 220) {
        lastSprout.current = now;
        const el = document.createElement('div');
        el.className = 'sprout-trail';
        el.textContent = SPROUTS[Math.floor(Math.random() * SPROUTS.length)];
        el.style.left = `${e.clientX + (Math.random() * 16 - 8)}px`;
        el.style.top = `${e.clientY + (Math.random() * 16 - 8)}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 950);
      }
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [earthStage]);

  return <div ref={dotRef} className={`savior-cursor ${earthStage > 40 ? 'grown' : ''}`} />;
}
