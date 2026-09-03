/**
 * ============================================================
 * KRONOS 360 - Motor Forense
 * Detección de fraudes y anomalías en trazabilidad
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

class ForensicEngine {
    constructor() {
        this.thresholds = {
            tiempoMinimoEntrePuntos: 600,  // segundos (10 min)
            velocidadMaxima: 250,           // km/h
            saltosGeograficosMaximos: 3,
            confianzaMinima: 60
        };
        this.alerts = [];
    }

    /**
     * Analiza un folio completo
     */
    analyzeFolio(folioData, escaneos) {
        const results = {
            folio: folioData.id || folioData.folio,
            timestamp: new Date().toISOString(),
            alerts: [],
            score: 100,
            anomalies: [],
            recomendaciones: []
        };

        // Análisis temporal
        const temporal = this.analyzeTemporalConsistency(escaneos);
        if (!temporal.valid) {
            results.alerts.push({
                type: 'tiempo',
                severity: 'alta',
                message: temporal.message,
                data: temporal.data
            });
            results.score -= 20;
        }

        // Análisis geográfico
        const geo = this.analyzeGeolocation(escaneos);
        if (!geo.valid) {
            results.alerts.push({
                type: 'geolocalizacion',
                severity: 'crítica',
                message: geo.message,
                data: geo.data
            });
            results.score -= 30;
        }

        // Determinar confianza final
        results.confianza = Math.max(0, Math.min(100, results.score));
        results.nivel = results.confianza >= 80 ? 'AUTÉNTICO' :
                        results.confianza >= 60 ? 'SOSPECHOSO' : 'FRAUDULENTO';

        // Recomendaciones
        if (results.confianza < 60) {
            results.recomendaciones.push('REVISIÓN MANUAL REQUERIDA');
            results.recomendaciones.push('Contactar a perito autorizado');
        } else if (results.confianza < 80) {
            results.recomendaciones.push('Verificación adicional sugerida');
        } else {
            results.recomendaciones.push('Producto auténtico');
        }

        return results;
    }

    /**
     * Analiza consistencia temporal
     */
    analyzeTemporalConsistency(escaneos) {
        if (!escaneos || escaneos.length < 2) {
            return { valid: true, message: 'Insuficientes datos' };
        }

        for (let i = 0; i < escaneos.length - 1; i++) {
            const actual = new Date(escaneos[i].timestamp);
            const siguiente = new Date(escaneos[i+1].timestamp);
            const diferencia = (siguiente - actual) / 1000;

            if (diferencia < this.thresholds.tiempoMinimoEntrePuntos) {
                return {
                    valid: false,
                    message: 'Tiempo entre escaneos demasiado corto: ' + diferencia + 's',
                    data: {
                        punto1: escaneos[i],
                        punto2: escaneos[i+1],
                        tiempo: diferencia,
                        minimo: this.thresholds.tiempoMinimoEntrePuntos
                    }
                };
            }
        }
        return { valid: true, message: 'Consistencia temporal OK' };
    }

    /**
     * Analiza consistencia geográfica
     */
    analyzeGeolocation(escaneos) {
        if (!escaneos || escaneos.length < 2) {
            return { valid: true, message: 'Insuficientes datos' };
        }

        let saltos = 0;
        for (let i = 0; i < escaneos.length - 1; i++) {
            const actual = escaneos[i];
            const siguiente = escaneos[i+1];
            
            if (!actual.ubicacion || !siguiente.ubicacion) continue;
            
            const distancia = this.calculateDistance(
                actual.ubicacion.lat,
                actual.ubicacion.lng,
                siguiente.ubicacion.lat,
                siguiente.ubicacion.lng
            );

            const tiempo = (new Date(siguiente.timestamp) - new Date(actual.timestamp)) / 1000 / 3600;
            const velocidad = tiempo > 0 ? distancia / tiempo : 0;

            if (velocidad > this.thresholds.velocidadMaxima) {
                saltos++;
                if (saltos > this.thresholds.saltosGeograficosMaximos) {
                    return {
                        valid: false,
                        message: 'Demasiados saltos geográficos: ' + saltos,
                        data: {
                            punto1: actual,
                            punto2: siguiente,
                            distancia: distancia,
                            velocidad: velocidad
                        }
                    };
                }
            }
        }
        return { valid: true, message: 'Geolocalización consistente' };
    }

    /**
     * Calcula distancia entre dos puntos (Haversine)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
        
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ForensicEngine;
}

// ===== EXPONER GLOBALMENTE =====
window.ForensicEngine = ForensicEngine;