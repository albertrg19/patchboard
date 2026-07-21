export interface Response {
  id: string;
  label: string;
  nextStepId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Step {
  id: string;
  label: string;
  text: string;
  isOutcome?: boolean;
  outcomeSentiment?: 'positive' | 'negative';
  outcomeTitle?: string;
  responses: Response[];
}

export interface CallFields {
  prospectLabel: string;
  companyLabel: string;
  agentLabel: string;
}

export interface Script {
  id: string;
  name: string;
  startStepId: string;
  callFields: CallFields;
  steps: Record<string, Step>;
}

export interface CallPathEntry {
  stepId: string;
  responseSentiment?: 'positive' | 'neutral' | 'negative';
}

export type AppMode = 'live' | 'builder';
