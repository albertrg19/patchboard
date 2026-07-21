import { useMemo } from 'react';
import type { CallFields } from '../types/script';

export function useTokenReplace(text: string, callFields: CallFields): string {
  return useMemo(() => {
    let result = text;
    result = result.replace(/\{prospect\}/gi, callFields.prospectLabel || '{prospect}');
    result = result.replace(/\{company\}/gi, callFields.companyLabel || '{company}');
    result = result.replace(/\{agent\}/gi, callFields.agentLabel || '{agent}');
    return result;
  }, [text, callFields.prospectLabel, callFields.companyLabel, callFields.agentLabel]);
}
