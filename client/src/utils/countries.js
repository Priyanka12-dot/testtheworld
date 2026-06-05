// src/utils/countries.js
// Country list with flag emojis for UI display

export const COUNTRIES = [
  // Asia
  { name: 'Japan',        flag: '🇯🇵', region: 'Asia' },
  { name: 'China',        flag: '🇨🇳', region: 'Asia' },
  { name: 'India',        flag: '🇮🇳', region: 'Asia' },
  { name: 'Thailand',     flag: '🇹🇭', region: 'Asia' },
  { name: 'Vietnam',      flag: '🇻🇳', region: 'Asia' },
  { name: 'South Korea',  flag: '🇰🇷', region: 'Asia' },
  { name: 'Indonesia',    flag: '🇮🇩', region: 'Asia' },
  { name: 'Malaysia',     flag: '🇲🇾', region: 'Asia' },
  { name: 'Philippines',  flag: '🇵🇭', region: 'Asia' },
  { name: 'Singapore',    flag: '🇸🇬', region: 'Asia' },
  { name: 'Bangladesh',   flag: '🇧🇩', region: 'Asia' },
  { name: 'Pakistan',     flag: '🇵🇰', region: 'Asia' },
  { name: 'Sri Lanka',    flag: '🇱🇰', region: 'Asia' },
  { name: 'Nepal',        flag: '🇳🇵', region: 'Asia' },
  { name: 'Myanmar',      flag: '🇲🇲', region: 'Asia' },
  { name: 'Cambodia',     flag: '🇰🇭', region: 'Asia' },
  // Middle East
  { name: 'Turkey',       flag: '🇹🇷', region: 'Middle East' },
  { name: 'Lebanon',      flag: '🇱🇧', region: 'Middle East' },
  { name: 'Iran',         flag: '🇮🇷', region: 'Middle East' },
  { name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East' },
  { name: 'Egypt',        flag: '🇪🇬', region: 'Middle East' },
  { name: 'Israel',       flag: '🇮🇱', region: 'Middle East' },
  { name: 'Iraq',         flag: '🇮🇶', region: 'Middle East' },
  { name: 'Jordan',       flag: '🇯🇴', region: 'Middle East' },
  // Africa
  { name: 'Morocco',      flag: '🇲🇦', region: 'Africa' },
  { name: 'Ethiopia',     flag: '🇪🇹', region: 'Africa' },
  { name: 'Nigeria',      flag: '🇳🇬', region: 'Africa' },
  { name: 'Ghana',        flag: '🇬🇭', region: 'Africa' },
  { name: 'Kenya',        flag: '🇰🇪', region: 'Africa' },
  { name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { name: 'Senegal',      flag: '🇸🇳', region: 'Africa' },
  { name: 'Tanzania',     flag: '🇹🇿', region: 'Africa' },
  // Europe
  { name: 'Italy',        flag: '🇮🇹', region: 'Europe' },
  { name: 'France',       flag: '🇫🇷', region: 'Europe' },
  { name: 'Spain',        flag: '🇪🇸', region: 'Europe' },
  { name: 'Greece',       flag: '🇬🇷', region: 'Europe' },
  { name: 'Germany',      flag: '🇩🇪', region: 'Europe' },
  { name: 'Portugal',     flag: '🇵🇹', region: 'Europe' },
  { name: 'United Kingdom',flag:'🇬🇧', region: 'Europe' },
  { name: 'Ireland',      flag: '🇮🇪', region: 'Europe' },
  { name: 'Netherlands',  flag: '🇳🇱', region: 'Europe' },
  { name: 'Belgium',      flag: '🇧🇪', region: 'Europe' },
  { name: 'Sweden',       flag: '🇸🇪', region: 'Europe' },
  { name: 'Norway',       flag: '🇳🇴', region: 'Europe' },
  { name: 'Denmark',      flag: '🇩🇰', region: 'Europe' },
  { name: 'Finland',      flag: '🇫🇮', region: 'Europe' },
  { name: 'Poland',       flag: '🇵🇱', region: 'Europe' },
  { name: 'Russia',       flag: '🇷🇺', region: 'Europe' },
  { name: 'Hungary',      flag: '🇭🇺', region: 'Europe' },
  { name: 'Switzerland',  flag: '🇨🇭', region: 'Europe' },
  { name: 'Austria',      flag: '🇦🇹', region: 'Europe' },
  // Americas
  { name: 'Mexico',       flag: '🇲🇽', region: 'Americas' },
  { name: 'Brazil',       flag: '🇧🇷', region: 'Americas' },
  { name: 'Argentina',    flag: '🇦🇷', region: 'Americas' },
  { name: 'Peru',         flag: '🇵🇪', region: 'Americas' },
  { name: 'Colombia',     flag: '🇨🇴', region: 'Americas' },
  { name: 'Cuba',         flag: '🇨🇺', region: 'Americas' },
  { name: 'Jamaica',      flag: '🇯🇲', region: 'Americas' },
  { name: 'Venezuela',    flag: '🇻🇪', region: 'Americas' },
  { name: 'Chile',        flag: '🇨🇱', region: 'Americas' },
  { name: 'Canada',       flag: '🇨🇦', region: 'Americas' },
  { name: 'United States',flag: '🇺🇸', region: 'Americas' },
  // Oceania
  { name: 'Australia',    flag: '🇦🇺', region: 'Oceania' },
  { name: 'New Zealand',  flag: '🇳🇿', region: 'Oceania' },
]

export const REGIONS = [...new Set(COUNTRIES.map((c) => c.region))]

export const getCountryByName = (name) =>
  COUNTRIES.find((c) => c.name.toLowerCase() === name?.toLowerCase())

export const getFlagByName = (name) => getCountryByName(name)?.flag || '🌍'