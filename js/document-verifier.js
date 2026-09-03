/**
 * ============================================================
 * KRONOS 360 - Document Verifier
 * Verificación de documentos sin servidor (100% navegador)
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class DocumentVerifier {
    constructor() {
        this.supportedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'text/plain'
        ];
        this.maxSize = 10 * 1024 * 1024; // 10MB
        this.verifiedDocuments = [];
    }

    /**
     * Verifica un documento
     */
    async verifyDocument(file, expectedHash) {
        // Validar archivo
        const validation = this.validateFile(file);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
                details: validation.details
            };
        }

        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const hash = await this.generateHash(arrayBuffer);
            
            const fileInfo = {
                name: file.name,
                size: file.size,
                type: file.type || 'Desconocido',
                lastModified: new Date(file.lastModified).toISOString(),
                hash: hash,
                hashShort: hash.substring(0, 16) + '...'
            };

            let verified = false;
            let match = false;
            
            if (expectedHash) {
                match = (hash === expectedHash);
                verified = match;
            } else {
                // Buscar en documentos previos
                const stored = this.findDocumentByHash(hash);
                if (stored) {
                    verified = true;
                    match = true;
                    fileInfo.storedData = stored;
                }
            }

            const result = {
                success: true,
                verified: verified,
                match: match,
                fileInfo: fileInfo,
                timestamp: new Date().toISOString(),
                details: {
                    size: this.formatFileSize(file.size),
                    type: file.type || 'Desconocido',
                    hashAlgorithm: 'SHA-256'
                }
            };

            // Guardar en historial
            this.verifiedDocuments.push(result);
            this.saveToLocalStorage(result);

            return result;

        } catch (error) {
            return {
                success: false,
                error: 'Error procesando el archivo',
                details: error.message
            };
        }
    }

    /**
     * Valida el archivo
     */
    validateFile(file) {
        if (file.size > this.maxSize) {
            return {
                valid: false,
                error: 'Archivo demasiado grande',
                details: 'Máximo: ' + this.formatFileSize(this.maxSize)
            };
        }

        if (!this.supportedTypes.includes(file.type) && 
            !file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png|txt)$/i)) {
            return {
                valid: false,
                error: 'Tipo de archivo no soportado',
                details: 'Formatos: PDF, DOC, DOCX, JPG, PNG, TXT'
            };
        }

        return { valid: true };
    }

    /**
     * Lee archivo como ArrayBuffer
     */
    readFileAsArrayBuffer(file) {
        return new Promise(function(resolve, reject) {
            const reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.onerror = function(e) { reject(e); };
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Genera hash SHA-256
     */
    async generateHash(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function(b) {
            return b.toString(16).padStart(2, '0');
        }).join('');
    }

    /**
     * Busca documento por hash
     */
    findDocumentByHash(hash) {
        const stored = this.getFromLocalStorage();
        return stored.find(function(doc) {
            return doc.fileInfo && doc.fileInfo.hash === hash;
        }) || null;
    }

    /**
     * Guarda en localStorage
     */
    saveToLocalStorage(data) {
        try {
            let history = this.getFromLocalStorage();
            history.push({
                ...data,
                savedAt: new Date().toISOString()
            });
            if (history.length > 100) {
                history = history.slice(-100);
            }
            localStorage.setItem('kronos_document_verification', JSON.stringify(history));
        } catch (error) {
            console.warn('⚠️ No se pudo guardar:', error);
        }
    }

    /**
     * Obtiene historial de localStorage
     */
    getFromLocalStorage() {
        try {
            const data = localStorage.getItem('kronos_document_verification');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * Formatea tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Genera reporte HTML
     */
    generateReport(result) {
        if (!result.success) {
            return '<div style="color:#ef4444;padding:16px;background:rgba(239,68,68,0.1);border-radius:8px;">' +
                   '<strong>❌ Error:</strong> ' + result.error +
                   '<br><span style="font-size:0.85rem;color:#666;">' + (result.details || '') + '</span></div>';
        }

        const status = result.verified ? '✅ VERIFICADO' : '⚠️ NO VERIFICADO';
        const statusColor = result.verified ? '#22c55e' : '#eab308';
        const matchStatus = result.match ? '✅ Coincide' : '❌ No coincide';

        let html = '<div style="padding:20px;background:rgba(255,255,255,0.02);border-radius:12px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;">';
        html += '  <h4 style="margin:0;">📄 ' + result.fileInfo.name + '</h4>';
        html += '  <span style="background:' + statusColor + ';color:#fff;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;">' + status + '</span>';
        html += '</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">';
        html += '  <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:6px;">';
        html += '    <span style="font-size:0.75rem;color:#64748b;">Tamaño</span>';
        html += '    <div style="font-weight:600;">' + result.details.size + '</div>';
        html += '  </div>';
        html += '  <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:6px;">';
        html += '    <span style="font-size:0.75rem;color:#64748b;">Tipo</span>';
        html += '    <div style="font-weight:600;">' + result.details.type + '</div>';
        html += '  </div>';
        html += '  <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:6px;grid-column:1/-1;">';
        html += '    <span style="font-size:0.75rem;color:#64748b;">Hash</span>';
        html += '    <div style="font-weight:600;font-family:monospace;font-size:0.8rem;word-break:break-all;">' + result.fileInfo.hash + '</div>';
        html += '  </div>';
        html += '  <div style="background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:6px;grid-column:1/-1;">';
        html += '    <span style="font-size:0.75rem;color:#64748b;">Estado</span>';
        html += '    <div style="font-weight:600;">' + matchStatus + '</div>';
        html += '  </div>';
        html += '</div>';
        html += '<div style="font-size:0.75rem;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.05);padding-top:12px;">';
        html += '  Verificado: ' + result.timestamp;
        html += '</div>';
        html += '</div>';

        return html;
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentVerifier;
}

// ===== EXPONER GLOBALMENTE =====
window.DocumentVerifier = DocumentVerifier;