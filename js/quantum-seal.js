/**
 * ============================================================
 * KRONOS 360 - Quantum Seal (MD-33)
 * Hash encadenado con KRONOS-MD-33-467162326
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class QuantumSeal {
    constructor() {
        this.rootHash = 'KRONOS-MD-33-467162326';
        this.chain = [];
        this.numeros = [4, 6, 7, 16, 23, 26];
        this.version = '1.0.0';
    }

    /**
     * Genera un hash MD-33 a partir de datos
     */
    generateHash(data) {
        try {
            const str = JSON.stringify(data) + this.rootHash;
            let hash = 0;
            
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convertir a 32-bit
                
                // Aplicar transformación MD-33
                this.numeros.forEach(function(n) {
                    hash = (hash * n) ^ (hash >> n);
                });
            }
            
            return 'MD33-' + Math.abs(hash).toString(16).padStart(32, '0').toUpperCase();
        } catch (error) {
            console.error('❌ Error al generar hash:', error);
            return 'MD33-ERROR-' + Date.now().toString(16);
        }
    }

    /**
     * Crea un sello cuántico para un folio
     */
    createSeal(folioData) {
        try {
            const timestamp = new Date().toISOString();
            const previousHash = this.chain.length > 0 
                ? this.chain[this.chain.length - 1].hash 
                : this.rootHash;
            
            const hash = this.generateHash({
                folio: folioData.id,
                timestamp: timestamp,
                previousHash: previousHash,
                data: folioData
            });

            const seal = {
                folio: folioData.id,
                hash: hash,
                previousHash: previousHash,
                timestamp: timestamp,
                rootSignature: this.rootHash,
                version: this.version,
                algorithm: 'MD-33',
                sealNumber: this.chain.length + 1
            };

            this.chain.push(seal);
            return seal;
        } catch (error) {
            console.error('❌ Error al crear sello:', error);
            return null;
        }
    }

    /**
     * Verifica la integridad de la cadena de sellos
     */
    verifyChain() {
        if (this.chain.length === 0) {
            return { valid: true, message: 'Cadena vacía' };
        }

        for (let i = 0; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = i > 0 ? this.chain[i - 1] : null;
            
            // Verificar hash actual
            const expectedHash = this.generateHash({
                folio: current.folio,
                timestamp: current.timestamp,
                previousHash: previous ? previous.hash : this.rootHash,
                data: current.data || {}
            });

            if (current.hash !== expectedHash) {
                return {
                    valid: false,
                    brokenIndex: i,
                    message: 'Cadena rota en el índice ' + i,
                    expected: expectedHash,
                    found: current.hash
                };
            }

            // Verificar enlace con el anterior
            if (previous && current.previousHash !== previous.hash) {
                return {
                    valid: false,
                    brokenIndex: i,
                    message: 'Enlace roto entre ' + (i-1) + ' y ' + i,
                    expected: previous.hash,
                    found: current.previousHash
                };
            }
        }

        return {
            valid: true,
            message: 'Cadena verificada correctamente',
            totalSeals: this.chain.length,
            rootHash: this.rootHash
        };
    }

    /**
     * Exporta la cadena para auditoría
     */
    exportChain() {
        return {
            rootHash: this.rootHash,
            version: this.version,
            totalSeals: this.chain.length,
            chain: this.chain,
            timestamp: new Date().toISOString()
        };
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumSeal;
}

// ===== EXPONER GLOBALMENTE =====
window.QuantumSeal = QuantumSeal;

console.log('🔒 Quantum Seal MD-33 cargado');
console.log('🔑 Sellado con KRONOS-MD-33-467162326');