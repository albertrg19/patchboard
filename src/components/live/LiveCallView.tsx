import { useScriptStore } from '../../store/useScriptStore';
import { CallPath } from './CallPath';
import { ScriptPanel } from './ScriptPanel';
import { ResponseButtons } from './ResponseButtons';
import { OutcomeBanner } from './OutcomeBanner';
import { RotateCcw } from 'lucide-react';

export function LiveCallView() {
  const callPath = useScriptStore((s) => s.callPath);
  const currentStepId = useScriptStore((s) => s.currentStepId);
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const resetCall = useScriptStore((s) => s.resetCall);

  const script = scripts.find((s) => s.id === activeScriptId);
  const step = script && currentStepId ? script.steps[currentStepId] : null;
  const isFirstStep = script ? currentStepId === script.startStepId : true;
  const isOutcome = step?.isOutcome ?? false;

  return (
    <div className="live-call">
      <CallPath />

      <div className="live-call__content">
        {isOutcome ? (
          <OutcomeBanner />
        ) : (
          <>
            <ScriptPanel />
            <ResponseButtons />
          </>
        )}
      </div>

      {!isFirstStep && !isOutcome && (
        <div className="live-call__footer">
          <button className="btn btn--ghost" onClick={resetCall}>
            <RotateCcw size={16} />
            Restart Call
          </button>
          <span className="live-call__hint">Press ESC to restart · Number keys 1–9 to select a response</span>
        </div>
      )}
    </div>
  );
}
