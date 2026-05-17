import { A2Z_STEPS } from './data.js';
import { SDE_STEPS } from './data_sde.js';
import { S79_STEPS } from './data_s79.js';
import { BLIND75_STEPS } from './data_blind75.js';

export const SHEETS = {
  a2z: {
    id: 'a2z',
    name: 'Core DSA Roadmap',
    subtitle: 'A full end-to-end DSA roadmap · 18 steps',
    badge: 'Comprehensive',
    color: '#6366F1',
    steps: A2Z_STEPS,
  },
  sde: {
    id: 'sde',
    name: 'Top Interview Problems',
    subtitle: 'Must-know problems for SDE interviews · 27 topics',
    badge: 'Interview Prep',
    color: '#F59E0B',
    steps: SDE_STEPS,
  },
  s79: {
    id: 's79',
    name: 'Pre-Placement Sprint',
    subtitle: 'High-impact problems to crack before placement season',
    badge: 'Last Moment',
    color: '#EC4899',
    steps: S79_STEPS,
  },
  blind75: {
    id: 'blind75',
    name: 'The Classics',
    subtitle: 'Community-curated essential problems, widely used in FAANG prep',
    badge: 'Classic',
    color: '#10B981',
    steps: BLIND75_STEPS,
  },
};
