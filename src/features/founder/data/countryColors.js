/**
 * Country data including ISO codes for flags and representative colors.
 */
export const COUNTRY_DATA = {
  'Argentina': { iso: 'ar', color: '#74ACDF' },
  'Bolivia': { iso: 'bo', color: '#007A33' },
  'Brazil': { iso: 'br', color: '#009739' },
  'Chile': { iso: 'cl', color: '#0039A6' },
  'Colombia': { iso: 'co', color: '#FCD116' },
  'Costa Rica': { iso: 'cr', color: '#EF3340' },
  'Cuba': { iso: 'cu', color: '#002590' },
  'Ecuador': { iso: 'ec', color: '#FFDD00' },
  'El Salvador': { iso: 'sv', color: '#0047AB' },
  'Spain': { iso: 'es', color: '#AA151B' },
  'United States of America': { iso: 'us', color: '#B22234' },
  'Honduras': { iso: 'hn', color: '#0073CF' },
  'Mexico': { iso: 'mx', color: '#006847' },
  'Nicaragua': { iso: 'ni', color: '#0067C6' },
  'Panama': { iso: 'pa', color: '#DA121A' },
  'Paraguay': { iso: 'py', color: '#D52B1E' },
  'Peru': { iso: 'pe', color: '#D91023' },
  'Dominican Rep.': { iso: 'do', color: '#002D62' },
  'Uruguay': { iso: 'uy', color: '#0038A8' },
  'Venezuela': { iso: 've', color: '#FCE300' },
  'Canada': { iso: 'ca', color: '#FF0000' },
  'Russia': { iso: 'ru', color: '#0039A6' },
  'China': { iso: 'cn', color: '#DE2910' },
  'Germany': { iso: 'de', color: '#FFCE00' },
  'France': { iso: 'fr', color: '#002395' },
  'Italy': { iso: 'it', color: '#009246' },
  'United Kingdom': { iso: 'gb', color: '#012169' },
  'Australia': { iso: 'au', color: '#012169' },
};

/**
 * Gets the ISO code for a country map name.
 */
export const getCountryIso = (mapName) => COUNTRY_DATA[mapName]?.iso || null;

/**
 * Gets the representative flag color for a country map name.
 */
export const getFlagColor = (mapName, isSelected, isDark) => {
  const data = COUNTRY_DATA[mapName];
  const baseColor = data?.color || (isDark ? '#475569' : '#94a3b8');
  
  if (isSelected) return baseColor;
  return baseColor + '4D'; // 30% opacity
};
