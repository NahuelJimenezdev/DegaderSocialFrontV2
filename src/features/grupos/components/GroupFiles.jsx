const GroupFiles = ({ groupData }) => {
  const files = [
    { id: 1, name: 'Documento 1.pdf', size: '2.5 MB', date: '15 Oct 2024' },
    { id: 2, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 3, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
    { id: 4, name: 'Documento 2.pdf', size: '3.0 MB', date: '12 Oct 2024' },
    { id: 5, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 6, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
    { id: 7, name: 'Documento 1.pdf', size: '2.5 MB', date: '15 Oct 2024' },
    { id: 8, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 9, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
    { id: 10, name: 'Documento 1.pdf', size: '2.5 MB', date: '15 Oct 2024' },
    { id: 11, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 12, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
    { id: 13, name: 'Documento 1.pdf', size: '2.5 MB', date: '15 Oct 2024' },
    { id: 14, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 15, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
    { id: 16, name: 'Documento 1.pdf', size: '2.5 MB', date: '15 Oct 2024' },
    { id: 17, name: 'Presentación.pptx', size: '5.1 MB', date: '14 Oct 2024' },
    { id: 18, name: 'Informe.docx', size: '1.2 MB', date: '13 Oct 2024' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Archivos Compartidos</h2>
      <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-md overflow-hidden">
        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">description</span>
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {file.size} • {file.date}
                </p>
              </div>
            </div>
            <button className="text-gray-600 dark:text-gray-400 hover:text-primary">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default GroupFiles;
