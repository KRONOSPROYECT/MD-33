/**
 * ============================================================
 * KRONOS 360 - Dashboard (Corregido - Sin XSS)
 * Panel de administración y estadísticas
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

// ===== CARGAR DASHBOARD =====
function cargarDashboard() {
    try {
        const folios = cargarFolios();
        const tbody = document.getElementById('tabla-body');
        
        if (!tbody) {
            console.warn('⚠️ No se encontró la tabla del dashboard');
            return;
        }
        
        // Limpiar tabla
        tbody.innerHTML = '';
        
        if (folios.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #444; padding: 30px 0;">
                        No hay folios generados aún
                    </td>
                </tr>
            `;
            return;
        }
        
        // Llenar tabla (SIN XSS - usando createElement)
        folios.forEach(function(f) {
            const tr = document.createElement('tr');
            
            // Celda: Folio ID
            const tdFolio = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = f.id;
            tdFolio.appendChild(strong);
            tr.appendChild(tdFolio);
            
            // Celda: Estado
            const tdEstado = document.createElement('td');
            const spanEstado = document.createElement('span');
            
            let estadoClase = 'activo';
            let estadoTexto = f.estado || 'Activo';
            
            if (f.estado === 'finalizado') {
                estadoClase = 'finalizado';
            }
            if (f.nivelConfianza && f.nivelConfianza < 60) {
                estadoClase = 'alert';
                estadoTexto = '⚠️ Alerta';
            }
            
            spanEstado.className = 'estado-badge ' + estadoClase;
            spanEstado.textContent = estadoTexto;
            tdEstado.appendChild(spanEstado);
            tr.appendChild(tdEstado);
            
            // Celda: Último escaneo
            const tdEscaneo = document.createElement('td');
            const ultimoEscaneo = (f.escaneos && f.escaneos.length > 0)
                ? new Date(f.escaneos[f.escaneos.length - 1].timestamp).toLocaleDateString()
                : 'Sin escaneos';
            tdEscaneo.textContent = ultimoEscaneo;
            tr.appendChild(tdEscaneo);
            
            // Celda: Nivel de confianza
            const tdConfianza = document.createElement('td');
            tdConfianza.textContent = (f.nivelConfianza || 'N/A') + '%';
            tr.appendChild(tdConfianza);
            
            // Celda: Acción (botón Ver)
            const tdAccion = document.createElement('td');
            const btn = document.createElement('button');
            btn.textContent = 'Ver';
            btn.className = 'btn-outline small';
            
            // ✅ FIX XSS: Event listener en lugar de onclick inline
            (function(folioId) {
                btn.addEventListener('click', function() {
                    verDetalle(folioId);
                });
            })(f.id);
            
            tdAccion.appendChild(btn);
            tr.appendChild(tdAccion);
            
            tbody.appendChild(tr);
        });

        // Actualizar estadísticas
        const activos = folios.filter(function(f) {
            return f.estado !== 'finalizado';
        });
        
        const totalEscaneos = folios.reduce(function(acc, f) {
            return acc + (f.escaneos ? f.escaneos.length : 0);
        }, 0);
        
        const alertas = folios.filter(function(f) {
            return f.nivelConfianza && f.nivelConfianza < 60;
        });
        
        let totalCredits = 0;
        if (typeof KRONOS_PAY !== 'undefined' && KRONOS_PAY.obtenerCredits) {
            totalCredits = KRONOS_PAY.obtenerCredits();
        } else {
            try {
                const vault = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
                totalCredits = vault.balance || 0;
            } catch (e) {
                totalCredits = 0;
            }
        }
        
        const elActivos = document.getElementById('folios-activos');
        const elEscaneos = document.getElementById('escaneos-totales');
        const elAlertas = document.getElementById('alertas-fraude');
        const elPago = document.getElementById('proximo-pago');
        
        if (elActivos) elActivos.textContent = activos.length;
        if (elEscaneos) elEscaneos.textContent = totalEscaneos;
        if (elAlertas) elAlertas.textContent = alertas.length;
        if (elPago) elPago.textContent = '$' + (totalCredits * 0.50).toFixed(2) + ' USD';
        
        console.log('✅ Dashboard actualizado sin XSS');
        
    } catch (error) {
        console.error('❌ Error al cargar dashboard:', error);
    }
}

// ===== VER DETALLE DE UN FOLIO =====
function verDetalle(folioId) {
    if (!folioId) return;
    // Usamos encodeURIComponent para sanitizar
    window.location.href = '../verify.html?folio=' + encodeURIComponent(folioId);
}

// ===== GENERAR NUEVOS FOLIOS DESDE DASHBOARD =====
function generarNuevosFolios() {
    try {
        // Verificar créditos
        let credits = 0;
        if (typeof KRONOS_PAY !== 'undefined' && KRONOS_PAY.obtenerCredits) {
            credits = KRONOS_PAY.obtenerCredits();
        } else {
            const vault = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
            credits = vault.balance || 0;
        }
        
        if (credits < 10) {
            alert('⚠️ No tienes suficientes créditos.\nNecesitas al menos 10 créditos para generar folios.\n\nCompra más créditos en la página principal.');
            return;
        }
        
        const nuevos = generarLote(10);
        const actuales = cargarFolios();
        const todos = actuales.concat(nuevos);
        guardarFolios(todos);
        
        // Gastar créditos
        if (typeof KRONOS_PAY !== 'undefined' && KRONOS_PAY.gastarCredito) {
            for (let i = 0; i < 10; i++) {
                KRONOS_PAY.gastarCredito();
            }
        } else {
            const vault = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
            vault.balance = Math.max(0, (vault.balance || 0) - 10);
            localStorage.setItem('kronos_credits', JSON.stringify(vault));
        }
        
        cargarDashboard();
        alert('✅ 10 folios nuevos generados');
        
    } catch (error) {
        console.error('❌ Error al generar folios:', error);
        alert('❌ Error al generar folios. Intenta de nuevo.');
    }
}

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cargarDashboard: cargarDashboard,
        verDetalle: verDetalle,
        generarNuevosFolios: generarNuevosFolios
    };
}

// ===== EXPONER GLOBALMENTE =====
window.cargarDashboard = cargarDashboard;
window.verDetalle = verDetalle;
window.generarNuevosFolios = generarNuevosFolios;

// ===== INICIALIZAR AL CARGAR =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tabla-body')) {
        cargarDashboard();
        
        // Botón para generar folios
        const btnGenerar = document.getElementById('btn-generar-folios');
        if (btnGenerar) {
            btnGenerar.addEventListener('click', generarNuevosFolios);
        }
    }
});