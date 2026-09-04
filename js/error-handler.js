/**
 * ============================================================
 * KRONOS 360 - Error Handler
 * Manejo centralizado de errores
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.environment = 'production';
    }

    /**
     * Registra un error
     */
    log(error, context) {
        context = context || {};
        
        const errorEntry = {
            id: 'ERR-' + Date.now().toString(36).toUpperCase(),
            timestamp: new Date().toISOString(),
            message: error.message || 'Error desconocido',
            stack: error.stack || null,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errors.push(errorEntry);
        
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        if (this.environment === 'development') {
            console.error('[KRONOS 360]', errorEntry);
        }

        this.saveToStorage();
        return errorEntry;
    }

    /**
     * Registra error de seguridad
     */
    logSecurityError(message, context) {
        context = context || {};
        return this.log(new Error('[SECURITY] ' + message), {
            ...context,
            severity: 'high',
            category: 'security'
        });
    }

    /**
     * Registra error de validación
     */
    logValidationError(message, context) {
        context = context || {};
        return this.log(new Error('[VALIDATION] ' + message), {
            ...context,
            severity: 'medium',
            category: 'validation'
        });
    }

    /**
     * Registra error de integridad
     */
    logIntegrityError(message, context) {
        context = context || {};
        return this.log(new Error('[INTEGRITY] ' + message), {
            ...context,
            severity: 'critical',
            category: 'integrity'
        });
    }

    /**
     * Obtiene todos los errores
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Obtiene errores por categoría
     */
    getErrorsByCategory(category) {
        return this.errors.filter(function(e) {
            return e.context && e.context.category === category;
        });
    }

    /**
     * Limpia errores
     */
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('kronos_error_log');
    }

    /**
     * Guarda en localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('kronos_error_log', JSON.stringify(this.errors.slice(-20)));
        } catch {
            // Si localStorage está lleno
        }
    }

    /**
     * Carga desde localStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem('kronos_error_log');
            if (data) {
                this.errors = JSON.parse(data);
            }
        } catch {
            this.errors = [];
        }
    }

    /**
     * Genera reporte
     */
    generateReport() {
        const categories = {};
        let total = 0;
        let critical = 0;

        for (const error of this.errors) {
            total++;
            if (error.context && error.context.severity === 'critical') {
                critical++;
            }
            const category = error.context && error.context.category || 'unknown';
            categories[category] = (categories[category] || 0) + 1;
        }

        return {
            total: total,
            critical: critical,
            categories: categories,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}

// ===== EXPONER GLOBALMENTE =====
window.ErrorHandler = ErrorHandler;

// ===== INSTANCIA GLOBAL =====
const errorHandler = new ErrorHandler();
window.errorHandler = errorHandler;

console.log('🛡️ Error Handler cargado');