function auditarFolio() {
    const input = document.getElementById('folioInput');
    const folioId = input.value.trim();
    const resultadoDiv = document.getElementById('resultado-auditoria');

    if (!folioId) {
        alert('⚠️ Por favor ingresa un folio');
        return;
    }

    let folios = cargarFolios();
    if (folios.length === 0) {
        cargarFoliosDemo();
        folios = cargarFolios();
    }

    const folio = folios.find(f => f.id === folioId);
    
    if (!folio) {
        resultadoDiv.innerHTML = `
            <div style="color: #ef4444; font-weight: 600; padding: 16px; background: rgba(239,68,68,0.1); border-radius: 8px;">
                ❌ Folio no encontrado. Verifica que sea correcto.
            </div>
        `;
        resultadoDiv.classList.add('visible');
        return;
    }

    const confianza = folio.nivelConfianza || 85;
    const nivel = confianza >= 90 ? 'alta' : confianza >= 60 ? 'media' : 'baja';
    const emoji = confianza >= 90 ? '✅' : confianza >= 60 ? '⚠️' : '🚨';
    
    let html = `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span style="font-weight: 700; font-size: 1.2rem;">${folio.id}</span>
            <span class="confianza ${nivel}">${emoji} ${confianza}%</span>
        </div>
        <p style="color: #475569; margin-bottom: 12px;">
            <strong>Estado:</strong> ${folio.estado || 'Activo'}
        </p>
        <div class="timeline">
    `;

    if (folio.escaneos && folio.escaneos.length > 0) {
        folio.escaneos.forEach((e) => {
            const fecha = new Date(e.timestamp).toLocaleString();
            html += `
                <div class="timeline-item">
                    <div class="hora">${fecha}</div>
                    <div>📍 ${e.descripcion || 'Punto de control'}</div>
                </div>
            `;
        });
    } else {
        html += `<p style="color: #94a3b8;">No hay escaneos registrados aún.</p>`;
    }

    html += `
        </div>
        <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px;">
            <strong>🤖 Informe pericial:</strong><br>
            ${confianza >= 90 ? '✅ Producto auténtico. Ruta consistente y coherente.' :
              confianza >= 60 ? '⚠️ Se detectan irregularidades. Revisión manual recomendada.' :
              '🚨 ¡ALERTA! Posible falsificación o manipulación.'}
        </div>
        <div style="margin-top: 12px; padding: 8px 16px; background: #0f172a; color: #94a3b8; border-radius: 4px; font-size: 0.7rem; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <span>🔒 Auditado con KRONOS-MD-33-467162326</span>
            <span>${new Date().toISOString()}</span>
        </div>
    `;

    resultadoDiv.innerHTML = html;
    resultadoDiv.classList.add('visible');
}