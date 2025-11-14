import { useState } from 'react';
import { User } from 'lucide-react';

const estados = {
  default: { color: '#10b981', texto: 'Agregar a amigos' },
  enviada: { color: '#f59e0b', texto: 'Solicitud pendiente' },
  recibida: { color: '#3b82f6', texto: 'Responder solicitud' },
  aceptado: { color: '#6366f1', texto: 'Amigos' },
  rechazado: { color: '#ef4444', texto: 'Solicitud rechazada' },
};

const AmistadButton = ({ estado = 'default', onAccion }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          background: estados[estado].color,
          color: '#fff',
          borderRadius: 20,
          padding: '8px 16px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
          cursor: 'pointer'
        }}
        onClick={() => setDropdown((v) => !v)}
      >
        <User size={18} />
        {estados[estado].texto}
      </button>

      {dropdown && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: 180
          }}
        >
          {estado === 'default' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('agregar'); setDropdown(false); }}
            >
              Agregar a amigos
            </button>
          )}

          {estado === 'enviada' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('cancelar'); setDropdown(false); }}
            >
              Cancelar solicitud
            </button>
          )}

          {estado === 'recibida' && (
            <>
              <button
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
                onClick={() => { onAccion('aceptar'); setDropdown(false); }}
              >
                Aceptar solicitud
              </button>
              <button
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
                onClick={() => { onAccion('rechazar'); setDropdown(false); }}
              >
                Rechazar solicitud
              </button>
            </>
          )}

          {estado === 'aceptado' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('eliminar'); setDropdown(false); }}
            >
              Eliminar amistad
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AmistadButton;