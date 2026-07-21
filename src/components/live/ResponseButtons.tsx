import { useCallback } from 'react';
import { useScriptStore } from '../../store/useScriptStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { motion } from 'framer-motion';

function getSentimentClass(sentiment: string): string {
  switch (sentiment) {
    case 'positive': return 'response-btn--positive';
    case 'negative': return 'response-btn--negative';
    default: return 'response-btn--neutral';
  }
}

export function ResponseButtons() {
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const currentStepId = useScriptStore((s) => s.currentStepId);
  const navigateToStep = useScriptStore((s) => s.navigateToStep);
  const resetCall = useScriptStore((s) => s.resetCall);

  const script = scripts.find((s) => s.id === activeScriptId);
  const step = script && currentStepId ? script.steps[currentStepId] : null;
  const responses = step?.responses ?? [];

  const handleSelect = useCallback(
    (index: number) => {
      const response = responses[index];
      if (response) {
        navigateToStep(response.id);
      }
    },
    [responses, navigateToStep]
  );

  useKeyboardShortcuts(handleSelect, resetCall, responses.length, !!step && !step.isOutcome);

  if (!step || step.isOutcome || responses.length === 0) return null;

  return (
    <div className="response-buttons" role="group" aria-label="Customer responses">
      {responses.map((response, index) => (
        <motion.button
          key={response.id}
          className={`response-btn ${getSentimentClass(response.sentiment)}`}
          onClick={() => navigateToStep(response.id)}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <span className="response-btn__key">{index + 1}</span>
          <span className="response-btn__label">{response.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
