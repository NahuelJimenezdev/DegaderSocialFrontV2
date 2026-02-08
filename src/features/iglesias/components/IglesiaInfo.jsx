import React, { useEffect, useState } from 'react';
import { Target, Zap, Sparkles, Clock, MapPin, Mail, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { churchColors } from '../utils/colors';
import InfoCard from './shared/InfoCard';
import ServiceTime from './shared/ServiceTime';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';

const IglesiaInfo = ({ iglesiaData }) => {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    const loadTestimonios = async () => {
      try {
        const { getTestimonios } = (await import('../../../api/iglesiaService')).default;
        if (iglesiaData?._id) {
          const data = await getTestimonios(iglesiaData._id);
          setTestimonios(data || []);
        }
      } catch (error) {
        console.error('Error loading testimonios:', error);
      }
    };
    loadTestimonios();
  }, [iglesiaData]);

  const getPastorName = () => {
    const pastor = iglesiaData?.pastorPrincipal;
    if (!pastor) return 'No asignado';
    if (pastor.nombres) {
      return `${pastor.nombres.primero} ${pastor.apellidos.primero}`;
    }
    return 'ID: ' + pastor;
  };

  const getRoleLabel = (usuario) => {
    if (usuario.eclesiastico?.rolPrincipal) {
      const roleMap = {
        'pastor_principal': 'Pastor Principal',
        'pastor_asociado': 'Pastor Asociado',
        'lider': 'Líder',
        'adminIglesia': 'Administrador',
        'anciano': 'Anciano',
        'diacono': 'Diácono',
        'maestro': 'Maestro',
        'coordinador': 'Coordinador',
        'miembro': 'Miembro',
        'servidor': 'Servidor'
      };
      return roleMap[usuario.eclesiastico.rolPrincipal] ||
        usuario.eclesiastico.rolPrincipal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    // Fallback: Si coincide con ID del pastor principal
    if (usuario._id === (iglesiaData.pastorPrincipal._id || iglesiaData.pastorPrincipal)) {
      return 'Pastor Principal';
    }
    return 'Miembro';
  };

  const galeria = iglesiaData?.galeria || [];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* About Section */}
        <section className={`${churchColors.cardBg} rounded-2xl shadow-xl p-6 md:p-8 border-t-4 ${churchColors.primaryBorder}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre Nosotros</h2>
          <p className={`text-xl font-semibold italic ${churchColors.accent} mb-4`}>
            "{iglesiaData?.denominacion || 'Sirviendo con amor, Creciendo en fe'}"
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg text-justify text-justify-inter-word">
            {iglesiaData?.descripcion || 'Una comunidad unida por el amor de Cristo, dedicada a servir al prójimo y expandir el Reino de Dios en nuestra ciudad.'}
          </p>
        </section>

        {/* Mission, Vision, Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            className="text-justify text-justify-inter-word"
            icon={Target}
            title="Misión"
            content={iglesiaData?.mision || "Alcanzar a los perdidos y edificar a los creyentes para que impacten al mundo."}
          />
          <InfoCard
            className="text-justify text-justify-inter-word"
            icon={Zap}
            title="Visión"
            content={iglesiaData?.vision || "Ser una iglesia relevante, apasionada y multiplicadora que refleja el amor de Dios."}
          />
          <InfoCard
            className="text-justify text-justify-inter-word"
            icon={Sparkles}
            title="Valores"
            content={iglesiaData?.valores || "La fe que transforma, la gracia que sostiene, el amor que une."}
            accent={true}
          />
        </section>

        {/* Photo Gallery (Preview) */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-500">photo_library</span>
            Galería de Fotos
          </h3>

          {galeria.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-64 md:h-80">
              {/* Main large image */}
              <div
                className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-lg relative group cursor-pointer"
                onClick={() => { setCurrentImageIndex(0); setShowGalleryModal(true); }}
              >
                <img
                  src={getAvatarUrl(galeria[0])}
                  alt="Principal"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>

              {/* Smaller images */}
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`rounded-xl overflow-hidden shadow-md relative group cursor-pointer ${idx === 3 ? 'hidden md:block' : ''}`}
                  onClick={() => {
                    if (idx < galeria.length) {
                      setCurrentImageIndex(idx);
                      setShowGalleryModal(true);
                    }
                  }}
                >
                  {galeria[idx] ? (
                    <>
                      <img
                        src={getAvatarUrl(galeria[idx])}
                        alt={`Galeria ${idx}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">landscape</span>
                    </div>
                  )}
                </div>
              ))}

              {/* View More Button */}
              <div
                onClick={() => setShowGalleryModal(true)}
                className="rounded-xl overflow-hidden shadow-md relative group bg-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              >
                {galeria.length > 4 && (
                  <img
                    src={getAvatarUrl(galeria[4])}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                    alt="Background"
                  />
                )}
                <span className="text-white font-medium flex flex-col items-center gap-1 relative z-10">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  <span className="text-sm">Ver más ({galeria.length})</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">image_not_supported</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No hay fotos en la galería aún</p>
            </div>
          )}
        </section>

        {/* Gallery Modal */}
        {showGalleryModal && galeria.length > 0 && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[210] p-2 bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
              {/* Navigation buttons */}
              {galeria.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galeria.length - 1))}
                    className="absolute left-0 text-white p-4 hover:bg-white/10 rounded-full transition-colors z-[210]"
                  >
                    <ChevronLeft size={48} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < galeria.length - 1 ? prev + 1 : 0))}
                    className="absolute right-0 text-white p-4 hover:bg-white/10 rounded-full transition-colors z-[210]"
                  >
                    <ChevronRight size={48} />
                  </button>
                </>
              )}

              <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
                <img
                  src={getAvatarUrl(galeria[currentImageIndex])}
                  alt={`Foto ${currentImageIndex}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="text-white font-medium bg-white/10 px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {galeria.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials (Solo si hay datos) */}
        {testimonios.length > 0 && (
          <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Lo que dice nuestra comunidad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonios.map((testimonio) => {
                const userRole = getRoleLabel(testimonio.usuario);
                const isPastorOrLeader = ['Pastor Principal', 'Pastor Asociado', 'Líder', 'Anciano'].includes(userRole);

                return (
                  <div key={testimonio._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative h-full flex flex-col">
                    <span className="absolute top-4 right-4 text-4xl text-indigo-200 dark:text-indigo-900 font-serif">"</span>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10 italic flex-grow">
                      {testimonio.mensaje}
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {testimonio.usuario.social?.fotoPerfil ? (
                          <img src={getAvatarUrl(testimonio.usuario.social.fotoPerfil)} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="colorMarcaDegader dark:text-indigo-200 font-bold">{testimonio.usuario.nombres.primero.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                          {testimonio.usuario.nombres.primero} {testimonio.usuario.apellidos.primero}
                        </h5>
                        <p className={`text-xs font-medium ${isPastorOrLeader ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {userRole}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Service Times & Location */}
        <section className={`${churchColors.cardBg} rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>

          {/* Service Times */}
          <div>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${churchColors.primary}`}>
              <Clock className="w-6 h-6 mr-3" />
              Horarios de Reunión
            </h3>
            {iglesiaData?.horarios && iglesiaData.horarios.length > 0 ? (
              (() => {
                const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                const horariosOrdenados = [...iglesiaData.horarios].sort((a, b) => {
                  return diasOrden.indexOf(a.dia) - diasOrden.indexOf(b.dia);
                });
                return horariosOrdenados.map((horario, index) => (
                  <ServiceTime
                    key={index}
                    day={horario.dia}
                    time={horario.hora}
                    description={horario.tipo || "Reunión"}
                  />
                ));
              })()
            ) : (
              <>
                <ServiceTime
                  day="Domingo"
                  time="10:00 AM"
                  description="Servicio Principal"
                />
                <ServiceTime
                  day="Miércoles"
                  time="7:30 PM"
                  description="Estudio Bíblico"
                />
              </>
            )}
          </div>

          {/* Location & Contact */}
          <div className="lg:col-span-2">
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${churchColors.primary}`}>
              <MapPin className="w-6 h-6 mr-3" />
              Ubicación y Contacto
            </h3>

            {/* Address */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <span>
                  {iglesiaData?.ubicacion?.direccion}, {iglesiaData?.ubicacion?.ciudad}, {iglesiaData?.ubicacion?.pais}
                </span>
              </p>
            </div>

            {/* Contact Info */}
            {(iglesiaData?.contacto?.email || iglesiaData?.contacto?.telefono || iglesiaData?.contacto?.sitioWeb) && (
              <div className="mb-4 space-y-2">
                {iglesiaData.contacto.email && (
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <a href={`mailto:${iglesiaData.contacto.email}`} className="hover:underline">
                      {iglesiaData.contacto.email}
                    </a>
                  </p>
                )}
                {iglesiaData.contacto.telefono && (
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-indigo-500" />
                    <a href={`tel:${iglesiaData.contacto.telefono}`} className="hover:underline">
                      {iglesiaData.contacto.telefono}
                    </a>
                  </p>
                )}
                {iglesiaData.contacto.sitioWeb && (
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="material-symbols-outlined w-5 h-5 text-indigo-500">language</span>
                    <a href={iglesiaData.contacto.sitioWeb} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {iglesiaData.contacto.sitioWeb}
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Google Maps */}
            {/* Google Maps o Botón GPS */}
            <div className="h-64 md:h-96 rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 relative">
              {iglesiaData?.ubicacion?.googleMapsLink ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <a
                      href={iglesiaData.ubicacion.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition-transform colorMarcaDegader dark:text-indigo-400"
                    >
                      <MapPin size={40} className="text-red-500" />
                      <span className="font-bold text-lg">Abrir ubicación en Google Maps</span>
                      <span className="text-xs text-gray-500">Haz clic para ver la ruta GPS</span>
                    </a>
                  </div>
                  {/* Intentamos mostrar iframe si el link parece un embed, si no, mostramos solo el botón arriba */}
                  {iglesiaData.ubicacion.googleMapsLink.includes('embed') && (
                    <iframe
                      src={iglesiaData.ubicacion.googleMapsLink}
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: 'relative', zIndex: 10 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de la iglesia"
                    />
                  )}
                </>
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.0899473167383!2d-58.56242532492178!3d-34.72812706407799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc5f4abbd384b%3A0x38980bcbc1567b5a!2sLas%20Camelias%2035%2C%20B1778JBB%20Cdad.%20Evita%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1769093691552!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la iglesia"
                />
              )}
            </div>
          </div>
        </section>

        {/* Pastor Section */}
        <section className={`${churchColors.cardBg} rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800`}>
          <h3 className={`text-2xl font-bold mb-8 ${churchColors.primary} text-center md:text-left flex items-center gap-3 justify-center md:justify-start`}>
            <span className="material-symbols-outlined text-3xl">verified_user</span>
            Liderazgo Pastoral
          </h3>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Foto del Pastor */}
            <div className="flex-shrink-0 relative group">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {iglesiaData?.pastorPrincipal?.social?.fotoPerfil ? (
                    <img
                      src={getAvatarUrl(iglesiaData.pastorPrincipal.social.fotoPerfil)}
                      alt="Pastor Principal"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-indigo-500">{getPastorName().charAt(0)}</span>
                  )}
                </div>
              </div>
              {/* Badge opcional de verificado o rol */}
              <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-100 dark:border-gray-700 text-indigo-500">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
            </div>

            {/* Información y Mensaje */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {getPastorName()}
                </h4>
                <p className={`text-lg font-medium ${churchColors.spiritual} flex items-center justify-center md:justify-start gap-2 mt-1`}>
                  Pastor Principal
                </p>
              </div>

              {/* Mensaje con estilo de cita elegante */}
              <div className="relative mt-4">
                <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-900/50 rounded-full" />
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg md:pl-2 italic">
                  {iglesiaData?.infoPastor?.mensaje ? (
                    <>"{iglesiaData.infoPastor.mensaje}"</>
                  ) : (
                    <>"Llamado a pastorear esta casa con amor, entrega y fidelidad a Su Palabra. Su ministerio se basa en el servicio y el cuidado espiritual de la congregación."</>
                  )}
                </p>
              </div>

              {/* Botón de contacto rápido o redes (Opcional, visualmente atractivo) */}
              <div className="pt-2 flex justify-center md:justify-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
                {/* Aquí se podrían agregar iconos sociales del pastor en el futuro */}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default IglesiaInfo;


