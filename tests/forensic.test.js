/**
 * ============================================================
 * KRONOS 360 - Tests: Forensic Engine
 * Pruebas para el motor forense de detección de fraudes
 * ============================================================
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

describe('KRONOS 360 - Forensic Engine Tests', function() {

    let forensic;

    // ============================================================
    // SETUP: Instanciar Forensic Engine antes de cada test
    // ============================================================
    beforeEach(function() {
        forensic = new ForensicEngine();
    });

    // ============================================================
    // TEST 1: Umbrales configurados
    // ============================================================
    test('debe tener umbrales configurados', function() {
        expect(forensic.thresholds).toBeDefined();
        expect(forensic.thresholds.tiempoMinimoEntrePuntos).toBe(600);
        expect(forensic.thresholds.velocidadMaxima).toBe(250);
        expect(forensic.thresholds.saltosGeograficosMaximos).toBe(3);
        expect(forensic.thresholds.confianzaMinima).toBe(60);
    });

    // ============================================================
    // TEST 2: Análisis de folio sin escaneos
    // ============================================================
    test('debe analizar un folio sin escaneos', function() {
        const folio = { id: 'TEST-001' };
        const escaneos = [];
        const result = forensic.analyzeFolio(folio, escaneos);
        
        expect(result).toHaveProperty('folio', 'TEST-001');
        expect(result).toHaveProperty('confianza');
        expect(result.confianza).toBeGreaterThanOrEqual(0);
        expect(result.confianza).toBeLessThanOrEqual(100);
    });

    // ============================================================
    // TEST 3: Análisis de folio con escaneos consistentes
    // ============================================================
    test('debe analizar un folio con escaneos consistentes', function() {
        const folio = { id: 'TEST-001' };
        const escaneos = [
            { timestamp: new Date().toISOString(), ubicacion: 'CDMX' },
            { timestamp: new Date(Date.now() + 7200000).toISOString(), ubicacion: 'GDL' },
            { timestamp: new Date(Date.now() + 14400000).toISOString(), ubicacion: 'MTY' }
        ];
        
        const result = forensic.analyzeFolio(folio, escaneos);
        
        expect(result.confianza).toBeGreaterThanOrEqual(80);
        expect(result.nivel).toBe('AUTÉNTICO');
        expect(result.alerts).toHaveLength(0);
    });

    // ============================================================
    // TEST 4: Análisis de folio con anomalía temporal
    // ============================================================
    test('debe detectar anomalía temporal', function() {
        const folio = { id: 'TEST-001' };
        const escaneos = [
            { timestamp: new Date().toISOString(), ubicacion: 'CDMX' },
            { timestamp: new Date(Date.now() + 10000).toISOString(), ubicacion: 'GDL' } // 10 segundos después
        ];
        
        const result = forensic.analyzeFolio(folio, escaneos);
        
        expect(result.alerts.length).toBeGreaterThan(0);
        expect(result.alerts[0].type).toBe('tiempo');
        expect(result.confianza).toBeLessThan(100);
    });

    // ============================================================
    // TEST 5: Cálculo de distancia
    // ============================================================
    test('debe calcular distancia entre dos puntos', function() {
        // CDMX a GDL ~ 540 km
        const distance = forensic.calculateDistance(19.4326, -99.1332, 20.6597, -103.3496);
        expect(distance).toBeGreaterThan(400);
        expect(distance).toBeLessThan(600);
    });

    // ============================================================
    // TEST 6: Conversión de grados a radianes
    // ============================================================
    test('debe convertir grados a radianes', function() {
        expect(forensic.deg2rad(0)).toBe(0);
        expect(forensic.deg2rad(90)).toBeCloseTo(Math.PI / 2, 5);
        expect(forensic.deg2rad(180)).toBeCloseTo(Math.PI, 5);
    });

    // ============================================================
    // TEST 7: Análisis de geolocalización consistente
    // ============================================================
    test('debe validar geolocalización consistente', function() {
        const escaneos = [
            { 
                timestamp: new Date().toISOString(), 
                ubicacion: 'CDMX',
                ubicacion: { lat: 19.4326, lng: -99.1332 } 
            },
            { 
                timestamp: new Date(Date.now() + 7200000).toISOString(), 
                ubicacion: 'GDL',
                ubicacion: { lat: 20.6597, lng: -103.3496 } 
            }
        ];
        
        const result = forensic.analyzeGeolocation(escaneos);
        expect(result.valid).toBe(true);
    });

    // ============================================================
    // TEST 8: Detección de salto geográfico
    // ============================================================
    test('debe detectar salto geográfico imposible', function() {
        const escaneos = [
            { 
                timestamp: new Date().toISOString(), 
                ubicacion: 'CDMX',
                ubicacion: { lat: 19.4326, lng: -99.1332 } 
            },
            { 
                timestamp: new Date(Date.now() + 600000).toISOString(), // 10 min después
                ubicacion: 'MAD',
                ubicacion: { lat: 40.4168, lng: -3.7038 } 
            }
        ];
        
        const result = forensic.analyzeGeolocation(escaneos);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('saltos');
    });

});

// ============================================================
// EXPORTAR PARA MÓDULOS
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}