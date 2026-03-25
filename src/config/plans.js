/**
 * @typedef {Object} PlanConfig
 * @property {string} id - Identificador único del plan.
 * @property {string} fase - Nombre de la fase operativa.
 * @property {string} titulo - Título comercial del plan.
 * @property {string} subtitulo - Beneficio emocional principal.
 * @property {string} descripcion - Descripción detallada orientada a ventas.
 * @property {number|string} precioInstalacion - Costo fijo inicial.
 * @property {number|string} precioMensual - Tarifa de suscripción mensual.
 * @property {boolean} popular - Indica si es el plan recomendado.
 * @property {string} cta - Texto del botón de llamado a la acción.
 * @property {string[]} caracteristicas - Lista de funcionalidades incluidas.
 */

/** @type {PlanConfig[]} */
export const PLANES_CONFIG = [
    {
        id: "fase-1",
        fase: "Fase 01",
        titulo: "Mostrador Digital",
        subtitulo: "Elimina el caos de las comandas",
        descripcion: "Recupera el silencio en el mostrador eliminando el papel, la lapicera y los gritos en la cocina.",
        precioInstalacion: 150,
        precioMensual: 25,
        popular: false,
        cta: "Recuperar el Control",
        caracteristicas: [
            "Dashboard Proactivo (Glance-First)",
            "Interacción Táctil Drag-and-Drop",
            "Logística Visual por Colores de contraste",
            "Gestión de 3 Estados Operativos",
            "Feedback Auditivo",
            "Buscador Mega-Rápido de IDs",
            "Bloqueo de Errores y Duplicados",
            "Centro de Reportes Avanzado",
            "Historial de Auditoría Permanente"
        ],
        promo: {
            activa: true,
            texto: "Beneficio Comandante",
            descuentoPorcentaje: 50,
            cuposTotales: 3,
            cuposDisponibles: 2
        }
    },
    {
        id: "fase-2",
        fase: "Fase 02",
        titulo: "Multi-Pantalla",
        subtitulo: "Vigila tu operación, desde donde estés",
        descripcion: "Transforma tu negocio en una Torre de Control con seguimiento en tiempo real.",
        precioInstalacion: 350,
        precioMensual: 60,
        popular: true,
        cta: "Escalar mi Negocio",
        caracteristicas: [
            "Todo lo incluido en Fase 01",
            "Acceso Multi-Pantalla simultáneo",
            "Infraestructura Google (Acceso Remoto Seguro)",
            "Control de Efectivo Blindado (Anti-Robo)",
            "Optimización de Medios (Firebase Storage)",
            "Acceso a Reportes Historicos"
        ],
        promo: {
            activa: true,
            texto: "Beneficio Comandante",
            descuentoPorcentaje: 50,
            cuposTotales: 3,
            cuposDisponibles: 1
        }
    },
    {
        id: "fase-3",
        fase: "Fase 03",
        titulo: "Despacho Ultrasónico",
        subtitulo: "Garantía de Entrega Sin Fricción",
        descripcion: "Resuelve cada contratiempo en menos de 3 segundos. Aquí muere WhatsApp.",
        precioInstalacion: 900,
        precioMensual: 180,
        popular: false,
        cta: "Solicitar Auditoría VIP",
        caracteristicas: [
            "Todo lo incluido en Fase 02",
            "Delivery App Premium (Logística de Última Milla)",
            "Comunicación Local-Delivery (Pasa de minutos a segundos)",
            //"Trazabilidad absoluta en la calle",
            "Sistema de Multi-Atención Inteligente",
            "Protocolo de Acción Directa: Cero-Ruido",
            "Alertas Hápticas Torre de Control",
            "Backup Local redundante"
        ],
        promo: {
            activa: true,
            texto: "Acceso Elite",
            descuentoPorcentaje: 30,
            cuposTotales: 2,
            cuposDisponibles: 1
        }
    }
];
