import type { Script } from '../types/script';

export const seedStandard: Script = {
  id: 'seed-standard',
  name: 'Standard — Accepting Credit Cards',
  startStepId: 'std-opening',
  callFields: {
    prospectLabel: '',
    companyLabel: '',
    agentLabel: '',
  },
  steps: {
    'std-opening': {
      id: 'std-opening',
      label: 'Opening',
      text: 'Hi this is {agent} from Merchant Service Center. Can I speak to the owner?',
      responses: [
        { id: 'std-r1', label: 'Owner is available', nextStepId: 'std-qualify', sentiment: 'positive' },
        { id: 'std-r2', label: 'Owner is NOT available', nextStepId: 'std-decision-maker', sentiment: 'neutral' },
        { id: 'std-r3', label: 'Not interested / Hang up', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-qualify': {
      id: 'std-qualify',
      label: 'Qualify — Credit Cards',
      text: 'And do you accept credit card as payment in the business?',
      responses: [
        { id: 'std-r4', label: '"Yes, we do"', nextStepId: 'std-fee-model', sentiment: 'positive' },
        { id: 'std-r5', label: '"No, we don\'t"', nextStepId: 'std-outcome-nccm', sentiment: 'negative' },
      ],
    },
    'std-decision-maker': {
      id: 'std-decision-maker',
      label: 'Decision Maker',
      text: 'How about the person in charge of the merchant billing statement for the business?',
      responses: [
        { id: 'std-r6', label: 'Transferred to PIC', nextStepId: 'std-get-name', sentiment: 'positive' },
        { id: 'std-r7', label: 'No one available', nextStepId: 'std-outcome-callback', sentiment: 'neutral' },
        { id: 'std-r8', label: 'Refused to transfer', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-get-name': {
      id: 'std-get-name',
      label: 'Get Name',
      text: 'Great, may I have your name please? And do you accept credit card as payment in the business?',
      responses: [
        { id: 'std-r9', label: '"Yes, we accept cards"', nextStepId: 'std-fee-model', sentiment: 'positive' },
        { id: 'std-r10', label: '"No, we don\'t accept cards"', nextStepId: 'std-outcome-nccm', sentiment: 'negative' },
      ],
    },
    'std-fee-model': {
      id: 'std-fee-model',
      label: 'Fee Model',
      text: 'Awesome! Are you currently passing the fees to your customers OR you\'re absorbing the fees?',
      responses: [
        { id: 'std-r11', label: '"We pass the fees"', nextStepId: 'std-surcharge', sentiment: 'neutral' },
        { id: 'std-r12', label: '"We absorb the fees"', nextStepId: 'std-absorb', sentiment: 'neutral' },
        { id: 'std-r13', label: '"I\'m not sure"', nextStepId: 'std-absorb', sentiment: 'neutral' },
      ],
    },
    'std-surcharge': {
      id: 'std-surcharge',
      label: 'Surcharge Path',
      text: 'How much do you charge your customers?\n\n(Wait for them to answer, then say:)\n\nWe also offer a Zero Fees Program — you can pass the fees to your customers, and the fee is just 2.99%.',
      responses: [
        { id: 'std-r14', label: 'Interested — wants details', nextStepId: 'std-close', sentiment: 'positive' },
        { id: 'std-r15', label: '"That\'s higher than what I charge"', nextStepId: 'std-close', sentiment: 'neutral' },
        { id: 'std-r16', label: 'Not interested', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-absorb': {
      id: 'std-absorb',
      label: 'Absorbing Fees Path',
      text: 'How much do you pay with your payment processor? What is your rate with your payment processor?\n\n(Wait for them to answer, then say:)\n\nOur rate is 1.35% base rate across the board.',
      responses: [
        { id: 'std-r17', label: 'Interested — wants details', nextStepId: 'std-close', sentiment: 'positive' },
        { id: 'std-r18', label: '"I\'m happy with my current rate"', nextStepId: 'std-rate-guarantee', sentiment: 'neutral' },
        { id: 'std-r19', label: 'Not interested', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-rate-guarantee': {
      id: 'std-rate-guarantee',
      label: 'Rate Guarantee',
      text: 'I totally understand. Our rate guaranteed program is designed to beat the rate of your current processor. We just need to conduct a free rate analysis to determine the best pricing based on your card mix and show you the exact savings. There\'s no obligation at all.',
      responses: [
        { id: 'std-r20', label: '"Okay, let\'s do it"', nextStepId: 'std-statement', sentiment: 'positive' },
        { id: 'std-r21', label: '"Not right now"', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-close': {
      id: 'std-close',
      label: 'Close — Rate Analysis',
      text: 'Our rate guaranteed program is to beat the rate of your current processor. We need to conduct a free rate analysis to determine the best pricing based on your card mix and show you the exact savings. Do you have a merchant statement handy?',
      responses: [
        { id: 'std-r22', label: '"Yes, I have it"', nextStepId: 'std-statement', sentiment: 'positive' },
        { id: 'std-r23', label: '"No, I don\'t have one right now"', nextStepId: 'std-no-statement', sentiment: 'neutral' },
      ],
    },
    'std-statement': {
      id: 'std-statement',
      label: 'Statement Review',
      text: 'Perfect! If you could pull that up, we\'ll get a quick look at your card mix and current rates. This will only take a few minutes.',
      responses: [
        { id: 'std-r24', label: 'Has statement ready', nextStepId: 'std-handoff', sentiment: 'positive' },
        { id: 'std-r25', label: 'Can\'t find it right now', nextStepId: 'std-no-statement', sentiment: 'neutral' },
      ],
    },
    'std-no-statement': {
      id: 'std-no-statement',
      label: 'No Statement — Get Email',
      text: 'No problem at all. May I have your email where we can send you the details of the program?',
      responses: [
        { id: 'std-r26', label: 'Provides email', nextStepId: 'std-handoff', sentiment: 'positive' },
        { id: 'std-r27', label: 'Refuses to give email', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-handoff': {
      id: 'std-handoff',
      label: 'Handoff to Supervisor',
      text: 'Thank you for providing your email! Here\'s my supervisor/partner to send it to your email. Her/His name is _______. One moment.',
      responses: [
        { id: 'std-r28', label: 'Transferred successfully', nextStepId: 'std-outcome-transferred', sentiment: 'positive' },
        { id: 'std-r29', label: 'Customer hung up', nextStepId: 'std-outcome-lost', sentiment: 'negative' },
      ],
    },
    'std-outcome-transferred': {
      id: 'std-outcome-transferred',
      label: 'Lead Transferred',
      text: 'Lead has been successfully transferred to the supervisor for rate analysis.',
      isOutcome: true,
      outcomeSentiment: 'positive',
      outcomeTitle: 'Lead Transferred',
      responses: [],
    },
    'std-outcome-callback': {
      id: 'std-outcome-callback',
      label: 'Callback Needed',
      text: 'Owner/decision maker was not available. Schedule a callback for a better time.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Callback Scheduled',
      responses: [],
    },
    'std-outcome-nccm': {
      id: 'std-outcome-nccm',
      label: 'Switch to NCCM',
      text: 'Merchant does not accept credit cards. Switch to the NCCM Script to continue the conversation.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Not Accepting CC — Use NCCM Script',
      responses: [],
    },
    'std-outcome-lost': {
      id: 'std-outcome-lost',
      label: 'Closed Lost',
      text: 'Merchant declined to continue. Log the call and move to the next prospect.',
      isOutcome: true,
      outcomeSentiment: 'negative',
      outcomeTitle: 'Closed Lost',
      responses: [],
    },
  },
};
