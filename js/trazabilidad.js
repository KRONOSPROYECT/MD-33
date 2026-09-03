/**
 * ============================================================
 * KRONOS 360 - Trazabilidad y Auditoría
 * Motor principal de verificación de folios
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

// ===== AUDITAR UN FOLIO =====
function auditarFolio() {
    const input = document.getElementById('folioInput');
    if (!input) {
        console.error('❌ No se encontró el input del folio');
        return;
    }
    
    const folioId = input.value.trim();
    const resultadoDiv = document.getElementById('resultado-auditoria');
    
    if (!resultadoDiv) {
        console.error('❌ No se encontró el contenedor de resultados');
        return;
    }

    if (!folioId) {
        resultadoDiv.innerHTML = `
            <div style="color: #eab308; padding: 16px; background: rgba(234, 179, 8, 0.1); border-radius: 8px;">
                ⚠️ Por favor ingresa un folio para verificar
            </div>
        `;
        resultadoDiv.classList.add('visible');
        return;
    }

    // Cargar folios
    let folios = [];
    try {
        folios = cargarFolios();
    } catch (e) {
        console.error('❌ Error al cargar folios:', e);
    }
    
    // Si no hay folios, cargar demo
    if (folios.length === 0) {
        cargarFoliosDemo();
        folios = cargarFolios();
    }

    // Buscar el folio
    const folio = folios.find(function(f) {
        return f.id === folioId;
    });
    
    if (!folio) {
        resultadoDiv.innerHTML = `
            <div style="color: #ef4444; padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                ❌ Folio no encontrado: <strong>${folioId}</strong><br>
                <span style="font-size: 0.85rem; color: #666;">Verifica que el código sea correcto.</span>
            </div>
        `;
        resultadoDiv.classList.add('visible');
        return;
    }

    // Calcular confianza
    const confianza = folio.nivelConfianza || 85;
    let nivel = 'alta';
    let emoji = '✅';
    
    if (confianza < 60) {
        nivel = 'baja';
        emoji = '🚨';
    } else if (confianza < 90) {
        nivel = 'media';
        emoji = '⚠️';
    }
    
    // Generar HTML de resultado
    let html = '';
    html += '<div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">';
    html += '  <span style="font-weight: 700; font-size: 1.2rem;">' + folio.id + '</span>';
    html += '  <span class="confianza ' + nivel + '">' + emoji + ' ' + confianza + '%</span>';
    html += '</div>';
    
    html += '<p style="color: #475569; margin-bottom: 12px;">';
    html += '  <strong>Estado:</strong> ' + (folio.estado || 'Activo');
    html += '</p>';
    
    // Timeline de escaneos
    html += '<div class="timeline">';
    if (folio.escaneos && folio.escaneos.length > 0) {
        folio.escaneos.forEach(function(e) {
            const fecha = new Date(e.timestamp).toLocaleString();
            html += '<div class="timeline-item">';
            html += '  <div class="hora">' + fecha + '</div>';
            html += '  <div>📍 ' + (e.descripcion || 'Punto de control') + '</div>';
            html += '</div>';
        });
    } else {
        html += '<p style="color: #94a3b8;">No hay escaneos registrados aún.</p>';
    }
    html += '</div>';
    
    // Informe pericial
    html += '<div style="margin-top: 16px; padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 8px;">';
    html += '  <strong>🤖 Informe pericial:</strong><br>';
    
    if (confianza >= 90) {
        html += '  ✅ El producto ha seguido una ruta consistente y coherente. No se detectan anomalías.';
    } else if (confianza >= 60) {
        html += '  ⚠️ Se detectan algunas irregularidades en la cadena de custodia. Se recomienda revisión manual.';
    } else {
        html += '  🚨 ¡ALERTA! La ruta presenta múltiples inconsistencias. Posible falsificación o manipulación.';
    }
    html += '</div>';
    
    // Sello de auditoría
    html += '<div style="margin-top: 12px; padding: 8px 16px; background: #0f172a; color: #94a3b8; border-radius: 4px; font-size: 0.7rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">';
    html += '  <span>🔒 Auditado con KRONOS-MD-33-467162326</span>';
    html += '  <span>' + new Date().toISOString() + '</span>';
    html += '</div>';

    resultadoDiv.innerHTML = html;
    resultadoDiv.classList.add('visible');
    
    // Guardar auditoría en Offline Vault
    if (typeof vault !== 'undefined' && vault.saveEscaneo) {
        try {
            vault.saveEscaneo({
                folioId: folioId,
                tipo: 'auditoria',
                resultado: {
                    confianza: confianza,
                    nivel: nivel
                },
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.warn('⚠️ No se pudo guardar auditoría:', e);
        }
    }
}

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        auditarFolio: auditarFolio
    };
}

// ===== EXPONER GLOBALMENTE =====
window.auditarFolio = auditarFolio;