import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from "../config/firebase.config.js";

/**
 * Servicio encargado de la comunicación con Firebase para leads y sesiones de chat.
 */
export class FireRouter {
    constructor() {
        this.db = db;
        this.initialized = !!db;
        if (this.initialized) {
            console.log("🔥 [Chatbot Service] Firebase Conectado");
        } else {
            console.error("❌ [Chatbot Service] Error: Firebase no inicializado");
        }
    }

    async saveLead(data) {
        if (!this.initialized) return { error: "Offline Mode" };
        try {
            const docRef = await addDoc(collection(this.db, "leads_inbox"), {
                ...data,
                timestamp: serverTimestamp(),
                source: 'landing_planes',
                status: 'new'
            });
            console.log("Packet sent with ID: ", docRef.id);
            return { success: true, id: docRef.id };
        } catch (e) {
            console.error("Error sending packet:", e);
            return { error: e.message };
        }
    }

    async saveChatSession(sessionData) {
        if (!this.initialized) return;
        try {
            await addDoc(collection(this.db, "chat_sessions"), {
                ...sessionData,
                startedAt: serverTimestamp()
            });
        } catch (e) { 
            console.error("Chat log error:", e); 
        }
    }
}

export const fireRouter = new FireRouter();
