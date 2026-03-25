// Global App State
window.AppState = {
    data: {
        orders: {},
        staff: [],
        currentUser: { email: 'demo@admin.com', isAnonymous: false },
        userRole: 'admin'
    },
    update(key, payload) {
        this.data[key] = payload;
        uiManager.renderApp(this.data, handlers);
    }
};

// Handlers for UI actions
const handlers = {
    onCreateOrder: (id, rep) => databaseService.createOrder(id, rep).then(() => uiManager.playSound(rep ? "G4" : "E4")),
    onAssignOrder: (id, rep) => databaseService.assignOrder(id, rep).then(() => uiManager.playSound("G4")),
    onFinalizeOrder: (id) => databaseService.finalizeOrder(id).then(() => uiManager.playSound("C5")),
    onDeleteOrder: (id) => {
        const orderData = window.AppState.data.orders[id];
        return databaseService.deleteOrder(id, orderData).then(() => uiManager.playSound("A2"));
    },
    onRespondIncident: (id, text) => databaseService.respondToIncident(id, text).then(() => uiManager.playSound("D4")),
    onUpdateStaff: (list) => {
        return databaseService.updateStaff(list);
    },
    onSignOut: () => {
        localStorage.clear();
        window.location.reload();
    }
};

// Initialize Application
const init = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Auto login as admin for demo
    window.AppState.data.userRole = 'admin';
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = `ADMINISTRADOR • MODO DEMO`;
    }

    applyRoleRestrictions('admin');

    // Subscribe to real-time data
    databaseService.subscribeToOrders((orders) => window.AppState.update('orders', orders));
    databaseService.subscribeToStaff((staff) => window.AppState.update('staff', staff));

    // Intervalo para actualizar temporizadores visuales de repartidores
    setInterval(() => {
        if (window.AppState.data.orders && window.AppState.data.staff) {
            uiManager.updateDeliveryTimers(window.AppState.data.orders, window.AppState.data.staff);
        }
    }, 30000);

    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    }
    
    // Auto activate terminal demo (simulate user clicking the terminal logic)
    setTimeout(() => {
        const btn = document.getElementById('start-demo-btn');
        if (btn) btn.click();
    }, 800);
};

function applyRoleRestrictions(role) {
    const isOperativo = role === 'operativo';
    
    const adminOnlyElements = [
        'download-pdf-btn',
        'clear-history-btn',
        'new-staff-name',
        'add-staff-btn'
    ];
    
    adminOnlyElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isOperativo ? 'none' : 'block';
    });

    ['open-staff-modal-btn', 'open-history-modal-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
    });
}

// Event Listeners and Global Setup
window.onload = () => {
    init();

    // UI Event Listeners
    document.getElementById('prev-btn').onclick = () => uiManager.slideNumbers(-1, window.AppState.data);
    document.getElementById('next-btn').onclick = () => uiManager.slideNumbers(1, window.AppState.data);

    document.getElementById('history-search').oninput = (e) => {
        uiManager.setSearchQuery(e.target.value);
        uiManager.renderApp(window.AppState.data, handlers);
    };

    document.getElementById('theme-toggle').onclick = () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode', !document.body.classList.contains('light-mode'));
        document.getElementById('theme-text').textContent = document.body.classList.contains('light-mode') ? 'MODO OSCURO' : 'MODO CLARO';
    };

    document.getElementById('start-demo-btn').onclick = () => {
        const opsPanel = document.getElementById('ops-panel');
        const kanban = document.getElementById('kanban-container');
        const btn = document.getElementById('start-demo-btn');
        
        const isHidden = opsPanel.classList.contains('hidden');
        
        if (isHidden) {
            opsPanel.classList.remove('hidden');
            kanban.classList.remove('hidden');
            btn.innerHTML = '<i class="fas fa-power-off"></i>';
            btn.classList.add('bg-red-600', 'hover:bg-red-500');
            btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
            uiManager.renderApp(window.AppState.data, handlers);
        } else {
            opsPanel.classList.add('hidden');
            kanban.classList.add('hidden');
            btn.innerHTML = '<i class="fas fa-terminal"></i>';
            btn.classList.remove('bg-red-600', 'hover:bg-red-500');
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
        }
    };

    // Modal Listeners
    const togModal = (id, show) => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = show ? 'flex' : 'none';
    };

    const sideMenu = document.getElementById('side-menu');
    const sideOverlay = document.getElementById('side-menu-overlay');

    const togSideMenu = (show) => {
        if (!sideMenu || !sideOverlay) return;
        if (show) {
            sideOverlay.classList.remove('hidden');
            setTimeout(() => {
                sideOverlay.style.opacity = '1';
                sideMenu.classList.remove('translate-x-full');
            }, 10);
        } else {
            sideOverlay.style.opacity = '0';
            sideMenu.classList.add('translate-x-full');
            setTimeout(() => {
                sideOverlay.classList.add('hidden');
            }, 300);
        }
    };

    document.getElementById('burger-menu-btn').onclick = () => togSideMenu(true);
    document.getElementById('close-side-menu').onclick = () => togSideMenu(false);
    sideOverlay.onclick = () => togSideMenu(false);

    sideMenu.querySelectorAll('button').forEach(btn => {
        const oldClick = btn.onclick;
        btn.onclick = (e) => {
            if (oldClick) oldClick(e);
            if (btn.id !== 'logoutBtn') togSideMenu(false);
        };
    });

    document.getElementById('open-staff-modal-btn').onclick = () => {
        uiManager.renderStaffListModal(window.AppState.data.staff, handlers.onUpdateStaff, window.AppState.data.userRole);
        togModal('staffModal', true);
    };
    document.getElementById('close-staff-modal-btn').onclick = () => togModal('staffModal', false);

    document.getElementById('open-history-modal-btn').onclick = () => {
        togModal('historyModal', true);
        uiManager.renderApp(window.AppState.data, handlers);
    };
    document.getElementById('close-history-modal-btn').onclick = () => togModal('historyModal', false);

    document.getElementById('add-staff-btn').onclick = () => {
        const v = document.getElementById('new-staff-name').value.trim();
        const cur = window.AppState.data.staff;
        if (v && !cur.includes(v)) {
            handlers.onUpdateStaff([...cur, v]);
            document.getElementById('new-staff-name').value = '';
            togModal('staffModal', false);
        }
    };
    
    document.getElementById('open-archive-modal-btn').onclick = async () => {
        alert("El Archivo Histórico no está disponible en la versión Demo (solo Cloud).");
    };

    document.getElementById('close-archive-modal-btn').onclick = () => {
        togModal('archiveModal', false);
    };

    document.getElementById('clear-history-btn').onclick = async () => {
        if (confirm("¿Limpiar todo el monitor? (Se borrarán los datos de la Demo local)")) {
            try {
                await databaseService.archiveAndClearAllOrders(window.AppState.data.orders);
                uiManager.playSound("A2");
                alert("Operación completada: Monitor limpio.");
            } catch (error) {
                alert("Error al limpiar.");
            }
        }
    };

    document.getElementById('download-pdf-btn').onclick = () => {
        uiManager.generatePDFReport(window.AppState.data.orders, window.AppState.data.staff);
    };

    document.getElementById('logoutBtn').onclick = () => {
        if (confirm("¿Deseas reiniciar la Demo y vaciar el historial local?")) {
            handlers.onSignOut();
        }
    };
};
