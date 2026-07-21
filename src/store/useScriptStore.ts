import { create } from 'zustand';
import type { Script, Step, CallPathEntry, AppMode, CallFields } from '../types/script';
import type { Response as ScriptResponse } from '../types/script';
import { storageService } from './storageService';
import { seedStandard } from '../data/seedStandard';
import { seedStandardPOS } from '../data/seedStandardPOS';
import { seedNCCM } from '../data/seedNCCM';
import { generateId } from '../utils/idGen';

interface ScriptStore {
  // --- Scripts ---
  scripts: Script[];
  activeScriptId: string | null;

  // --- Call session ---
  currentStepId: string | null;
  callPath: CallPathEntry[];
  callFields: CallFields;

  // --- UI ---
  mode: AppMode;

  // --- Script CRUD ---
  loadScripts: () => void;
  setActiveScript: (id: string) => void;
  createScript: (name: string) => void;
  duplicateScript: (id: string) => void;
  renameScript: (id: string, name: string) => void;
  deleteScript: (id: string) => void;
  importScript: (script: Script) => void;
  getActiveScript: () => Script | null;

  // --- Step CRUD ---
  addStep: () => void;
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  deleteStep: (stepId: string) => void;
  setStartStep: (stepId: string) => void;

  // --- Response CRUD ---
  addResponse: (stepId: string) => void;
  updateResponse: (stepId: string, responseId: string, updates: Partial<ScriptResponse>) => void;
  deleteResponse: (stepId: string, responseId: string) => void;

  // --- Call navigation ---
  navigateToStep: (responseId: string) => void;
  resetCall: () => void;
  setCallField: (field: keyof CallFields, value: string) => void;

  // --- UI ---
  setMode: (mode: AppMode) => void;
}

function persistScript(scripts: Script[], script: Script): void {
  storageService.saveScript(script);
}


const getInitialCallFields = (): CallFields => {
  const saved = localStorage.getItem('patchboard_call_fields');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return { prospectLabel: '', companyLabel: '', agentLabel: '' };
};

