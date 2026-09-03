function generarFolio() {
    const año = new Date().getFullYear();
    const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
    const numero = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `AF-${año}-${codigo}-${numero}`;
}

function generarLote(cantidad = 10) {
    const folios = [];
    for (let i = 0; i < cantidad; i++) {
        folios.push({
            id: generarFolio(),
            estado: 'activo',
            creado: new Date().toISOString(),
            escaneos: [],
            nivelConfianza: 100
        });
    }
    return folios;
}

function guardarFolios(folios) {
    localStorage.setItem('folios', JSON.stringify(folios));
}

function cargarFolios() {
    const data = localStorage.getItem('folios');
    return data ? JSON.parse(data) : [];
}

function cargarFoliosDemo() {
    const demo = generarLote(10);
    demo[0].escaneos = [
        { timestamp: new Date().toISOString(), ubicacion: 'CDMX', descripcion: 'Origen' },
        { timestamp: new Date(Date.now() + 3600000).toISOString(), ubicacion: 'GDL', descripcion: 'Distribución' },
        { timestamp: new Date(Date.now() + 7200000).toISOString(), ubicacion: 'MTY', descripcion: 'Almacén' }
    ];
    demo[0].nivelConfianza = 92;
    
    if (typeof quantumSeal !== 'undefined') {
        const seal = new QuantumSeal();
        demo[0].seal = seal.createSeal(demo[0]);
    }
    
    guardarFolios(demo);
    alert(`✅ Se generaron ${demo.length} folios de ejemplo`);
    document.getElementById('folioInput').value = demo[0].id;
}