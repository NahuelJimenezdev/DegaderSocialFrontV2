// src/App.jsx
import AppLayout from './app/layout/AppLayout';
import CarpetaCard from './features/carpetas/components/CarpetaCard';
import './shared/styles/index.css';

function App() {
  return (
    <div>
        <h1>Bienvenido a Degader V2</h1>
        <p>Contenido principal aquí</p>

        {/* Ejemplo de contenido con scroll */}
        <div style={{ height: '150vh', paddingTop: '2rem' }}>
          <p>Este contenido hace scroll dentro del main...</p>
          <p>Mientras que el Navbar, Sidebar y QuickSearch permanecen fijos.</p>

        </div>
      </div>
  );
}

export default App;