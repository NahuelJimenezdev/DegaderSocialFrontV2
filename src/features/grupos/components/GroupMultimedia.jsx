const GroupMultimedia = ({ groupData }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Multimedia</h2>
      <div className="grid grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => (
          <div
            key={item}
            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMultimedia;