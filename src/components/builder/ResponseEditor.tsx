import { useScriptStore } from '../../store/useScriptStore';
import type { Step } from '../../types/script';
import { Trash2, ChevronDown } from 'lucide-react';

interface ResponseEditorProps {
  stepId: string;
  response: Step['responses'][number];
  allSteps: Step[];
}

export function ResponseEditor({ stepId, response, allSteps }: ResponseEditorProps) {
  const updateResponse = useScriptStore((s) => s.updateResponse);
  const deleteResponse = useScriptStore((s) => s.deleteResponse);

  const sentiments: Array<{ value: 'positive' | 'neutral' | 'negative'; label: string; color: string }> = [
    { value: 'positive', label: '✓', color: 'var(--accent-teal)' },
    { value: 'neutral', label: '—', color: 'var(--text-muted)' },
    { value: 'negative', label: '✗', color: 'var(--accent-red)' },
  ];

  return (
    <div className="response-editor">
      <div className="response-editor__sentiment-group">
        {sentiments.map((s) => (
          <button
            key={s.value}
            className={`response-editor__sentiment-btn ${response.sentiment === s.value ? 'response-editor__sentiment-btn--active' : ''}`}
            style={response.sentiment === s.value ? { borderColor: s.color, color: s.color } : {}}
            onClick={() => updateResponse(stepId, response.id, { sentiment: s.value })}
            title={s.value}
            aria-label={`Set sentiment to ${s.value}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        className="response-editor__label"
        value={response.label}
        onChange={(e) => updateResponse(stepId, response.id, { label: e.target.value })}
        placeholder="Response label"
        aria-label="Response label"
      />

      <div className="response-editor__next-step-wrapper">
        <select
          className="response-editor__next-step"
          value={response.nextStepId}
          onChange={(e) => updateResponse(stepId, response.id, { nextStepId: e.target.value })}
          aria-label="Next step"
        >
          <option value="">— Select next step —</option>
          {allSteps.map((step) => (
            <option key={step.id} value={step.id}>
              {step.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="response-editor__select-icon" />
      </div>

      <button
        className="response-editor__delete"
        onClick={() => deleteResponse(stepId, response.id)}
        aria-label="Delete response"
        title="Delete response"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
