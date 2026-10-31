import { observations } from './data'

export const demoAnalysis = {
  title: 'Possible drainage maintenance loop',
  summary: 'Several observations around North Market and Unity Avenue share a recurring signal: water remains or overflows where drains meet high-footfall areas.',
  confidence: 86,
  risk: 'Potential concern',
  evidence: [
    '4 water and drainage observations within a 1.1 km area',
    '2 reports mention the North Market channel after market days',
    'Waste appears at one drain entrance, which may contribute to reduced flow',
  ],
  actions: ['Inspect and clear the North Market channel', 'Check the waste collection schedule around Market Street', 'Collect two more observations after the next rainfall'],
}

export function runLocalAnalysis() {
  const related = observations.filter((item) => item.category === 'Water & drainage' || item.id === 'OBS-103')
  return { ...demoAnalysis, related }
}
