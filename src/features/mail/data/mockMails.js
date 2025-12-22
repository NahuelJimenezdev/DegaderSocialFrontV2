// src/modules/mail/data/mockMails.js
export const mockMails = {
  inbox: [
    {
      id: 1,
      sender: "Ana Gómez",
      subject: "Preparativos para el evento del domingo",
      preview:
        "Hola equipo, solo para confirmar los últimos detalles para el evento de este domingo...",
      time: "10:30 AM",
      body: `
        <p>Hola equipo,</p>
        <p>Solo para confirmar los últimos detalles para el evento de este domingo.</p>
        <ul>
          <li>Confirmar la llegada del equipo de sonido a las 8:00 AM.</li>
          <li>Preparar el área de bienvenida.</li>
          <li>Coordinar con el equipo de voluntarios.</li>
        </ul>
        <p>¡Será un día de gran bendición!</p>
        <p><strong>Ana Gómez</strong><br/>Coordinadora de Eventos</p>
      `,
    },
    {
      id: 2,
      sender: "Coro de la Iglesia",
      subject: "Horarios de ensayo de esta semana",
      preview: "Recordatorio: los ensayos serán el miércoles y viernes a las 7 PM.",
      time: "Ayer",
      body: `
        <p>Querido coro,</p>
        <p>Recordatorio: los ensayos serán el miércoles y viernes a las 7 PM.</p>
        <p>¡Dios los bendiga!</p>
      `,
    },
    {
      id: 3,
      sender: "Pastor Wilson Sánchez",
      subject: "Reunión de líderes este viernes",
      preview:
        "Queridos líderes, los invito a nuestra reunión mensual este viernes a las 6:30 PM...",
      time: "8:15 AM",
      body: `
        <p>Queridos líderes,</p>
        <p>Les recuerdo que este viernes tendremos nuestra reunión mensual de liderazgo a las 6:30 PM en el salón principal.</p>
        <p>Por favor, confirmen su asistencia.</p>
        <p>Bendiciones,<br/><strong>Pr. Wilson Sánchez</strong></p>
      `,
    },
    {
      id: 4,
      sender: "Fundación Humanitaria Sol y Luna",
      subject: "Informe de proyectos comunitarios - Octubre",
      preview:
        "Estimado equipo, adjuntamos el informe correspondiente a las actividades del mes de octubre...",
      time: "Martes",
      body: `
        <p>Estimado equipo,</p>
        <p>Adjuntamos el informe correspondiente a las actividades del mes de octubre.</p>
        <p>Gracias por su esfuerzo y compromiso con las comunidades.</p>
        <p><strong>Dirección de Proyectos</strong><br/>Fundación Humanitaria Sol y Luna</p>
      `,
    },
    {
      id: 5,
      sender: "Carlos Muñoz",
      subject: "Reflexiones de Fé - Tema de la próxima emisión",
      preview:
        "Hola Nahuel, quería comentarte el tema de la próxima emisión del programa...",
      time: "Lunes",
      body: `
        <p>Hola Nahuel,</p>
        <p>El tema de la próxima emisión será <strong>"La fe que mueve montañas"</strong>. Me gustaría que prepararas una reflexión corta para acompañar el mensaje central.</p>
        <p>Bendiciones,<br/><strong>Carlos Muñoz</strong></p>
      `,
    },
    {
      id: 6,
      sender: "Departamento de Jóvenes",
      subject: "Campamento juvenil 2025",
      preview:
        "Se abre la inscripción para el campamento juvenil del próximo mes...",
      time: "Domingo",
      body: `
        <p>¡Buenas noticias!</p>
        <p>Ya están abiertas las inscripciones para el campamento juvenil 2025 que se realizará del 12 al 15 de enero.</p>
        <ul>
          <li>Lugar: Finca “Monte de Paz”</li>
          <li>Costo: 150.000 COP</li>
          <li>Inscripciones abiertas hasta el 20 de diciembre.</li>
        </ul>
        <p>No te lo pierdas. ¡Será una experiencia transformadora!</p>
      `,
    },
    {
      id: 7,
      sender: "Ministerio de Alabanza",
      subject: "Lista de canciones para el domingo",
      preview:
        "Hermanos, aquí les comparto las canciones que cantaremos este domingo...",
      time: "Sábado",
      body: `
        <p>Hermanos,</p>
        <p>Estas son las canciones para el servicio del domingo:</p>
        <ol>
          <li>Ven, Espíritu Santo</li>
          <li>En Ti confiaré</li>
          <li>Grande es Tu fidelidad</li>
        </ol>
        <p>Nos vemos en el ensayo el sábado a las 6 PM.</p>
      `,
    },
    {
      id: 8,
      sender: "Leonardo Ruiz",
      subject: "Receta actualizada del chorizo artesanal",
      preview:
        "Hola Nahuel, te mando la nueva mezcla de condimentos que probamos ayer...",
      time: "Jueves",
      body: `
        <p>Hola Nahuel,</p>
        <p>Te comparto la receta actualizada del chorizo artesanal que preparamos ayer.</p>
        <p>Agregamos un toque de vino tinto y menos sal. El sabor quedó espectacular.</p>
        <p><strong>Leonardo Ruiz</strong><br/>Maestro choricero</p>
      `,
    },
    {
      id: 9,
      sender: "Aracelis Meneses",
      subject: "Película para ver en familia",
      preview:
        "Hola hijito, les recomiendo una película hermosa para ver esta noche...",
      time: "Miércoles",
      body: `
        <p>Hola hijito,</p>
        <p>Les recomiendo una película hermosa para ver esta noche: <em>"El Cielo sí existe"</em>. Es muy edificante.</p>
        <p>No les cuento el final, aunque me dan ganas 😅</p>
        <p>Con cariño,<br/><strong>Mamá Aracelis</strong></p>
      `,
    },
    {
      id: 10,
      sender: "Eric Ezequiel Noguera",
      subject: "Partido amistoso este sábado",
      preview:
        "Ey Nahuel, armamos un partido con los muchachos para este sábado a las 5...",
      time: "Martes",
      body: `
        <p>Ey Nahuel,</p>
        <p>Armamos un partido con los muchachos para este sábado a las 5 PM en la cancha del barrio.</p>
        <p>Llevá tus botines y la camiseta roja.</p>
        <p><strong>El Salchicha</strong></p>
      `,
    },
    {
      id: 11,
      sender: "Joel Natanael Benítez",
      subject: "Compra de pan para los choripanes",
      preview:
        "Papi, acordate de pasar por la panadería antes del mediodía...",
      time: "Hoy",
      body: `
        <p>Papi,</p>
        <p>Acordate de pasar por la panadería antes del mediodía, que después se acaba el pan.</p>
        <p>Y no te olvides de traer la gaseosa también 😎</p>
        <p><strong>El Bonito</strong></p>
      `,
    },
    {
      id: 12,
      sender: "Fabián",
      subject: "Invitación al grupo de oración",
      preview:
        "Hola hermano, te esperamos este jueves para compartir tiempo de oración y palabra...",
      time: "Lunes",
      body: `
        <p>Hola hermano,</p>
        <p>Te esperamos este jueves a las 7 PM en la iglesia para compartir un tiempo especial de oración y palabra.</p>
        <p>Será un momento de renovación espiritual. ¡No faltes!</p>
        <p><strong>Fabián</strong></p>
      `,
    },
    {
      id: 13,
      sender: "Carol Tatiana Jiménez",
      subject: "Fotos del evento familiar",
      preview:
        "Te envío las fotos que tomamos el domingo, saliste re bien en todas 😄...",
      time: "Viernes",
      body: `
        <p>Te envío las fotos que tomamos el domingo, saliste re bien en todas 😄</p>
        <p>Después te paso el video completo.</p>
        <p><strong>Akún Lentes Caídos</strong></p>
      `,
    },
    {
      id: 14,
      sender: "Susana Gertrudis Matiz",
      subject: "Almuerzo del sábado",
      preview:
        "Hola sobrino, este sábado hago almuerzo en casa, quiero que vengan todos...",
      time: "Ayer",
      body: `
        <p>Hola sobrino,</p>
        <p>Este sábado hago almuerzo en casa, quiero que vengan todos. Habrá asado, ensalada y postre casero.</p>
        <p>No me falten 😘</p>
        <p><strong>La Chaparra</strong></p>
      `,
    },
  ],
  starred: [],
  sent: [],
  drafts: [],
  trash: [],
};


