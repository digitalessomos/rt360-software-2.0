# 🛰️ Guía de Clonado — RutaTotal 360 Sales Suite

> **Para Antigravity:** Esta guía contiene todo lo necesario para clonar este proyecto y conectarlo a una nueva base de datos Firebase sin errores. Seguí los pasos en orden.

---

## 📁 Estructura del Proyecto

```
rutatotalSoftware-main/
├── index.html                   ← Landing page (Firebase inline script al final)
├── admin.html                   ← Torre de Control (Firebase Auth + Firestore)
├── sales-hub.html               ← Dashboard SPA principal (sin Firebase directo)
├── sales-builder.html           ← Herramienta de propuestas
├── pitch-master.html            ← Generador de pitches
├── outreach-kanban.html         ← Kanban de seguimiento
├── outreach-bot.html            ← Bot de prospección
├── paquetes/
│   └── planes.html              ← Página de planes (usa firebase.service.js)
└── src/
    ├── config/
    │   ├── firebase.config.js   ← ⭐ ARCHIVO CENTRAL DE CONEXIÓN
    │   ├── chatbot.config.js    ← Datos estáticos del chatbot (NO toca Firebase)
    │   └── plans.js             ← Datos de planes (sin Firebase)
    └── services/
        ├── firebase.service.js  ← Guarda leads en leads_inbox
        ├── lead.service.js      ← CRUD leads + chat_sessions (usa firebase.config.js)
        └── ChatbotCore.js       ← Lógica del chatbot
```

---

## 🔥 Colecciones Requeridas en Firestore

Crear las siguientes colecciones en la **nueva base de datos**:

| Colección | Descripción | Quién escribe |
|---|---|---|
| `leads_inbox` | Leads del formulario landing y click WhatsApp | `index.html`, `firebase.service.js`, `lead.service.js` |
| `chat_sessions` | Sesiones del chatbot del landing | `lead.service.js` → `saveChatSession()` |

### Estructura de documento `leads_inbox`
```json
{
  "nombre": "string",
  "local": "string",
  "flota": "string",
  "volume": "string",
  "specialty": "string",
  "contacto": "string",
  "plan": "string",
  "source": "chatbot_planes | landing_planes | whatsapp_click | ...",
  "status": "new | contacted | audit | closed",
  "timestamp": "Firestore serverTimestamp"
}
```

### Estructura de documento `chat_sessions`
```json
{
  "startedAt": "Firestore serverTimestamp",
  "...sessionData": "campos varios del chatbot"
}
```

---

## 🔧 PASO 1 — Crear el Proyecto Firebase Nuevo

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Crear proyecto nuevo
3. Habilitar **Firestore Database** (modo producción o prueba)
4. Habilitar **Authentication** → Email/Password
5. Crear un usuario admin: `Authentication > Users > Add user`
6. Copiar las **credenciales del SDK Web** desde `Project Settings > General > Your apps`

---

## 🔧 PASO 2 — Actualizar `src/config/firebase.config.js`

Este es el **único archivo central** que la mayoría de los servicios importan.

```js
// src/config/firebase.config.js
const firebaseConfig = {
    apiKey: "TU_NUEVA_API_KEY",
    authDomain: "TU_NUEVO_PROJECT_ID.firebaseapp.com",
    projectId: "TU_NUEVO_PROJECT_ID",
    storageBucket: "TU_NUEVO_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "TU_NUEVO_MESSAGING_SENDER_ID",
    appId: "TU_NUEVO_APP_ID",
    measurementId: "TU_NUEVO_MEASUREMENT_ID"
};
```

---

## ⚠️ PASO 3 — Actualizar `index.html` (Config Inline)

`index.html` tiene su **propia config de Firebase inline** al final del archivo (aprox. línea 1367). Es independiente de `firebase.config.js`.

Buscar el bloque:
```js
// --- FIREBASE TRACKING CONFIG ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
...
const firebaseConfig = {
    apiKey: "AIzaSyAcAUgiW9LX_lmqZ6sY7z6pesz0wZVBXfI",  ← CAMBIAR
    authDomain: "fase1y2-rutatotal360.firebaseapp.com",    ← CAMBIAR
    projectId: "fase1y2-rutatotal360",                     ← CAMBIAR
    storageBucket: "...",                                   ← CAMBIAR
    messagingSenderId: "...",                               ← CAMBIAR
    appId: "..."                                            ← CAMBIAR
};
```

Reemplazar con las nuevas credenciales.

> **Nota:** Este bloque solo guarda leads de click de WhatsApp (`leads_inbox`) y no usa Firebase Auth.

---

## 🔧 PASO 4 — Configurar Reglas de Firestore

En Firebase Console → `Firestore > Rules`:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // leads_inbox: escritura pública (landing/chatbot), lectura solo autenticados
    match /leads_inbox/{doc} {
      allow read, update: if request.auth != null;
      allow create: if true;
    }
    // chat_sessions: escritura pública, lectura solo autenticados
    match /chat_sessions/{doc} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

---

## 🔧 PASO 5 — Verificar PIN del Chatbot (Si Aplica)

Si el chatbot usa un sistema de PIN almacenado en Firestore, verificar que el nuevo proyecto tenga el documento correspondiente. Buscar referencias a colecciones de PIN en `ChatbotCore.js`.

---

## ✅ Checklist Final

- [ ] Nuevo proyecto Firebase creado
- [ ] Firestore habilitado con colecciones `leads_inbox` y `chat_sessions`
- [ ] Authentication habilitado con usuario admin creado
- [ ] `src/config/firebase.config.js` actualizado con nuevas credenciales
- [ ] `index.html` (script inline ~línea 1367) actualizado con nuevas credenciales
- [ ] Reglas de Firestore configuradas
- [ ] Probar login en `admin.html` con el nuevo usuario
- [ ] Probar formulario de contacto en `index.html` (debe crear doc en `leads_inbox`)
- [ ] Probar que el chatbot guarda sesiones en `chat_sessions`

---

## 🗂️ Archivos SIN Firebase (No requieren cambios al clonar)

- `sales-hub.html` — Solo carga los otros HTML en iframe
- `sales-builder.html` — Herramienta local, sin DB
- `pitch-master.html` — Herramienta local, sin DB
- `outreach-kanban.html` — Kanban local, sin DB
- `outreach-bot.html` — Bot local, sin DB
- `src/config/chatbot.config.js` — Datos estáticos
- `src/config/plans.js` — Datos estáticos

---

*Guía generada por Antigravity · RT360 Sales Suite · Última actualización: 2026-03-24*
