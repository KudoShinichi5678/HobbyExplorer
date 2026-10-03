export const ACTIVITY_CATEGORIES = [
  { id: 'all', label: 'All Activities', icon: 'Compass', desc: 'Browse everything' },
  { id: 'trekking', label: 'Trekking & Mountains', icon: 'Mountain', desc: 'Ridge trails, peaks & hiking' },
  { id: 'running', label: 'Marathons & Races', icon: 'Flame', desc: 'Road races, 10Ks & ultra trails' },
  { id: 'concert', label: 'Concerts & Festivals', icon: 'Music', desc: 'Live bands, jazz, indie & arts' },
  { id: 'tradition', label: 'Tradition & Culture', icon: 'Sparkles', desc: 'Lanterns, pottery & heritage' },
  { id: 'clubs', label: 'Clubs & Communities', icon: 'Users', desc: 'Board games, cycling, film & running' },
  { id: 'nature', label: 'Scenic Nature & Camping', icon: 'Trees', desc: 'Stargazing, misty viewpoints & clouds' },
  { id: 'hidden-gem', label: 'Hidden Gems & Vibe Spots', icon: 'Eye', desc: 'Secret vinyl lounges, retro alleys' },
  { id: 'water-sports', label: 'Adventure & Water Sports', icon: 'Waves', desc: 'SUP, rock climbing, diving & surfing' }
];

export const DESIRED_LOCATIONS = [
  { id: 'all', label: 'All Locations (Explore Anywhere)', group: 'General', lat: 13.7563, lng: 100.5018 },
  { id: 'current', label: '📍 My Current Location (GPS / Near Me)', group: 'GPS', lat: null, lng: null },
  // Central & Bangkok
  { id: 'bangkok', label: 'Bangkok (CBD, Silom, Ari, Sukhumvit)', group: 'Central Thailand', lat: 13.7563, lng: 100.5018 },
  { id: 'nonthaburi', label: 'Nonthaburi & Koh Kret', group: 'Central Thailand', lat: 13.8621, lng: 100.5144 },
  { id: 'samut-songkhram', label: 'Samut Songkhram (Canals & Mangroves)', group: 'Central Thailand', lat: 13.4098, lng: 99.9964 },
  // West & Mountains
  { id: 'kanchanaburi', label: 'Kanchanaburi (Mountains & Waterfalls)', group: 'Western Region', lat: 14.0228, lng: 99.5328 },
  { id: 'phetchaburi', label: 'Phetchaburi & Kaeng Krachan', group: 'Western Region', lat: 13.1118, lng: 99.9392 },
  // East & Coast
  { id: 'chonburi', label: 'Chonburi & Bangsaen Coast', group: 'Eastern Seaboard', lat: 13.3611, lng: 100.9847 },
  { id: 'pattaya', label: 'Pattaya & The Fields (Country Club)', group: 'Eastern Seaboard', lat: 12.9276, lng: 100.8771 },
  // North & Highlands
  { id: 'chiangmai', label: 'Chiang Mai (Old City & Mountains)', group: 'Northern Thailand', lat: 18.7883, lng: 98.9853 },
  { id: 'nan', label: 'Nan & Pua Valley (Scenic Rice Terraces)', group: 'Northern Thailand', lat: 18.7834, lng: 100.7782 },
  { id: 'mae-hong-son', label: 'Mae Hong Son & Pai Loop (1,864 Curves)', group: 'Northern Thailand', lat: 19.3022, lng: 97.9654 },
  // South & Islands
  { id: 'krabi', label: 'Krabi (Railay Cliffs & Islands)', group: 'Southern Thailand', lat: 8.0863, lng: 98.9063 },
  { id: 'phuket', label: 'Phuket (Beaches, Capes & Wellness)', group: 'Southern Thailand', lat: 7.8804, lng: 98.3923 },
  { id: 'phang-nga', label: 'Phang Nga & Similan Islands', group: 'Southern Thailand', lat: 8.4501, lng: 98.5255 },
  // International Trips
  { id: 'tokyo', label: 'Tokyo, Japan (Old Town & Culture)', group: 'International Getaways', lat: 35.6762, lng: 139.6503 },
  { id: 'bali', label: 'Bali, Indonesia (Sunset Surf & Ocean)', group: 'International Getaways', lat: -8.3405, lng: 115.0920 }
];

