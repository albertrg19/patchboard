import { useScriptStore } from '../../store/useScriptStore';
import { useTokenReplace } from '../../hooks/useTokenReplace';
import { motion, AnimatePresence } from 'framer-motion';

const panelVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function ScriptPanel() {
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const currentStepId = useScriptStore((s) => s.currentStepId);
  const callFields = useScriptStore((s) => s.callFields);

  const script = scripts.find((s) => s.id === activeScriptId);
  const step = script && currentStepId ? script.steps[currentStepId] : null;

  const replacedText = useTokenReplace(step?.text ?? '', callFields);

  if (!step) {
    return (
      <div className="script-panel">
        <p className="script-panel__empty">No script loaded. Select or create a script to begin.</p>
      </div>
    );
  }

  return (
    <div className="script-panel">
      <div className="script-panel__header">
        <span className="script-panel__step-label">{step.label}</span>
        {step.isOutcome && (
          <span className={`script-panel__outcome-badge script-panel__outcome-badge--${step.outcomeSentiment}`}>
            {step.outcomeSentiment === 'positive' ? '✓' : '✗'} Outcome
          </span>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          className="script-panel__text"
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {replacedText.split('\n').map((line, i) => (
            <p key={i} className={line.trim() === '' ? 'script-panel__blank' : ''}>
              {line || '\u00A0'}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
