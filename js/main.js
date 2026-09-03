/**
 * ============================================================
 * KRONOS 360 - Main
 * Event listeners, inicialización y lógica principal
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 KRONOS 360 v1.0.0');
    console.log('🔑 Sellado con KRONOS-MD-33-467162326');

    // ============================================================
    // 1. BOTÓN DE AUDITORÍA (FOLIO)
    // ============================================================
    const btnAuditar = document.getElementById('btn-auditar');
    if (btnAuditar) {
        btnAuditar.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof auditarFolio === 'function') {
                auditarFolio();
            } else {
                console.warn('⚠️ auditarFolio no está definido');
            }
        });
    }

    // ============================================================
    // 2. BOTÓN DE DEMO (CARGAR FOLIOS)
    // ============================================================
    const btnDemo = document.getElementById('btn-demo');
    if (btnDemo) {
        btnDemo.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof cargarFoliosDemo === 'function') {
                cargarFoliosDemo();
            } else {
                console.warn('⚠️ cargarFoliosDemo no está definido');
            }
        });
    }

    // ============================================================
    // 3. BOTONES DE "PRÓXIMAMENTE" (PLANES)
    // ============================================================
    document.querySelectorAll('.btn-coming-soon').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🚀 Próximamente disponible');
        });
    });

    // ============================================================
    // 4. BOTÓN DE "CONTACTAR" (PLAN ENTERPRISE)
    // ============================================================
    const btnContact = document.querySelector('.btn-contact');
    if (btnContact) {
        btnContact.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📞 Contacta a ventas: ventas@kronos360.com');
        });
    }

    // ============================================================
    // 5. ENTER PARA AUDITAR
    // ============================================================
    const folioInput = document.getElementById('folioInput');
    if (folioInput) {
        folioInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const btn = document.getElementById('btn-auditar');
                if (btn) {
                    btn.click();
                }
            }
        });
    }

    // ============================================================
    // 6. DETECTAR PARÁMETRO ?folio= EN URL
    // ============================================================
    const params = new URLSearchParams(window.location.search);
    const folio = params.get('folio');
    if (folio && document.getElementById('folioInput')) {
        document.getElementById('folioInput').value = folio;
        if (typeof auditarFolio === 'function') {
            setTimeout(auditarFolio, 500);
        }
    }

    // ============================================================
    // 7. CARGAR DASHBOARD SI EXISTE
    // ============================================================
    if (document.getElementById('tabla-body')) {
        if (typeof cargarDashboard === 'function') {
            cargarDashboard();
        }
    }

    // ============================================================
    // 8. DETECTAR MODO OFFLINE
    // ============================================================
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
        window.addEventListener('online', function() {
            offlineIndicator.style.display = 'none';
        });
        window.addEventListener('offline', function() {
            offlineIndicator.style.display = 'block';
        });
    }

    console.log('✅ KRONOS 360 - Inicialización completada');
});