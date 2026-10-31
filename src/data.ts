export type Category = 'Water & drainage' | 'Waste management' | 'Infrastructure' | 'Environmental pollution' | 'Public safety'
export type Risk = 'Low' | 'Moderate' | 'High'

export type Observation = {
  id: string
  title: string
  description: string
  category: Category
  location: string
  coordinates: [number, number]
  date: string
  status: 'Verified' | 'Needs review' | 'New'
  risk: Risk
  score: number
  keywords: string[]
  demo?: boolean
}

export const observations: Observation[] = [
  { id: 'OBS-104', title: 'Water pooling after light rain', description: 'Standing water remains across the footpath outside the market for two days after rainfall.', category: 'Water & drainage', location: 'North Market', coordinates: [6.5244, 3.3792], date: '2026-10-28', status: 'Verified', risk: 'High', score: 82, keywords: ['standing water', 'footpath', 'rainfall'], demo: true },
  { id: 'OBS-103', title: 'Drain entrance blocked by packaging', description: 'Plastic and food packaging are collecting where the open drain meets Market Street.', category: 'Waste management', location: 'Market Street', coordinates: [6.5249, 3.3781], date: '2026-10-26', status: 'Verified', risk: 'High', score: 78, keywords: ['packaging', 'drain', 'market'], demo: true },
  { id: 'OBS-102', title: 'Slow drainage near bus stop', description: 'Water drains slowly around the west bus stop. The smell has become noticeable.', category: 'Water & drainage', location: 'West Bus Stop', coordinates: [6.5235, 3.3768], date: '2026-10-23', status: 'Needs review', risk: 'Moderate', score: 61, keywords: ['slow drain', 'smell', 'bus stop'], demo: true },
  { id: 'OBS-101', title: 'Recurring waste pile behind shops', description: 'A small waste pile has appeared behind the row of shops three times this month.', category: 'Waste management', location: 'Cedar Row', coordinates: [6.5219, 3.3759], date: '2026-10-20', status: 'Verified', risk: 'Moderate', score: 58, keywords: ['recurring', 'waste pile', 'shops'], demo: true },
  { id: 'OBS-100', title: 'Streetlight out near pedestrian crossing', description: 'The northern light has been out since last week, making the crossing difficult to see after dusk.', category: 'Public safety', location: 'Cedar Crossing', coordinates: [6.5223, 3.3799], date: '2026-10-18', status: 'Needs review', risk: 'Moderate', score: 52, keywords: ['streetlight', 'crossing', 'dusk'], demo: true },
  { id: 'OBS-099', title: 'Dust cloud from unfinished roadworks', description: 'Vehicles raise a dense dust cloud during the afternoon school commute.', category: 'Environmental pollution', location: 'Unity Avenue', coordinates: [6.5207, 3.3814], date: '2026-10-15', status: 'New', risk: 'Low', score: 38, keywords: ['dust', 'roadworks', 'school'], demo: true },
  { id: 'OBS-098', title: 'Loose paving stones by clinic', description: 'Several paving stones are loose on the clinic approach and catch wheelchair wheels.', category: 'Infrastructure', location: 'Community Clinic', coordinates: [6.5194, 3.3783], date: '2026-10-12', status: 'Verified', risk: 'Moderate', score: 49, keywords: ['paving', 'clinic', 'access'], demo: true },
  { id: 'OBS-097', title: 'Overflowing public bin on weekends', description: 'The bin is consistently full by Saturday afternoon and waste blows into the lane.', category: 'Waste management', location: 'Riverside Walk', coordinates: [6.5189, 3.3754], date: '2026-10-09', status: 'Verified', risk: 'Low', score: 35, keywords: ['bin', 'weekend', 'overflow'], demo: true },
  { id: 'OBS-096', title: 'Foul smell near drain cover', description: 'A persistent smell is noticeable near the drain cover beside the pharmacy.', category: 'Water & drainage', location: 'Green Pharmacy', coordinates: [6.5257, 3.3810], date: '2026-10-07', status: 'Needs review', risk: 'Moderate', score: 55, keywords: ['smell', 'drain cover', 'pharmacy'], demo: true },
  { id: 'OBS-095', title: 'Cracked curb at school gate', description: 'The curb has widened into a sharp edge beside the school gate.', category: 'Infrastructure', location: 'Unity Primary School', coordinates: [6.5177, 3.3807], date: '2026-10-04', status: 'New', risk: 'Low', score: 31, keywords: ['crack', 'curb', 'school'], demo: true },
  { id: 'OBS-094', title: 'Smoke from informal burning', description: 'Smoke from burning waste is drifting toward homes during the early evening.', category: 'Environmental pollution', location: 'East Footpath', coordinates: [6.5264, 3.3762], date: '2026-10-01', status: 'Verified', risk: 'Moderate', score: 64, keywords: ['smoke', 'burning', 'homes'], demo: true },
  { id: 'OBS-093', title: 'Missing cover on service pit', description: 'A service pit is uncovered beside a busy walkway.', category: 'Public safety', location: 'East Footpath', coordinates: [6.5269, 3.3771], date: '2026-09-28', status: 'Needs review', risk: 'High', score: 74, keywords: ['service pit', 'walkway', 'hazard'], demo: true },
  { id: 'OBS-092', title: 'Blocked channel after market day', description: 'The narrow channel is packed with sediment after the weekend market.', category: 'Water & drainage', location: 'North Market', coordinates: [6.5241, 3.3786], date: '2026-09-25', status: 'Verified', risk: 'High', score: 79, keywords: ['channel', 'sediment', 'market'], demo: true },
  { id: 'OBS-091', title: 'Faded crossing markings', description: 'Crossing markings are barely visible at the busiest junction.', category: 'Public safety', location: 'Cedar Crossing', coordinates: [6.5224, 3.3802], date: '2026-09-20', status: 'New', risk: 'Low', score: 34, keywords: ['crossing', 'markings', 'junction'], demo: true },
  { id: 'OBS-090', title: 'Water stain on apartment wall', description: 'A damp patch is spreading along the ground-floor wall after rain.', category: 'Infrastructure', location: 'Cedar Row', coordinates: [6.5213, 3.3764], date: '2026-09-18', status: 'Needs review', risk: 'Moderate', score: 47, keywords: ['damp', 'wall', 'rain'], demo: true },
  { id: 'OBS-089', title: 'Overflow from roadside channel', description: 'The roadside channel overflows onto the lane during short bursts of rain.', category: 'Water & drainage', location: 'Unity Avenue', coordinates: [6.5203, 3.3818], date: '2026-09-12', status: 'Verified', risk: 'High', score: 76, keywords: ['overflow', 'channel', 'rain'], demo: true },
]

export const categoryColors: Record<Category, string> = {
  'Water & drainage': '#317C62',
  'Waste management': '#D9A441',
  Infrastructure: '#5D7186',
  'Environmental pollution': '#8B6B4A',
  'Public safety': '#C8664E',
}
