/**
 * ============================================================
 * KRONOS 360 - Configuración Centralizada
 * Sellado con KRONOS-MD-33-467162326
 * ============================================================
 * 
 * IMPORTANTE: Este archivo NO debe contener:
 * - Claves secretas
 * - Credenciales
 * - Tokens de API
 * ============================================================
 */

export const KRONOS_CONFIG = Object.freeze({
    // ===== VERSIÓN =====
    schemaVersion: '1.0.0',
    version: '1.0.0',
    
    // ===== SELLO GENESIS =====
    genesisFolio: 'KRONOS-MD-33-467162326',
    genesisHash: 'KRONOS-MD-33-467162326',
    
    // ===== CRIPTOGRAFÍA =====
    hashAlgorithm: 'SHA-256',
    saltLength: 32,
    
    // ===== LÍMITES =====
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    maxFolioLength: 32,
    auditRetentionDays: 365,
    maxCredits: 100000,
    maxPurchaseCredits: 10000,
    
    // ===== ENTORNO =====
    environment: 'production', // 'development' | 'staging' | 'production'
    
    // ===== URLS =====
    baseUrl: 'https://KRONOSPROYECT.github.io/MD-33/',
    verifyUrl: 'https://KRONOSPROYECT.github.io/MD-33/verify.html',
    
    // ===== ESTADOS DE FOLIO =====
    folioStatus: {
        VALID: 'valid',
        PENDING: 'pending',
        REVOKED: 'revoked',
        EXPIRED: 'expired',
        UNKNOWN: 'unknown'
    },
    
    // ===== TIPOS DE EVENTOS =====
    eventTypes: {
        FOLIO_CREATED: 'folio_created',
        DOCUMENT_ATTACHED: 'document_attached',
        FOLIO_VERIFIED: 'folio_verified',
        FOLIO_REVOKED: 'folio_revoked',
        FOLIO_RESTORED: 'folio_restored',
        EXPORT_CREATED: 'export_created',
        ADMIN_LOGIN: 'admin_login',
        SETTINGS_CHANGED: 'settings_changed',
        AUDIT_COMPLETED: 'audit_completed'
    },
    
    // ===== CONFIGURACIÓN DE EXPORTACIÓN =====
    exportFormats: {
        JSON: 'json',
        CSV: 'csv',
        PDF: 'pdf'
    },
    
    // ===== ESTADOS DE DOCUMENTO =====
    documentStatus: {
        PENDING: 'pending',
        VERIFIED: 'verified',
        FAILED: 'failed',
        REVOKED: 'revoked'
    }
});

// Congelar para evitar modificaciones accidentales
Object.freeze(KRONOS_CONFIG);

// Exportar también como variable global
if (typeof window !== 'undefined') {
    window.KRONOS_CONFIG = KRONOS_CONFIG;
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KRONOS_CONFIG;
}