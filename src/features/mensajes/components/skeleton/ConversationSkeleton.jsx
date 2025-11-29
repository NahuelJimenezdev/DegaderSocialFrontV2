const ConversationSkeleton = () => {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          {/* Avatar skeleton */}
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationSkeleton;