export const DISTANCE_SCOPES = [
  { id: 'all', label: 'Any Distance / Nationwide' },
  { id: 'in-city', label: 'In-City / Nearby (< 30 km)', maxKm: 30 },
  { id: 'day-trip', label: 'Day Trip (30 - 150 km)', maxKm: 150 },
  { id: 'weekend-trip', label: 'Weekend Drive (150 - 450 km)', maxKm: 450 },
  { id: 'expedition', label: 'Expedition / Fly-Away (> 450 km)', minKm: 450 }
];

export const TIMING_OPTIONS = [
  { id: 'all', label: 'Any Time / Flexible' },
  { id: 'tonight', label: '🌙 Tonight / After-Work' },
  { id: 'weekend', label: '☀️ This Weekend' },
  { id: 'seasonal', label: '🗓️ Upcoming & Seasonal Festivals' }
];

export const BUDGET_OPTIONS = [
  { id: 'all', label: 'Any Budget' },
  { id: 'free', label: '100% Free Events' },
  { id: 'budget', label: 'Under ฿1,000' },
  { id: 'moderate', label: '฿1,000 - ฿3,000' },
  { id: 'premium', label: 'Premium (> ฿3,000)' }
];

export const ENVIRONMENT_OPTIONS = [
  { id: 'all', label: 'Indoor & Outdoor' },
  { id: 'outdoor', label: '🌿 100% Outdoor & Nature' },
  { id: 'indoor', label: '❄️ Air-Conditioned Indoors' }
];

export const POPULAR_KEYWORDS = [
  'Ridge Trekking',
  'Half Marathon',
  'Live Jazz',
  'Board Games',
  'Rock Climbing',
  'Stargazing',
  'Paddleboard',
  'Muay Thai',
  'Lantern Festival',
  'Cloud Sea',
  'Vinyl Music',
  'Surfing',
  'Road Cycling',
  'Pottery'
];

export const PRESET_PACKS = [
  {
    id: 'preset-nature-escape',
    name: '🏔️ Mountain & Nature Escape',
    description: 'Breathtaking ridge treks, misty cloud sea camps & Dark Sky stargazing reserves',
    filters: {
      category: 'nature',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-marathon-athletes',
    name: '🏃‍♂️ Road & Trail Runners',
    description: 'From World Athletics Platinum road races to grueling UTMB rainforest ultras',
    filters: {
      category: 'running',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-live-music',
    name: '🎸 Concerts & Music Festivals',
    description: 'Wonderfruit arts gathering, pine forest jazz & intimate candlelight symphonies',
    filters: {
      category: 'concert',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-community-clubs',
    name: '👥 Make Friends / Active Clubs',
    description: 'Weekend tabletop board games, after-work running crews & road cycling pelotons',
    filters: {
      category: 'clubs',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-secret-gems',
    name: '☕ Hidden Gems & Chill Vibe',
    description: 'Secret vinyl listening rooms, heritage artisan alleys & misty valley retreats',
    filters: {
      category: 'hidden-gem',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-weekend-adventures',
    name: '🌊 Adrenaline & Ocean Thrills',
    description: 'Deep limestone rock climbing, liveaboard manta ray diving & sunset surfing',
    filters: {
      category: 'water-sports',
      location: 'all',
      timing: 'all',
      budget: 'all',
      distanceScope: 'all',
      keyword: ''
    }
  },
  {
    id: 'preset-free-fun',
    name: '✨ 100% Free Weekend Fun',
    description: 'Zero cost: sunset park runs, 23km bike circuit & glowing river festivals',
    filters: {
      category: 'all',
      location: 'all',
      timing: 'all',
      budget: 'free',
      distanceScope: 'all',
      keyword: ''
    }
  }
];
