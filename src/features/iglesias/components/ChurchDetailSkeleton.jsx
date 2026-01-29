export default function ChurchDetailSkeleton({ isMobile = false }) {
    return (
        <>
            {/* Mobile Toggle Skeleton - Solo en mobile */}
            {isMobile && (
                <div className="fixed top-20 left-4 z-[60]">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>
            )}

            {/* Sidebar Skeleton - Oculto en mobile */}
            <div className={`fixed top-[65px] bottom-0 w-[280px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-[145] ${isMobile ? 'hidden' : 'block'}`}>
                <div className="h-full flex flex-col p-4">
                    {/* Header con logo y nombre */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                        </div>
                    </div>

                    {/* Menu items skeleton */}
                    <div className="space-y-2 flex-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton - Sin margin en mobile */}
            <div className={isMobile ? 'min-h-screen' : 'ml-[280px] min-h-screen'}>
                {/* Header Skeleton */}
                <div className="relative">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-end gap-4">
                            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
                            <div className="flex-1 space-y-2 mb-2">
                                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/3" />
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area Skeleton */}
                <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12" />
                                    </div>
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Large Content Block */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
