/* src/services/database.demo.service.js */

const STORAGE_KEYS = {
    ORDERS: 'rutatotal_demo_orders',
    STAFF: 'rutatotal_demo_staff',
    ARCHIVE: 'rutatotal_demo_archive'
};

const getLocalData = (key, defaultVal) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
};

const setLocalData = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
    notifyListeners(key);
};

const listeners = {
    [STORAGE_KEYS.ORDERS]: [],
    [STORAGE_KEYS.STAFF]: []
};

const notifyListeners = (key) => {
    const data = getLocalData(key, key === STORAGE_KEYS.ORDERS ? {} : []);
    listeners[key].forEach(callback => callback(data));
};

const databaseService = {
    subscribeToOrders(callback) {
        listeners[STORAGE_KEYS.ORDERS].push(callback);
        callback(getLocalData(STORAGE_KEYS.ORDERS, {}));
        return () => {
            listeners[STORAGE_KEYS.ORDERS] = listeners[STORAGE_KEYS.ORDERS].filter(c => c !== callback);
        };
    },

    subscribeToStaff(callback) {
        listeners[STORAGE_KEYS.STAFF].push(callback);
        const currentStaff = getLocalData(STORAGE_KEYS.STAFF, null);
        if (!currentStaff) {
             const defaultStaff = ['Carlos M.', 'Ana R.', 'Mateo G.'];
             setLocalData(STORAGE_KEYS.STAFF, defaultStaff);
             // callback will be called by notifyListeners
        } else {
             callback(currentStaff);
        }
        return () => {
             listeners[STORAGE_KEYS.STAFF] = listeners[STORAGE_KEYS.STAFF].filter(c => c !== callback);
        };
    },

    async createOrder(id, repartidor = null) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        orders[id] = {
            id: parseInt(id),
            repartidor: repartidor || null,
            status: repartidor ? 'en ruta' : 'nuevo',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            serverTime: { seconds: Math.floor(Date.now() / 1000) }
        };
        setLocalData(STORAGE_KEYS.ORDERS, orders);
    },

    async assignOrder(id, repartidor) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        if (orders[id]) {
            orders[id].repartidor = repartidor || null;
            orders[id].status = repartidor ? 'en ruta' : 'nuevo';
            orders[id].timestamp = Date.now();
            setLocalData(STORAGE_KEYS.ORDERS, orders);
        }
    },

    async reportIncident(id, text) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        if (orders[id]) {
            orders[id].incident = text;
            orders[id].incidentTime = Date.now();
            orders[id].response = null;
            setLocalData(STORAGE_KEYS.ORDERS, orders);
        }
    },

    async respondToIncident(id, text) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        if (orders[id]) {
            orders[id].response = text;
            orders[id].responseTime = Date.now();
            setLocalData(STORAGE_KEYS.ORDERS, orders);
        }
    },

    async finalizeOrder(id) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        if (orders[id]) {
            orders[id].status = 'entregado';
            orders[id].timestamp = Date.now();
            orders[id].deliveredAt = { seconds: Math.floor(Date.now() / 1000) };
            setLocalData(STORAGE_KEYS.ORDERS, orders);
        }
    },

    async deleteOrder(id, orderData) {
        const orders = getLocalData(STORAGE_KEYS.ORDERS, {});
        if (orders[id]) {
            delete orders[id];
            setLocalData(STORAGE_KEYS.ORDERS, orders);
        }
    },

    async updateStaff(newList) {
        setLocalData(STORAGE_KEYS.STAFF, newList);
    },

    async archiveAndClearAllOrders(ordersToArchive) {
        setLocalData(STORAGE_KEYS.ORDERS, {});
        console.log("Modo Fantasma DEMO: pedidos limpios.");
    },

    async getArchivedMonths() {
        return [];
    },

    async getArchivedSessions(monthId) {
        return [];
    },

    async getArchivedOrders(monthId, sessionId) {
        return {};
    }
};
