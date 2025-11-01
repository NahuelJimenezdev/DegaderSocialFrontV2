const GroupLinks = ({ groupData }) => {
  const links = [
    { id: 1, title: 'Sitio Web Oficial', url: 'https://ejemplo.com', date: '15 Oct 2024' },
    { id: 2, title: 'Recursos Útiles', url: 'https://recursos.com', date: '14 Oct 2024' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Enlaces Importantes</h2>
      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">link</span>
              <div>
                <h3 className="font-semibold">{link.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{link.url}</p>
              </div>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visitar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupLinks;
