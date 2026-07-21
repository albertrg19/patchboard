import { useRef, useEffect } from 'react';
import { useScriptStore } from '../../store/useScriptStore';
import type { CallPathEntry } from '../../types/script';

function getSentimentColor(entry: CallPathEntry): string {
  if (!entry.responseSentiment) return 'var(--accent-amber)';
  switch (entry.responseSentiment) {
    case 'positive': return 'var(--accent-teal)';
    case 'negative': return 'var(--accent-red)';
    default: return 'var(--text-muted)';
  }
}

export function CallPath() {
  const callPath = useScriptStore((s) => s.callPath);
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const currentStepId = useScriptStore((s) => s.currentStepId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const script = scripts.find((s) => s.id === activeScriptId);

  // Auto-scroll to the end when path changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [callPath.length]);

  if (!script || callPath.length === 0) return null;

  return (
    <div className="call-path" ref={scrollRef} role="navigation" aria-label="Call path">
      <div className="call-path__track">
        {callPath.map((entry, index) => {
          const step = script.steps[entry.stepId];
          if (!step) return null;
          const isCurrent = entry.stepId === currentStepId;
          const color = getSentimentColor(entry);

          return (
            <div key={`${entry.stepId}-${index}`} className="call-path__segment">
              {index > 0 && (
                <div className="call-path__connector" style={{ backgroundColor: color }} />
              )}
              <div
                className={`call-path__node ${isCurrent ? 'call-path__node--current' : ''}`}
                style={{
                  borderColor: color,
                  boxShadow: isCurrent ? `0 0 12px ${color}40, 0 0 4px ${color}60` : 'none',
                }}
                title={step.label}
              >
                <span className="call-path__step-number">{index + 1}</span>
                <span className="call-path__label">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
