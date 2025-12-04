import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel,
  illustration 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon or Illustration */}
      {illustration ? (
        <div className="w-48 h-48 mb-6">
          {illustration}
        </div>
      ) : Icon && (
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
