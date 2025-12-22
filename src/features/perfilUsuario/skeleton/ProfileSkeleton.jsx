import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 animate-pulse">
      {/* Cover y avatar skeleton */}
      <div className="relative">
        <div className="h-32 md:h-48 bg-gray-300 dark:bg-gray-700">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="relative -mt-12 md:-mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Avatar skeleton */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-gray-50 dark:border-gray-900" />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    {/* Nombre skeleton */}
                    <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded-lg w-48" />
                    {/* Username skeleton */}
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32" />
                  </div>
                  {/* Botón editar skeleton */}
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-28 ml-5" />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {/* Biografía skeleton */}
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-lg w-full" />
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4" />

              {/* Info adicional skeleton */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-24" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-28" />
              </div>

              {/* Stats skeleton */}
              <div className="flex gap-4 md:gap-6 pt-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-lg w-32" />
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-lg w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-700 mt-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded-t-lg mr-1" />
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-t-lg mr-1" />
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-t-lg" />
          </div>
        </div>
      </div>

      {/* Publicaciones skeleton */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Composer skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-24" />
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Post cards skeleton */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-32" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-lg w-24" />
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Contenido */}
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-4/6" />
            </div>

            {/* Imagen skeleton (aleatorio) */}
            {item % 2 === 0 && (
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
            )}

            {/* Acciones */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-24" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-24" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-20" />
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;


