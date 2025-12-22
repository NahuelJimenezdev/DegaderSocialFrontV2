import React from 'react';

const Skeleton = ({ className = '', variant = 'text', count = 1 }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-64 rounded-xl',
    button: 'h-10 w-24 rounded-lg',
    image: 'h-48 rounded-lg',
  };

  const baseClass = 'bg-gray-200 dark:bg-gray-700 animate-pulse';
  const variantClass = variants[variant] || variants.text;

  if (count === 1) {
    return <div className={`${baseClass} ${variantClass} ${className}`} />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${baseClass} ${variantClass} ${className}`} />
      ))}
    </div>
  );
};

export default Skeleton;


