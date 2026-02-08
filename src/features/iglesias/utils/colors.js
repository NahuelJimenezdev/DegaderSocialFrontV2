// Color palette and styling constants for church components
export const churchColors = {
  // Primary colors
  primary: 'colorMarcaDegader dark:text-indigo-400',
  primaryBg: 'bg-indigo-600 hover:bg-indigo-700',
  primaryLight: 'bg-indigo-50 dark:bg-indigo-900/20',
  primaryBorder: 'border-indigo-600',

  // Accent colors
  accent: 'text-yellow-600 dark:text-yellow-400',
  accentBg: 'bg-yellow-400',
  accentLight: 'bg-yellow-50 dark:bg-yellow-900/20',
  accentBorder: 'border-yellow-400',

  // Semantic colors
  success: 'text-green-600 dark:text-green-400',
  successBg: 'bg-green-500 hover:bg-green-600',
  successLight: 'bg-green-50 dark:bg-green-900/20',

  info: 'text-blue-600 dark:text-blue-400',
  infoBg: 'bg-blue-500 hover:bg-blue-600',
  infoLight: 'bg-blue-50 dark:bg-blue-900/20',

  warning: 'text-amber-600 dark:text-amber-400',
  warningBg: 'bg-amber-500 hover:bg-amber-600',
  warningLight: 'bg-yellow-50 dark:bg-yellow-900/20',

  spiritual: 'text-purple-600 dark:text-purple-400',
  spiritualBg: 'bg-purple-500 hover:bg-purple-600',
  spiritualLight: 'bg-purple-50 dark:bg-purple-900/20',

  // Base colors
  cardBg: 'bg-white dark:bg-gray-800',
  appBg: 'bg-gray-50 dark:bg-gray-900',
  border: 'border-gray-200 dark:border-gray-700',
  borderLight: 'border-gray-100 dark:border-gray-700',
};

// Event type colors
export const eventColors = {
  'Culto General': { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Estudio Bíblico': { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
  'Oración': { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-700' },
  'Jóvenes': { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-700' },
  'Alabanza': { border: 'border-pink-500', bg: 'bg-pink-100', text: 'text-pink-700' },
  'default': { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700' },
};

// Ministry badge colors
export const ministryColors = [
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
];

export const getMinistryColor = (index) => {
  return ministryColors[index % ministryColors.length];
};