export const useScriptStore = create<ScriptStore & { isLoading: boolean }>((set, get) => ({
  scripts: [],
  activeScriptId: null,
  currentStepId: null,
  callPath: [],
  callFields: getInitialCallFields(),
  mode: 'live',
  isLoading: true,

  loadScripts: async () => {
    set({ isLoading: true });
    const scripts = await storageService.getScripts();
    
    if (scripts.length === 0) {
      const seeds = [seedStandard, seedStandardPOS, seedNCCM];
      for (const script of seeds) {
        storageService.saveScript(script); // Optimistic save
      }
      scripts.push(...seeds);
    }

    const savedActiveId = storageService.getActiveScriptId();
    const activeId = scripts.find((s) => s.id === savedActiveId)?.id ?? scripts[0]?.id ?? null;

    if (activeId) {
      storageService.setActiveScriptId(activeId);
    }

    const activeScript = scripts.find((s) => s.id === activeId);
    set({
      scripts,
      activeScriptId: activeId,
      currentStepId: activeScript?.startStepId ?? null,
      callPath: activeScript
        ? [{ stepId: activeScript.startStepId }]
        : [],
      isLoading: false,
    });
  },

  setActiveScript: (id: string) => {
    const { scripts } = get();
    const script = scripts.find((s) => s.id === id);
    if (!script) return;

    storageService.setActiveScriptId(id);
    set({
      activeScriptId: id,
      currentStepId: script.startStepId,
      callPath: [{ stepId: script.startStepId }],
    });
  },

  createScript: (name: string) => {
    const id = generateId();
    const startStepId = generateId();
    const newScript: Script = {
      id,
      name,
      startStepId,
      callFields: { prospectLabel: '', companyLabel: '', agentLabel: '' },
      steps: {
        [startStepId]: {
          id: startStepId,
          label: 'Opening',
          text: 'Enter your opening script line here...',
          responses: [],
        },
      },
    };

    storageService.saveScript(newScript);
    const scripts = [...get().scripts, newScript];
    storageService.setActiveScriptId(id);

    set({
      scripts,
      activeScriptId: id,
      currentStepId: startStepId,
      callPath: [{ stepId: startStepId }],
    });
  },

  duplicateScript: (id: string) => {
    const source = get().scripts.find((s) => s.id === id);
    if (!source) return;

    const newId = generateId();
    const stepIdMap: Record<string, string> = {};
    const newSteps: Record<string, Step> = {};

    // Generate new IDs for all steps
    for (const stepId of Object.keys(source.steps)) {
      stepIdMap[stepId] = generateId();
    }

    // Rebuild steps with new IDs
    for (const [oldId, step] of Object.entries(source.steps)) {
      const newStepId = stepIdMap[oldId];
      newSteps[newStepId] = {
        ...step,
        id: newStepId,
        responses: step.responses.map((r) => ({
          ...r,
          id: generateId(),
          nextStepId: stepIdMap[r.nextStepId] ?? r.nextStepId,
        })),
      };
    }

    const duplicate: Script = {
      id: newId,
      name: `${source.name} (Copy)`,
      startStepId: stepIdMap[source.startStepId],
      callFields: { ...source.callFields },
      steps: newSteps,
    };

    storageService.saveScript(duplicate);
    const scripts = [...get().scripts, duplicate];

    set({ scripts });
  },

  renameScript: (id: string, name: string) => {
    const { scripts } = get();
    const updated = scripts.map((s) => (s.id === id ? { ...s, name } : s));
    const script = updated.find((s) => s.id === id);
    if (script) persistScript(updated, script);
    set({ scripts: updated });
  },

  deleteScript: (id: string) => {
    storageService.deleteScript(id);
    const scripts = get().scripts.filter((s) => s.id !== id);
    const { activeScriptId } = get();

    if (activeScriptId === id) {
      const newActive = scripts[0] ?? null;
      if (newActive) {
        storageService.setActiveScriptId(newActive.id);
        set({
          scripts,
          activeScriptId: newActive.id,
          currentStepId: newActive.startStepId,
          callPath: [{ stepId: newActive.startStepId }],
        });
      } else {
        set({
          scripts,
          activeScriptId: null,
          currentStepId: null,
          callPath: [],
        });
      }
    } else {
      set({ scripts });
    }
  },

  importScript: (script: Script) => {
    // Assign new ID to avoid collisions
    const newScript = { ...script, id: generateId() };
    storageService.saveScript(newScript);
    const scripts = [...get().scripts, newScript];
    set({ scripts });
  },

  getActiveScript: () => {
    const { scripts, activeScriptId } = get();
    return scripts.find((s) => s.id === activeScriptId) ?? null;
  },

  // --- Step CRUD ---
  addStep: () => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script) return;

    const stepId = generateId();
    const newStep: Step = {
      id: stepId,
      label: 'New Step',
      text: 'Enter script line here...',
      responses: [],
    };

    const updated: Script = {
      ...script,
      steps: { ...script.steps, [stepId]: newStep },
    };

    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  updateStep: (stepId: string, updates: Partial<Step>) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !script.steps[stepId]) return;

    const updated: Script = {
      ...script,
      steps: {
        ...script.steps,
        [stepId]: { ...script.steps[stepId], ...updates },
      },
    };

    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  deleteStep: (stepId: string) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script) return;

    // Can't delete the start step
    if (script.startStepId === stepId) return;

    // Remove the step
    const { [stepId]: _, ...remainingSteps } = script.steps;

    // Clean up responses pointing to this step
    for (const step of Object.values(remainingSteps)) {
      step.responses = step.responses.filter((r) => r.nextStepId !== stepId);
    }

    const updated: Script = { ...script, steps: remainingSteps };
    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  setStartStep: (stepId: string) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !script.steps[stepId]) return;

    const updated: Script = { ...script, startStepId: stepId };
    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  // --- Response CRUD ---
  addResponse: (stepId: string) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !script.steps[stepId]) return;

    const step = script.steps[stepId];
    const newResponse: ScriptResponse = {
      id: generateId(),
      label: 'New response',
      nextStepId: '',
      sentiment: 'neutral',
    };

    const updatedStep: Step = {
      ...step,
      responses: [...step.responses, newResponse],
    };

    const updated: Script = {
      ...script,
      steps: { ...script.steps, [stepId]: updatedStep },
    };

    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  updateResponse: (stepId: string, responseId: string, updates: Partial<ScriptResponse>) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !script.steps[stepId]) return;

    const step = script.steps[stepId];
    const updatedResponses = step.responses.map((r) =>
      r.id === responseId ? { ...r, ...updates } : r
    );

    const updated: Script = {
      ...script,
      steps: {
        ...script.steps,
        [stepId]: { ...step, responses: updatedResponses },
      },
    };

    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  deleteResponse: (stepId: string, responseId: string) => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !script.steps[stepId]) return;

    const step = script.steps[stepId];
    const updatedStep: Step = {
      ...step,
      responses: step.responses.filter((r) => r.id !== responseId),
    };

    const updated: Script = {
      ...script,
      steps: { ...script.steps, [stepId]: updatedStep },
    };

    const updatedScripts = scripts.map((s) => (s.id === updated.id ? updated : s));
    persistScript(updatedScripts, updated);
    set({ scripts: updatedScripts });
  },

  // --- Call navigation ---
  navigateToStep: (responseId: string) => {
    const { scripts, activeScriptId, currentStepId, callPath } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script || !currentStepId) return;

    const currentStep = script.steps[currentStepId];
    if (!currentStep) return;

    const response = currentStep.responses.find((r) => r.id === responseId);
    if (!response || !response.nextStepId) return;

    const nextStep = script.steps[response.nextStepId];
    if (!nextStep) return;

    set({
      currentStepId: response.nextStepId,
      callPath: [...callPath, { stepId: response.nextStepId, responseSentiment: response.sentiment }],
    });
  },

  resetCall: () => {
    const { scripts, activeScriptId } = get();
    const script = scripts.find((s) => s.id === activeScriptId);
    if (!script) return;

    set({
      currentStepId: script.startStepId,
      callPath: [{ stepId: script.startStepId }],
    });
  },

  setCallField: (field: keyof CallFields, value: string) => {
    const { callFields } = get();
    const newFields = { ...callFields, [field]: value };
    localStorage.setItem('patchboard_call_fields', JSON.stringify(newFields));
    set({ callFields: newFields });
  },

  // --- UI ---
  setMode: (mode: AppMode) => {
    set({ mode });
  },
}));
