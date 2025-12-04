import React from 'react';
import { Target, Zap, Sparkles, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { churchColors } from '../utils/colors';
import InfoCard from './shared/InfoCard';
import ServiceTime from './shared/ServiceTime';

const IglesiaInfo = ({ iglesiaData }) => {
  const getPastorName = () => {
    const pastor = iglesiaData?.pastorPrincipal;
    if (!pastor) return 'No asignado';
    if (pastor.nombres) {
      return `${pastor.nombres.primero} ${pastor.apellidos.primero}`;
    }
    return 'ID: ' + pastor;
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* About Section */}
        <section className={`${churchColors.cardBg} rounded-2xl shadow-xl p-6 md:p-8 border-t-4 ${churchColors.primaryBorder}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre Nosotros</h2>
          <p className={`text-xl font-semibold italic ${churchColors.accent} mb-4`}>
            "{iglesiaData?.denominacion || 'Sirviendo con amor, Creciendo en fe'}"
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            {iglesiaData?.descripcion || 'Una comunidad unida por el amor de Cristo, dedicada a servir al prójimo y expandir el Reino de Dios en nuestra ciudad.'}
          </p>
        </section>

        {/* Mission, Vision, Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            icon={Target} 
            title="Misión" 
            content={iglesiaData?.mision || "Alcanzar a los perdidos y edificar a los creyentes para que impacten al mundo."} 
          />
          <InfoCard 
            icon={Zap} 
            title="Visión" 
            content={iglesiaData?.vision || "Ser una iglesia relevante, apasionada y multiplicadora que refleja el amor de Dios."} 
          />
          <InfoCard 
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-64 md:h-80">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Church Interior" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
            {/* Smaller images */}
            <div className="rounded-xl overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Worship" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Community" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Event" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md relative group bg-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
              <span className="text-white font-medium flex flex-col items-center gap-1">
                <span className="material-symbols-outlined">add_a_photo</span>
                Ver más
              </span>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/30">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Lo que dice nuestra comunidad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "María González", role: "Miembro desde 2018", text: "Encontré una familia que me acogió con amor desde el primer día. Aquí he crecido espiritualmente." },
              { name: "Juan Pérez", role: "Líder de Jóvenes", text: "Un lugar donde los jóvenes pueden desarrollar su potencial y servir a Dios con pasión." },
              { name: "Ana Martínez", role: "Voluntaria", text: "Servir en esta iglesia ha sido la mayor bendición para mi vida y la de mi familia." }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative">
                <span className="absolute top-4 right-4 text-4xl text-indigo-200 dark:text-indigo-900 font-serif">"</span>
                <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10 italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-600 dark:text-indigo-200 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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

            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Mapa de ubicación</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pastor Section */}
        <section className={`${churchColors.cardBg} rounded-2xl shadow-xl p-6 md:p-8`}>
          <h3 className={`text-2xl font-bold mb-6 ${churchColors.primary}`}>
            Liderazgo Pastoral
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-2xl flex-shrink-0">
              {getPastorName().charAt(0)}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getPastorName()}
              </h4>
              <p className={`text-lg font-semibold ${churchColors.spiritual}`}>
                Pastor Principal
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1 italic">
                "Llamado a pastorear esta casa con amor y la Palabra."
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default IglesiaInfo;
