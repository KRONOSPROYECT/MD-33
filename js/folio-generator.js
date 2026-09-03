/**
 * ============================================================
 * KRONOS 360 - Generador de Folios (Versión Criptográfica)
 * Generación de folios únicos e impredecibles con crypto.getRandomValues
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

// ===== GENERAR UN FOLIO ÚNICO (Criptográficamente seguro) =====
function generarFolio() {
    const año = new Date().getFullYear();
    
    // Generar valores criptográficos aleatorios
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    
    // Código de 4 caracteres (base36) - impredecible
    const codigo = arr[0].toString(36).toUpperCase().slice(0, 4).padStart(4, '0');
    
    // Número de 3 dígitos
    const numero = String(arr[1] % 1000).padStart(3, '0');
    
    // Construir base del folio
    const base = 'AF-' + año + '-' + codigo + '-' + numero;
    
    // Checksum MD-33 (módulo 97) para validación interna
    const checksum = base.split('').reduce(function(acc, ch) {
        return acc + ch.charCodeAt(0);
    }, 0) % 97;
    
    // Devolver folio con checksum de 2 dígitos
    return base + '-' + String(checksum).padStart(2, '0');
}

// ===== GENERAR LOTE DE FOLIOS =====
function generarLote(cantidad) {
    cantidad = cantidad || 10;
    const folios = [];
    for (let i = 0; i < cantidad; i++) {
        folios.push({
            id: generarFolio(),
            estado: 'activo',
            creado: new Date().toISOString(),
            escaneos: [],
            nivelConfianza: 100
        });
    }
    return folios;
}

// ===== GUARDAR FOLIOS EN localStorage =====
function guardarFolios(folios) {
    try {
        localStorage.setItem('folios', JSON.stringify(folios));
    } catch (error) {
        console.error('❌ Error al guardar folios:', error);
    }
}

// ===== CARGAR FOLIOS DESDE localStorage =====
function cargarFolios() {
    try {
        const data = localStorage.getItem('folios');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Error al cargar folios:', error);
        return [];
    }
}

// ===== VALIDAR UN FOLIO (checksum) =====
function validarFolio(folioId) {
    if (!folioId) return false;
    
    // Extraer la base (sin el checksum al final)
    const parts = folioId.split('-');
    if (parts.length !== 5) return false; // AF-AÑO-CODIGO-NUMERO-CHECKSUM
    
    const base = parts.slice(0, 4).join('-');
    const checksumRecibido = parseInt(parts[4], 10);
    
    // Calcular checksum esperado
    const checksumEsperado = base.split('').reduce(function(acc, ch) {
        return acc + ch.charCodeAt(0);
    }, 0) % 97;
    
    return checksumRecibido === checksumEsperado;
}

// ===== CARGAR FOLIOS DE EJEMPLO =====
function cargarFoliosDemo() {
    const demo = generarLote(10);
    
    // Folio 1: Ruta normal
    demo[0].escaneos = [
        { timestamp: new Date().toISOString(), ubicacion: 'CDMX', descripcion: 'Origen' },
        { timestamp: new Date(Date.now() + 3600000).toISOString(), ubicacion: 'GDL', descripcion: 'Distribución' },
        { timestamp: new Date(Date.now() + 7200000).toISOString(), ubicacion: 'MTY', descripcion: 'Almacén' }
    ];
    demo[0].nivelConfianza = 92;
    
    // Folio 2: Anomalía
    demo[1].escaneos = [
        { timestamp: new Date().toISOString(), ubicacion: 'CDMX', descripcion: 'Origen' },
        { timestamp: new Date(Date.now() + 1200000).toISOString(), ubicacion: 'MAD', descripcion: '⚠️ ALERTA: Salto imposible' }
    ];
    demo[1].nivelConfianza = 35;
    
    // Generar sellos cuánticos si están disponibles
    if (typeof quantumSeal !== 'undefined' && window.QuantumSeal) {
        try {
            const seal = new QuantumSeal();
            demo.forEach(function(f) {
                f.seal = seal.createSeal(f);
            });
        } catch (e) {
            console.warn('⚠️ No se pudo generar sellos cuánticos:', e);
        }
    }
    
    guardarFolios(demo);
    
    // Guardar en Offline Vault si está disponible
    if (typeof vault !== 'undefined' && vault.saveFolio) {
        try {
            demo.forEach(function(f) {
                vault.saveFolio(f);
            });
        } catch (e) {
            console.warn('⚠️ No se pudo guardar en vault:', e);
        }
    }
    
    alert('✅ Se generaron ' + demo.length + ' folios de ejemplo.\nFolio 1: Válido (92%)\nFolio 2: Alerta (35%)');
    
    const input = document.getElementById('folioInput');
    if (input) {
        input.value = demo[0].id;
    }
}

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generarFolio: generarFolio,
        generarLote: generarLote,
        guardarFolios: guardarFolios,
        cargarFolios: cargarFolios,
        validarFolio: validarFolio,
        cargarFoliosDemo: cargarFoliosDemo
    };
}

// ===== EXPONER GLOBALMENTE =====
window.generarFolio = generarFolio;
window.generarLote = generarLote;
window.guardarFolios = guardarFolios;
window.cargarFolios = cargarFolios;
window.validarFolio = validarFolio;
window.cargarFoliosDemo = cargarFoliosDemo;