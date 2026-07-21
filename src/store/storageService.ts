import { supabase } from '../lib/supabaseClient';
import type { Script } from '../types/script';

export const storageService = {
  async getScripts(): Promise<Script[]> {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading scripts:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.title,
      startStepId: row.start_step_id || '',
      callFields: row.call_fields || { prospectLabel: '', companyLabel: '', agentLabel: '' },
      steps: row.steps || {},
    }));
  },

  async saveScript(script: Script): Promise<void> {
    const row = {
      id: script.id,
      title: script.name,
      start_step_id: script.startStepId,
      call_fields: script.callFields,
      steps: script.steps,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('scripts')
      .upsert(row);

    if (error) {
      console.error('Error saving script:', error);
    }
  },

  async deleteScript(id: string): Promise<void> {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting script:', error);
    }
  },

  // We can still use localStorage just for remembering which script was last opened
  getActiveScriptId(): string | null {
    return localStorage.getItem('patchboard_active_script');
  },

  setActiveScriptId(id: string): void {
    localStorage.setItem('patchboard_active_script', id);
  }
};
