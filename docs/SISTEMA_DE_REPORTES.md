🔹 PROMPT MAESTRO – SISTEMA DE REPORTES, MODERACIÓN Y TRUST & SAFETY PARA PLATAFORMA SOCIAL (MOBILE-FIRST)
________________________________________
# CONTEXTO GENERAL
Estás diseñando una plataforma social moderna, mobile-first, inspirada en patrones reales de productos como Instagram, Facebook y X, pero adaptada a una red en crecimiento.
El sistema debe ser escalable, ético, operable por humanos, con posibilidad futura de asistencia por inteligencia artificial, y con flujos automatizados mediante herramientas externas como n8n.
El objetivo es diseñar un sistema completo de reportes de contenido, moderación y revisión, sin usar el rol de administrador, sino un sistema profesional de Trust & Safety.
________________________________________
1. PRINCIPIOS FUNDAMENTALES DEL SISTEMA
    1.	El sistema de reportes NO debe depender del rol admin.
    2.	Debe existir una separación clara de responsabilidades:
    o	Infraestructura ≠ Moderación ≠ Soporte ≠ Founder.
    3.	El sistema debe funcionar correctamente en:
        o	Desktop
        o	Tablet
        o	Mobile pequeño (360×640, ej. Moto G)
    4.	El sistema debe ser:
        o	Claro para el usuario que reporta
        o	Eficiente para el moderador
        o	Auditable para el founder
    5.	La inteligencia artificial NO toma decisiones finales; asiste.
    6.	El humano es siempre el responsable final de la decisión.
________________________________________
2. EXPERIENCIA DEL USUARIO AL REPORTAR
Flujo de reporte (usuario final):
    1.	El usuario selecciona “Reportar” sobre:
        o	Publicación
        o	Comentario
        o	Perfil
        o	Mensaje (si aplica)
    2.	Se muestra una lista clara, breve y comprensible de motivos, inspirados en estándares reales:
        o	No me gusta
        o	Bullying o acoso
        o	Contacto no deseado
        o	Violencia
        o	Odio
        o	Autolesión o suicidio
        o	Desnudez o actividad sexual
        o	Estafa, fraude o spam
        o	Información falsa
        o	Propiedad intelectual
    Nota: No es obligatorio incluir todas; el sistema debe permitir escalabilidad.
    3.	El usuario puede:
        o	Elegir un motivo principal
        o	Opcionalmente una subcategoría
        o	Opcionalmente un comentario
        4.	El sistema confirma:
        o	Que el reporte fue recibido
        o	Que será revisado
        o	Sin prometer resultados inmediatos
________________________________________
3. MODELO CONCEPTUAL DEL REPORTE
    Cada reporte debe generar una entidad estructurada con información suficiente para humanos e IA:
        •	ID único del reporte
        •	Tipo de contenido reportado
        •	ID del contenido
        •	Contenido completo (snapshot)
        •	Autor del contenido
        •	Usuario que reporta
        •	Motivo principal
        •	Submotivo
        •	Comentario del reportante
        •	Fecha y hora
        •	Estado del reporte
        •	Nivel de prioridad
        •	Historial de acciones
        •	Moderador asignado (si aplica)
    El reporte no se elimina nunca, solo cambia de estado.
________________________________________
4. ROLES Y PERFILES DEL SISTEMA
    Roles principales:
        Founder / Owner
            •	Acceso total a métricas
            •	Ve estadísticas
            •	Puede auditar decisiones
            •	Puede escalar o revertir casos
            •	NO revisa reportes uno por uno
        Trust & Safety / Moderador
            •	Revisa reportes
            •	Ve contenido reportado
            •	Decide validez
            •	Aplica acciones
            •	Documenta decisiones
        Soporte (opcional)
            •	Ve reportes cerrados
            •	Responde usuarios
            •	No decide sanciones
        Usuario
            •	Reporta contenido
            •	Ve estado general (opcional)
