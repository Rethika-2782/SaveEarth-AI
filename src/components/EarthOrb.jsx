import { motion } from 'framer-motion';

// A stylised orb: base sphere darkens/greens based on `stage` (0-100),
// with pollution particles fading out and leaves fading in as stage rises.
export default function EarthOrb({ stage = 0, size = 320 }) {
  const t = Math.min(1, Math.max(0, stage / 100));
  const oceanColor = mix('#2a3a3a', '#0f6e5c', t);
  const landColor = mix('#5b5548', '#3f9d5c', t);
  const glowColor = mix('#3a3a38', '#b8e600', t);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: glowColor, opacity: 0.35 + t * 0.25 }}
        animate={{ opacity: [0.3 + t * 0.2, 0.55 + t * 0.25, 0.3 + t * 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative animate-float-slow"
      >
        <defs>
          <radialGradient id="oceanGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={mix('#4a4a48', '#3fd68f', t)} />
            <stop offset="100%" stopColor={oceanColor} />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="82" fill="url(#oceanGrad)" stroke={mix('#6b6b64', '#b8e600', t)} strokeWidth="1.5" strokeOpacity="0.4" />
        {/* land blobs */}
        <motion.path
          d="M60 60 Q75 45 100 55 Q120 62 115 85 Q110 105 85 100 Q60 95 60 60Z"
          fill={landColor}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <path d="M115 120 Q140 115 150 135 Q145 155 120 150 Q105 145 115 120Z" fill={landColor} opacity={0.9} />
        <path d="M70 130 Q90 125 95 145 Q85 160 65 152 Q60 140 70 130Z" fill={landColor} opacity={0.8} />

        {/* pollution particles - fade out as stage rises */}
        {t < 0.85 && Array.from({ length: 6 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={40 + i * 22}
            cy={30 + (i % 3) * 15}
            r={2.4}
            fill="#22221f"
            opacity={0.55 * (1 - t)}
            animate={{ cy: [30 + (i % 3) * 15, 20 + (i % 3) * 15, 30 + (i % 3) * 15] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
          />
        ))}

        {/* leaves/sparkles - fade in as stage rises */}
        {t > 0.15 && Array.from({ length: 5 }).map((_, i) => (
          <motion.text
            key={`leaf-${i}`}
            x={45 + i * 25}
            y={45 + (i % 2) * 90}
            fontSize="10"
            opacity={Math.min(1, t * 1.3)}
            animate={{ y: [45 + (i % 2) * 90, 38 + (i % 2) * 90, 45 + (i % 2) * 90] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity }}
          >🌿</motion.text>
        ))}

        {/* face: sad below 40, neutral 40-70, smiling above */}
        <EarthFace t={t} />
      </motion.svg>
    </div>
  );
}

function EarthFace({ t }) {
  const eyeY = 95;
  const mouthPath = t < 0.4
    ? 'M85 118 Q100 108 115 118' // frown
    : t < 0.75
      ? 'M85 116 L115 116' // neutral
      : 'M85 112 Q100 126 115 112'; // smile
  return (
    <g>
      <circle cx="88" cy={eyeY} r="2.6" fill="#101010" />
      <circle cx="112" cy={eyeY} r="2.6" fill="#101010" />
      <path d={mouthPath} stroke="#101010" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {t < 0.4 && (
        <>
          <path d="M78 108 q4 -4 8 0" stroke="#101010" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M114 108 q4 -4 8 0" stroke="#101010" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      )}
    </g>
  );
}

function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bch = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bch})`;
}
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
