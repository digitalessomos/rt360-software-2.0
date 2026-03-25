import { BENEFITS_DATA, FAQ_DATA } from "../config/chatbot.config.js";
import { fireRouter } from "../services/firebase.service.js";
import { leadService } from "../services/lead.service.js";

/**
 * ChatbotCore (ES6 Module)
 * Encapsula la lógica de navegación, flujo de conversación y renderizado del asistente.
 */
export class ChatbotCore {
    constructor() {
        this.step = 'HOOK';
        this.data = { context: '', volume: '', specialty: '', nombre: '', local: '', plan: '' };
        this.isOpen = false;
        this.history = [];

        this.container = document.getElementById('chatbot-container');
        this.messagesArea = document.getElementById('chat-messages');
        this.inputArea = document.getElementById('chat-input-area');
        this.triggerBtn = document.getElementById('chat-trigger');

        if (this.container) {
            this.bindEvents();
            this.initFlow();
        }
    }

    startPlanFlow(planName) {
        this.data.plan = planName;
        this.toggle('open');
        this.messagesArea.innerHTML = '';
        this.botSay(`¡Excelente elección! El <span class='text-emerald-400 font-black'>${planName}</span> es un gran paso hacia el control total.`);
        setTimeout(() => {
            this.botSay("Para darte el diagnóstico correcto y avanzar con este plan, ¿cuántos repartidores manejas actualmente?");
            this.step = 'VOLUME';
            this.renderOptions([
                { text: "1 a 3 Repartidores", value: "1-3" },
                { text: "3 a 10 Repartidores", value: "3-10" },
                { text: "+10 Repartidores", value: "+10" }
            ]);
        }, 800);
    }

    bindEvents() {
        if (!this.triggerBtn || !this.container) return;
        this.triggerBtn.onclick = () => this.toggle();
        const closeBtn = this.container.querySelector('button.text-white\\/50');
        if (closeBtn) {
            closeBtn.onclick = () => this.toggle();
        }
    }

    toggle(state) {
        if (!this.container) return;
        this.isOpen = (state === 'open') ? true : (state === 'close') ? false : !this.isOpen;
        this.container.classList.toggle('hidden', !this.isOpen);
        if (this.isOpen) setTimeout(() => this.scrollToBottom(), 100);
    }

    scrollToBottom() {
        if (this.messagesArea) {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }
    }

    initFlow() {
        if (!this.messagesArea) return;
        this.messagesArea.innerHTML = '';
        this.botSay("¡Hola! 👋 Soy el estratega virtual de <span class='text-emerald-400 font-black'>RutaTotal 360</span>.");
        setTimeout(() => {
            this.botSay("Antes de hablar de software, cuéntame: ¿Sientes que tu logística es un caos o solo quieres escalar lo que ya funciona?");
            this.renderOptions([
                { text: "¡Es un caos total!", value: "caos" },
                { text: "Quiero escalar mis ventas.", value: "escalar" },
                { text: "Solo estoy curioseando.", value: "curioso" },
                { text: "¿Dudas?", value: "dudas" },
                { text: "Beneficios", value: "beneficios" }
            ]);
        }, 800);
    }

    botSay(html) {
        this.addMessage(html, 'bot');
        this.history.push({ sender: 'bot', content: html, time: new Date().toISOString() });
    }

    userSay(text) {
        this.addMessage(text, 'user');
        this.history.push({ sender: 'user', content: text, time: new Date().toISOString() });
    }