________________________________________
5. PERMISOS DEL ROL TRUST & SAFETY
    Permisos permitidos:
        •	Ver lista de reportes
        •	Acceder al contenido reportado
        •	Ver contexto (posts anteriores, historial)
        •	Cambiar estado del reporte:
            o	Pendiente
            o	En revisión
            o	Válido
            o	No válido
            o	Duplicado
            o	Escalado
            •	Aplicar acciones:
            o	Ocultar contenido
            o	Eliminar contenido
            o	Advertir usuario
            o	Suspensión temporal
            o	Escalar al founder
    Permisos prohibidos:
        •	Acceso a base de datos global
        •	Cambios estructurales del sistema
        •	Edición de contenido
        •	Acceso a datos sensibles innecesarios
________________________________________
6. DASHBOARD DE MODERACIÓN (MVP REALISTA)
    El dashboard NO debe ser complejo, pero sí funcional y claro.
        Principios:
            •	Pensado como cola de trabajo
            •	No como panel administrativo
            •	Priorización clara
            •	Accesible visualmente en mobile pequeño
        Vista principal:
            •	Lista de reportes ordenables por:
                o	Prioridad
                o	Tiempo
                o	Tipo
                •	Cada item muestra:
                o	Motivo
                o	Tipo de contenido
                o	Usuario reportado
                o	Tiempo relativo
                o	Estado
        Vista de detalle:
            •	Contenido reportado
            •	Contexto inmediato
            •	Historial del usuario
            •	Motivo del reporte
            •	Acciones disponibles
            •	Campo de justificación
________________________________________
7. NOTIFICACIONES Y PRIORIDAD
    El sistema debe manejar prioridades:
        •	Alta gravedad:
            o	Violencia
            o	Suicidio
            o	Odio
            •	Media:
            o	Bullying
            o	Desnudez
            •	Baja:
            o	Spam
            o	No me gusta
    Las notificaciones:
        •	No todo es tiempo real
        •	Alta gravedad → alerta inmediata
        •	Media y baja → cola de revisión
________________________________________
8. DISEÑO Y UX (FOCO MOBILE 360×640)
    Reglas clave:
        •	Una idea por fila
        •	Nada crítico alineado a la derecha excepto acciones
        •	Metadata compacta en una sola línea
        •	Uso de separadores (·)
        •	Tipografía jerárquica clara
        •	Avatar siempre circular perfecto
        •	Nombre truncado inteligentemente
        •	Fecha siempre relativa (“hace 4 días”)
    El dashboard debe:
        •	Ser usable en desktop
        •	Pero legible y funcional en Moto G
        •	Sin columnas excesivas
        •	Sin texto redundante
________________________________________
9. AUTOMATIZACIÓN Y FLOJOS (SIN DETALLE TÉCNICO)
    El sistema debe estar preparado para integrarse con:
        •	Flujos automatizados externos (ej. n8n)
        •	Webhooks
        •	Asignación automática
        •	Notificaciones internas
        •	Registro de decisiones
No es necesario detallar implementación, solo dejar clara su existencia como capa operativa.
________________________________________
10. INTEGRACIÓN CON INTELIGENCIA ARTIFICIAL
    La IA debe:
        •	Clasificar reportes
        •	Priorizar
        •	Resumir contenido
        •	Detectar duplicados
        •	Sugerir decisiones
    La IA NO debe:
        •	Eliminar contenido
        •	Sancionar usuarios
        •	Tomar decisiones finales
    Siempre:
        IA = asistente
        Humano = juez
________________________________________
11. TRAZABILIDAD Y ÉTICA
    Cada decisión debe dejar rastro:
        •	Quién revisó
        •	Qué decisión tomó
        •	Por qué
        •	Cuándo
    Esto permite:
        •	Auditoría
        •	Mejora del sistema
        •	Entrenamiento futuro de IA
        •	Protección legal y ética
________________________________________
12. OBJETIVO FINAL DEL SISTEMA
    Construir un sistema de reportes que:
        •	Sea confiable
        •	Escalable
        •	Humano-centrado
        •	Compatible con automatización
        •	Usable en mobile pequeño
        •	Profesional al nivel de grandes plataformas
        •	Pero viable para una red en crecimiento
________________________________________
FIN DEL PROMPT
________________________________________
Si querés, en otro momento (cuando vos decidas), puedo ayudarte a:
    •	Validar este prompt
    •	Dividirlo en documentación
    •	Traducirlo a especificación funcional
    •	Convertirlo en backlog de producto
Pero este prompt ya está completo, cerrado y autosuficiente

