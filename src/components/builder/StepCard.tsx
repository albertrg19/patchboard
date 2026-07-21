import { useState } from 'react';
import { useScriptStore } from '../../store/useScriptStore';
import { ResponseEditor } from './ResponseEditor';
import type { Step } from '../../types/script';
import { getStepsReferencingStep } from '../../utils/graphUtils';
import {
  Trash2, Plus, Star, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from 'lucide-react';

interface StepCardProps {
  step: Step;
  isStartStep: boolean;
  allSteps: Step[];
  isOrphan: boolean;
  isDeadEnd: boolean;
}

export function StepCard({ step, isStartStep, allSteps, isOrphan, isDeadEnd }: StepCardProps) {
  const updateStep = useScriptStore((s) => s.updateStep);
  const deleteStep = useScriptStore((s) => s.deleteStep);
  const setStartStep = useScriptStore((s) => s.setStartStep);
  const addResponse = useScriptStore((s) => s.addResponse);
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const script = scripts.find((s) => s.id === activeScriptId);
  const refs = script ? getStepsReferencingStep(script, step.id) : [];

  let borderClass = '';
  if (isStartStep) borderClass = 'step-card--start';
  else if (isOrphan) borderClass = 'step-card--orphan';
  else if (isDeadEnd) borderClass = 'step-card--dead-end';

  return (
    <div className={`step-card ${borderClass}`} id={`step-${step.id}`}>
      <div className="step-card__header">
        <div className="step-card__header-left">
          <button
            className="step-card__collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand step' : 'Collapse step'}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <input
            type="text"
            className="step-card__label-input"
            value={step.label}
            onChange={(e) => updateStep(step.id, { label: e.target.value })}
            aria-label="Step label"
          />
          {isStartStep && (
            <span className="step-card__start-badge">
              <Star size={12} /> START
            </span>
          )}
          {isOrphan && <span className="step-card__warn-badge step-card__warn-badge--orphan">ORPHAN</span>}
          {isDeadEnd && <span className="step-card__warn-badge step-card__warn-badge--dead-end">DEAD END</span>}
        </div>

        <div className="step-card__header-right">
          <span className="step-card__id">{step.id}</span>
          {!isStartStep && (
            <button className="step-card__action-btn" onClick={() => setStartStep(step.id)} title="Set as start step">
              <Star size={14} />
            </button>
          )}
          {!isStartStep && (
            <button
              className="step-card__action-btn step-card__action-btn--danger"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete step"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="step-card__body">
          <textarea
            className="step-card__text-input"
            value={step.text}
            onChange={(e) => updateStep(step.id, { text: e.target.value })}
            rows={3}
            placeholder="Script text... Use {prospect}, {company}, {agent} tokens"
            aria-label="Script text"
          />

          <div className="step-card__outcome-row">
            <button
              className={`step-card__outcome-toggle ${step.isOutcome ? 'step-card__outcome-toggle--active' : ''}`}
              onClick={() =>
                updateStep(step.id, {
                  isOutcome: !step.isOutcome,
                  outcomeSentiment: step.isOutcome ? undefined : 'positive',
                  outcomeTitle: step.isOutcome ? undefined : step.label,
                })
              }
            >
              {step.isOutcome ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              <span>Outcome step</span>
            </button>

            {step.isOutcome && (
              <>
                <input
                  type="text"
                  className="step-card__outcome-title"
                  value={step.outcomeTitle ?? ''}
                  onChange={(e) => updateStep(step.id, { outcomeTitle: e.target.value })}
                  placeholder="Outcome title"
                  aria-label="Outcome title"
                />
                <div className="step-card__sentiment-select">
                  <button
                    className={`step-card__sentiment-btn ${step.outcomeSentiment === 'positive' ? 'step-card__sentiment-btn--positive-active' : ''}`}
                    onClick={() => updateStep(step.id, { outcomeSentiment: 'positive' })}
                  >
                    ✓ Positive
                  </button>
                  <button
                    className={`step-card__sentiment-btn ${step.outcomeSentiment === 'negative' ? 'step-card__sentiment-btn--negative-active' : ''}`}
                    onClick={() => updateStep(step.id, { outcomeSentiment: 'negative' })}
                  >
                    ✗ Negative
                  </button>
                </div>
              </>
            )}
          </div>

          {!step.isOutcome && (
            <div className="step-card__responses">
              <div className="step-card__responses-header">
                <span className="step-card__responses-label">Responses ({step.responses.length})</span>
                <button className="btn btn--small btn--ghost" onClick={() => addResponse(step.id)}>
                  <Plus size={14} /> Add Response
                </button>
              </div>
              {step.responses.map((response) => (
                <ResponseEditor
                  key={response.id}
                  stepId={step.id}
                  response={response}
                  allSteps={allSteps}
                />
              ))}
              {step.responses.length === 0 && (
                <p className="step-card__empty-responses">No responses yet. Add one to connect this step to the next.</p>
              )}
            </div>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Delete Step</h3>
            <p className="modal__text">
              Are you sure you want to delete <strong>"{step.label}"</strong>?
            </p>
            {refs.length > 0 && (
              <div className="modal__warning">
                <p>The following responses point to this step and will be removed:</p>
                <ul>
                  {refs.map((ref, i) => (
                    <li key={i}>
                      <strong>{ref.step.label}</strong> → "{ref.responseLabel}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => { deleteStep(step.id); setShowDeleteConfirm(false); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
