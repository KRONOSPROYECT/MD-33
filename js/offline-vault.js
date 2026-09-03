/**
 * ============================================================
 * KRONOS 360 - Offline Vault
 * Almacenamiento persistente con IndexedDB y localStorage
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class OfflineVault {
    constructor() {
        this.dbName = 'KronosVault';
        this.version = 1;
        this.db = null;
        this.isOnline = navigator.onLine;
    }

    /**
     * Inicializa IndexedDB
     */
    async init() {
        return new Promise(function(resolve, reject) {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('folios')) {
                    const store = db.createObjectStore('folios', { keyPath: 'id' });
                    store.createIndex('estado', 'estado', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('escaneos')) {
                    const store = db.createObjectStore('escaneos', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    store.createIndex('folioId', 'folioId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('sellos')) {
                    const store = db.createObjectStore('sellos', { keyPath: 'hash' });
                    store.createIndex('folio', 'folio', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };

            request.onsuccess = function(event) {
                this.db = event.target.result;
                resolve();
            }.bind(this);

            request.onerror = function(event) {
                console.error('❌ Error abriendo IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        }.bind(this));
    }

    /**
     * Guarda un folio
     */
    async saveFolio(folioData) {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['folios'], 'readwrite');
            const store = transaction.objectStore('folios');
            
            const request = store.put({
                ...folioData,
                _offline: true,
                _version: '1.0.0'
            });
            
            request.onsuccess = function() { resolve(); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }

    /**
     * Obtiene un folio por ID
     */
    async getFolio(folioId) {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['folios'], 'readonly');
            const store = transaction.objectStore('folios');
            const request = store.get(folioId);
            
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }

    /**
     * Obtiene todos los folios
     */
    async getAllFolios() {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['folios'], 'readonly');
            const store = transaction.objectStore('folios');
            const request = store.getAll();
            
            request.onsuccess = function() { resolve(request.result || []); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }

    /**
     * Guarda un escaneo
     */
    async saveEscaneo(escaneoData) {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['escaneos'], 'readwrite');
            const store = transaction.objectStore('escaneos');
            
            const request = store.put({
                ...escaneoData,
                _offline: true,
                _version: '1.0.0'
            });
            
            request.onsuccess = function() { resolve(); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }

    /**
     * Obtiene escaneos de un folio
     */
    async getEscaneos(folioId) {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['escaneos'], 'readonly');
            const store = transaction.objectStore('escaneos');
            const index = store.index('folioId');
            const request = index.getAll(folioId);
            
            request.onsuccess = function() { resolve(request.result || []); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }

    /**
     * Guarda un sello
     */
    async saveSeal(sealData) {
        if (!this.db) await this.init();
        
        return new Promise(function(resolve, reject) {
            const transaction = this.db.transaction(['sellos'], 'readwrite');
            const store = transaction.objectStore('sellos');
            
            const request = store.put({
                ...sealData,
                _offline: true,
                _version: '1.0.0'
            });
            
            request.onsuccess = function() { resolve(); };
            request.onerror = function(event) { reject(event.target.error); };
        }.bind(this));
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfflineVault;
}

// ===== EXPONER GLOBALMENTE =====
window.OfflineVault = OfflineVault;

// ===== INSTANCIA GLOBAL =====
const vault = new OfflineVault();

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    vault.init().then(function() {
        console.log('✅ Offline Vault inicializado');
    }).catch(function(error) {
        console.warn('⚠️ Offline Vault no disponible:', error);
    });
});

console.log('📦 Offline Vault cargado');