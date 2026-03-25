---
description: Proceso Maestro de Generación y Despliegue de Pitches RT360
---

Este workflow describe el proceso optimizado para generar mensajes de ventas de alta conversión utilizando la inteligencia del Agente y la interfaz Pitch Master Pro.

### 📋 Requisitos Previos
- Tener abierto el archivo [pitch-master.html](file:///c:/Users/Noxie/Documents/MDP__LANDING/LANDING__Antigravity/pitch-master.html).
- Tener acceso a la lista de prospectos en formato .txt.

### 🚀 Pasos del Flujo de Trabajo

1. **Configuración de Estrategia**
   - En `pitch-master.html`, selecciona el **Nicho** del prospecto (Burger, Sushi, Pizza, Resto).
   - Elige una **Tonalidad** (Velocidad, Seguridad o Autoridad).
   - Selecciona los **3 Mandamientos** que más resuenen con el dolor detectado en el prospecto.

2.  **Generación del Master Prompt**
    - Haz clic en el botón **"⚡ GENERAR Y COPIAR MASTER PROMPT"**.
    - El sistema copiará automáticamente las instrucciones estructuradas para el Agente.

3.  **Intervención del Agente (Cerebro RT360)**
    - Pega el prompt copiado en el chat de **Antigravity**.
    - El Agente procesará el pedido usando su skill `Generador_Pitch_RT360` y te devolverá el pitch final refinado.
    - Copia el resultado final entregado por el Agente.

4.  **Validación y Previsualización**
    - Regresa a `pitch-master.html` y pega el resultado en el cuadro verde: **"PEGA AQUÍ EL RESULTADO DEL AGENTE"**.
    - Haz clic en **"👁️ PREVISUALIZAR"** para ver cómo quedó el mensaje transformado.

5.  **Despliegue al Bot**
    - Una vez validado, haz clic en **"🤖 DESPLEGAR AL BOT COMANDANTE"**.
    - Se guardará en `localStorage` y estarás listo para disparar desde `outreach-bot.html`.

---
> [!TIP]
> Si el pitch generado por el Agente no te convence del todo, puedes pedirle un ajuste específico en el chat antes de pegarlo en la web.
