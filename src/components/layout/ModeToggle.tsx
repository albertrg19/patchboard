import { useScriptStore } from '../../store/useScriptStore';
import { Radio, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export function ModeToggle() {
  const mode = useScriptStore((s) => s.mode);
  const setMode = useScriptStore((s) => s.setMode);

  return (
    <div className="mode-toggle" role="tablist" aria-label="App mode">
      <button
        role="tab"
        aria-selected={mode === 'live'}
        className={`mode-toggle__btn ${mode === 'live' ? 'mode-toggle__btn--active' : ''}`}
        onClick={() => setMode('live')}
      >
        <Radio size={16} />
        <span>Live Call</span>
        {mode === 'live' && (
          <motion.div
            className="mode-toggle__indicator"
            layoutId="mode-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      <button
        role="tab"
        aria-selected={mode === 'builder'}
        className={`mode-toggle__btn ${mode === 'builder' ? 'mode-toggle__btn--active' : ''}`}
        onClick={() => setMode('builder')}
      >
        <Wrench size={16} />
        <span>Builder</span>
        {mode === 'builder' && (
          <motion.div
            className="mode-toggle__indicator"
            layoutId="mode-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}
