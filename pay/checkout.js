/**
 * ============================================================
 * KRONOS 360 - Checkout con créditos
 * Integración con Stripe y gestión de saldo local
 * ============================================================
 * 
 * INSTRUCCIONES:
 * 1. Reemplaza 'pk_live_TU_CLAVE_PUBLICA' con tu clave pública de Stripe
 * 2. Para pruebas usa: pk_test_TU_CLAVE_PUBLICA
 * 3. El webhook de éxito redirige a gracias.html con los créditos
 * 
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

const KRONOS_PAY = {
    // ===== CONFIGURACIÓN =====
    // ⚠️ CAMBIA ESTO: Usa tu clave pública de Stripe
    stripePublicKey: 'pk_live_TU_CLAVE_PUBLICA',
    
    productName: 'KRONOS 360 - Créditos de trazabilidad',
    pricePerCredit: 0.50,      // $0.50 USD por folio
    minCredits: 100,           // Compra mínima de 100 folios ($50 USD)
    currency: 'USD',
    
    // URLs del sistema
    successUrl: window.location.origin + '/pay/gracias.html',
    cancelUrl: window.location.origin + '/#planes',
    
    // ===== INICIALIZAR =====
    init() {
        console.log('💳 KRONOS 360 - Checkout v1.0.0');
        console.log('🔒 Sellado con KRONOS-MD-33-467162326');
        this.bindEvents();
        this.mostrarSaldo();
    },

    // ===== MOSTRAR SALDO ACTUAL =====
    mostrarSaldo() {
        const saldo = this.obtenerCredits();
        const elemento = document.getElementById('saldo-creditos');
        if (elemento) {
            elemento.textContent = saldo;
        }
        return saldo;
    },

    // ===== OBTENER CRÉDITOS DESDE localStorage =====
    obtenerCredits() {
        try {
            const vault = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
            return typeof vault.balance === 'number' ? vault.balance : 0;
        } catch {
            return 0;
        }
    },

    // ===== AGREGAR CRÉDITOS (se llama desde gracias.html) =====
    agregarCredits(cantidad) {
        if (typeof cantidad !== 'number' || cantidad <= 0) return false;
        
        const actual = this.obtenerCredits();
        const nuevo = actual + cantidad;
        
        try {
            localStorage.setItem('kronos_credits', JSON.stringify({ 
                balance: nuevo,
                ultima_actualizacion: new Date().toISOString()
            }));
            return nuevo;
        } catch {
            return false;
        }
    },

    // ===== GASTAR CRÉDITO (al generar un folio) =====
    gastarCredito() {
        const actual = this.obtenerCredits();
        if (actual <= 0) return false;
        
        const nuevo = actual - 1;
        try {
            localStorage.setItem('kronos_credits', JSON.stringify({ 
                balance: nuevo,
                ultima_actualizacion: new Date().toISOString()
            }));
            return true;
        } catch {
            return false;
        }
    },

    // ===== OBTENER HISTORIAL DE TRANSACCIONES =====
    obtenerHistorial() {
        try {
            return JSON.parse(localStorage.getItem('kronos_transacciones') || '[]');
        } catch {
            return [];
        }
    },

    // ===== REGISTRAR TRANSACCIÓN =====
    registrarTransaccion(tipo, cantidad, metodo, referencia = null) {
        const historial = this.obtenerHistorial();
        historial.push({
            id: 'TXN-' + Date.now().toString(36).toUpperCase(),
            tipo: tipo,
            cantidad: cantidad,
            metodo: metodo,
            referencia: referencia,
            saldo_restante: this.obtenerCredits(),
            timestamp: new Date().toISOString()
        });
        
        try {
            localStorage.setItem('kronos_transacciones', JSON.stringify(historial));
            return true;
        } catch {
            return false;
        }
    },

    // ===== BIND EVENTOS =====
    bindEvents() {
        // Botón de compra en la landing
        document.querySelectorAll('.btn-pay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startCheckout();
            });
        });

        // Botón de "Comprar más créditos" en dashboard
        const btnRecargar = document.getElementById('btn-recargar');
        if (btnRecargar) {
            btnRecargar.addEventListener('click', () => this.startCheckout());
        }

        // Input de cantidad de créditos (si existe)
        const inputCantidad = document.getElementById('cantidad-creditos');
        if (inputCantidad) {
            inputCantidad.addEventListener('change', () => {
                this.actualizarPrecio();
            });
        }
    },

    // ===== ACTUALIZAR PRECIO EN VIVO =====
    actualizarPrecio() {
        const input = document.getElementById('cantidad-creditos');
        const precioElement = document.getElementById('precio-total');
        
        if (!input || !precioElement) return;
        
        const cantidad = parseInt(input.value) || this.minCredits;
        const total = (cantidad * this.pricePerCredit).toFixed(2);
        precioElement.textContent = `$${total} USD`;
    },

    // ===== INICIAR CHECKOUT (Stripe) =====
    async startCheckout() {
        // Validar que Stripe esté cargado
        if (typeof Stripe === 'undefined') {
            alert('⚠️ La pasarela de pagos no está disponible. Intenta de nuevo.');
            console.error('❌ Stripe no está definido. Verifica que cargaste stripe.js');
            return;
        }

        // Obtener cantidad
        const input = document.getElementById('cantidad-creditos');
        let cantidad = this.minCredits;
        
        if (input) {
            const parsed = parseInt(input.value);
            if (!isNaN(parsed) && parsed > 0) {
                cantidad = parsed;
            }
        }

        // Validar cantidad mínima
        if (cantidad < this.minCredits) {
            alert(`⚠️ La compra mínima es de ${this.minCredits} folios ($${(this.minCredits * this.pricePerCredit).toFixed(2)} USD).`);
            if (input) input.value = this.minCredits;
            return;
        }

        // Calcular monto
        const monto = (cantidad * this.pricePerCredit).toFixed(2);

        // Verificar conexión a internet
        if (!navigator.onLine) {
            alert('⚠️ No hay conexión a internet. Conéctate para realizar el pago.');
            return;
        }

        // ===== Stripe =====
        const stripe = Stripe(this.stripePublicKey);
        
        try {
            // Mostrar estado de carga
            const btn = document.querySelector('.btn-pay');
            if (btn) {
                btn.textContent = '⏳ Procesando...';
                btn.disabled = true;
            }

            // 🔧 CAMBIA ESTO: Reemplaza con tu endpoint de backend
            // Si usas Netlify Functions, Vercel Serverless, o tu propio backend
            const response = await fetch('https://tu-backend.com/api/create-checkout-session', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    cantidad: cantidad,
                    monto: monto,
                    currency: this.currency,
                    product: this.productName,
                    success_url: this.successUrl + `?credits=${cantidad}`,
                    cancel_url: this.cancelUrl,
                    metadata: {
                        credits: cantidad,
                        product: 'kronos-360',
                        version: '1.0.0'
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const session = await response.json();
            
            if (session.id) {
                // Redirigir a Stripe Checkout
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                
                if (result.error) {
                    console.error('❌ Error de Stripe:', result.error);
                    alert('❌ Error al iniciar el pago: ' + result.error.message);
                    this.restaurarBoton();
                }
            } else {
                throw new Error('No se recibió session ID');
            }
        } catch (error) {
            console.error('❌ Error de checkout:', error);
            
            // Si es un error de red, modo demo
            if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
                alert('⚠️ No se pudo conectar al servidor. ¿Quieres probar en modo demo?');
                if (confirm('🔬 Modo demo: Simular pago sin Stripe')) {
                    this.simulatePayment(cantidad);
                }
            } else {
                alert('❌ Error al conectar con la pasarela de pagos. Intenta de nuevo.');
            }
            this.restaurarBoton();
        }
    },

    // ===== RESTAURAR BOTÓN =====
    restaurarBoton() {
        const btn = document.querySelector('.btn-pay');
        if (btn) {
            btn.textContent = '💳 Comprar créditos';
            btn.disabled = false;
        }
    },

    // ===== SIMULACIÓN DE PAGO (demo) =====
    simulatePayment(cantidad) {
        if (!confirm(`💳 Modo demo: ¿Comprar ${cantidad} folios por $${(cantidad * this.pricePerCredit).toFixed(2)} USD?`)) {
            this.restaurarBoton();
            return;
        }

        try {
            // Generar folio de transacción
            const folioTransaccion = 'DEMO-' + Date.now().toString(36).toUpperCase();
            
            // Guardar en localStorage
            localStorage.setItem('kronos_last_purchase', JSON.stringify({
                credits: cantidad,
                folio: folioTransaccion,
                timestamp: new Date().toISOString(),
                demo: true
            }));

            // Registrar transacción
            this.registrarTransaccion('compra_demo', cantidad, 'demo', folioTransaccion);

            // Agregar créditos
            this.agregarCredits(cantidad);

            // Redirigir
            window.location.href = this.successUrl + `?credits=${cantidad}&demo=true`;

        } catch (error) {
            console.error('❌ Error en demo:', error);
            alert('❌ Error en la simulación de pago.');
            this.restaurarBoton();
        }
    },

    // ===== VERIFICAR SALDO PARA GENERAR FOLIO =====
    verificarSaldo(cantidad = 1) {
        const saldo = this.obtenerCredits();
        if (saldo < cantidad) {
            return {
                disponible: false,
                saldo: saldo,
                faltante: cantidad - saldo,
                mensaje: `Saldo insuficiente. Te faltan ${cantidad - saldo} créditos.`
            };
        }
        return {
            disponible: true,
            saldo: saldo
        };
    }
};

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el DOM esté listo
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        KRONOS_PAY.init();
    } else {
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
                KRONOS_PAY.init();
            }
        });
    }
});

// ===== EXPORTAR PARA MÓDULOS (opcional) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KRONOS_PAY;
}

// ===== EXPONER GLOBALMENTE =====
window.KRONOS_PAY = KRONOS_PAY;

console.log('✅ KRONOS 360 - Checkout cargado correctamente');
console.log('🔒 Sellado con KRONOS-MD-33-467162326');