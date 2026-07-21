import type { Script } from '../types/script';

export const seedStandardPOS: Script = {
  id: 'seed-standard-pos',
  name: 'Standard + POS+',
  startStepId: 'pos-opening',
  callFields: {
    prospectLabel: '',
    companyLabel: '',
    agentLabel: '',
  },
  steps: {
    'pos-opening': {
      id: 'pos-opening',
      label: '1. Opening',
      text: 'Hi, this is {agent} with Merchant Service Center. Am I speaking with the owner?',
      responses: [
        { id: 'pos-r1', label: '"Yes, this is the owner"', nextStepId: 'pos-qualify', sentiment: 'positive' },
        { id: 'pos-r2', label: '"No, the owner isn\'t here"', nextStepId: 'pos-decision-maker', sentiment: 'neutral' },
        { id: 'pos-r3', label: 'Not interested / Hang up', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-qualify': {
      id: 'pos-qualify',
      label: '2. Qualify',
      text: 'Do you accept credit cards in the business?',
      responses: [
        { id: 'pos-r4', label: '"Yes"', nextStepId: 'pos-hook', sentiment: 'positive' },
        { id: 'pos-r5', label: '"No" → Stop / NCCM', nextStepId: 'pos-outcome-nccm', sentiment: 'negative' },
      ],
    },
    'pos-decision-maker': {
      id: 'pos-decision-maker',
      label: '3. Decision Maker',
      text: 'No problem — who handles your merchant statements? And your name?',
      responses: [
        { id: 'pos-r6', label: 'Transferred to decision maker', nextStepId: 'pos-qualify', sentiment: 'positive' },
        { id: 'pos-r7', label: 'No one available', nextStepId: 'pos-outcome-callback', sentiment: 'neutral' },
        { id: 'pos-r8', label: 'Refused', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-hook': {
      id: 'pos-hook',
      label: '4. POS Hook',
      text: 'Are you currently using a POS system for payments that is specialized for your industry?',
      responses: [
        { id: 'pos-r9', label: '"Yes, we have a POS system"', nextStepId: 'pos-pain-point', sentiment: 'positive' },
        { id: 'pos-r10', label: '"No, we use a basic terminal"', nextStepId: 'pos-pain-point', sentiment: 'neutral' },
      ],
    },
    'pos-pain-point': {
      id: 'pos-pain-point',
      label: '5. Pain Point',
      text: 'Got it. A lot of businesses we speak with like their POS, but feel stuck with one payment provider and higher rates.',
      responses: [
        { id: 'pos-r11', label: '"Yeah, that sounds about right"', nextStepId: 'pos-solution', sentiment: 'positive' },
        { id: 'pos-r12', label: '"I\'m pretty happy with my setup"', nextStepId: 'pos-solution', sentiment: 'neutral' },
        { id: 'pos-r13', label: 'Not interested', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-solution': {
      id: 'pos-solution',
      label: '6. Solution (POS+)',
      text: 'With POS+, you keep your system exactly the same, but gain the ability to choose a different payment processor.',
      responses: [
        { id: 'pos-r14', label: '"How does that work?"', nextStepId: 'pos-key-line', sentiment: 'positive' },
        { id: 'pos-r15', label: '"I\'m not sure I need that"', nextStepId: 'pos-key-line', sentiment: 'neutral' },
      ],
    },
    'pos-key-line': {
      id: 'pos-key-line',
      label: '7. Key Line',
      text: 'Nothing changes with your system — you just get the option to lower your processing costs.',
      responses: [
        { id: 'pos-r16', label: '"That sounds interesting"', nextStepId: 'pos-no-cost', sentiment: 'positive' },
        { id: 'pos-r17', label: '"What\'s the catch?"', nextStepId: 'pos-no-cost', sentiment: 'neutral' },
      ],
    },
    'pos-no-cost': {
      id: 'pos-no-cost',
      label: '8. No Cost',
      text: 'And there\'s no cost at all — no setup fees, no monthly fees.',
      responses: [
        { id: 'pos-r18', label: 'Customer is surcharging', nextStepId: 'pos-surcharge', sentiment: 'neutral' },
        { id: 'pos-r19', label: 'Customer is absorbing fees', nextStepId: 'pos-absorb', sentiment: 'neutral' },
        { id: 'pos-r20', label: '"Okay, what do I need to do?"', nextStepId: 'pos-close', sentiment: 'positive' },
      ],
    },
    'pos-surcharge': {
      id: 'pos-surcharge',
      label: '9a. Surcharging',
      text: 'Are you passing the fee to customers? How much are you charging?\n\n(Wait for answer)\n\nGot it — POS+ gives you flexibility so you\'re not locked in. We offer a Zero Fees Program at 2.99%.',
      responses: [
        { id: 'pos-r21', label: 'Interested in learning more', nextStepId: 'pos-close', sentiment: 'positive' },
        { id: 'pos-r22', label: '"I\'m good with my current setup"', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-absorb': {
      id: 'pos-absorb',
      label: '9b. Absorbing',
      text: 'Do you know what rate you\'re currently paying?\n\n(Wait for answer)\n\nPOS+ lets you move to a lower-cost provider without changing your system. Our rate is around 1.85%.',
      responses: [
        { id: 'pos-r23', label: 'Interested in comparison', nextStepId: 'pos-close', sentiment: 'positive' },
        { id: 'pos-r24', label: '"My rate is already low"', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-close': {
      id: 'pos-close',
      label: '10. Close',
      text: 'What we do is a quick free analysis to see if we can lower your costs without changing your system.',
      responses: [
        { id: 'pos-r25', label: '"Sure, let\'s do it"', nextStepId: 'pos-statement', sentiment: 'positive' },
        { id: 'pos-r26', label: '"Not right now"', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-statement': {
      id: 'pos-statement',
      label: '11. Statement Request',
      text: 'Do you have a recent merchant statement handy?',
      responses: [
        { id: 'pos-r27', label: '"Yes, I have it"', nextStepId: 'pos-handoff', sentiment: 'positive' },
        { id: 'pos-r28', label: '"No, I don\'t"', nextStepId: 'pos-email', sentiment: 'neutral' },
      ],
    },
    'pos-email': {
      id: 'pos-email',
      label: '12. Email Fallback',
      text: 'No problem — what\'s the best email to send the details?',
      responses: [
        { id: 'pos-r29', label: 'Provides email', nextStepId: 'pos-handoff', sentiment: 'positive' },
        { id: 'pos-r30', label: 'Refuses', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-handoff': {
      id: 'pos-handoff',
      label: '13. Handoff',
      text: 'Perfect — I\'ll have my supervisor send the details and walk you through it.',
      responses: [
        { id: 'pos-r31', label: 'Transferred successfully', nextStepId: 'pos-outcome-transferred', sentiment: 'positive' },
        { id: 'pos-r32', label: 'Customer hung up', nextStepId: 'pos-outcome-lost', sentiment: 'negative' },
      ],
    },
    'pos-outcome-transferred': {
      id: 'pos-outcome-transferred',
      label: 'Lead Transferred',
      text: 'Lead has been successfully transferred to the supervisor.',
      isOutcome: true,
      outcomeSentiment: 'positive',
      outcomeTitle: 'Lead Transferred',
      responses: [],
    },
    'pos-outcome-callback': {
      id: 'pos-outcome-callback',
      label: 'Callback Needed',
      text: 'Decision maker was not available. Schedule a callback.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Callback Scheduled',
      responses: [],
    },
    'pos-outcome-nccm': {
      id: 'pos-outcome-nccm',
      label: 'Switch to NCCM',
      text: 'Merchant does not accept credit cards. Switch to the NCCM Script.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Not Accepting CC — Use NCCM Script',
      responses: [],
    },
    'pos-outcome-lost': {
      id: 'pos-outcome-lost',
      label: 'Closed Lost',
      text: 'Merchant declined. Log the call and move to the next prospect.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Closed Lost',
      responses: [],
    },
  },
};
