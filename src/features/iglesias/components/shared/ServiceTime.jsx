import React from 'react';
import { churchColors } from '../../utils/colors';

const ServiceTime = ({ day, time, description }) => {
  return (
    <div className={`border-b ${churchColors.borderLight} py-3`}>
      <p className="font-semibold text-lg text-gray-800 dark:text-white">{day}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
        {time} - {description}
      </p>
    </div>
  );
};

export default ServiceTime;
