// src/shared/components/QuickSearch.jsx
const QuickSearch = () => {
  return (
    <aside className="quick-search">
      <div className="quick-search-content">
        {/* Buscador */}
        <div className="search-box">
          <h3 className="search-title">QUICK SEARCH</h3>
          <input
            type="text"
            placeholder="Type here to search"
            className="search-input"
          />
        </div>

        {/* Top podcasters/usuarios */}
        <div className="top-section">
          <h3 className="section-title">TOP PODCASTERS</h3>
          {/* Aquí irán los top usuarios */}
        </div>

        {/* Player */}
        <div className="player-section">
          <h3 className="section-title">Player</h3>
          {/* Aquí irá el reproductor */}
        </div>
      </div>
    </aside>
  );
};

export default QuickSearch;