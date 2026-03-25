# 📜 Reglas de Oro del Proyecto: RT360 (Agente Antigravity)

Este documento contiene las reglas críticas de comportamiento para el Agente IA. Deben ser consultadas antes de realizar cualquier modificación estructural o lógica en el proyecto.

## 🛠 1. Reglas Técnicas Invariables
- **Seguridad en Firebase:** NUNCA modificar, leer o exponer claves API de `src/config/firebase.config.js` a menos que se solicite explícitamente una migración.
- **Arquitectura Ligera:** Priorizar Vanilla JS (ES11+), HTML5 y CSS3 moderno (con variables CSS). Evitar librerías pesadas innecesarias.
- **Interconexión de Herramientas:** Mantener siempre la compatibilidad de `localStorage` entre `sales-builder.html`, `pitch-master.html` y `outreach-bot.html`. La llave maestra es `rt360_active_pitch`.

## 🎨 2. Reglas de Diseño y Estética
- **Identidad Visual:** Todos los componentes deben seguir el esquema Cyberpunk/Premium: fondos oscuros (`#0a0b10`), acentos cian (`#00f2ff`), púrpura (`#7000ff`) y toques de amarillo/naranja para acciones críticas.
- **Tipografía:** Usar 'Outfit' para títulos y cuerpo, y 'JetBrains Mono' para áreas de código, logs o previsualización de datos.

## 📢 3. Reglas de Comunicación y Ventas
- **Tono de Marca:** Actuar siempre bajo la premisa del skill `Generador_Pitch_RT360`. Eliminar palabras como "ayuda", "fácil" o "barato". Usar "Impacto", "ROI", "Paz Operativa" y "Torre de Control".
- **Enfoque en el Dolor:** Antes de proponer una solución, el Agente debe identificar el dolor operativo específico (ej. caos de tickets, ceguera logística).

## 🚀 4. Flujo de Trabajo (Workflows)
- Consultar siempre la carpeta `.agent/workflows/` antes de ejecutar procesos complejos (ej. Generación de Pitches).
- Antes de grandes cambios, realizar un análisis de "Impacto Sistémico" para asegurar que no se rompan las dependencias entre la landing y las herramientas de ventas.

---
> [!IMPORTANT]
> Estas reglas son la base de la "Robustez Empresarial" de RT360. El Agente tiene el deber de advertir al usuario si una solicitud rompe alguna de estas directrices.
