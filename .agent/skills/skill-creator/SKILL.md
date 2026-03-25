---
name: Creador de Habilidades (Skill Creator)
description: Habilidad especializada en asistir al usuario en la creación, estructuración y documentación de nuevas habilidades para Antigravity.
---

# 🛠 Habilidad: Creador de Habilidades

Esta habilidad te asiste en la creación de nuevas capacidades modulares ("skills") para tu espacio de trabajo de Antigravity. Sigue estas instrucciones para generar habilidades consistentes y útiles.

## 📋 Estructura de una Habilidad

Cada habilidad debe residir en su propia carpeta dentro de `.agent/skills/` y seguir esta estructura:

- `.agent/skills/<nombre-de-la-habilidad>/`
  - `SKILL.md` (Obligatorio): Instrucciones principales con frontmatter YAML.
  - `scripts/`: Scripts de apoyo (Bash, Python, JS).
  - `examples/`: Ejemplos de uso o archivos de referencia.
  - `resources/`: Activos adicionales, plantillas o datos.

## 🚀 Cómo crear una nueva habilidad

1. **Definir el propósito:** ¿Qué tarea compleja automatizará esta habilidad?
2. **Crear el directorio:** `mkdir -p .agent/skills/<nombre-habilidad>`
3. **Escribir el SKILL.md:**
   - Debe incluir el frontmatter con `name` y `description`.
   - Las instrucciones deben ser claras, paso a paso y definir cuándo el agente debe recurrir a esta habilidad.
4. **Agregar scripts y ejemplos:** Si la habilidad requiere comandos complejos, colócalos en `scripts/`.

## 💡 Mejores Prácticas
- **Modularidad:** Diseña habilidades para tareas específicas (ej. "Validador de Accesibilidad", "Generador de Tests").
- **Claridad:** Usa encabezados de Markdown y bloques de código para ejemplos.
- **Detección Activa:** La descripción en el YAML ayuda al agente a saber cuándo esta habilidad es relevante para la petición del usuario.

---
*Usa esta habilidad siempre que desees expandir mis capacidades de forma estructurada.*
