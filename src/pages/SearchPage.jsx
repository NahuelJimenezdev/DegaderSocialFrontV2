import SearchBar from '../features/buscador/components/SearchBar';

const SearchPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Buscar Personas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encuentra personas en Degader
        </p>
      </div>

      <div className="w-full">
        <SearchBar />
      </div>

      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        <p>Empieza a escribir para buscar personas...</p>
      </div>
    </div>
  );
};

export default SearchPage;
