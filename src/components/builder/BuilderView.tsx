import { useScriptStore } from '../../store/useScriptStore';
import { StepCard } from './StepCard';
import { ValidationBadges } from './ValidationBadges';
import { FlowPreview } from './FlowPreview';
import { getOrphanedSteps, getDeadEndSteps } from '../../utils/graphUtils';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';

export function BuilderView() {
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const addStep = useScriptStore((s) => s.addStep);

  const script = scripts.find((s) => s.id === activeScriptId);

  const { orphanIds, deadEndIds } = useMemo(() => {
    if (!script) return { orphanIds: new Set<string>(), deadEndIds: new Set<string>() };
    const orphans = getOrphanedSteps(script);
    const deadEnds = getDeadEndSteps(script);
    return {
      orphanIds: new Set(orphans.map((s) => s.id)),
      deadEndIds: new Set(deadEnds.map((s) => s.id)),
    };
  }, [script]);

  if (!script) {
    return (
      <div className="builder">
        <p className="builder__empty">No script selected. Create or select a script to start building.</p>
      </div>
    );
  }

  const allSteps = Object.values(script.steps);

  // Sort: start step first, then alphabetical by label
  const sortedSteps = [...allSteps].sort((a, b) => {
    if (a.id === script.startStepId) return -1;
    if (b.id === script.startStepId) return 1;
    return a.label.localeCompare(b.label);
  });

  return (
    <div className="builder">
      <div className="builder__top-bar">
        <h2 className="builder__title">Script Builder</h2>
        <span className="builder__step-count">{allSteps.length} steps</span>
        <button className="btn btn--primary btn--small" onClick={addStep}>
          <Plus size={16} /> Add Step
        </button>
      </div>

      <ValidationBadges script={script} />

      <div className="builder__layout">
        <div className="builder__step-list">
          {sortedSteps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isStartStep={step.id === script.startStepId}
              allSteps={allSteps}
              isOrphan={orphanIds.has(step.id)}
              isDeadEnd={deadEndIds.has(step.id)}
            />
          ))}
        </div>

        <div className="builder__preview">
          <FlowPreview script={script} />
        </div>
      </div>
    </div>
  );
}
