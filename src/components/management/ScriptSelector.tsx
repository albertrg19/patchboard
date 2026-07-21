import { useState, useRef, useEffect } from 'react';
import { useScriptStore } from '../../store/useScriptStore';
import { ChevronDown, Plus, Copy, Trash2, Download, Upload, Pencil } from 'lucide-react';
import { validateScriptShape } from '../../utils/graphUtils';
import type { Script } from '../../types/script';

export function ScriptSelector() {
  const scripts = useScriptStore((s) => s.scripts);
  const activeScriptId = useScriptStore((s) => s.activeScriptId);
  const setActiveScript = useScriptStore((s) => s.setActiveScript);
  const createScript = useScriptStore((s) => s.createScript);
  const duplicateScript = useScriptStore((s) => s.duplicateScript);
  const renameScript = useScriptStore((s) => s.renameScript);
  const deleteScript = useScriptStore((s) => s.deleteScript);
  const importScript = useScriptStore((s) => s.importScript);
  const getActiveScript = useScriptStore((s) => s.getActiveScript);

  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeScript = scripts.find((s) => s.id === activeScriptId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleExport() {
    const script = getActiveScript();
    if (!script) return;
    const json = JSON.stringify(script, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (validateScriptShape(data)) {
          importScript(data as Script);
        } else {
          alert('Invalid script file format.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setIsOpen(false);
  }

  function handleStartRename() {
    if (!activeScript) return;
    setRenameValue(activeScript.name);
    setIsRenaming(true);
    setIsOpen(false);
  }

  function handleFinishRename() {
    if (activeScriptId && renameValue.trim()) {
      renameScript(activeScriptId, renameValue.trim());
    }
    setIsRenaming(false);
  }

  function handleDelete() {
    if (activeScriptId) {
      deleteScript(activeScriptId);
    }
    setShowDeleteConfirm(false);
    setIsOpen(false);
  }

  return (
    <div className="script-selector" ref={dropdownRef}>
      {isRenaming ? (
        <form
          className="script-selector__rename-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleFinishRename();
          }}
        >
          <input
            type="text"
            className="script-selector__rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleFinishRename}
            autoFocus
          />
        </form>
      ) : (
        <button
          className="script-selector__trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="script-selector__name">{activeScript?.name ?? 'No script'}</span>
          <ChevronDown size={16} className={`script-selector__chevron ${isOpen ? 'script-selector__chevron--open' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div className="script-selector__dropdown" role="listbox">
          <div className="script-selector__list">
            {scripts.map((script) => (
              <button
                key={script.id}
                role="option"
                aria-selected={script.id === activeScriptId}
                className={`script-selector__option ${script.id === activeScriptId ? 'script-selector__option--active' : ''}`}
                onClick={() => {
                  setActiveScript(script.id);
                  setIsOpen(false);
                }}
              >
                {script.name}
              </button>
            ))}
          </div>

          <div className="script-selector__divider" />

          <div className="script-selector__actions">
            <button className="script-selector__action" onClick={() => { createScript('New Script'); setIsOpen(false); }}>
              <Plus size={14} /> New Script
            </button>
            <button className="script-selector__action" onClick={() => { if (activeScriptId) duplicateScript(activeScriptId); setIsOpen(false); }}>
              <Copy size={14} /> Duplicate
            </button>
            <button className="script-selector__action" onClick={handleStartRename}>
              <Pencil size={14} /> Rename
            </button>
            <button className="script-selector__action" onClick={handleExport}>
              <Download size={14} /> Export JSON
            </button>
            <button className="script-selector__action" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Import JSON
            </button>
            {scripts.length > 1 && (
              <button
                className="script-selector__action script-selector__action--danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={14} /> Delete Script
              </button>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="sr-only"
        onChange={handleImport}
        aria-label="Import script JSON"
      />

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Delete Script</h3>
            <p className="modal__text">
              Are you sure you want to delete <strong>"{activeScript?.name}"</strong>? This action cannot be undone.
            </p>
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
