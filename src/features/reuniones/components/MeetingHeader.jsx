import React from 'react';
import '../../../shared/styles/headers.style.css';

// Aceptar la prop onNewMeeting
export function MeetingHeader({ onNewMeeting }) {
  return (
    <div className="section-header">
      {/* Icono en caja con fondo */}
      <div className="section-header__icon-box">
        <span className="material-symbols-outlined section-header__icon">
          video_call
        </span>
      </div>

      {/* Contenido: Título + Subtítulo */}
      <div className="section-header__content">
        <h1 className="section-header__title section-header__title--heavy">
          Reuniones
        </h1>
        <p className="section-header__subtitle">
          Gestiona y únete a reuniones virtuales
        </p>
      </div>

      {/* Botón CTA */}
      <button
        onClick={onNewMeeting}
        className="section-header__button section-header__button--indigo"
      >
        <span className="material-symbols-outlined section-header__button-icon">
          add
        </span>
        <span className="section-header__button-text">Nueva Reunión</span>
      </button>
    </div>
  );
}


