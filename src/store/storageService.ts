import type { Script } from '../types/script';

const STORAGE_KEY = 'patchboard_scripts';
const ACTIVE_SCRIPT_KEY = 'patchboard_active_script';

export interface StorageService {
  getScripts(): Script[];
  getScript(id: string): Script | null;
  saveScript(script: Script): void;
  deleteScript(id: string): void;
  getActiveScriptId(): string | null;
  setActiveScriptId(id: string): void;
}

function createLocalStorageService(): StorageService {
  function getAllScripts(): Script[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Script[];
    } catch {
      return [];
    }
  }

  function saveAllScripts(scripts: Script[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  }

  return {
    getScripts(): Script[] {
      return getAllScripts();
    },

    getScript(id: string): Script | null {
      const scripts = getAllScripts();
      return scripts.find((s) => s.id === id) ?? null;
    },

    saveScript(script: Script): void {
      const scripts = getAllScripts();
      const index = scripts.findIndex((s) => s.id === script.id);
      if (index >= 0) {
        scripts[index] = script;
      } else {
        scripts.push(script);
      }
      saveAllScripts(scripts);
    },

    deleteScript(id: string): void {
      const scripts = getAllScripts().filter((s) => s.id !== id);
      saveAllScripts(scripts);
    },

    getActiveScriptId(): string | null {
      return localStorage.getItem(ACTIVE_SCRIPT_KEY);
    },

    setActiveScriptId(id: string): void {
      localStorage.setItem(ACTIVE_SCRIPT_KEY, id);
    },
  };
}

// Singleton — swap this factory for a REST/API service later
export const storageService: StorageService = createLocalStorageService();
