import { useScriptStore } from '../../store/useScriptStore';
import { getOrphanedSteps, getDeadEndSteps } from '../../utils/graphUtils';
import { AlertTriangle, Unplug } from 'lucide-react';
import type { Script } from '../../types/script';

interface ValidationBadgesProps {
  script: Script;
}

export function ValidationBadges({ script }: ValidationBadgesProps) {
  const orphans = getOrphanedSteps(script);
  const deadEnds = getDeadEndSteps(script);

  if (orphans.length === 0 && deadEnds.length === 0) return null;

  return (
    <div className="validation-badges">
      {orphans.length > 0 && (
        <div className="validation-badge validation-badge--warning">
          <Unplug size={16} />
          <span>
            <strong>{orphans.length} orphaned</strong> step{orphans.length > 1 ? 's' : ''}: {orphans.map((s) => s.label).join(', ')}
          </span>
        </div>
      )}
      {deadEnds.length > 0 && (
        <div className="validation-badge validation-badge--error">
          <AlertTriangle size={16} />
          <span>
            <strong>{deadEnds.length} dead-end</strong> step{deadEnds.length > 1 ? 's' : ''}: {deadEnds.map((s) => s.label).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}
