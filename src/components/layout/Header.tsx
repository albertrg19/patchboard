import { ModeToggle } from './ModeToggle';
import { ScriptSelector } from '../management/ScriptSelector';
import { CallFields } from '../live/CallFields';
import { useScriptStore } from '../../store/useScriptStore';
import { Zap } from 'lucide-react';

export function Header() {
  const mode = useScriptStore((s) => s.mode);

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__brand">
          <Zap size={20} className="header__logo" />
          <span className="header__title">PATCHBOARD</span>
        </div>
        <ScriptSelector />
      </div>

      <div className="header__center">
        {mode === 'live' && <CallFields />}
      </div>

      <div className="header__right">
        <ModeToggle />
        {mode === 'live' && (
          <div className="header__on-air">
            <span className="header__on-air-dot" />
            <span className="header__on-air-label">ON CALL</span>
          </div>
        )}
      </div>
    </header>
  );
}
