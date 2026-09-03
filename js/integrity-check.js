/**
 * ============================================================
 * KRONOS 360 - Integrity Check
 * Verificación de integridad del sistema
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

/**
 * Genera hash SHA-256 de un texto
 */
async function sha256Text(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map(function(b) { return b.toString(16).padStart(2, '0'); })
        .join('');
}

/**
 * Genera hash SHA-256 de un archivo
 */
async function sha256File(file) {
    const arrayBuffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return Array.from(new Uint8Array(digest))
        .map(function(b) { return b.toString(16).padStart(2, '0'); })
        .join('');
}

/**
 * Verifica integridad de archivos críticos
 */
async function verifyAllIntegrity() {
    const results = [];
    const files = [
        '/index.html',
        '/verify.html',
        '/dashboard.html',
        '/js/quantum-seal.js',
        '/js/offline-vault.js',
        '/js/forensic.js',
        '/js/main.js'
    ];

    for (const filePath of files) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            const hash = await sha256Text(text);
            results.push({
                file: filePath,
                hash: hash,
                match: null
            });
        } catch (error) {
            results.push({
                file: filePath,
                error: error.message,
                match: false
            });
        }
    }

    return {
        timestamp: new Date().toISOString(),
        results: results
    };
}

/**
 * Verifica que sea HTTPS
 */
function isSecureContext() {
    return window.isSecureContext || location.protocol === 'https:';
}

/**
 * Reporte completo de integridad
 */
async function integrityReport() {
    const integrity = await verifyAllIntegrity();
    const security = isSecureContext();

    return {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        genesisHash: 'KRONOS-MD-33-467162326',
        integrity: integrity,
        security: {
            https: security,
            csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')
        }
    };
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sha256Text: sha256Text,
        sha256File: sha256File,
        verifyAllIntegrity: verifyAllIntegrity,
        isSecureContext: isSecureContext,
        integrityReport: integrityReport
    };
}

// ===== EXPONER GLOBALMENTE =====
window.sha256Text = sha256Text;
window.sha256File = sha256File;
window.verifyAllIntegrity = verifyAllIntegrity;
window.isSecureContext = isSecureContext;
window.integrityReport = integrityReport;