/**
 * Skeleton loader profesional para la página de Grupos
 * Replica exactamente el diseño de GruposPages.jsx con placeholders animados
 */

const GruposPageSkeleton = () => {
    // Componente auxiliar para el efecto shimmer
    const SkeletonShimmer = ({ className = "" }) => (
        <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
    );

    // Card skeleton individual (replica renderGroupCard exacto)
    const CardSkeleton = () => (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Imagen - h-32 exacto como en el real */}
            <SkeletonShimmer className="h-32 w-full rounded-t-xl" />

            {/* Contenido - p-4 exacto */}
            <div className="p-4 space-y-3">
                {/* Título - font-semibold text-base mb-1 line-clamp-1 */}
                <SkeletonShimmer className="h-5 w-3/4 rounded" />

                {/* Descripción - text-xs mb-3 line-clamp-2 (2 líneas) */}
                <div className="space-y-1.5">
                    <SkeletonShimmer className="h-3 w-full rounded" />
                    <SkeletonShimmer className="h-3 w-4/5 rounded" />
                </div>

                {/* Footer - flex items-center justify-between */}
                <div className="flex items-center justify-between pt-1">
                    {/* Contador miembros - gap-1 text-xs */}
                    <div className="flex items-center gap-1">
                        <SkeletonShimmer className="h-4 w-4 rounded-full" />
                        <SkeletonShimmer className="h-3 w-20 rounded" />
                    </div>

                    {/* Botón Unirse - px-3 py-1 text-xs rounded-md */}
                    <SkeletonShimmer className="h-6 w-16 rounded-md" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="w-full mx-auto flex flex-col gap-6 mb-mobile-30">

                {/* Header - Replica section-header exacto */}
                <div className="section-header">
                    {/* Icono en caja - section-header__icon-box */}
                    <div className="section-header__icon-box">
                        <SkeletonShimmer className="w-8 h-8 rounded-lg" />
                    </div>

                    {/* Contenido: Título + Subtítulo - section-header__content */}
                    <div className="section-header__content space-y-2">
                        {/* Título - section-header__title (text-2xl font-bold) */}
                        <SkeletonShimmer className="h-8 w-36 rounded-md" />
                        {/* Subtítulo - section-header__subtitle (text-sm) */}
                        <SkeletonShimmer className="h-4 w-64 rounded" />
                    </div>

                    {/* Botón CTA - section-header__button */}
                    <SkeletonShimmer className="h-10 w-32 rounded-lg" />
                </div>

                {/* Toolbar - Grid 2 columnas exacto como el real */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

                    {/* Columna Izquierda: Pestañas */}
                    <div className="flex justify-start w-full">
                        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl">
                            {/* Pestaña "Mis Grupos" - px-4 py-2 rounded-lg */}
                            <SkeletonShimmer className="h-10 w-32 rounded-lg" />
                            {/* Pestaña "Explorar" - px-4 py-2 rounded-lg */}
                            <SkeletonShimmer className="h-10 w-28 rounded-lg" />
                        </div>
                    </div>

                    {/* Columna Derecha: Toggle Grid/List */}
                    <div className="flex justify-end w-full">
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl">
                            {/* Botón Grid - w-10 h-10 rounded-lg */}
                            <SkeletonShimmer className="h-10 w-10 rounded-lg" />
                            {/* Botón List - w-10 h-10 rounded-lg */}
                            <SkeletonShimmer className="h-10 w-10 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="w-full flex flex-col gap-6">

                    {/* Buscador - h-12 exacto como en el componente real */}
                    <SkeletonShimmer className="h-12 w-full rounded-lg" />

                    {/* Grid de Cards - Mismo grid que el real: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Renderizamos 6 cards para dar sensación de contenido */}
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <CardSkeleton key={item} />
                        ))}
                    </div>
                </div>

            </div>

            {/* CSS para la animación shimmer */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
};

export default GruposPageSkeleton;
