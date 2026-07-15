import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Certificate({ name, campaign, amount, date, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = 1000, H = 700;
    canvas.width = W; canvas.height = H;

    // background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0b2b26');
    grad.addColorStop(1, '#06120f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // border
    ctx.strokeStyle = '#b8e600';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = 'rgba(184,230,0,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#eef6ee';
    ctx.font = '700 20px Sora, sans-serif';
    ctx.fillText('🌍 SAVIOR AI  •  EARTH CALLING', W / 2, 100);

    ctx.font = '800 42px Sora, sans-serif';
    ctx.fillStyle = '#b8e600';
    ctx.fillText('Savior Impact Certificate', W / 2, 160);

    ctx.font = '400 16px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(238,246,238,0.75)';
    ctx.fillText('This certifies that', W / 2, 230);

    ctx.font = '700 36px Sora, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name || 'A Planet Savior', W / 2, 285);

    ctx.font = '400 17px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(238,246,238,0.85)';
    wrapText(ctx, `has generously contributed ₹${amount} toward`, W / 2, 335, 700, 24);
    ctx.font = '700 22px Sora, sans-serif';
    ctx.fillStyle = '#4fcf7e';
    wrapText(ctx, `“${campaign}”`, W / 2, 375, 760, 26);

    ctx.font = '400 15px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(238,246,238,0.6)';
    ctx.fillText('and has been recognised as a verified Planet Savior for this act of impact.', W / 2, 420);

    ctx.font = '400 14px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(238,246,238,0.5)';
    ctx.fillText(`Issued ${date}`, W / 2, 470);

    // seal
    ctx.beginPath();
    ctx.arc(W / 2, 560, 46, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(184,230,0,0.12)';
    ctx.fill();
    ctx.strokeStyle = '#b8e600';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '28px serif';
    ctx.fillStyle = '#b8e600';
    ctx.fillText('🌱', W / 2, 570);

    ctx.font = '600 13px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(238,246,238,0.55)';
    ctx.fillText('SAVIOR AI  ·  Verified Impact Seal', W / 2, 630);
  }, [name, campaign, amount, date]);

  function download() {
    const link = document.createElement('a');
    link.download = 'savior-impact-certificate.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <motion.div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-spore/30 shadow-2xl" />
        <div className="flex gap-3 mt-4 justify-center">
          <button onClick={download} className="rounded-full bg-spore text-abyss font-bold px-6 py-2.5">Download Certificate</button>
          <button onClick={onClose} className="rounded-full border border-mist/30 text-mist px-6 py-2.5">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w + ' ';
    } else line = test;
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}
