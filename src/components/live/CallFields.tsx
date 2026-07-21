import { useScriptStore } from '../../store/useScriptStore';
import { User, Building2, Headset } from 'lucide-react';

export function CallFields() {
  const callFields = useScriptStore((s) => s.callFields);
  const setCallField = useScriptStore((s) => s.setCallField);

  return (
    <div className="call-fields">
      <div className="call-fields__field">
        <User size={14} className="call-fields__icon" />
        <input
          type="text"
          className="call-fields__input"
          placeholder="Prospect name"
          value={callFields.prospectLabel}
          onChange={(e) => setCallField('prospectLabel', e.target.value)}
          aria-label="Prospect name"
        />
      </div>
      <div className="call-fields__field">
        <Building2 size={14} className="call-fields__icon" />
        <input
          type="text"
          className="call-fields__input"
          placeholder="Company"
          value={callFields.companyLabel}
          onChange={(e) => setCallField('companyLabel', e.target.value)}
          aria-label="Company name"
        />
      </div>
      <div className="call-fields__field">
        <Headset size={14} className="call-fields__icon" />
        <input
          type="text"
          className="call-fields__input"
          placeholder="Agent name"
          value={callFields.agentLabel}
          onChange={(e) => setCallField('agentLabel', e.target.value)}
          aria-label="Agent name"
        />
      </div>
    </div>
  );
}
