import type { Script } from '../types/script';

export const seedNCCM: Script = {
  id: 'seed-nccm',
  name: 'NCCM — Not Accepting Credit Cards',
  startStepId: 'nccm-transition',
  callFields: {
    prospectLabel: '',
    companyLabel: '',
    agentLabel: '',
  },
  steps: {
    'nccm-transition': {
      id: 'nccm-transition',
      label: '1. Transition',
      text: 'Are you the one who makes decisions for the business?',
      responses: [
        { id: 'nccm-r1', label: '"Yes, I am"', nextStepId: 'nccm-hook', sentiment: 'positive' },
        { id: 'nccm-r2', label: '"No, but I can listen"', nextStepId: 'nccm-hook', sentiment: 'neutral' },
        { id: 'nccm-r3', label: '"No" / Not interested', nextStepId: 'nccm-outcome-lost', sentiment: 'negative' },
      ],
    },
    'nccm-hook': {
      id: 'nccm-hook',
      label: '2. Opportunity Hook',
      text: 'Honestly, this might be the perfect time to expand and bring in more customers.',
      responses: [
        { id: 'nccm-r4', label: '"What do you mean?"', nextStepId: 'nccm-probe', sentiment: 'positive' },
        { id: 'nccm-r5', label: 'Listening / Neutral', nextStepId: 'nccm-probe', sentiment: 'neutral' },
        { id: 'nccm-r6', label: '"We\'re not looking to expand"', nextStepId: 'nccm-rebuttal-holding', sentiment: 'negative' },
      ],
    },
    'nccm-probe': {
      id: 'nccm-probe',
      label: '3. Probe Interest',
      text: 'Have you thought about accepting credit cards?',
      responses: [
        { id: 'nccm-r7', label: '"Yes, we\'ve been thinking about it"', nextStepId: 'nccm-offer', sentiment: 'positive' },
        { id: 'nccm-r8', label: '"Maybe" / Open to hearing more', nextStepId: 'nccm-offer', sentiment: 'neutral' },
        { id: 'nccm-r9', label: '"No, not really"', nextStepId: 'nccm-rebuttal-ask', sentiment: 'negative' },
      ],
    },
    'nccm-offer': {
      id: 'nccm-offer',
      label: '4. Offer',
      text: 'Perfect. Right now, we\'re offering a base rate as low as 1.35%.',
      responses: [
        { id: 'nccm-r10', label: '"That\'s a good rate"', nextStepId: 'nccm-value', sentiment: 'positive' },
        { id: 'nccm-r11', label: '"What are the other costs?"', nextStepId: 'nccm-value', sentiment: 'neutral' },
        { id: 'nccm-r12', label: '"I need to think about it"', nextStepId: 'nccm-soft-push', sentiment: 'neutral' },
      ],
    },
    'nccm-value': {
      id: 'nccm-value',
      label: '5. Value',
      text: 'It also comes with a free EMV chip card terminal — so there\'s zero upfront cost.',
      responses: [
        { id: 'nccm-r13', label: '"Okay, tell me more"', nextStepId: 'nccm-get-email', sentiment: 'positive' },
        { id: 'nccm-r14', label: '"That sounds too good to be true"', nextStepId: 'nccm-soft-push', sentiment: 'neutral' },
        { id: 'nccm-r15', label: '"I\'m not interested"', nextStepId: 'nccm-soft-push', sentiment: 'negative' },
      ],
    },
    'nccm-get-email': {
      id: 'nccm-get-email',
      label: '6. Get Email',
      text: 'I\'d be happy to send over the details. What\'s the best email for you?',
      responses: [
        { id: 'nccm-r16', label: 'Provides email', nextStepId: 'nccm-handoff', sentiment: 'positive' },
        { id: 'nccm-r17', label: '"I don\'t want to give my email"', nextStepId: 'nccm-outcome-lost', sentiment: 'negative' },
      ],
    },
    'nccm-handoff': {
      id: 'nccm-handoff',
      label: '7. Handoff',
      text: 'I\'ll have my supervisor send everything and walk you through it.',
      responses: [
        { id: 'nccm-r18', label: 'Transferred successfully', nextStepId: 'nccm-outcome-transferred', sentiment: 'positive' },
        { id: 'nccm-r19', label: 'Customer hung up', nextStepId: 'nccm-outcome-lost', sentiment: 'negative' },
      ],
    },
    'nccm-rebuttal-ask': {
      id: 'nccm-rebuttal-ask',
      label: 'Rebuttal: Customer Ask',
      text: 'Do customers ever ask if you accept credit cards?',
      responses: [
        { id: 'nccm-r20', label: '"Yes, actually they do"', nextStepId: 'nccm-offer', sentiment: 'positive' },
        { id: 'nccm-r21', label: '"Not really"', nextStepId: 'nccm-rebuttal-holding', sentiment: 'neutral' },
      ],
    },
    'nccm-rebuttal-holding': {
      id: 'nccm-rebuttal-holding',
      label: 'Rebuttal: Holding Back',
      text: 'May I ask what\'s been holding you back from accepting them?',
      responses: [
        { id: 'nccm-r22', label: 'Shares a concern', nextStepId: 'nccm-soft-push', sentiment: 'neutral' },
        { id: 'nccm-r23', label: '"I just don\'t want to"', nextStepId: 'nccm-soft-push', sentiment: 'negative' },
      ],
    },
    'nccm-soft-push': {
      id: 'nccm-soft-push',
      label: 'Soft Push',
      text: 'The good thing is — there\'s no sign-up cost, and the terminal is free. It just adds another payment option and can increase your sales.',
      responses: [
        { id: 'nccm-r24', label: '"Okay, I\'ll hear you out"', nextStepId: 'nccm-final-close', sentiment: 'positive' },
        { id: 'nccm-r25', label: '"Still not interested"', nextStepId: 'nccm-final-close', sentiment: 'negative' },
      ],
    },
    'nccm-final-close': {
      id: 'nccm-final-close',
      label: 'Final Close',
      text: 'I can send you the details so you can take a look — what\'s the best email for you?',
      responses: [
        { id: 'nccm-r26', label: 'Provides email', nextStepId: 'nccm-handoff', sentiment: 'positive' },
        { id: 'nccm-r27', label: 'Refuses', nextStepId: 'nccm-outcome-lost', sentiment: 'negative' },
      ],
    },
    'nccm-outcome-transferred': {
      id: 'nccm-outcome-transferred',
      label: 'Lead Transferred',
      text: 'Lead has been successfully transferred to the supervisor.',
      isOutcome: true,
      outcomeSentiment: 'positive',
      outcomeTitle: 'Lead Transferred',
      responses: [],
    },
    'nccm-outcome-lost': {
      id: 'nccm-outcome-lost',
      label: 'Not Interested',
      text: 'Merchant is not interested in accepting credit cards at this time. Log the call and move on.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Not Interested',
      responses: [],
    },
  },
};
