import { motion } from 'framer-motion';
import { AGENTS } from '../data/mockData';

// Places 10 agents in a circle around the orchestrator hub, lighting up
// sequentially as `activeCount` increases (driven by the parent's timer).
export default function AgentOrchestrator({ activeCount }) {
  const R = 150;
  const cx = 200, cy = 200;

  return (
    <div className="relative w-full flex justify-center">
      <svg viewBox="0 0 400 400" className="w-full max-w-[420px]">
        {AGENTS.map((a, i) => {
          const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + R * Math.cos(angle);
          const y = cy + R * Math.sin(angle);
          const active = i < activeCount;
          return (
            <g key={a.id}>
              <line x1={cx} y1={cy} x2={x} y2={y}
                stroke={active ? '#b8e600' : '#2f5c47'}
                strokeWidth={active ? 1.6 : 1}
                className={active ? 'agent-link' : ''}
                opacity={active ? 0.8 : 0.35} />
            </g>
          );
        })}

        {/* orchestrator hub */}
        <circle cx={cx} cy={cy} r="34" fill="#0b2b26" stroke="#b8e600" strokeWidth="1.5" />
        <motion.circle cx={cx} cy={cy} r="34" fill="none" stroke="#b8e600" strokeWidth="1"
          animate={{ r: [34, 44, 34], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="10" fill="#eef6ee" fontWeight="700">SAVIOR</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#b8e600">ORCHESTRATOR</text>

        {AGENTS.map((a, i) => {
          const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + R * Math.cos(angle);
          const y = cy + R * Math.sin(angle);
          const active = i < activeCount;
          const done = i < activeCount - 1 || activeCount >= AGENTS.length;
          return (
            <g key={`node-${a.id}`} transform={`translate(${x},${y})`}>
              <motion.circle
                r={active ? 26 : 22}
                fill={active ? '#163d33' : '#0b2b26'}
                stroke={done ? '#4fcf7e' : active ? '#b8e600' : '#2f5c47'}
                strokeWidth={active ? 2 : 1}
                animate={active && !done ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <text textAnchor="middle" dy="6" fontSize="18">{a.emoji}</text>
              <text textAnchor="middle" y="38" fontSize="8" fill={active ? '#eef6ee' : '#7a9184'}>{a.name.replace(' Agent', '')}</text>
              {done && <text textAnchor="middle" y="-30" fontSize="10" fill="#4fcf7e">✓</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
