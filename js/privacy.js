/**
 * ============================================================
 * KRONOS 360 - Privacidad y Retención
 * Gestión de datos personales y políticas de privacidad
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class PrivacyManager {
    constructor() {
        this.retentionDays = 365;
        this.storedKeys = [
            'folios',
            'escaneos',
            'sellos',
            'kronos_document_verification',
            'kronos_credits',
            'kronos_transacciones',
            'kronos_used_'
        ];
    }

    /**
     * Obtiene claves almacenadas
     */
    getStoredKeys() {
        return this.storedKeys.filter(function(key) {
            if (key === 'kronos_used_') {
                // Buscar claves que comiencen con kronos_used_
                for (const k in localStorage) {
                    if (k.startsWith('kronos_used_')) return true;
                }
                return false;
            }
            return localStorage.getItem(key) !== null;
        });
    }

    /**
     * Calcula tamaño total de datos
     */
    getStorageSize() {
        let total = 0;
        for (const key in localStorage) {
            if (key.startsWith('kronos_') || key === 'folios' || key === 'escaneos' || key === 'sellos') {
                total += (localStorage.getItem(key) || '').length * 2;
            }
        }
        return total;
    }

    /**
     * Obtiene datos de un folio
     */
    getFolioData(folioId) {
        try {
            const folios = JSON.parse(localStorage.getItem('folios') || '[]');
            const escaneos = JSON.parse(localStorage.getItem('escaneos') || '[]');
            
            return {
                folio: folios.find(function(f) { return f.id === folioId; }),
                escaneos: escaneos.filter(function(e) { return e.folioId === folioId; })
            };
        } catch {
            return null;
        }
    }

    /**
     * Anonimiza datos de un folio
     */
    anonymizeFolio(folioId) {
        try {
            const folios = JSON.parse(localStorage.getItem('folios') || '[]');
            const index = folios.findIndex(function(f) { return f.id === folioId; });
            
            if (index === -1) return null;
            
            folios[index].userData = undefined;
            folios[index].contactInfo = undefined;
            folios[index]._anonymized = true;
            folios[index]._anonymizedAt = new Date().toISOString();
            
            localStorage.setItem('folios', JSON.stringify(folios));
            return folios[index];
        } catch {
            return null;
        }
    }

    /**
     * Elimina datos de un folio (GDPR)
     */
    deleteFolioData(folioId) {
        try {
            let folios = JSON.parse(localStorage.getItem('folios') || '[]');
            let escaneos = JSON.parse(localStorage.getItem('escaneos') || '[]');
            
            folios = folios.filter(function(f) { return f.id !== folioId; });
            escaneos = escaneos.filter(function(e) { return e.folioId !== folioId; });
            
            localStorage.setItem('folios', JSON.stringify(folios));
            localStorage.setItem('escaneos', JSON.stringify(escaneos));
            
            return {
                deleted: true,
                folioId: folioId,
                timestamp: new Date().toISOString()
            };
        } catch {
            return { deleted: false, error: 'Error al eliminar' };
        }
    }

    /**
     * Exporta todos los datos
     */
    exportAllData() {
        const data = {};
        for (const key of this.storedKeys) {
            if (key === 'kronos_used_') continue;
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    data[key] = JSON.parse(item);
                } catch {
                    data[key] = item;
                }
            }
        }
        return {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            data: data,
            totalItems: Object.keys(data).length
        };
    }

    /**
     * Limpia datos expirados
     */
    cleanExpiredData() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
        
        try {
            const escaneos = JSON.parse(localStorage.getItem('escaneos') || '[]');
            const filtered = escaneos.filter(function(e) {
                const date = new Date(e.timestamp);
                return date > cutoffDate;
            });
            
            localStorage.setItem('escaneos', JSON.stringify(filtered));
            
            return {
                cleaned: escaneos.length - filtered.length,
                remaining: filtered.length,
                cutoffDate: cutoffDate.toISOString()
            };
        } catch {
            return { error: 'Error al limpiar datos' };
        }
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyManager;
}

// ===== EXPONER GLOBALMENTE =====
window.PrivacyManager = PrivacyManager;