# Reglas de Desarrollo - DegaderSocialFrontV2

## ⚠️ REGLAS CRÍTICAS DE CSS

### 📂 ESTRUCTURA DE CARPETAS OBLIGATORIA
Cada "feature" o módulo principal debe tener su propia carpeta de estilos para mantener el código ordenado.

**Estructura Correcta:**
`src/features/[NombreFeature]/styles/`

**Ejemplo:**
- ✅ `src/features/amigos/styles/amigos.css`
- ✅ `src/features/chat/styles/chat.mobile.css`

**Reglas:**
1. La carpeta SIEMPRE se debe llamar `styles` (en minúscula).
2. **NUNCA** dejar archivos CSS sueltos en la raíz del feature.
3. Si extraes estilos de `index.global.css`, deben ir a esta carpeta específica del componente.

---

### ❌ NO MODIFICAR `index.global.css`

**NUNCA editar directamente `src/shared/styles/index.global.css`**

Este archivo solo debe usarse como **REFERENCIA** para ver cómo debe quedar el código en otros archivos CSS.

**Proceso correcto:**
1. Ver `index.global.css` para entender el estilo
2. Aplicar ese mismo código en el archivo CSS correspondiente:
   - `index.css` - Para estilos globales y variables
   - `layout.mobile.css` - Para estilos mobile
   - Otros archivos específicos según corresponda

**Razón:**
`index.global.css` es un archivo de configuración base que no debe modificarse directamente para evitar conflictos y mantener la arquitectura del proyecto.

---

## 📝 Otras Reglas Importantes

### Page Containers
- Usar la clase `.page-container` en componentes principales
- No usar divs con clases inline de Tailwind que sobrescriban el contenedor

### Modo Oscuro
- Siempre probar cambios en modo claro y oscuro
- Usar variables CSS en lugar de colores hardcodeados

### Mobile First
- Verificar responsive en todas las modificaciones
- Breakpoint principal: 768px

---

**Última actualización:** 2025-12-27
