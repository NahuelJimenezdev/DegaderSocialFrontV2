# Reglas de Desarrollo - DegaderSocialFrontV2

## ⚠️ REGLAS CRÍTICAS DE CSS

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
