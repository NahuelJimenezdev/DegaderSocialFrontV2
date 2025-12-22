import React from 'react';
import { churchColors } from '../../utils/colors';

const InfoCard = ({ icon: Icon, title, content, accent = false }) => {
  return (
    <div 
      className={`
        ${churchColors.cardBg} p-6 rounded-xl shadow-md 
        transition duration-300 hover:shadow-lg
        ${accent ? `border-t-4 ${churchColors.accentBorder}` : `border-t-4 ${churchColors.primaryBorder}`}
      `}
    >
      <Icon className={`w-8 h-8 mb-3 ${accent ? churchColors.accent : churchColors.primary}`} />
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{content}</p>
    </div>
  );
};

export default InfoCard;


