/**
 * ============================================================
 * KRONOS 360 - Generador de QR
 * Generación de códigos QR para folios (con soporte para librería externa)
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class QRGenerator {
    constructor() {
        this.baseUrl = window.location.origin + '/verify.html';
        this.version = '1.0.0';
    }

    /**
     * Genera URL de verificación para un folio
     */
    generateVerificationUrl(folioId) {
        return this.baseUrl + '?folio=' + encodeURIComponent(folioId);
    }

    /**
     * Genera contenido del QR
     */
    generateQRContent(folioId) {
        return this.generateVerificationUrl(folioId);
    }

    /**
     * Genera QR usando la librería qrcodejs (si está cargada)
     * o devuelve un SVG placeholder
     */
    generateQRCode(folioId, size, elementId) {
        size = size || 200;
        const content = this.generateQRContent(folioId);
        
        // Si la librería QRCode está disponible, usarla
        if (typeof QRCode !== 'undefined' && elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '';
                new QRCode(element, {
                    text: content,
                    width: size,
                    height: size,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
                return { success: true, method: 'qrcodejs', elementId: elementId };
            }
        }
        
        // Fallback a SVG placeholder
        return this.generateQRCodeSVG(folioId, size);
    }

    /**
     * Genera QR como SVG placeholder
     */
    generateQRCodeSVG(folioId, size) {
        size = size || 200;
        const content = this.generateQRContent(folioId);
        
        return {
            success: true,
            method: 'svg-placeholder',
            svg: '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg" style="background:white;">' +
                 '  <rect width="' + size + '" height="' + size + '" fill="white" />' +
                 '  <text x="50%" y="40%" text-anchor="middle" dominant-baseline="central" font-family="monospace" font-size="14" fill="black">📱 QR</text>' +
                 '  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="monospace" font-size="10" fill="#666">' + folioId.substring(0, 20) + '...</text>' +
                 '  <text x="50%" y="70%" text-anchor="middle" dominant-baseline="central" font-family="monospace" font-size="8" fill="#999">KRONOS 360</text>' +
                 '</svg>',
            content: content,
            size: size,
            folioId: folioId
        };
    }

    /**
     * Renderiza QR en un elemento del DOM
     */
    renderQR(qrData, elementId) {
        if (qrData.method === 'qrcodejs') {
            // Ya renderizado por la librería
            return true;
        }
        
        const element = document.getElementById(elementId);
        if (!element) return false;
        
        element.innerHTML = qrData.svg;
        element.dataset.folio = qrData.folioId;
        element.dataset.content = qrData.content;
        
        return true;
    }

    /**
     * Descarga QR como SVG
     */
    downloadQR(qrData, filename) {
        filename = filename || 'qr-' + qrData.folioId + '.svg';
        const blob = new Blob([qrData.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRGenerator;
}

// ===== EXPONER GLOBALMENTE =====
window.QRGenerator = QRGenerator;