    addMessage(content, sender) {
        if (!this.messagesArea) return;
        const div = document.createElement('div');
        div.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`;
        const bubble = document.createElement('div');
        bubble.className = sender === 'user'
            ? "bg-emerald-600/20 text-emerald-100 p-3 rounded-2xl rounded-tr-none max-w-[85%] border border-emerald-500/20"
            : "bg-white/5 text-slate-300 p-3 rounded-2xl rounded-tl-none max-w-[85%] border border-white/10";
        bubble.innerHTML = content;
        div.appendChild(bubble);
        this.messagesArea.appendChild(div);
        this.scrollToBottom();
    }

    renderOptions(options) {
        if (!this.inputArea) return;
        this.inputArea.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = "grid grid-cols-1 gap-2 w-full";

        options.forEach(opt => {
            const btn = document.createElement('button');
            
            // Estilo dinámico: Verde para Beneficios/Dudas, Slate para el resto
            const isHighlight = ['beneficios', 'dudas'].includes(opt.value);
            
            if (isHighlight) {
                btn.className = "w-full text-left bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/40 hover:border-emerald-500/70 p-3 rounded-xl text-xs font-bold text-emerald-400 transition-all transform hover:scale-[1.02] active:scale-95";
            } else {
                btn.className = "w-full text-left bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-500/50 p-3 rounded-xl text-xs font-bold text-slate-300 transition-all transform hover:scale-[1.02] active:scale-95";
            }

            btn.innerHTML = opt.text;
            btn.onclick = () => this.handleSelection(opt);
            grid.appendChild(btn);
        });
        this.inputArea.appendChild(grid);
    }

    handleSelection(opt) {
        this.userSay(opt.text);

        if (this.step === 'HOOK') {
            if (opt.value === 'curioso') {
                this.botSay("¡Genial! El que curiosea es porque sabe que siempre hay algo que mejorar. 💡");
                setTimeout(() => {
                    this.botSay("Mira este dato: Los negocios que automatizan su logística antes de que sea un caos, escalan un <b>40% más rápido</b>.  ¿Te gustaría ver un ejemplo real de éxito?");
                    this.renderOptions([
                        { text: "Sí, muéstrame cómo.", value: "si_escalar" },
                        { text: "Solo quiero ver precios.", value: "escalar" }
                    ]);
                }, 800);
            } else if (opt.value === 'beneficios') {
                this.showBenefitsList();
            } else if (opt.value === 'dudas') {
                this.showFaqList();
            } else {
                this.data.context = opt.value;
                this.step = 'VOLUME';
                this.nextStep();
            }
        } else if (this.step === 'BENEFITS' || opt.value === 'see_more_benefits' || opt.value === 'start_diag') {
            if (opt.value === 'back_to_start' || opt.value === 'start_diag') {
                this.step = 'HOOK';
                this.initFlow();
            } else if (opt.value === 'see_more_benefits') {
                this.showBenefitsList();
            } else {
                this.showBenefitDetail(opt.value);
            }
        } else if (this.step === 'FAQ' || opt.value === 'see_more_faqs') {
            if (opt.value === 'back_to_start' || opt.value === 'start_diag') {
                this.step = 'HOOK';
                this.initFlow();
            } else if (opt.value === 'see_more_faqs') {
                this.showFaqList();
            } else {
                this.showFaqDetail(opt.value);
            }
        } else if (this.step === 'VOLUME' || opt.value === 'si_escalar') {
            this.data.volume = opt.value === 'si_escalar' ? '5-10' : opt.value; // Default to medium if re-engaging
            this.step = 'SPECIALTY';
            this.nextStep();
        } else if (this.step === 'SPECIALTY') {
            this.data.specialty = opt.value;
            this.step = 'AHA';
            this.nextStep();
        }
    }

    showBenefitsList() {
        this.step = 'BENEFITS';
        this.botSay("Nuestra solución no es solo software, es paz operativa. Estos son los 5 pilares que transformarán tu local:");
        this.renderOptions([
            { text: "1. Erradicación del Caos del Papel", value: "1" },
            { text: "2. Visibilidad Instantánea 'Glance-First'", value: "2" },
            { text: "3. Asignación Ultra-Veloz", value: "3" },
            { text: "4. Trazabilidad y Verdad Digital", value: "4" },
            { text: "5. Cierres de Turno en 30 Segundos", value: "5" },
            { text: "⬅️ Volver", value: "back_to_start" }
        ]);
    }

    showBenefitDetail(id) {
        const b = BENEFITS_DATA[id];
        if (!b) return;
        this.botSay(`<b>${b.title}</b><br><br>${b.desc}`);

        setTimeout(() => {
            this.renderOptions([
                { text: "Ver otro beneficio", value: "see_more_benefits" },
                { text: "Comenzar diagnóstico", value: "start_diag" }
            ]);
        }, 1000);
    }

    showFaqList() {
        this.step = 'FAQ';
        this.botSay("Entiendo, es normal tener dudas antes de transformar tu local. Aquí tienes las 5 preguntas que más nos hacen los dueños:");
        this.renderOptions([
            { text: "1. ¿Es difícil de usar en hora pico?", value: "faq1" },
            { text: "2. ¿Es un gasto extra?", value: "faq2" },
            { text: "3. ¿Por qué cambiar el papel?", value: "faq3" },
            { text: "4. ¿Por qué no usar WhatsApp?", value: "faq4" },
            { text: "5. ¿Qué instalan los repartidores?", value: "faq5" },
            { text: "⬅️ Volver", value: "back_to_start" }
        ]);
    }

    showFaqDetail(id) {
        const faq = FAQ_DATA[id];
        if (!faq) return;
        this.botSay(`<b>${faq.q}</b><br><br>${faq.a}`);

        setTimeout(() => {
            this.renderOptions([
                { text: "Ver otra duda", value: "see_more_faqs" },
                { text: "Comenzar diagnóstico", value: "start_diag" }
            ]);
        }, 1000);
    }

    nextStep() {
        if (!this.inputArea) return;
        this.inputArea.innerHTML = '<div class="flex justify-center p-2"><i class="fas fa-circle-notch animate-spin text-emerald-500"></i></div>';

        setTimeout(() => {
            if (this.step === 'VOLUME') {
                this.botSay("Entendido. Para darte el diagnóstico correcto, ¿cuántos repartidores manejas actualmente?");
                this.renderOptions([
                    { text: "1 a 3 Repartidores", value: "1-3" },
                    { text: "3 a 10 Repartidores", value: "3-10" },
                    { text: "+10 Repartidores", value: "+10" }
                ]);
            }
            else if (this.step === 'SPECIALTY') {
                this.botSay("Perfecto. Cada cocina es un mundo diferente. ¿Cuál es la especialidad de tu local?");
                this.renderOptions([
                    { text: "<i class='fas fa-pizza-slice mr-2'></i> Pizzería", value: "pizzeria" },
                    { text: "<i class='fas fa-fish mr-2'></i> Sushi", value: "sushi" },
                    { text: "<i class='fas fa-hamburger mr-2'></i> Hamburguesas", value: "burgers" },
                    { text: "<i class='fas fa-utensils mr-2'></i> Restaurante Tradicional", value: "restaurante" }
                ]);
            }
            else if (this.step === 'AHA') {
                this.generateAhaMoment();
            }
        }, 800);
    }

    generateAhaMoment() {
        const { volume, specialty } = this.data;
        let script = "";

        if (specialty === 'pizzeria') {
            if (volume === '1-3') {
                script = "Gestionar repartidores en una pizzería es una pesadilla de tiempos. Una optimización del 15% en tus rutas te ahorraría combustible y evitaría que las pizzas lleguen frías. ¿Quieres ver cómo lo automatizamos?";
            } else {
                script = "En el negocio de la pizza, el tiempo es calidad. Si tus repartidores se pierden o se amontonan, la masa llega fría y el cliente no vuelve. Con tantas unidades, necesitas rutas optimizadas. ¿Listo para que lleguen siempre calientes?";
            }
        } else if (specialty === 'sushi') {
            if (volume === '1-3') {
                script = "En el sushi, 10 minutos de retraso arruinan la experiencia. Con varios repartidores, el dueño suele perder horas coordinando. ¿Qué harías si recuperaras esas horas garantizando frescura?";
            } else {
                script = "El sushi es arte y logística de precisión. Un minuto de más afecta la frescura. Para una operación de muchos repartidores, necesitas trazabilidad total. Evita el '¿donde está mi pedido?'. ¿Te gustaría automatizarlo?";
            }
        } else if (specialty === 'burgers') {
            if (volume === '1-3') {
                script = "Tus 'horas pico' son brutales. Cuando caen 20 pedidos en 10 minutos, el caos del mostrador se traslada a la calle. Necesitas un despacho quirúrgico. ¿Quieres ver cómo despejamos tu mostrador?";
            } else {
                script = "<b>¡El Fin de las Preguntas al Aire!</b> 🛑<br><br>Basta de preguntar: <i>¿Quién se llevó el pedido 45? ¿Hace cuánto salió?</i>. Con nuestra interfaz visual, solo miras la pantalla y ves al repartidor y el tiempo exacto. ¿Listo para la Torre de Control?";
            }
        } else { // Restaurante
            if (volume === '1-3') {
                script = "Gestionar salón y delivery al mismo tiempo es de malabaristas. Vamos a profesionalizar tu logística para que te enfoques en el sabor, no en el mapa. ¿Te enviamos la propuesta?";
            } else {
                script = "<b>Torre de Control Digital</b> 🗼<br><br>En un restaurante con mucho flujo, no se necesita preguntar. Nuestra trazabilidad 360 por colores te permite saber quién tiene cada pedido solo con mirar el monitor. ¿Te gustaría implementarlo?";
            }
        }

        this.botSay(script);

        setTimeout(() => {
            this.botSay("Así se ve tu operación bajo control en <span class='text-emerald-400 font-black'>Monitor de Pedidos</span>. ¿Te lo imaginas en tu local?");
            this.botSay(`<div class="rounded-xl overflow-hidden border border-emerald-500/30 shadow-2xl mt-2">
                <video src="https://rutatotal360.vercel.app/videos/monitor.mov" autoplay loop muted playsinline class="w-full"></video>
            </div>`);

            setTimeout(() => {
                this.botSay("Para enviarte el análisis de costos y la propuesta personalizada, ¿con quién tengo el gusto de hablar?");
                this.step = 'LEAD_NAME';
                this.renderInput("Ingrese su nombre...");
            }, 4000);
        }, 2000);
    }

    renderInput(placeholder) {
        if (!this.inputArea) return;
        this.inputArea.innerHTML = `
            <div class="flex flex-col gap-2 w-full">
                <input type="text" id="bot-input" 
                    class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 text-sm" 
                    placeholder="${placeholder}">
                <button id="bot-send-btn" class="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-xl font-black uppercase tracking-tighter transition-all active:scale-95">Continuar</button>
            </div>
        `;
        const input = document.getElementById('bot-input');
        const btn = document.getElementById('bot-send-btn');

        const submit = () => {
            const val = input.value.trim();
            if (val) this.handleTextInput(val);
        };

        if (btn) btn.onclick = submit;
        if (input) {
            input.onkeypress = (e) => { if (e.key === 'Enter') submit(); };
            setTimeout(() => input.focus(), 200);
        }
    }

    handleTextInput(val) {
        if (this.step === 'LEAD_CONTACT') {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            const isPhone = /^\+?[\d\s-]{6,}$/.test(val);

            if (!isEmail && !isPhone) {
                this.botSay("Ups, parece que faltó un dígito o el formato es inválido. 😅 Necesito tu contacto para enviarte el diagnóstico personalizado.");
                return;
            }
        }

        this.userSay(val);
        if (this.step === 'LEAD_NAME') {
            this.data.nombre = val;
            this.botSay(`Excelente Comandante ${val}. ¿Cómo se llama su Base de Operaciones (Local)?`);
            this.step = 'LEAD_LOCAL';
            this.renderInput("Nombre de su local...");
        } else if (this.step === 'LEAD_LOCAL') {
            this.data.local = val;
            this.botSay("¡Perfecto! Un último detalle: ¿Email o WhatsApp para enviarte el análisis de costos?");
            this.step = 'LEAD_CONTACT';
            this.renderInput("Email o WhatsApp...");
        } else if (this.step === 'LEAD_CONTACT') {
            this.data.contacto = val;
            this.finishFlow();
        }
    }

    finishFlow() {
        this.botSay("<b>¡Análisis completado!</b> 🎯 El sistema está generando tu propuesta estratégica.");

        const planRecomendado = (this.data.volume === '1-3') ? 'Fase 01: Organización' : 'Fase 02: Conectividad';
        this.data.plan = planRecomendado;

        const ctaMap = {
            pizzeria: "Optimizar mis entregas de Pizza",
            sushi: "Garantizar frescura en mis envíos",
            burgers: "Eliminar el caos en mi mostrador",
            restaurante: "Activar mi Torre de Control"
        };
        const ctaText = ctaMap[this.data.specialty] || "Obtener mi Propuesta Personalizada";

		fireRouter.saveChatSession({
			lead: this.data,
			history: this.history
		});

        if (this.inputArea) {
            this.inputArea.innerHTML = `
                <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                    <p class="text-[10px] font-black uppercase text-emerald-400 mb-2">Plan Sugerido</p>
                    <h4 class="text-white font-black mb-4">${planRecomendado}</h4>
                    <button onclick="window.location.reload()" class="text-[9px] text-slate-500 uppercase font-black hover:text-white transition-colors">Iniciar nuevo diagnóstico</button>
                </div>
            `;
        }

        setTimeout(() => {
            const nicho = this.data.specialty === 'pizzeria' ? 'tu Pizzería' :
                this.data.specialty === 'sushi' ? 'tu Sushi' :
                    this.data.specialty === 'burgers' ? 'tus Hamburguesas' : 'tu Restaurante';

            this.botSay(`Mira cómo transformamos el caos en <span class='text-emerald-400 font-black'>${nicho}</span> en 45 segundos.`);

            setTimeout(() => {
                this.botSay(`<button onclick="openVideoModal()" class="w-full bg-white/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-center font-black uppercase tracking-tight text-xs mt-2 flex items-center justify-center gap-2">
                    <i class="fas fa-play-circle"></i> Ver los 3 Mandamientos
                </button>`);
            }, 1000);
        }, 1500);


        setTimeout(() => {
            const msg = `[ALTA PRIORIDAD] Soy ${this.data.nombre} de ${this.data.local} (${this.data.specialty}). Solicito presupuesto para ${this.data.volume} repartidores.`;
            const encoded = encodeURIComponent(msg);
            const waLink = `https://wa.me/5491159665917?text=${encoded}`;

            this.botSay(`<a href="${waLink}" target="_blank" class="block w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl text-center font-black uppercase tracking-tight text-xs mt-4 animate-bounce">${ctaText}</a>`);
        }, 4000);
    }
}
