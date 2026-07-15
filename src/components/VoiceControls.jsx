import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles, Type } from 'lucide-react';

export default function VoiceControls({ setView, onCameraRequest }) {
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState('Say “scan waste” or “open food”');
  const [commandText, setCommandText] = useState('');
  const [voiceReady, setVoiceReady] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef(null);

  function speak(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceReady(false);
      setHint('Voice command is available through the text box below');
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();

      if (!interimTranscript) return;

      setLiveTranscript(interimTranscript);
      const finalTranscript = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim()
        .toLowerCase();

      if (finalTranscript) {
        setHint(`Heard: “${finalTranscript}”`);
        handleVoiceCommand(finalTranscript);
        setListening(false);
      } else {
        setHint('Listening… say a command');
      }
    };

    recognition.onerror = () => {
      setHint('Voice control paused — try again or type a command');
      setListening(false);
      setLiveTranscript('');
    };

    recognition.onend = () => {
      setListening(false);
      setLiveTranscript((current) => current || '');
    };
    recognitionRef.current = recognition;
    setVoiceReady(true);

    return () => recognition.abort();
  }, []);

  function handleVoiceCommand(transcript) {
    if (/home|main|start/.test(transcript)) {
      setView('home');
      speak('Opening the home screen');
    } else if (/scan|waste|camera|photo|upload/.test(transcript)) {
      onCameraRequest?.();
      setView('lab');
      speak('Opening the waste lab camera');
    } else if (/food|pantry|share|meal/.test(transcript)) {
      setView('food');
      speak('Opening food rescue');
    } else if (/earth|donat|ngo|campaign/.test(transcript)) {
      setView('earthcalling');
      speak('Opening Earth Calling');
    } else if (/leader|league/.test(transcript)) {
      setView('leaderboard');
      speak('Opening the leaderboard');
    } else if (/kid|guardian|child/.test(transcript)) {
      setView('kids');
      speak('Opening Guardian Mode');
    } else {
      setHint('Try: scan waste, open food, or go home');
      speak('Please try a supported command');
    }
  }

  function toggleListening() {
    if (!recognitionRef.current) {
      setHint('Voice commands need a browser with speech recognition');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      setHint('Voice paused');
      return;
    }

    recognitionRef.current.start();
    setListening(true);
    setLiveTranscript('');
    setHint('Listening… speak naturally');
  }

  function runTypedCommand() {
    const trimmed = commandText.trim();
    if (!trimmed) return;
    setHint(`Command: “${trimmed}”`);
    handleVoiceCommand(trimmed.toLowerCase());
    setCommandText('');
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 max-w-[280px]">
      <div className="glass rounded-2xl px-3 py-2 text-[11px] text-mist/70 shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-spore">
          <Sparkles size={12} />
          {voiceReady ? 'Voice ready' : 'Text fallback ready'}
        </div>
        <div>{hint}</div>
        <div className={`mt-2 rounded-lg border border-spore/15 bg-abyss/70 px-2 py-2 ${listening ? 'animate-pulse' : ''}`}>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-mist/50">
            <span className={`h-2 w-2 rounded-full ${listening ? 'bg-coral' : 'bg-spore'}`} />
            {listening ? 'Live voice tracker' : 'Voice tracker'}
          </div>
          <div className="mt-1 text-xs text-mist/80 min-h-[1.2rem]">{liveTranscript || hint}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-canopy/90 px-2 py-2 shadow-lg">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${listening ? 'bg-coral text-white' : 'bg-spore text-abyss'}`}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
          {listening ? 'Stop' : 'Voice'}
        </button>
        <div className="flex items-center gap-1 rounded-full border border-mist/15 bg-abyss/70 px-2 py-1">
          <Type size={13} className="text-mist/60" />
          <input
            value={commandText}
            onChange={(event) => setCommandText(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && runTypedCommand()}
            placeholder="Type a command"
            className="w-24 bg-transparent text-xs text-mist outline-none"
          />
          <button onClick={runTypedCommand} className="text-[11px] font-semibold text-spore">Go</button>
        </div>
      </div>
    </div>
  );
}
