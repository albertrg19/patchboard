import { useScriptStore } from '../../store/useScriptStore';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export function OutcomeBanner() {
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const currentStepId = useScriptStore((s) => s.currentStepId);
  const resetCall = useScriptStore((s) => s.resetCall);

  const script = scripts.find((s) => s.id === activeScriptId);
  const step = script && currentStepId ? script.steps[currentStepId] : null;

  if (!step || !step.isOutcome) return null;

  const isPositive = step.outcomeSentiment === 'positive';

  return (
    <motion.div
      className={`outcome-banner ${isPositive ? 'outcome-banner--positive' : 'outcome-banner--negative'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="outcome-banner__icon">
        {isPositive ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
      </div>
      <h2 className="outcome-banner__title">{step.outcomeTitle ?? 'Call Complete'}</h2>
      <p className="outcome-banner__text">{step.text}</p>
      <button className="btn btn--primary outcome-banner__cta" onClick={resetCall}>
        <RotateCcw size={18} />
        Start Next Call
      </button>
    </motion.div>
  );
}
