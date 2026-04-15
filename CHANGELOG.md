# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.92.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.5...v1.92.6) (2026-04-15)


### Bug Fixes

* **founder:** corregir estilos del modal Reset Password - Input ahora es legible en modo oscuro (removidas clases dark:) - Titulo del IosModal actualizado a color marca ([#1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/issues/1)e3a5f) para mejor integracion de diseño ([8510da9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8510da91946c3a33dfb69be6061a16667bbf08f0)), closes [#1e3a5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/issues/1e3a5)

### [1.92.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.4...v1.92.5) (2026-04-15)


### Bug Fixes

* **auth:** redondear logo en pagina de restablecimiento de contrasena - La imagen del logo se mostraba cuadrada dentro del contenedor circular - Se agrego rounded-full a la imagen y overflow-hidden al contenedor para que el logo se recorte correctamente al circulo ([131ffe5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/131ffe573ab48d2a5d599f0544392401cbd920d4))
* **auth:** redondear logo en vista mobile de restablecimiento de contrasena - Mismo fix aplicado a la version mobile: overflow-hidden en contenedor y rounded-full en imagen ([2209f17](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2209f1776c19331f60b6da082739adf3ffeb51b6))

### [1.92.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.3...v1.92.4) (2026-04-15)


### Bug Fixes

* **ui:** cambiar color del toast de exito de azul a verde - El toast de success usaba colores azules identicos al fondo de la pagina de login haciendolo invisible - Ahora usa verde (bg-green-50, text-green-800, border-green-200) que es el estandar universal para notificaciones de exito - El toast de info mantiene su color azul original para diferenciarlos visualmente ([e944b07](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e944b0721db18f2b65b4f429e55cfd731ee35ea1))

### [1.92.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.2...v1.92.3) (2026-04-15)


### Bug Fixes

* **auth:** corregir estilos del modal Recuperar Contrasena en la pagina de login - El titulo era blanco sobre fondo blanco (invisible) por herencia de dark mode - El input de email tenia fondo oscuro (dark:bg-gray-900) en un modal claro - Se removieron clases dark: del IosModal para forzar siempre estilo claro tipo iOS glassmorphism - Se corrigio el input en Login.jsx con colores explicitos (bg-white text-gray-900) ([d4f031e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d4f031edb2ba0e11da8ad93b2ac1bbb69f09a366))

### [1.92.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.1...v1.92.2) (2026-04-15)


### Bug Fixes

* **perfil:** actualizar nombre completo de la fundacion en descripcion de afiliados - Cambiar Fundacion por Fundacion Humanitaria Internacional Sol y Luna en los 3 componentes de perfil ([ded5707](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ded570717330294f709dcfabe4e7c49e4bcda3b4))

### [1.92.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.92.0...v1.92.1) (2026-04-15)


### Bug Fixes

* **perfil:** corregir descripcion redundante de Afiliados en perfil de usuario - Antes mostraba: Se desempena como Afiliado en la Afiliado a nivel afiliado en Argentina - Ahora muestra: Actualmente Afiliado a la Fundacion con pais - Los demas cargos mantienen el formato detallado con area y jurisdiccion - Corregido en 3 archivos: PerfilVisitantePage, MemberProfilePage, MemberProfileContent ([295e07d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/295e07ddee82c766f2115d83dd7cb2e451725a1b))

## [1.92.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.91.0...v1.92.0) (2026-04-15)


### Features

* **fundacion:** rediseño premium de formularios de Entrevista y Hoja de Vida ([ac0b1c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ac0b1c57ededd22a35e019443eed4381761449c9))


### Bug Fixes

* **fundacion:** corregir filtro Buscar por Cargo en panel de administracion - Se reemplazo el input de texto por un select dropdown con todos los cargos validos del enum CARGOS_FUNDACION - Los cargos estan organizados por categoria con optgroup: Directivo General, Organos de Control, Organismos Internacionales, Direcciones Territoriales, Niveles Operativos y Afiliados - El match exacto del backend ahora funciona correctamente sin necesidad de debounce ni regex ([3717f47](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3717f47353d2f21d214bf582013034b2bcb2b92f))

## [1.91.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.90.0...v1.91.0) (2026-04-15)


### Features

* add Secretary roles for International Organizations (Salvacion Mundial and Mision Internacional de Paz) ([56f803a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/56f803a1e27e4b4b4e1aa6c8c98eabb9bf935f35))
* **auth:** complete password recovery system (front-end) ([f557374](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f55737472fab212d3abfd9fe05f7dbefbaad86b2))
* **fundacion:** add edit button to DocumentViewer for all document types ([5965553](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/59655530c12d8666401df441f6a370e52e974c6b))
* **fundacion:** mejorar UX del panel admin con filtros de estado e indicadores visuales ([115bf28](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/115bf280685129ebc3c2d1c2878204d76c895828))
* ocultar anuncios en el panel de administración de la fundación ([3350097](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3350097a8df1ed5e892f2967a6d166d26c7d5f1e))


### Bug Fixes

* **fundacion:** corregir error de 'Invalid time value' en formularios ([28dc952](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/28dc952cf0731ad55515551179ee2365c698f5b7))
* **fundacion:** sincronización de datos, respaldo localStorage y DocumentViewer completo ([b19e41f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b19e41f2b814fdf557c2182d62cb0fa0a00ff2d7))
* **shared:** move hooks before conditional return in IosModal to resolve React error ([b29e0fc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b29e0fc97d0090949a97f251f34cf94407a29f8d))
* **shared:** rewrite IosModal to strictly follow rules of hooks ([359679a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/359679a4fe6043229d09d29e6df78517962c10da))

## [1.90.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.89.2...v1.90.0) (2026-04-09)


### Features

* **iglesia:** mostrar información de vinculación a fundación en el perfil de miembro ([b286f92](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b286f9223a34b7b7cf036ebe487378e3bc761635))
* **iglesia:** pre-cargar país del usuario al registrar una nueva iglesia ([a94c493](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a94c49351671c71885a6425a5fa4605adb889d23))


### Bug Fixes

* **iglesia:** mostrar card de fundación en la vista incrustada de perfil de miembro ([518af41](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/518af415ad59f23572dff09d4b1d554710f84de3))

### [1.89.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.89.1...v1.89.2) (2026-04-09)


### Bug Fixes

* **fundacion:** corregir visualización de avatares en documentación ([b346ab5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b346ab57714ad1ed171bd9425ad4dadf6a050afd))

### [1.89.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.89.0...v1.89.1) (2026-04-09)


### Bug Fixes

* **fundacion:** mejorar visualización de niveles jerárquicos y territorios en el perfil ([ca936a7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ca936a7151e2b179f3ab107bfc84926e8925da2f))

## [1.89.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.88.0...v1.89.0) (2026-04-09)


### Features

* **fundacion:** integrar botón de descarga de base Excel en el panel administrativo ([4a610ec](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4a610ecce46fd6354c9dcfd484f64d1a9e31da55))

## [1.88.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.87.0...v1.88.0) (2026-04-09)


### Features

* **whatsapp:** update greeting message with blessings and formatting ([9121593](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9121593a6fd9aa2e3f64354bcc26e71dca6a38c8))

## [1.87.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.6...v1.87.0) (2026-04-09)


### Features

* **whatsapp:** add personalized message structure for WhatsApp contact ([2dee6da](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2dee6da7a4369bcc3aadd26ebfc52430efb6393d))

### [1.86.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.5...v1.86.6) (2026-04-09)

### [1.86.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.4...v1.86.5) (2026-04-08)

### [1.86.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.3...v1.86.4) (2026-04-08)


### Bug Fixes

* **build:** fix syntax error and upgrade Node to 20 for Vite 7 ([ef46acd](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ef46acd7b0597b42db0872a6b80f78e6feb96dfc))

### [1.86.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.2...v1.86.3) (2026-04-08)


### Bug Fixes

* **fundacion:** fix data mapping and async download bugs ([fd0853f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/fd0853f209124dfdf99dae2053835091ceb704fb))

### [1.86.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.1...v1.86.2) (2026-04-08)

### [1.86.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.86.0...v1.86.1) (2026-04-08)


### Bug Fixes

* **fundacion:** fix firma digital not loading in Hoja de Vida ([65b360d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/65b360dde761482fadab6bfe6fa67200b465015e))

## [1.86.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.85.0...v1.86.0) (2026-04-08)


### Features

* **iglesia:** add expulsion UI with confirmation modal ([dd60c81](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/dd60c810e0fbf608881e61616a8782b5b0fdf60a))


### Bug Fixes

* **folders:** add missing ProgressiveImage import to FilePreviewModal ([fb0a8c2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/fb0a8c29ac97b8a25815ee6743da958b972a4efd))

## [1.85.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.84.0...v1.85.0) (2026-04-08)


### Features

* **folders:** add owner name to folder card with minimalist styling ([aa0fe0e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/aa0fe0e0cc2b194f7ad0184f27843730756757b6))
* **folders:** improve preview, styling, and permissions ([23b03d0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/23b03d0905702c5d67780f4581106efc480f55cc))
* **fundacion:** se mejoró la visualización de solicitudes pendientes, incluyendo información detallada del referente para afiliados y eliminando etiquetas 'undefined' mediante filtrado de campos vacíos ([8e3ad1d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8e3ad1d81bbeedf508ccf595865863cb60361b76))
* link previews, typography improvements, and mobile z-index fix ([9144f58](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9144f583e9492035e010b74a62881a8cfc7a00c4))
* rich link preview UI, improved typography for accessibility, and mobile z-index layering fix ([99b88c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/99b88c540bab5050fb111b38dd74d4b6b5628722))


### Bug Fixes

* **folders:** add robust extension check for document preview (PPT fix) ([7203a6d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7203a6d090cf231973508780d6b7047ae33204f6))
* **folders:** clean up double slashes in URLs to ensure Microsoft Viewer works ([bd362ba](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bd362baccd331fe91df16eeb81b8558c82df7c1b))
* **folders:** ensure CarpetaCard truncation and styling are fully committed and pushed ([8c6e69e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8c6e69eb48294bc63534c938cd077824afbcb0b5))
* **folders:** explicitly prioritize Microsoft for PPT/Excel and Google for PDF/Word ([9851a2b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9851a2b7966d9a208269c81fcac8ce73a0fdb5d3))
* **folders:** implement hybrid viewer (Google for PDF/Word, Microsoft for Excel/PPT) and Portal fix ([e05df24](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e05df24287570154372a8144bd7aa329b43e57eb))
* **folders:** replace inline modal with FilePreviewModal component to fix z-index and mobile preview ([0b62092](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0b620927135d7ffaf0437ef4fb2cd7e87147f867))
* **folders:** switch to Google Docs Viewer for unified document preview (mobile fix) ([0db30c2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0db30c20af8ef2d51b6dfc1a9808309f62028aef))
* **ui:** implement React Portal for FilePreviewModal to fix z-index issues on mobile ([4a3a920](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4a3a92040b07604b75c3ab7cfa0f90e2595fea26))

## [1.84.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.83.2...v1.84.0) (2026-04-02)


### Features

* Agregar icono de visibilidad de contraseña en Login y Registro (móvil y desktop) ([96599b5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/96599b5300934f732ad96db2c90d77ff76ba1862))
* **frontend:** implementation of birthday card sending system with typography selection and enhanced animations ([f267404](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f2674047770709e27357f5e76595e80c53ad002a))
* **fundacion:** display fechaSolicitud in request list ([4829e63](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4829e63bb704a89392edfd0e71524acfc0c9542a))
* **fundacion:** implementar contador total de usuarios en el Panel Administrativo - Se reemplazó la variable inexistente 'contadordetodoslosusuarios' por 'pagination.total'. - Se mejoró la interfaz del Panel de Control Fundación integrando un indicador visual premium del total de miembros registrados bajo la jurisdicción del administrador. - Se añadió un estado de carga visual al contador para mejorar la experiencia de usuario durante la obtención de datos del servidor. - Se optimizó el estilo del botón 'Descargar Base' para alinearse con los estándares estéticos del sistema. ([2759e6d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2759e6d5278180968d8207d3f05b9f6256511305))
* Implementar cargo Afiliado con doble dimensión (territorial + jerárquica manual via referenteId) ([e04a1d3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e04a1d337b1f668879ff390321f885264c7b64af))
* **institutional-roles:** add Sub-Director de Áreas and Secretario/a Sub-Director de Áreas positions to frontend hierarchy ([5ae5f9e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5ae5f9e10f407cf82ca0c91e4566a057a95157b8))
* Mostrar nivel y pais en texto de solicitud pendiente ([61539f9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/61539f95a371a90b1e25757a18e7e66a4ee21b61))
* Mostrar subArea y programa en SolicitudesList cuando existen en la solicitud ([c9df68f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c9df68f70acbdeaf16240d70b7093c25fe95dd79))
* **notifications:** add absolute timestamp format to approval requests ([e9f4191](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e9f4191fa1d9cc3188b993bc21db90dae475a46d))
* Sistema de compartir Pro con copia directa en tarjetas de cumpleaños ([757cfb1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/757cfb17fc16a958b1aca54ed2a53c148de07d83))
* Sistema de tarjetas de cumpleaños finalizado y correccion de importacion en PerfilVisitante ([4809683](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4809683e6e85a2ecd5158e6c9f805eb674bf5611))
* **ui:** implementar detección y resaltado de enlaces en mensajes, posts y comentarios - Creada utilidad textUtils para identificar URLs y menciones. - Se aplicó el estilo azul característico de enlaces tanto en modo claro como oscuro. - Se habilitó la apertura de enlaces en nuevas pestañas con seguridad rel='noopener'. - Se integró la funcionalidad en Chat de Grupos, Feed de Grupos, Muro general y Comentarios. ([a968514](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a96851477246e742958b0a8e5218c885f7c981a5))


### Bug Fixes

* Eliminacion total de clases dark de Tailwind en BirthdayPostCard ([8ac3a5b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8ac3a5b4c61448a894d046a8d5bf24e50f6fa415))
* Forzado de colores de texto oscuros en BirthdayPostCard para compatibilidad con modo oscuro ([5653fd6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5653fd653b2cb943d56f202b9288d6b1a6c50b3f))
* **frontend:** add missing Smartphone icon import for mobile PWA install prompt ([aef0246](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/aef0246952fe2edbdeeab80c45eee18d6979a869))
* **frontend:** optional chaining on user country to prevent crash on incomplete profiles ([586fdd5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/586fdd5fd72483f5b6472d01487d844a5f6b1adb))
* **frontend:** UserCarousel logic disappearing for users with 5-9 posts ([383ee49](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/383ee49abd0ee4d4e8c6721ba711c36fe46c7c61))
* **fundacion:** corregir visibilidad del botón Descargar Base en mobile ([5ccfe7b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5ccfe7b9ae45edab8cf8043fabc1a42175bedc44))
* **notifications:** use request date instead of account creation date ([c0d04a4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c0d04a4011a6e3a1788a66efa619c12f3a9bef67))
* Overrides agresivos de CSS para forzar texto oscuro en BirthdayPostCard ([6b2e2b2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6b2e2b20239b70d8a552dd947ff7760f31c5a7bd))
* Restauracion de import PostCard en PerfilVisitante ([bfe73d0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bfe73d022d933e6d143ea2f7d10cb18dc0ad1ccf))
* Solucionado ReferenceError: Smartphone is not defined en Sidebar ([6908331](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/69083311e5eabc99459fda710bd15bd84bbad400))
* **UI:** prevent phantom requests on suggestion carousel and fix state mapping ([eace2c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/eace2c5c1b2ba1b9796197cc6603e0b0f226187d))
* updated PostCard to use likesCount and commentsCount, and added optimistic updates in useFeed ([f035856](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f035856fc80ca10071878e98a8d4e3fa889d400e))

### [1.83.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.83.1...v1.83.2) (2026-03-29)


### Bug Fixes

* renderizado condicional del departamento en dashboard ([44a4b2d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/44a4b2d3f271f43d2525c8324148f9f0b05be317))

### [1.83.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.83.0...v1.83.1) (2026-03-29)


### Bug Fixes

* renderizado condicional de dirección en dashboard ([4feee3e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4feee3e293b9e1d3e976c2513ab1cffebec8fccd))

## [1.83.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.82.0...v1.83.0) (2026-03-29)


### Features

* sincronización final de mejoras visuales en el dashboard ([1896919](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/18969190b06bc55422d4f38cb807f2de48bb9296))

## [1.82.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.81.1...v1.82.0) (2026-03-29)


### Features

* sync missing dashboard UI improvements ([354917c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/354917c4fbcb4b63ec78fcd10a515418f6832c68))

### [1.81.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.81.0...v1.81.1) (2026-03-29)

## [1.81.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.80.0...v1.81.0) (2026-03-29)


### Features

* enhance foundation request cards with detailed territory info ([65f03c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/65f03c573c6650cf1ad8bae5ac1cc4756a69affe))
* implement responsive user recommendation carousel UI ([90f59c4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/90f59c4a7257a34e17d725b9a104f39b5b74fb3a))
* Sistema dinámico de niveles territoriales por país ([19280f5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/19280f5fad2d55d341c1b879eb70183f16cd6423))


### Bug Fixes

* Ajuste de márgenes y breakout del carrusel para evitar overflow y mejorar visualización en el Feed ([2d63baf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2d63bafe88e2d7738b392fb2768de796371e6706))
* **frontend:** corregido ReferenceError en BirthdayCard ([5765e7c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5765e7c870e4b5d15855cd80d0ca4eeb95329b9b))

## [1.80.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.79.0...v1.80.0) (2026-03-27)


### Features

* fundacion reestructuracion visual y territorial ([cc6b74f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cc6b74f3138729bdd6759da0ed9448d140547d5b))


### Bug Fixes

* **fcm:** Corrección de AbortError de registro (manifiesto y service worker) ([924f71c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/924f71ca22d2b0e438f1478d80e7fbe1a93dc641))
* mejorar compatibilidad de Word (Office XML), completar mapeo de FHSYL y ocultar publicidad en aplicativo ([cbae0bb](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cbae0bbe793840605300a74abe72fe981fc65dc8))

## [1.79.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.78.3...v1.79.0) (2026-03-24)


### Features

* **messaging:** deep audit fixes, push permission gesture, and delivered status ui ([460e9d2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/460e9d2c87adc9a0fa37512de2fcfa2f03adc3f0))
* **messaging:** Phase 7 - Proactive Push Integration (Onboarding & Settings) ([d893d7e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d893d7ebcda55dfa6213807974ccb3b06da25fc0))
* **messaging:** PWA install button and isPWA/deviceId tracking ([6fe22b0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6fe22b08af29364d75dc2287f73a78cb19823614))


### Bug Fixes

* **deploy:** update Dockerfile to accept Firebase build args ([42dbf4f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42dbf4fd78605d765b227c59c898b76d355df829))
* **fcm:** added diagnostic logs for production push initialization ([eb5f261](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/eb5f2616e5d66dc59ab148b3b3613dce7314d262))
* **fundacion:** corregir visualización de hijos y diseño responsivo en Aplicativo Argentina ([4d5d40a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4d5d40a7021cb33bb2787876199d37b0bd617b8a))
* **hooks:** resolve useEffect ReferenceErrors in Sidebar and ModalCarpeta ([f008089](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f008089e617bd81f986bc967d823537eb05282ca))
* **iglesia:** protección de UI contra duplicación y visualización de errores de backend ([42afce0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42afce0cc0d5cff26bbd878cf7f23fe3a7e52f82))
* **messaging:** normalized sender field and enhanced SW logs ([da9ec20](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/da9ec20cda1dc2693318b1b9e567c03820f0907e))
* **push:** dynamic firebase-messaging-sw.js config via Docker build args ([3eee96d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3eee96d49711ddebd9a18170aa19a87a84717ff7))
* **pwa:** add start_url to manifest and register sw in main.jsx ([2788b29](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2788b2903640398d9411ebf7ced1a2e87b485027))
* **settings:** use updateUser instead of login to refresh context after profile update ([4de6071](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4de6071c42e8c3ac4f616e67355cf0f3882d2777))

## [1.78.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.78.3...v1.78.0) (2026-03-24)


### Features

* **messaging:** deep audit fixes, push permission gesture, and delivered status ui ([460e9d2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/460e9d2c87adc9a0fa37512de2fcfa2f03adc3f0))
* **messaging:** Phase 7 - Proactive Push Integration (Onboarding & Settings) ([d893d7e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d893d7ebcda55dfa6213807974ccb3b06da25fc0))
* **messaging:** PWA install button and isPWA/deviceId tracking ([6fe22b0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6fe22b08af29364d75dc2287f73a78cb19823614))


### Bug Fixes

* **deploy:** update Dockerfile to accept Firebase build args ([42dbf4f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42dbf4fd78605d765b227c59c898b76d355df829))
* **fcm:** added diagnostic logs for production push initialization ([eb5f261](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/eb5f2616e5d66dc59ab148b3b3613dce7314d262))
* **fundacion:** corregir visualización de hijos y diseño responsivo en Aplicativo Argentina ([4d5d40a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4d5d40a7021cb33bb2787876199d37b0bd617b8a))
* **hooks:** resolve useEffect ReferenceErrors in Sidebar and ModalCarpeta ([f008089](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f008089e617bd81f986bc967d823537eb05282ca))
* **iglesia:** protección de UI contra duplicación y visualización de errores de backend ([42afce0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42afce0cc0d5cff26bbd878cf7f23fe3a7e52f82))
* **messaging:** normalized sender field and enhanced SW logs ([da9ec20](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/da9ec20cda1dc2693318b1b9e567c03820f0907e))
* **push:** dynamic firebase-messaging-sw.js config via Docker build args ([3eee96d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3eee96d49711ddebd9a18170aa19a87a84717ff7))
* **pwa:** add start_url to manifest and register sw in main.jsx ([2788b29](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2788b2903640398d9411ebf7ced1a2e87b485027))
* **settings:** use updateUser instead of login to refresh context after profile update ([4de6071](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4de6071c42e8c3ac4f616e67355cf0f3882d2777))

## [1.77.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.76.0...v1.77.0) (2026-03-20)


### Features

* full document mapping and ZIP bundling for user documentation ([05ba0f7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/05ba0f7ca5a1c6448604e1ac2ee103085e48c7a7))


### Bug Fixes

* restringir creación y filtro de carpetas institucionales por aprobación y cargo ([cf0ec10](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cf0ec107efae1d131d28c8ea3e12aaf8482a9622))

## [1.76.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.75.0...v1.76.0) (2026-03-20)


### Features

* ajustar jerarquia de ubicacion territorial por nivel (Nacional, Regional, Dept, Mun) ([8aa5762](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8aa5762559466742ba9b43479337989d5e199cf3))
* bloqueo de Solicitud de Ingreso hasta completar CV, FHSYL y Entrevista ([593301f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/593301ff135da4d57f90fee40f30ccfebc4507a4))
* implementar seccion de documentacion para administradores con descarga de Word ([4f8654c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4f8654c72dc7c169bd7ae779a379cbc487617b63))
* sincronización de datos cross-form entre CV, FHSYL y Entrevista ([2c21077](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2c21077840a80da130115bdfc73b49ba036554ea))


### Bug Fixes

* corregir extraccion de datos en UserDocumentationView ([a2f3e24](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a2f3e2483521ea8b567e5a50a106c466ed384cf2))
* dividir campos combinados en Entrevista para correcta persistencia (situacion y talentos) ([46ab102](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/46ab102a29c005555d2c86f6fc9aa28f4b0ba43f))
* mapeado ultra-robusto con fallbacks y logs de depuración para Datos Generales ([351a856](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/351a8561946858fd038e5b5ef757277c8fa413c5))
* mapeo fuzzy de llaves para referencias y campos de documento ([3940007](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/394000783ee8d59b56d789005020c811eb70eb2c))
* refinar sincronización de Llamado Pastoral (solo entre FHSYL y Entrevista) ([d9502d6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d9502d6f49636e22cbdefae73a9d9d5461020872))
* solucionar ReferenceError en el formulario de solicitud (handleAreaChange) ([d85a14d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d85a14d1f64c4d4d01f281729151426493d1cd6d))
* soporte para tags con espacio en plantilla Word para profesiones personales ([0e381ca](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0e381ca1d0a21630d0f569663fd5fd27f850852f))

## [1.75.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.74.3...v1.75.0) (2026-03-19)


### Features

* expansion completa de Formulario Hoja de Vida con firma digital y todas las secciones ([806e624](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/806e62485e14ad140772e82ee056c3d08180165f))
* implementar modo oscuro en DocumentViewer y correcciones de UI ([ad98650](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ad98650888029ad683fa9c69af15d3e396b522de))
* persistencia de datos en Hoja de Vida y botón de guardado ([8d5b4eb](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8d5b4eba9886e0b8d5c63eedfb588f8588597171))
* update tablet breakpoint to 1112px to hide ads on iPad landscape and other layout refinements ([55e6d09](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/55e6d09de728384658e083acd8a9051c25934b25))
* uso de proxy para imágenes y renderAsync en Hoja de Vida ([bd0f752](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bd0f752d036427baa5a66350730cb8c931768c57))


### Bug Fixes

* corrección de proxy URL y mapeo de imágenes en Word ([ba169a7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ba169a7838533a12c8cc897d9832187948c9326b))
* corrección definitiva de campos undefined, documento_num e imágenes ([3d6e52f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3d6e52f963fab55cdb93ab0b560f57e04d270033))
* corrección definitiva de ortografía (identificadora) y ajustes de hoja de vida ([be512f6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/be512f65847d6f29715e95cc73fecd8f88306bf8))
* correcciones en formulario Hoja de Vida, campos faltantes, sectores y transparencia de firma ([d4fbec6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d4fbec63649c2b9235580b64b634cc8910abbdd8))
* eliminación definitiva de tags legacy y limpieza total del mapeo de datos ([3ab388a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3ab388a477bbc122cb48e7516dfdb654da84e5e5))
* evitar error de length en Word devolviendo imagen transparente para tags vacíos ([f96927c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f96927cb79c0cd829eede7e3d8e532759047ccf7))
* implementación de tags robustos (alfanuméricos) para evitar errores de XML ([358a7f7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/358a7f72ac25b1592d70ddf066d7c7d169304fa9))
* inclusión de FormularioHojaDeVida.jsx y ajustes finales de Hoja de Vida ([d730237](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d730237bd9d7dfb42d61e8d89e834285c9a0e8b7))
* limpieza final de mapeo de tags y unificación con sistema robusto alfanumérico ([4662e54](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4662e54ca985511240790a0a251fb33a2f8873c1))
* make getImage robust to handle URLs and base64 in Hoja de Vida ([6e3b93e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6e3b93e01dca3b2a5e7c68a70a06ee3c1b08ab3c))
* mapeado robusto de documento y ubicación con fallbacks al perfil personal ([73f6eb9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/73f6eb9bec48e4219ca6e8d9c291ad0b3b25c4e2))
* mapeo de tags con tildes y persistencia de firma/foto ([0c56aea](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0c56aea0fabbd8bee0f23305a6a10cfadfbac949))
* reparación automática de etiqueta corrupta (4_grado) en plantilla Word ([84b2d49](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/84b2d49929815b55f3f2f1bc3bd81db5138c317a))
* reparación quirúrgica de XML para etiquetas de grados escolares ([d005335](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d005335a365b71c48b31676d3295f4c6443ffc00))
* restore sidebar navigation on iPad landscape while keeping ads hidden ([ce04ee8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ce04ee89e3f41099458a5f865883a288e35dbc2f))
* sincronización final con nueva plantilla y mapeo de tags corregidos ([d733295](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d7332954c68698378ba526806d22e11410bb75ea))
* solución definitiva a la persistencia de datos con markModified y useEffect atómico ([1095aa0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1095aa0a4c4f6474e249e47f44ce726d49fd71a5))
* solución definitiva sin tildes, con nullGetter y mapeo robusto ([988df64](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/988df64d832e77a364126fe467c3bf3bd8f07f6f))
* unificación universal de tags de grados a formato grado1-11 en todo el front ([bfced05](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bfced050023878a810a801918bf3ac4689689c73))

### [1.74.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.74.2...v1.74.3) (2026-03-17)

### [1.74.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.74.1...v1.74.2) (2026-03-17)


### Bug Fixes

* **fundacion:** eliminar area y rol inventado y corregir formato de ubicacion ([313b1f4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/313b1f45a013989f4318c8d44e6835c9390d1d77))
* **ui:** Corregir diseño de cuadrícula en portátiles y autoselección del Área en formulario de Fundación ([7e57d3f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7e57d3fffae7dc47455c07ddc4d19f77c40dd206))

### [1.74.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.74.0...v1.74.1) (2026-03-17)

## [1.74.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.73.0...v1.74.0) (2026-03-17)


### Features

* **fundacion:** anadir campo region al formulario de hoja de vida ([41d9ac7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/41d9ac7b366fed0d23ab0d0c79645ca98f161372))
* **fundacion:** ocultar departamento, ciudad y barrio segun jerarquia de cargos directivos territoriales ([bdbdb2d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bdbdb2d6702e13b3e917c416dc277560010bba7c))
* **fundacion:** remodelación del organigrama jerárquico y lógica de ubicación dinámica FHISYL vs Nacional ([b9c644f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b9c644f5435e93e13419b57044bf1338ddffa6eb))
* **fundacion:** remover form de dos pasos, aislar inputs globalmente y ocultar roles ([83b9abd](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/83b9abde1e5d94e10d9e6e36d4d94e63e85046c5))


### Bug Fixes

* **fundacion:** corregir color blanco del boton enviar solicitud en modo claro ([c74c37c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c74c37c80fa1b906480ab99539cfd29d8883b619))
* **fundacion:** ocultar location por defecto, remover despacho, y validar necesitaRolFuncional con area ([21e8c13](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/21e8c13ff78a9d79ae84ec1596adbda5bb688e86))

## [1.73.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.72.0...v1.73.0) (2026-03-14)


### Features

* Actualización de la Hoja de Vida y componentes ([44dcc9a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/44dcc9a53a7e3f917e34f81185d49245b9e11104))
* Actualización final de la plantilla Word de Hoja de Vida ([52bab43](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/52bab439130595f7114feb0ed8d7e2851b73f60b))
* Actualizada plantilla de Hoja de Vida con etiquetas del usuario ([5d3d4ad](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5d3d4adb46bfdec49973bbc32918af0f5798e34a))
* Actualizado correo del founder a founderdegader@degadersocial.com en permisos de sistema ([3f52c88](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3f52c88313f84f223c12f06e7e7ee01af4848095))
* Agregado soporte para foto de perfil en Hoja de Vida con docxtemplater-image-module ([8f65966](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8f659665b589596d6bd6ae0044caa3917833f3c9))
* Implementada generación de Hoja de Vida en Word con docxtemplater ([f2460ff](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f2460ff6daf2df3dbe16bb8e15430899716286ff))
* Sincronización final de Hoja de Vida con soporte de imagen y etiquetas actualizadas ([df016e2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/df016e2ee508fdfc57ab97330e3dc312fdb0d3c6))


### Bug Fixes

* Areglado problema de detección de founder por espacios en blanco y actualizado placeholder ([ff06b5b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ff06b5b54e0d69bba1d1e77cfd84c3d726de2261))
* Corregido acceso a URL de banner y añadido logs de error ([12442ff](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/12442ff5f0b1eaf19a777ff78f1458b99f0116b7))
* Corregido error asincrónico en generación de Word con imagen (resolveData) ([eb8e305](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/eb8e305ae4c0a5d0baf7a98057d3688ba5d2ad9d))

## [1.72.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.5...v1.72.0) (2026-03-13)


### Features

* Agregada validación de campos obligatorios por paso en FormularioEntrevista ([0398075](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/03980752687efe24f2f84cc6495855a8dd09e385))
* Protegida navegación lateral en FormularioEntrevista para evitar bypass de validación ([41a6322](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/41a632214d13cecd7d8317e75f7a30e5b8219ef0))

### [1.71.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.4...v1.71.5) (2026-03-13)


### Bug Fixes

* Corregido visibilidad de header e inputs en modo claro/oscuro para FormularioEntrevista ([b89f150](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b89f150927effda72a5829d363d591b21bc5c9d0))
* Forzado de gradiente y colores de texto en header de FormularioEntrevista ([9b01206](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9b012062d10fab4e156bcc66d6838dd7e2994ae5))
* Revertido diseño de header e implementado estándar institucional para FormularioEntrevista ([4030cb4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4030cb480acdb9fd952f3faed2c2787171e535ad))

### [1.71.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.3...v1.71.4) (2026-03-13)


### Bug Fixes

* Corregida navegación y visualización de Solicitud de Ingreso ([2a10741](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2a107411246a4bf33813aca7a0ffd280366f89d4))
* Corregido ReferenceError y visibilidad condicional para Director General ([2b73e90](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2b73e904ca3208114ad8a4e17b389442431e720a))

### [1.71.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.2...v1.71.3) (2026-03-13)


### Bug Fixes

* Incluida información personal en el envío del formulario FHSYL para persistencia global ([c89eb38](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c89eb3881c65153dc926be1af4b2f0c447e3f891))

### [1.71.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.1...v1.71.2) (2026-03-13)

### [1.71.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.71.0...v1.71.1) (2026-03-13)


### Bug Fixes

* Corregida visibilidad de scrollbars en modo claro, justificación de texto en Word y error de impresión completa ([13d2628](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/13d2628b61b3f2d4e008f53835affde40d22ced4))

## [1.71.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.70.0...v1.71.0) (2026-03-13)


### Features

* Mejoras en visualización de documentos FHSYL, diseño profesional minimalista y correcciones de temas en formularios ([0310096](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/031009632034a28ee87bda842ed8ff24148bb47c))


### Bug Fixes

* Corrección de navegación al visor de documentos y ajuste de alineación en header mobile ([07317c7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/07317c73ffe6760242b2e62e7a6531cfeeebe80f))
* Corrección de visibilidad de temas (claro/oscuro) localizada en formularios de Fundación ([7f4de25](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7f4de25658d624ec17dd81ddd708720a43222cab))
* Estandarización de encabezados premium, botones de regreso y corrección de lógica de guardado en formularios de Fundación ([96a160e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/96a160e158cca073146f645558b4fa8d42dca4ba))
* Recuperación de formulario de solicitud institucional, corrección de navegación en cards y ajuste de diseño header mobile ([c0546cf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c0546cf33c629a5684e2628d4b23aae102c6f2ad))

## [1.70.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.69.3...v1.70.0) (2026-03-12)


### Features

* Implementación de visor de documentos Word y lógica de visualización/edición en cards de Fundación ([c927323](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c92732369f1e3a1cbfa25b5b6eea32d8a0a8afc7))


### Bug Fixes

* Nombre de institución y layout de íconos en DocumentCards ([31aee7b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/31aee7b25c298a757664af979d445f2c3837046d))

### [1.69.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.69.2...v1.69.3) (2026-03-12)

### [1.69.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.69.1...v1.69.2) (2026-03-12)


### Bug Fixes

* **fundacion:** cambiar ruta de documento fhsyl para evitar wildcard y colision con backend ([4b8a865](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4b8a865918d51c3e67661ff5b5bdff9c9b0c01d0))
* **fundacion:** revertir llamada a login al actualizar documentacion fhsyl y usar updateUser en su lugar ([904cbdf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/904cbdf39254b94c6c749024b032a8d940e41df2))

### [1.69.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.69.0...v1.69.1) (2026-03-12)


### Bug Fixes

* **fundacion:** corregir rutas de importacion en FormularioFHSYL que rompian el build ([c8bd0a8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c8bd0a8ad0ebac6bfddcc3f88c846b5c034facd9))

## [1.69.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.68.1...v1.69.0) (2026-03-11)


### Features

* **fundacion:** implementar formulario documentacion FHSYL con exportacion word/pdf nativa ([2fe65a3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2fe65a36c7ea06f2e95ccd7279a0fe37bdc9ea3a))

### [1.68.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.68.0...v1.68.1) (2026-03-11)


### Bug Fixes

* **iglesia:** renderizar fallback object en error de img galeria ([9a11485](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9a1148563f74a3d3a708a87747093fb1d1c36908))

## [1.68.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.67.1...v1.68.0) (2026-03-11)


### Features

* **fundacion:** agregar areas de despacho y cargo de subdirector ([9aac60d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9aac60dcafb93dbe64e89f4f11e4d5e19108af79))

### [1.67.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.67.0...v1.67.1) (2026-03-11)


### Bug Fixes

* **fundacion:** sanitizar rol Secretario/a para validacion del backend ([d5e3b9f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d5e3b9f56b4414848d0ae609627411eb4f764582))

## [1.67.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.66.2...v1.67.0) (2026-03-10)


### Features

* **carpetas:** agregar soporte para carpetas grupales faltantes ([a6ba73d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a6ba73d729deda3a9dcd0d1d2b999acaa2a611d2))


### Bug Fixes

* **carpetas:** corregir etiqueta div de cierre faltante en el modal ([8c4e869](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8c4e8699a08d7294c41f7a8b5756ec06e8d96c5c))

### [1.66.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.66.1...v1.66.2) (2026-03-10)

### [1.66.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.66.0...v1.66.1) (2026-03-10)

## [1.66.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.65.2...v1.66.0) (2026-03-09)


### Features

* agregar cargo de secretario/a con lógica de género y cargos en niveles local/barrial ([74bff20](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/74bff2032a4c4bf66536df389d99b809e99e276a))

### [1.65.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.65.1...v1.65.2) (2026-03-03)

### [1.65.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.65.0...v1.65.1) (2026-03-03)

## [1.65.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.5...v1.65.0) (2026-03-03)


### Features

* **auth:** implementar PublicRoute para redirección automática de usuarios autenticados ([7d60950](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7d6095094534240fef5a713ceb2c1124bcdd6f7d))

### [1.64.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.4...v1.64.5) (2026-03-03)

### [1.64.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.3...v1.64.4) (2026-03-03)

### [1.64.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.2...v1.64.3) (2026-03-03)


### Bug Fixes

* **grupos:** eliminar import duplicado de ProgressiveImage que causaba error de build ([2b824a7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2b824a74731782efb54f4db0bb4adcda3cb4dcac))

### [1.64.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.1...v1.64.2) (2026-03-03)


### Bug Fixes

* **grupos:** solucionar ReferenceError de ProgressiveImage agregando importaciones faltantes ([a4c185b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a4c185b32c0355a46c94ae2c6273480009a7378d))

### [1.64.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.64.0...v1.64.1) (2026-03-02)

## [1.64.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.63.0...v1.64.0) (2026-03-02)


### Features

* rediseño exacto de card competitiva con nuevo copy y botón ([9f74a19](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9f74a1903a767c6792cc4c0bd456ab588e01679a))

## [1.63.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.62.2...v1.63.0) (2026-03-02)


### Features

* rediseño de card competitiva, swap de fondos y mejoras de flujo ([b1c4a7d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b1c4a7d97e905519a6303c3a5d1fc8225799bf53))

### [1.62.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.62.1...v1.62.2) (2026-03-02)


### Bug Fixes

* rotación condicional y posicionamiento de avatares optimizado ([9e4404c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9e4404cbd7a345f35f8bcdf8b352013fe84d3acc))

### [1.62.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.62.0...v1.62.1) (2026-03-02)


### Bug Fixes

* modo pantalla completa y rotación automática para la arena ([8ef1440](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8ef1440fb18a241bf469330195e7933a29fee397))

## [1.62.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.61.4...v1.62.0) (2026-03-02)


### Features

* mejoras mobile arena, anuncio de rotación y rediseño 1vs1 ([f37b29e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f37b29e5825536293aa89f02b677575461e1776a))

### [1.61.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.61.3...v1.61.4) (2026-03-02)

### [1.61.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.61.2...v1.61.3) (2026-03-02)

### [1.61.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.61.1...v1.61.2) (2026-03-02)

### [1.61.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.61.0...v1.61.1) (2026-03-02)

## [1.61.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.60.2...v1.61.0) (2026-03-02)


### Features

* **seguridad:** agregar modales interactivos para cambiar contraseña y eliminar cuenta ([8fa2aa6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8fa2aa68ec4882cff5b286e5dbcf693f6193fe30))

### [1.60.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.60.1...v1.60.2) (2026-03-02)


### Bug Fixes

* **perfil:** corregir error de alertas en paginas de configuracion y privacidad ([1722ad2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1722ad21962d8eab2cdf8d91a4ade72ee5641011))

### [1.60.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.60.0...v1.60.1) (2026-03-02)

## [1.60.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.59.0...v1.60.0) (2026-03-02)


### Features

* **perfil:** agregar paginas de configuracion y privacidad de cuenta ([8ddb527](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8ddb527e8319e96528b615bd8aa49956806705e4))

## [1.59.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.5...v1.59.0) (2026-03-02)


### Features

* **iglesia:** agregar opciones de eliminar y transferir administracion ([10ecffc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/10ecffc6840d7ead8d9bc6d80dfb9715db23eded))

### [1.58.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.4...v1.58.5) (2026-03-02)


### Bug Fixes

* corregir superposicion logo/titulo en splash screen arena ([1866ee2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1866ee2f94ac84b1c79f31a61b54f40f70cf94ac))

### [1.58.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.3...v1.58.4) (2026-03-02)


### Bug Fixes

* corregir logo splash screen arena de w-150vw a min(60vw,280px) ([2169fee](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2169feee9a40f638021f65caa5a7a2fd1fe9c975))

### [1.58.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.2...v1.58.3) (2026-03-02)


### Bug Fixes

* usar inline styles en ArenaLoading para evitar override de CSS del ProgressiveImage wrapper ([b36cb28](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b36cb28e684e1d668ba9cf302148b4949938ec80))

### [1.58.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.1...v1.58.2) (2026-03-02)


### Bug Fixes

* reducir aun mas el logo de loading arena (55vw max 200px, max-h 35vh) ([d3dc0b9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d3dc0b9f997693b97a83f16b53f3c12d905b5f50))

### [1.58.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.58.0...v1.58.1) (2026-03-02)


### Bug Fixes

* reducir logo de loading arena al 70%, ajustar watermark cabecera y corregir modo oscuro ([027c2c2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/027c2c2538b9203ef0725ba6ee360317fe564038))

## [1.58.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.10...v1.58.0) (2026-03-02)


### Features

* **arena:** preload logo.svg on app initialization to prevent flicker ([b87c6a5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b87c6a555a1cf6a0667cb2ffe7a94481d220a89d))
* **reuniones:** rediseno sistema con tipos Publica/Capacitacion/Grupal, flujo de asistencia con aprobacion y modal de gestion del creador ([3b8e097](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3b8e097900b904249b521ad6de0548c2bc11deba))


### Bug Fixes

* corregir fondo cuadrado del logo en pantalla de login mobile y desktop ([3712093](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3712093ee96f83d7b0b6de721a99e392472c0a5e))

### [1.57.10](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.9...v1.57.10) (2026-03-02)

### [1.57.9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.8...v1.57.9) (2026-03-02)


### Bug Fixes

* **arena:** apply invert and screen mix-blend-mode to force logo white background transparency on dark themes ([0601dec](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0601decce7a8aec842fa4629b28727a64342e221))

### [1.57.8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.7...v1.57.8) (2026-03-02)


### Bug Fixes

* aplicar noBackground a marcas de agua y logos secundarios en Arena ([6520983](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6520983b845e092c5e5af243c66ba016e08c6f1a))
* eliminar fondo gris en logos de la Arena mediante prop noBackground ([ec9c19a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ec9c19ad5ebd5060198104fe2675ba5dc8605bd8))

### [1.57.7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.6...v1.57.7) (2026-03-02)


### Bug Fixes

* **arena:** fix useState ReferenceError and remove logo white background via CSS ([67050cc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/67050cc6da079801d8a0c1bb9cf00a352c174142))

### [1.57.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.5...v1.57.6) (2026-03-02)


### Bug Fixes

* forzar proporción 1:1 en avatares para evitar deformación visual ([e11531e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e11531e54ee495ffa49ee9bc37491ee0953e960b))

### [1.57.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.4...v1.57.5) (2026-03-02)


### Bug Fixes

* **arena:** fix ReferenceError motion is not defined in ArenaSplashScreen ([bf1f500](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bf1f500d2f00d7d1216e26a4a394befb4e6683b1))

### [1.57.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.3...v1.57.4) (2026-03-02)


### Bug Fixes

* REVERT Tailwind and index.html to restore original design ([7ccf6c1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7ccf6c19d0fbe1c58e0bf8f8636727d76d1c6d16))

### [1.57.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.2...v1.57.3) (2026-03-02)

### [1.57.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.1...v1.57.2) (2026-03-02)

### [1.57.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.57.0...v1.57.1) (2026-03-02)


### Bug Fixes

* **arena:** restaurar importaciones faltantes en StickyArenaHeader ([807e8c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/807e8c55841b6b77e37dd135f7a60dd4dd9f68a7))
* refactorización de ProgressiveImage para auto-height y visibilidad ([fb8ec2c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/fb8ec2cfb03867f23c612d57566a75cac4b6b407))

## [1.57.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.56.0...v1.57.0) (2026-03-02)


### Features

* auditoría global de imágenes progresivas e integración en múltiples módulos ([6082b16](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6082b16cba0af947eb3e76ab47864871b690bfe0))


### Bug Fixes

* corregir error de resolución de ProgressiveImage en build de producción ([ffbd4e2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ffbd4e20016c9c0a4fe7d72273b3af6de6443ccc))
* importación de ProgressiveImage y corrección de auditoría ([1207c42](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1207c42e21a6840a7818d252ca5500a7eaf3dde7))

## [1.56.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.55.2...v1.56.0) (2026-03-01)


### Features

* integrar componente ProgressiveImage ([e1d262a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e1d262a1ba068bd1d200992a1a7e639b1fc22b6c))

### [1.55.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.55.1...v1.55.2) (2026-03-01)


### Bug Fixes

* **arena:** refactoriza avatar en sticky header aislando css del contenedor para bordes perfectos ([0fbe454](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0fbe45474fc6a9d5ab1c419beb1947492dfb1ad9))

### [1.55.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.55.0...v1.55.1) (2026-03-01)


### Bug Fixes

* **arena:** centraliza avatar de sticky header y repara circulo de progreso SVG recortado ([2920da8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2920da86d811760ca45623982d5a2b55565234bc))

## [1.55.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.54.0...v1.55.0) (2026-03-01)


### Features

* restringir botones de continuación hasta visualización de todos los logros obtenidos ([1ee352d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1ee352d1890ceef8bd69f71306724b7dc503e304))

## [1.54.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.53.2...v1.54.0) (2026-03-01)


### Features

* restaurar animación de confeti premium en sistema de logros de Arena ([c6b947b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c6b947bc04545a778336f897838556f2d0dd68d3))

### [1.53.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.53.1...v1.53.2) (2026-03-01)


### Bug Fixes

* **arena:** restaura diseno original de Hero Card con escudo y stats correcta ([c507d15](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c507d153cddd0e287147a89f1ec6eb10bfc493a4))
* mejorar responsividad en Arena y ocultar cabecera durante el juego ([b46f50c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b46f50cda57985e62958d8745359f2f57726904c))

### [1.53.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.53.0...v1.53.1) (2026-03-01)


### Bug Fixes

* arena layout pc ([48e4c81](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/48e4c8182363f37bf88a238c66e47f61afce72b6))

## [1.53.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.16...v1.53.0) (2026-03-01)


### Features

* **arena:** ajustar visibilidad de cabecera en pestañas de Ranking y Logros ([deb18e8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/deb18e82c4f8586e2cd94c0d25143d5421053f0f))
* restaurar loading inicial (Splash Screen) en ArenaPage y actualizar assets de marca ([a291b6a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a291b6a42e0a3bb6738f36236ab61689e2285266))

### [1.52.15](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.14...v1.52.15) (2026-03-01)


### Bug Fixes

* Corregir navegación de notificaciones de grupo y marcado como leído ([8196662](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/81966624858813797ba661b19ec1351845bc72da))

### [1.52.14](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.13...v1.52.14) (2026-03-01)


### Bug Fixes

* Restaurar sincronización de datos de usuario y progreso en la Arena ([9afac67](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9afac6745f106c3e9949bd82a0fe78c0e2d5e1fe))

### [1.52.13](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.12...v1.52.13) (2026-03-01)


### Bug Fixes

* Corregir redirección de notificaciones de iglesia al chat correspondiente ([ad8d055](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ad8d055f898994c9cdbb9097714d6bdd197375e2))

### [1.52.12](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.11...v1.52.12) (2026-03-01)

### [1.52.11](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.10...v1.52.11) (2026-03-01)


### Bug Fixes

* Aislamiento absoluto de z-index para móvil (Solución regresión PC) ([88d6625](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/88d66250758c66c651a4dc1a642fb6ee916e7ccd))

### [1.52.10](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.9...v1.52.10) (2026-03-01)

### [1.52.9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.8...v1.52.9) (2026-03-01)

### [1.52.8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.7...v1.52.8) (2026-03-01)

### [1.52.7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.6...v1.52.7) (2026-03-01)

### [1.52.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.5...v1.52.6) (2026-03-01)


### Bug Fixes

* corrección de navegación object Object y optimización responsiva de iglesias ([9aa8ad9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9aa8ad95de8325933ea31695056b36258095c558))

### [1.52.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.4...v1.52.5) (2026-03-01)

### [1.52.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.3...v1.52.4) (2026-03-01)


### Bug Fixes

* increase nginx client_max_body_size to 100M ([aca637a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/aca637a4be4c465ef9cc498593656ec5bc674a9c))

### [1.52.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.2...v1.52.3) (2026-03-01)


### Bug Fixes

* resolve jsx syntax errors and hook violations in ArenaPage ([78ade29](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/78ade295647d45b5c221324170f1c340ff8bf5f7))

### [1.52.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.1...v1.52.2) (2026-03-01)


### Bug Fixes

* move favicons to public root for better server compatibility ([0ebb88e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0ebb88ecbc4b21f4e69f19891492cf6cc62c7d3b))

### [1.52.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.52.0...v1.52.1) (2026-03-01)

## [1.52.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.51.4...v1.52.0) (2026-03-01)


### Features

* add multi-device favicon system and app metadata ([cf9be2e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cf9be2e3e549c012f234929d36dce7603d8f75e6))

### [1.51.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.51.3...v1.51.4) (2026-03-01)

### [1.51.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.51.2...v1.51.3) (2026-03-01)

### [1.51.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.51.1...v1.51.2) (2026-03-01)

### [1.51.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.51.0...v1.51.1) (2026-03-01)


### Bug Fixes

* definitive smart name formatting with capitalization ([da80d26](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/da80d2693b861a9602b4cf12131ba575c1dac96a))

## [1.51.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.50.4...v1.51.0) (2026-03-01)


### Features

* ultimate premium light mode redesign and name formatting ([de62ab4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/de62ab43e22d8fcb44af351b1485ecc20009253c))

### [1.50.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.50.3...v1.50.4) (2026-03-01)


### Bug Fixes

* smarter name formatting to handle CamelCase in Arena ([cc72637](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cc726370746e1b9e480eb7b1f6ef0ca4d45b134b))

### [1.50.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.50.2...v1.50.3) (2026-03-01)


### Bug Fixes

* format username to show only first and last name in Arena ([45b6031](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/45b6031ba401d0bec82a9ee9de6f7d3acb42d147))

### [1.50.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.50.1...v1.50.2) (2026-03-01)


### Bug Fixes

* definitive arena ui responsiveness and spacing ([9ff5b2a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9ff5b2a449e351662137696251f2f605665847df))

### [1.50.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.50.0...v1.50.1) (2026-03-01)

## [1.50.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.49.10...v1.50.0) (2026-02-28)


### Features

* agregar favicon ([7b7964a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7b7964afe4fc5c50e2562c1dae44124cf7513dd1))

### [1.48.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.48.1...v1.48.2) (2026-02-28)

### [1.48.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.48.0...v1.48.1) (2026-02-28)


### Bug Fixes

* **arena:** corregir detección de scroll y visibilidad de cabecera sticky en mobile ([d7bb65c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d7bb65ce455ae5c4b40595a16131bac40ba1c1b2))

## [1.48.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.47.0...v1.48.0) (2026-02-28)


### Features

* **arena:** implementar cabecera sticky móvil compacta ([4d683d4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4d683d422b089ac932414e7f86956c4682f1c574))

## [1.47.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.46.2...v1.47.0) (2026-02-28)


### Features

* **arena:** mejoras en UI/UX, logros interactivos y ocultamiento de navbars ([e9320d2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e9320d2e604759dd866ee9a2b5e2476fbd585941))

### [1.46.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.2.1-arena-ui...v1.46.2) (2026-02-28)

### [1.46.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.46.0...v1.46.1) (2026-02-27)


### Bug Fixes

* importación faltante de ARENA_ACHIEVEMENTS en ArenaPage ([ef54304](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ef543044ee88411472d7a6359ab83ba49c3b904f))

## [1.46.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.45.0...v1.46.0) (2026-02-27)


### Features

* implementado splash screen de marca y cargador con barra de progreso para la arena ([f22acee](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f22acee6525401ecb7898878af666cdc5d4123cf))


### Bug Fixes

* corregida visibilidad en modo claro de la lista de logros y añadida verificación proactiva de logros para jugadores veteranos ([acc9c0f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/acc9c0f73741b46c2b8fb9cc638df77a3dffadc2))

## [1.45.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.44.4...v1.45.0) (2026-02-27)


### Features

* implementado sistema de logros expandido (+40), notificaciones premium estilo iOS y modal de desbloqueo de nivel ([4e1464d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4e1464dada342439a5f0f2f9be1415973203a35c))

### [1.44.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.44.3...v1.44.4) (2026-02-27)


### Bug Fixes

* **design:** unificar fondo de tarjeta de misión cumplida con el estilo del juego ([6dfbcc3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6dfbcc33563087306bafa7f700152c43733bedd9))

### [1.44.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.44.2...v1.44.3) (2026-02-27)


### Bug Fixes

* **design:** refinamiento final de visibilidad en pestañas y pantalla de misión cumplida ([76dc652](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/76dc6522a8fb92d6e868bfc21992d62f7b3ce4a5))

### [1.44.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.44.1...v1.44.2) (2026-02-27)


### Bug Fixes

* **design:** corregir contraste de botones y pestañas para mayor legibilidad ([bb59504](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bb595041b3189865c5614fb2032a1bd98a65c194))

### [1.44.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.44.0...v1.44.1) (2026-02-27)


### Bug Fixes

* **design:** mejorar visibilidad de pestañas y logros bloqueados en modo claro ([0a2db62](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0a2db622f7da080d5b5935c183cacd2cbec0fec5))

## [1.44.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.43.6...v1.44.0) (2026-02-27)


### Features

* **arena:** corregir renderizado de iconos, persistencia de estado y diseño de logros ([4b4c0a3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4b4c0a30d1d55897a260e5a9e45ae2c6099adc6a))

## [1.39.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.38.0...v1.39.0) (2026-02-25)


### Features

* **arena:** rediseño de Leaderboard y soporte anti-farming ([be84a50](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/be84a5016e5989f1582c25b409f15072d259d099))

## [1.38.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.37.0...v1.38.0) (2026-02-25)


### Features

* **onboarding:** adjust width of FounderWelcomeModal for desktop screens ([20769b0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/20769b033ccaf0d6178216083dc98c2918cc27b9))
* **onboarding:** complete implementation of Founder Welcome Message and tour logic ([f3b5006](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f3b5006f9e884b612447a3f58d9f59787966b1a0))

## [1.37.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.36.3...v1.37.0) (2026-02-08)


### Features

* **design:** implementar colores adaptativos y optimizar espaciado movil ([1e14164](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1e1416432b93d9dab61e82cc716f0c9bc7656ebe))

### [1.36.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.36.2...v1.36.3) (2026-02-08)


### Bug Fixes

* se arregla el el posicionamiento de los botones en pantallas muy alargadas ya que se ven muy abajo ([5487dda](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5487ddadded360952bf365d8502a3c70ae96d8db))

### [1.36.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.36.1...v1.36.2) (2026-02-08)


### Bug Fixes

* se arregla el interlineado del titulo h1 haciendo que se visualice mas cerca ([003c27d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/003c27d641589e43784504f0a8fe78ca9d52997a))

### [1.36.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.36.0...v1.36.1) (2026-02-08)

## [1.36.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.35.2...v1.36.0) (2026-02-08)


### Features

* **auth:** unificar identidad visual de headers moviles ([dfa492d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/dfa492d2ff85ca28a87b0d91789feaa14acdddb3))


### Bug Fixes

* **auth:** incluir corrección de minúsculas en importaciones CSS omitidas en release anterior ([e02c6db](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e02c6db25f7c1185b0c1d2c3a18ab33ab35bcbdf))

### [1.35.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.35.1...v1.35.2) (2026-02-07)

### [1.35.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.35.0...v1.35.1) (2026-02-07)

## [1.35.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.34.0...v1.35.0) (2026-02-07)


### Features

* **auth:** consolidación final de estilos y componentes de prueba para flujo móvil ([818f13d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/818f13d62484c307fc83865f34f6cf0f23549b6a))
* **auth:** implementación premium de flujo móvil con BottomSheet y Loader inteligente ([cf2562c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cf2562c18fea926b1a469e2bf6d881ba41a61b8d))

## [1.34.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.33.1...v1.34.0) (2026-02-07)


### Features

* **auth:** integrar nuevos estilos premium y actualizar componente de login ([1a6ab5c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1a6ab5cad3db7d02a0b12dc141a9fef25d72ebee))

### [1.33.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.33.0...v1.33.1) (2026-02-07)


### Bug Fixes

* **routes:** eliminar referencia a componente de prueba ausente que bloqueaba el build ([09579cf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/09579cfa261851a4ce931e0f22ada97f71f0699e))

## [1.33.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.32.0...v1.33.0) (2026-02-07)


### Features

* **ui:** sincronizar cambios pendientes en navegación, sidebar, creación de reuniones y login original ([6ca2977](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6ca2977861ba2fe8eac45ca897f08f32017d4d88))

## [1.32.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.31.0...v1.32.0) (2026-02-07)


### Features

* **auth:** corregir diseño responsivo del formulario de registro para mantener dos columnas en móviles ([556c760](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/556c7600fef2eebd5c78d42acdeec113fc6dbb32))

## [1.31.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.30.2...v1.31.0) (2026-02-05)


### Features

* rediseño perfil visitante, muro de usuario y protección founder ([4f32c0e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4f32c0e6fde7424901f7a6d4536b4a5604663c69))

### [1.30.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.30.1...v1.30.2) (2026-02-05)


### Bug Fixes

* importar Compass icon para evitar ReferenceError ([3100bf2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3100bf203ef93dcfdea251c44fb11cabc9403899))

### [1.30.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.30.0...v1.30.1) (2026-02-05)


### Bug Fixes

* eliminar import duplicado de mobileSteps ([7b6d7ec](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7b6d7ecf7e4938c3a06eaa0eb55014a82c2e6b7a))

## [1.30.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.29.1...v1.30.0) (2026-02-05)


### Features

* traducir contador de pasos con estilos originales ([ed8f9c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ed8f9c55e8701373ca8d30c9ea5a8fb1f9705d6a))

### [1.29.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.29.0...v1.29.1) (2026-02-05)


### Bug Fixes

* corregir UI dropdown y extender tour mobile a 6 pasos ([42290a2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42290a282cbe9184ae1118b702bc2b67805c7fa0))

## [1.29.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.28.1...v1.29.0) (2026-02-05)


### Features

* agregar opcion reiniciar tour en menu de perfil para mobile ([cf6bfdf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cf6bfdf51c7399069e3682a228da62506c292344))

### [1.28.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.28.0...v1.28.1) (2026-02-05)


### Bug Fixes

* agregar .npmrc para compatibilidad de react-joyride con React 19 ([f3930e6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f3930e6f3b1be4d6c67ee4e272c74d586fdd8c5b))

## [1.28.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.27.1...v1.28.0) (2026-02-05)


### Features

* implementar tour guiado de onboarding con react-joyride ([b347968](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b34796829df2118c8231b74995d64d726f429ef1))

### [1.27.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.27.0...v1.27.1) (2026-02-05)


### Bug Fixes

* mejorar alert 'Próximamente' con un solo botón e ícono de construcción ([ecf54fa](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ecf54fa3878348f2e9c02e6c556156191439ebff))

## [1.27.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.26.3...v1.27.0) (2026-02-05)


### Features

* agregar alertas 'Próximamente' para Configuración, Privacidad y Ayuda ([69d8dda](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/69d8ddab481aa0d7eb223c098d036e1741bcb8be))

### [1.26.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.26.2...v1.26.3) (2026-02-05)


### Bug Fixes

* **mobile:** corregir chat pantalla completa, z-index, sidebar y visibilidad de texto en modo claro ([93889b6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/93889b65e7b9652f79609e57ddb6cedbef3eebe1))

### [1.26.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.26.1...v1.26.2) (2026-02-05)


### Bug Fixes

* **chat:** corregir visualización pantalla completa en mobile y z-index ([5e28787](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5e28787926e87cd641fe2323b18881fe90232c88))

### [1.26.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.26.0...v1.26.1) (2026-02-04)


### Bug Fixes

* **layout:** corregir visibilidad global del sidebar en mobile y dependencias css ([f06e3f1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f06e3f1f3e4c3f8404d40b69cc60d81960c74d80))

## [1.26.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.25.0...v1.26.0) (2026-02-04)


### Features

* **grupos:** permitir acceso a configuración a todos los miembros y mejoras en UX de unirse ([99d4566](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/99d4566724bfdc6edd7bde2fd0cf8590dfc2abc5))

## [1.25.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.5...v1.25.0) (2026-02-04)


### Features

* **grupos:** implementar alerta iOS minimalista para acceso restringido a grupos ([7f13560](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7f135609f99d0ca7bceccb67dfb3d4e6e3756a33))
* **grupos:** scroll instantáneo al final del chat al cargar ([3abb0c7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3abb0c73572b97e5048995809517cb6608e8cd95))

### [1.24.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.4...v1.24.5) (2026-02-04)


### Bug Fixes

* **navbar:** aumentar z-index a 150 para aparecer sobre chat (z-100) ([75e892f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/75e892f4060f665d8da93a55a5096f1847da1895))

### [1.24.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.3...v1.24.4) (2026-02-04)


### Bug Fixes

* **notificaciones:** cambiar dropdown a position fixed con cálculo dinámico de posición ([11cb268](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/11cb26826b2e0bb624e3f318da4f8c6b27516bc1))

### [1.24.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.2...v1.24.3) (2026-02-04)


### Bug Fixes

* **navbar:** aumentar z-index de 40 a 50 para que dropdown de notificaciones aparezca sobre el chat ([d2ef6d7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d2ef6d754d8fd8f5488b36a6e2089e0b4966a667))

### [1.24.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.1...v1.24.2) (2026-02-04)


### Bug Fixes

* **notificaciones:** aumentar z-index del dropdown a 10000 para aparecer sobre el chat ([44d032f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/44d032fcf57a5927e627babf4a5de5dc7fd7111b))

### [1.24.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.24.0...v1.24.1) (2026-02-04)


### Bug Fixes

* **notificaciones:** agregar navegación a grupo para tipo mensaje_grupo ([0b0adf6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0b0adf63b6224892b8c95a4bb3864968bd476b98))

## [1.24.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.23.0...v1.24.0) (2026-02-04)


### Features

* **grupos:** UI de configuración de notificaciones con silencio temporal y solo menciones ([5fe5d44](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5fe5d44debcc1a5c5e743b8fff66ce0fd6a6f2cd))

## [1.23.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.22.3...v1.23.0) (2026-02-04)


### Features

* **favoritos:** usar contador de amigos calculado por backend con logs de debug ([f062f65](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f062f654c939919c29047299e023d0729bdd5684))

### [1.22.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.22.2...v1.22.3) (2026-02-04)

### [1.22.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.22.1...v1.22.2) (2026-02-04)


### Bug Fixes

* **favorites:** mostrar contador de amigos en tarjeta de favorito ([ecfc727](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ecfc727ebf8f4b7340cfde0947c848da63cee8ad))

### [1.22.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.22.0...v1.22.1) (2026-02-04)


### Bug Fixes

* **profile:** priorizar roles de liderazgo en ministerios sobre rol principal generico ([43858fd](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/43858fda95b75ec3a0a58b90f64cb9e23806b1c5))

## [1.22.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.21.1...v1.22.0) (2026-02-04)


### Features

* **profile:** mostrar info detallada de gloria y fundacion en perfil publico ([6c43162](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6c43162d79da56d57947da6f17793903bf521e3c))

### [1.21.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.21.0...v1.21.1) (2026-02-04)


### Bug Fixes

* **chat:** restaurar imports faltantes en ConversationItem para error de referencia ([b61a0d4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b61a0d4052cd86a9785629442cafcae9f42b69e0))

## [1.21.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.20.0...v1.21.0) (2026-02-04)


### Features

* **chat:** reemplazar alertas nativas por ConfirmDialog customizado en lista de chats ([441094f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/441094fa60ec86d0b7b88764784a49f571dba948))

## [1.20.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.6...v1.20.0) (2026-02-04)


### Features

* interfaz para transferencia de propiedad de grupos y modal de confirmación ([0515de5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0515de5c55b22d22ef5268fdd9fc6aee08d03224))

### [1.19.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.5...v1.19.6) (2026-02-04)


### Bug Fixes

* **chat:** emitir message_read por socket al recibir nuevo mensaje en chat abierto ([1bf3171](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1bf3171cef2337c6963b7ec668e717ce6fea1248))

### [1.19.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.4...v1.19.5) (2026-02-04)

### [1.19.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.3...v1.19.4) (2026-02-04)


### Bug Fixes

* **chat:** agregar logica faltante para emitir evento message_read ([309f123](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/309f123895c95b9323697abe6d67cb8502ca2198))

### [1.19.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.2...v1.19.3) (2026-02-04)

### [1.19.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.1...v1.19.2) (2026-02-04)


### Bug Fixes

* **chat:** reemplazar require() por import en ChatWindow para evitar error de runtime ([318868c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/318868c553d741ac330413c28677392112c37ff7))

### [1.19.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.19.0...v1.19.1) (2026-02-04)


### Bug Fixes

* **chat:** eliminar propiedad duplicada handleEmojiSelect en ChatInput ([0e5ab99](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0e5ab9952758cff9cf56bcf1844d8e38464d77cf))

## [1.19.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.18.0...v1.19.0) (2026-02-04)


### Features

* **chat:** UI para indicador de escritura y ticks de estado de mensaje ([1a0a945](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1a0a945074c04049040f3d3966871c9047a413cd))

## [1.18.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.17.0...v1.18.0) (2026-02-04)


### Features

* **data:** agregar provincias y departamentos para República Dominicana y Uruguay ([42365e1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42365e16133e5ac29f1644aeee63204a9aaff35e))

## [1.17.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.16.0...v1.17.0) (2026-02-03)


### Features

* **fundacion:** mostrar sub-área y programa en lista de solicitudes pendientes ([ec996a7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ec996a7f508ca4d81702b59f29d7b657d01f39dc))

## [1.16.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.15.0...v1.16.0) (2026-02-03)


### Features

* **fundacion:** corregir selección de programas y mostrar detalles en notificaciones ([89d1101](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/89d11018a04e94db7e3872a61ac7854652be6b68))

## [1.15.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.14.0...v1.15.0) (2026-02-03)


### Features

* **notificaciones:** agregar visualización de territorio en solicitudes de fundación ([18097a4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/18097a476110c5f5a80f11e1746036fdc5d9b645))

## [1.14.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.13.1...v1.14.0) (2026-02-03)


### Features

* **auth:** integrate dynamic country and province selection in registration ([7d51908](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7d519086188ff1bc5216e44eb8d223a768d0870e))


### Bug Fixes

* se agregan mas paises a la base de datos ([0e5f4df](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0e5f4df81fe6c8d670d7f8c61a9aa0c5598fde00))

### [1.13.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.13.0...v1.13.1) (2026-02-03)


### Bug Fixes

* **auth:** ajustes y correcciones en formulario de registro ([9e15101](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9e151017863cec2a435f71e7578eb85aef315f15))

## [1.13.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.5...v1.13.0) (2026-02-03)


### Features

* **auth:** add registration fields and fix foundation notifications ([13a3838](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/13a383866cadbf970c6ff1c0463c9c66121da1c5))

### [1.12.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.4...v1.12.5) (2026-02-03)


### Bug Fixes

* **layout:** remove redundant margin-left from main-content to fix spacing gap ([8db70cc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8db70cc4236a27a87231a7714ec330875327723a))

### [1.12.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.3...v1.12.4) (2026-02-03)

### [1.12.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.2...v1.12.3) (2026-01-31)


### Bug Fixes

* permitir visualización de solicitudes a Founder y prevenir crash ([907a84b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/907a84baf4797208f7ebcc558a4a354e22b0eed1))

### [1.12.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.1...v1.12.2) (2026-01-31)


### Bug Fixes

* agregar importación faltante de formatTime en MeetingCard ([46bf07d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/46bf07d0946dbddfa03b91af714aeedec1aac901))

### [1.12.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.12.0...v1.12.1) (2026-01-30)

## [1.12.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.7...v1.12.0) (2026-01-30)


### Features

* **ui:** pulido de interfaz de iglesia, sidebar full-screen y restauración de botón atrás ([ea54059](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ea54059fac91b10b102a8b025af812b539cf765f))

### [1.11.7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.6...v1.11.7) (2026-01-30)

### [1.11.6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.5...v1.11.6) (2026-01-30)


### Bug Fixes

* **chat:** corrección de chat en tiempo real y logs de debug ([3a3e05d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3a3e05dcfe98cc9cb126603ec0759cea94e10a52))

### [1.11.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.4...v1.11.5) (2026-01-30)


### Bug Fixes

* corregir alineación y visualización en historial de salidas ([39ac88e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/39ac88e57c4c6d73cc54b24e812c3ab967df0b6c))

### [1.11.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.3...v1.11.4) (2026-01-30)

### [1.11.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.2...v1.11.3) (2026-01-30)

### [1.11.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.1...v1.11.2) (2026-01-30)

### [1.11.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.11.0...v1.11.1) (2026-01-30)


### Bug Fixes

* **iglesias:** corregir renderizado y alineación en historial salidas ([715f8da](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/715f8da752e6cb10eca5c744e9d08b5ed7807dfc))
* **ui:** aumentar z-index de notificaciones para visibilidad sobre chat ([2315535](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/23155350e60073060efc8c914be0cbf4e1f80606))

## [1.11.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.5...v1.11.0) (2026-01-29)


### Features

* integrar perfil de miembro con query params para navegación sin recarga ([8a1d5a4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8a1d5a46ba27878daf8a3a4f94577a7f3df04721))


### Bug Fixes

* usar navigate en lugar de prop churchId para evitar recarga de página ([715555b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/715555b556a64aff0e4097ddd95911e41f8e7fd0))

### [1.10.5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.4...v1.10.5) (2026-01-29)

### [1.10.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.3...v1.10.4) (2026-01-29)

### [1.10.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.2...v1.10.3) (2026-01-29)


### Bug Fixes

* corregido exitosamente los errores en la sección Historial Salidas. ([b58f57d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b58f57dd7d182647e136522fab60b85cec239f66))

### [1.10.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.1...v1.10.2) (2026-01-29)


### Bug Fixes

* convertir ID de iglesia a string en navegación desde notificaciones ([4e410fb](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4e410fb3ad2f5b247aee2b1d67cd53f91ba8e45b))

### [1.10.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.10.0...v1.10.1) (2026-01-29)


### Bug Fixes

* corregir envío de iglesiaId como [object Object] en solicitudes desde notificaciones ([afb40b9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/afb40b975767c055831a0ad250df9a12c7a5abd5))

## [1.10.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.9.4...v1.10.0) (2026-01-29)


### Features

* agregar 4 columnas para pantallas extra grandes (1280px) ([ddefa5d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ddefa5d18713ec0e555c2819a4a169875ddfdb00))
* limitar visualización a máximo 3 miembros por línea ([4f131de](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4f131de90b18ba4091ae9cddd18c6fcee40d6109))

### [1.9.4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.9.3...v1.9.4) (2026-01-29)


### Bug Fixes

* corregir truncado de emails largos en cards de miembros ([6b0b361](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6b0b3611db77f7daec81bca499c34884423e1ee2))

### [1.9.3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.9.2...v1.9.3) (2026-01-29)


### Bug Fixes

* mejorar visualización de emails largos en cards de miembros ([4cd984e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4cd984e26cdffd43701564c855163b851c0b8fb2))

### [1.9.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.9.1...v1.9.2) (2026-01-29)


### Bug Fixes

* corrección integral de sincronización, dropdowns y notificaciones ([a0dc39e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a0dc39e19440945f11f8bc29e041c70cc508443e))

### [1.9.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.9.0...v1.9.1) (2026-01-28)

## [1.9.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.8.2...v1.9.0) (2026-01-28)


### Features

* **iglesia:** visualización historial salidas y correcciones navegación ([60978a2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/60978a20e1596b28108e402a4086b3427c130b9a))

### [1.8.2](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.8.1...v1.8.2) (2026-01-28)


### Bug Fixes

* **frontend:** corrección de notificaciones 'todos', visualización sidebar y permisos; Se renombra la opción 'Todos los Miembros' a 'Todos' en CreateMeetingModal.; Se corrige la navegación en MemberCards pasando explícitamente el iglesiaId.; Se solucionan permisos y visualización del sidebar en MemberProfilePage.; Se limpian logs y warnings en SeccionAdministrativaMinisterios. ([7036011](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/70360116e287020048eaf8c2f548a96612c75d4b))

### [1.8.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.8.0...v1.8.1) (2026-01-27)


### Bug Fixes

* correcciones en iglesias (navegación, permisos settings, errores solicitudes) ([2530958](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2530958f9f28e5fd8971adb3c05f12630022af58))

## [1.8.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.7.0...v1.8.0) (2026-01-27)


### Features

* Implementar funcionalidad Abandonar Iglesia con endpoint leave, notificación al pastor, vista personalizada para miembros, pestaña Cuenta con Zona de Peligro, soporte para Google Maps, correcciones de navegación y fixes de UI/UX ([4875120](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4875120c450bb74b8a548c32f7a71597c6c9626c))

## [1.7.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.6.1...v1.7.0) (2026-01-27)


### Features

* se corrige visualización de grillas de reuniones y eventos ([b273343](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b273343c017d5a739bf8b213cfbb7737dd426705))

### [1.6.1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.6.0...v1.6.1) (2026-01-27)


### Bug Fixes

* se corrige visualización de grillas de reuniones y eventos ([0faf4c1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0faf4c12eeacde81472a36fc85df0a9688b0bb99))

## [1.6.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.5.0...v1.6.0) (2026-01-27)


### Features

* **multimedia:** navegación en modal y soporte para videos ([c1053b0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c1053b0cf942087caae8ffebfa1af8d5cb1387ee))

## [1.5.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.4.0...v1.5.0) (2026-01-27)


### Features

* notificación por edición de publicación con redirección ([1386b14](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1386b1401ba85c7c3442075c9c400daa3bfcd709))

## [1.4.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.3.0...v1.4.0) (2026-01-26)


### Features

* interfaz de eventos de iglesia, permisos y edicion ([f5edeb4](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f5edeb4283c79b1ac6fa2142e59d684f5e3e5889))

## [1.3.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.2.0...v1.3.0) (2026-01-24)


### Features

* se crea la seccion de comentarios, para visualizar lo que los miembros de la iglesia opinan ([6d76ab0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6d76ab027ce6a730c17aafa64fb537dd2cd97d1d))

## [1.2.0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/compare/v1.1.0...v1.2.0) (2026-01-24)


### Features

* agregar automatización de releases con GitHub Actions ([e96951e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e96951eba6da4d99748fa0c189d72d867b380765))
* **ci:** agregar GitHub Releases automáticos con notas ([3bae604](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3bae604f003d6dc3dc0c4fce715918a55389972b))


### Bug Fixes

* actualización de la sección pastor en configuración de la iglesia ([ee0e7db](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ee0e7dbe5bd0e81f9856ef476fc4a7f0e8bcbb68))
* **ci:** ajustar workflow de release manual y permisos ([ba90836](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ba90836e1fba70ce6c92ee66e22e78d605d53eac))
* **ci:** configurar identidad git para releases automáticos ([6861b4f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6861b4ff3ba724b64ce4750df9a356a68c063c33))

## 1.1.0 (2026-01-24)


### Features

* Agregar borde verde neón cyan a filtros de área y cargo ([41736ee](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/41736eec4b043ac5f8d8e87b1308e62a3905b17b))
* Agregar debug listener para OnlineUsersContext ([4690eff](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4690efffbc92165101103bd31a6a383ee716f272))
* agregar pagina de informacion del usuario con cards profesionales ([59d287a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/59d287a05452aa02fa980684fd66c66e3d427ec1))
* Agregar página de notificaciones del sistema y reporte de perfiles ([ad6df5f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ad6df5f7e47bdda5fb24254981ce2ba598afd90e))
* Corregir display de notificaciones y navegación de grupos ([1817a17](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1817a178f77d1f747d9d5747f0a97dbf6951eb08))
* Crear página de historial de notificaciones ([3d4fbc7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3d4fbc7c603536fa0f810714052b487896bfb43e))
* Dashboard de moderación y UI de reportes mobile-first ([9b73d0c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9b73d0c2400c688405f07d057e8772984584ee68))
* Dashboard de publicidad - Modal de edición de campañas y mejoras UI ([e3ce217](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e3ce21796bf0d87df9154ee3fe392eccb26cf667))
* Header responsivo para Instituciones (Mobile vs Desktop) ([7222c11](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7222c11779713bc3bcacb3c10db1892f422d2138))
* implement asymmetric blocking, simplified badges, fix layout ([18d2f91](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/18d2f91649886c41ed9993e3a25c077c704aff70))
* implement enterprise-grade meeting management system with real-time synchronization ([9beab29](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9beab294cf60f2c49c774254633ea642aa3f26c9))
* Implement reporting system UI (posts, comments, profiles) and fix navigation icons ([3287739](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3287739c8cc869f179c31171e8be589693317ee3))
* implementar copiar enlace de publicacion al portapapeles ([66e141c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/66e141ca9c5cdfac4fe2f417ec9a8f52a9a0e8b0))
* Implementar listener socket para eliminacion de posts en tiempo real ([100e4ec](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/100e4ecc172e4262a3d628c499c75a0903c0665d))
* Implementar Modo Lista real en Tarjetas de Iglesia con botones de acción sincronizados ([d7c6a79](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d7c6a79bf96f2bf818a93c111938e35939004efb))
* implementar panel admin frontend y sistema de tickets ([9ce1c26](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9ce1c263c7b4975e6b1e777d7b6788216104be12))
* implementar sistema de favoritos (frontend) ([ed1aad9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ed1aad96fe25c151e449136988968f7a845a6163))
* implementar sistema de username en frontend ([f25094d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f25094d34dc6f2ba18140320192b16641cbf911b))
* manejo de eventos de eliminacion de notificaciones y validacion null ([cca4925](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cca492515f404a6f6f0dfb1063ca5fdc6e0ba6ec))
* mejorar soporte de archivos en grupos y UI responsive ([4af347b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4af347b2d850286f71e84f44587ee9d2c38f782e))
* mejoras de UI, dark mode, componentes de grupos y reuniones, y correcciones de diseño ([f99f96e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f99f96eb4caed00b4d941b3ac0f9e553866277af))
* mejoras UX guardados, fix renderizado posts y manejo estado ([cbcfa2b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cbcfa2bd9bf4c7fe91e2ee626e3c7db37f508531))
* mejoras visuales en notificaciones de menciones y redireccion a post ([4b9fcb6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4b9fcb6b23b6ea40a398251a36fc2774701ff813))
* mejoras visuales menu posts opciones faltantes ([5333c77](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5333c77edd17407aee53181849ec4d9a188ea9fe))
* menu de opciones completo y dejar de seguir ([58d5825](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/58d5825e343f06ddf2a2a80aba2bdcbd35cb7a1e))
* menu de opciones, guardados y username real ([d488a2f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d488a2fca6b942dec80ab08da1b3d582068c4ca1))
* Mostrar días transcurridos de suspensión y validar fechas ([1d747c5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1d747c58393e2cfe43c117f8fd3fb95275b526e2))
* Rediseñar cards de amigos para móviles pequeños ([5ae1867](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5ae1867f9e6aa8ba489a4167075bc67a7c2faf80))
* Rediseñar cards de cumpleaños para dispositivos pequeños ([6905dbc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6905dbc41728713390fd6e8d4b097d4a1f7aeba2))
* rediseño premium de chat de iglesia para móviles ([d8bd852](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d8bd85261421c1280efb2d22a89e06576531397a))
* reemplazar alert con toast en copiar enlace ([0bf64d3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0bf64d3141e0d3f911490d3ec1e8fd63e8c253ad))
* Sistema de autocompletado de menciones y mejoras en comentarios ([96c1c90](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/96c1c9031370852eb3115cd2090e3f8120335501))
* Sistema de roles y protección de rutas de moderación ([8fc5f0e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8fc5f0efd4098d86453b90b28766d8f6d599f246))
* **ui:** Mejoras generales de UI/UX, correcciones de layout y optimizacion de componentes ([cddbd10](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/cddbd1000a35b1974f21b4101fde8491ae31a34b))
* Unificar diseño visual y corregir padding móvil ([5c1d967](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5c1d9676f768fa0d627ab635fa6810276de4eb8c))
* Unificar headers y optimizar navegación mobile ([3213d76](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3213d762a6e0c844ca1a61919d3b25487853f874)), closes [#059669](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/issues/059669)
* usar nombre usuario en URL y mostrar sin confirmar en info personal ([19b2d16](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/19b2d16dd356f9dcb132d5d2218a62b0250ac1a9))
* Vista de detalle completa y acciones de moderación ([25537a0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/25537a0632a067044c90ab501442c8449970b5f6))


### Bug Fixes

* actualizar visualización de avatar desde R2 - eliminar React.memo y logs de debug ([c433204](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c433204e94ab9488134aaef966f0ecf45f829c86))
* Add 'otro' gender option to campaign modals to match backend enum ([489ecd0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/489ecd09aa4ae32dfa62cce679c335c0c2677b82))
* Agregar exports faltantes en reportService ([c98fbfe](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c98fbfe461f21bd0b33f944a63a718b8d0b960a2))
* agregar fallback para usuarios sin username ([453a2bf](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/453a2bf6b0186adcaef432c90cf83310bb1af2f2))
* Agregar validación para evitar error cuando contenido es null/undefined ([6875373](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/68753730054c5fda4a8500ecfd3dd9daccfc22f2))
* Arreglar formulario de iglesias y botones de solicitudes ([f07538e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/f07538e566e878f020eb28b8146cf89141e95ce7))
* Aumentar breakpoint móvil de 400px a 480px ([1fccced](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1fccced36802dadcf443177e372210bc4b5664ed))
* Aumentar espacio entre navbar y contenido en móviles ([044b933](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/044b933ea229e4e9ebc55ab60400cfbee1925ec3))
* Aumentar espacio entre navbar y contenido en móviles (layout.mobile.css) ([1f90d36](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1f90d3638edf75ed14213dea5a9f7ed2fd35a952))
* Aumentar padding de cards en móviles (layout.mobile.css) ([6ef027a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6ef027a8f4b76f02bf7f761e472153a23151c816))
* Coloreo de menciones en comentarios ahora captura puntos y guiones ([7a7f256](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/7a7f2568196a78f02e107daa243bb8994d293539))
* Convertir MODERATOR_ACTIONS de objeto a array ([b4d1318](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b4d13185832ace79a6a257ac49ecfb026e0a3e48))
* corregimos la informacion oculta de las iglesias que al integrar la galería se habían ocultado las secciones de Descripción, Misión, Visión y Valores. ([d096c1e](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d096c1e834730e2e290ddc8255edcc8369e85b4b))
* corregir desfase de fechas por zona horaria ([3e6b5c0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3e6b5c0abd44506026358fc5d539edbf162ea130))
* Corregir error changePage en AuditLogsPage y mejorar paginación ([b211e5c](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b211e5cf73b685a8998d7510420868e7ee499c9e))
* Corregir estilos del buscador en modo claro - eliminar media queries que causaban conflicto con el tema de la app ([c01ff43](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c01ff43f20cf3f3fbcb5cb3b67b3045f959dc1ef))
* corregir estructura JSX PostOptionsMenu para renderizado correcto ([903b197](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/903b197c90ed3334bd469addaf8773ef8f060e17))
* Corregir layout de cards de cumpleaños para móviles pequeños ([e670818](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e670818efdfdf3b23f85e32b22adf85a547dac5b))
* corregir navegación en vista list de miembros de iglesia - Agregado hook useNavigate faltante en IglesiaMembers.jsx - Corregido error 'navigate is not defined' al hacer click en Ver más desde vista list - Mantenida funcionalidad existente en vista grid ([80feb7a](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/80feb7a813866524f9c681485082a3925bfd54c9))
* corregir navegación y sidebar móvil - Corregida ruta /iglesias a /Mi_iglesia - Sidebar móvil desplegable funcionando ([2516c5f](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2516c5fbf84672d27e3ec31d334cff4931f4e471))
* Corregir paso de ID en handleDeleteUser ([c5f952d](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c5f952d8715802b17d759cfadb914ec048146614))
* Corregir renderizado condicional del menú y modal de reportes ([ba1a9b6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ba1a9b6409b7a4d390388d90157130f597f6d03a))
* corregir URLs de imágenes en GroupMultimedia para soportar R2 ([3dfa221](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3dfa22163cb6e6c66235194d584589c838a3f854))
* Crash al responder comentarios en página de detalle del post ([90be93b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/90be93b5fd43c777c9e98d7ec9ad832bd0196cad))
* Deep linking a comentarios, sincronización de likes y navegación a publicaciones desde notificaciones ([047d9a6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/047d9a67a7a5cfb8d37ff04c0a8c2f46ad0622b0))
* Deshabilitar botones de acción en notificaciones procesadas ([0a57955](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/0a579552fb361171d294b540c7880ec89e93fec7))
* eliminar AlertDialog de confirmacion al guardar posts ([64a48d1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/64a48d17b7b54b2f13e9adf671407fbf2b30e366))
* Eliminar atributo jsx del tag style para resolver warning de React ([5ddac13](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/5ddac134f3022e0043ec1bc28566022a2610e1ce))
* extraer solo fecha sin hora para evitar desfase ([2b3215b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2b3215b03a5e1b7b3936d70376967b4c78157f9b))
* Forzar fondo transparente en input del buscador con !important ([783aca1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/783aca1d07bfd7f27e5335f182e8ba27c3c72d59))
* Forzar layout de 3 columnas en iglesias y arreglar estilo de filtros ([6bf4d25](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6bf4d25730e7bb462e714ebb217d8f47e89573d1))
* Forzar padding 0 en input del buscador para evitar conflicto con regla global ([4e46cbb](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4e46cbb482c22421f91198637e6c517b00d74e9f))
* Habilitar scroll y altura máxima en dropdown de perfil para móviles ([d6db911](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d6db9114a12fa1ab7f12a9ad733e07d494b700b0))
* Importación faltante de icono Building2 en ChurchCard ([fd8b6c8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/fd8b6c8e3aaeb50ea29ae48b463b35e870304e9e))
* Importar iconos faltantes Edit2 y Trash2 ([2ef9b98](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/2ef9b9861e24b56f84f947260225e147d8af10ba))
* likes en comentarios ahora se actualizan en tiempo real ([3c1a5dc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3c1a5dc1aaf00560990f6f48a577204d4d313364))
* Mantener background gris en focus del buscador ([bcd8617](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/bcd8617e2eca4a181bf4363061b76ca08f7c5782))
* Mejorar UX de cards de cumpleaños en móviles pequeños ([ce8f444](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ce8f444a40b86586cd72f39c26d379a92b36c254))
* Mejorar visibilidad texto sidebar y bottom navbar en dark mode + ocultar avatar CreatePost + padding móvil ([c8dc1d3](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c8dc1d3238a0b2e3c1a6eb17e3b1ecd0f262e46c))
* Mejorar visibilidad total del menú móvil en dark mode (texto + hover) ([17a99d9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/17a99d921328c4493af3f8cf0399ec3a043a5e96))
* Mobile layout improvements - navbar relative positioning and background gap fix ([382781b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/382781bc1ad654ff44c2c70ec3696608c1bb6016))
* Mostrar badge online/offline en móviles pequeños ([ae22666](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/ae2266627b7e8289598f0a3e949be3a65a5cdaa8))
* Mover ReportModal fuera del contenedor del menú para evitar conflictos de z-index ([a0657b5](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a0657b564073335eef57a72392eb7b50297e3ee2))
* Ocultar boton de accion en reportes cerrados ([c59d3d1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c59d3d1ea87a0a14d14282b55fe71049873d0f13))
* Ocultar filtros de área y cargo para carpetas no institucionales ([4f86e82](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/4f86e82320fceced5299c9236d2beccafca116d3))
* Prevent state corruption in PostPage when receiving real-time updates from socket ([8e43cc7](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8e43cc7041e3fe5359923d0f3af32cdaacdeaa40))
* Priorizar siempre emisor en notificaciones para corregir visualización después de F5 ([9a5aaab](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/9a5aaab2d7ef744d20cb5620ed28d229b0352fbf))
* Reducir altura del buscador (padding vertical) mantener ancho original ([b6bd555](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b6bd5551b034a6db6f0e2a66f7a20f3696e77c9c))
* Reducir ancho del buscador para un look más sutil ([c0d3d37](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/c0d3d3764dc45eae27156b6c2ec312443a13d46a))
* remove syntax error in FavoriteUserCard ([773b8f0](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/773b8f0d4de1b811a10295eed22e3a632e1a0883))
* Reset automático del contador de mensajes no leídos en lista de chats ([3d383e1](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3d383e13d87e24454de63e9cb6a8b4944e15950d))
* restaurar funcionalidad guardar posts con toast ([8007f80](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/8007f80c251c8778ada824eb91db4538645531bd))
* Sincronizar estado online entre pestañas Amigos y Ubicación ([d0e2763](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/d0e27635fd2a4e949f0023fa735c20f3a34961ae))
* Solucionar error 400 en subida de imágenes y corregir scroll en chat ([a2a6e2b](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/a2a6e2bc4906105e98d098a1bac4ff76378e813b))
* Soporte completo para archivos en chat (office, audio, PDF) y corrección de URLs R2 ([42ec9ce](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/42ec9cec57243a1bc86d016f914a21dbf2aea4f2))
* Truncar texto largo en selects de MisCarpetas para evitar desbordes ([1038eb9](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/1038eb9ce737efe195b5f8953583d11a387237c5))
* UI de Usuarios Suspendidos (Fallbacks de nombre, fecha y avatar) ([34e6fdc](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/34e6fdc0ba07783ee386bf9726fea5909a8e7d07))
* Unificar MisCarpetasPage con page-container y mejorar padding móvil ([e864abb](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/e864abbc78ca76f30f90c80f54894b5823fdb060))
* usar estructura correcta para cumpleanos y ubicacion ([b1972b8](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b1972b8aab1db334e880d02a6a5d88eca03cc008))
* usar getUserById en UserInfoPage ([b364763](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/b364763ade1ef5ecf8e375fd89bf9bf24c4140d2))
* usar userId en URL para cargar informacion correctamente ([3f8ab53](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/3f8ab5302ff85f484afbdfb0f78002d918e2d009))
* Validación defensiva en MentionAutocomplete ([6648fd6](https://github.com/NahuelJimenezdev/DegaderSocialFrontV2/commit/6648fd60de1535739ada3c7118dc89b04cd142b3))
