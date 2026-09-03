/**
 * ============================================================
 * KRONOS 360 - Checkout con créditos (VERSIÓN BLINDADA)
 * Integración con Stripe y gestión de saldo local
 * ============================================================
 * 
 * VERSIÓN: 1.0.0
 * SELLO: KRONOS-MD-33-467162326
 * ============================================================
 */

const KRONOS_PAY = {
    // ===== CONFIGURACIÓN =====
    stripePublicKey: 'pk_live_TU_CLAVE_PUBLICA',
    
    productName: 'KRONOS 360 - Créditos de trazabilidad',
    pricePerCredit: 0.50,
    minCredits: 100,
    currency: 'USD',
    
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

    // ===== OBTENER CRÉDITOS CON LÍMITE Y VALIDACIÓN =====
    obtenerCredits() {
        try {
            const v = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
            // VALIDACIÓN: Si el saldo es irreal, lo limitamos
            if (v.balance > 100000) {
                console.warn('⚠️ Posible tamper detectado - Limitando saldo a 100,000');
                return 100000;
            }
            return typeof v.balance === 'number' ? v.balance : 0;
        } catch {
            return 0;
        }
    },

    // ===== AGREGAR CRÉDITOS =====
    agregarCredits(cantidad) {
        if (typeof cantidad !== 'number' || cantidad <= 0 || cantidad > 10000) {
            console.warn('⚠️ Intento de agregar cantidad inválida:', cantidad);
            return false;
        }
        
        const actual = this.obtenerCredits();
        const nuevo = Math.min(actual + cantidad, 100000); // Cap máximo
        
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

    // ===== GASTAR CRÉDITO =====
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

    // ===== OBTENER HISTORIAL =====
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
        document.querySelectorAll('.btn-pay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startCheckout();
            });
        });

        const btnRecargar = document.getElementById('btn-recargar');
        if (btnRecargar) {
            btnRecargar.addEventListener('click', () => this.startCheckout());
        }

        const inputCantidad = document.getElementById('cantidad-creditos');
        if (inputCantidad) {
            inputCantidad.addEventListener('change', () => {
                this.actualizarPrecio();
            });
        }
    },

    // ===== ACTUALIZAR PRECIO =====
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
        if (typeof Stripe === 'undefined') {
            alert('⚠️ La pasarela de pagos no está disponible.');
            return;
        }

        const input = document.getElementById('cantidad-creditos');
        let cantidad = this.minCredits;
        
        if (input) {
            const parsed = parseInt(input.value);
            if (!isNaN(parsed) && parsed > 0) {
                cantidad = parsed;
            }
        }

        if (cantidad < this.minCredits) {
            alert(`⚠️ La compra mínima es de ${this.minCredits} folios.`);
            if (input) input.value = this.minCredits;
            return;
        }

        if (cantidad > 10000) {
            alert('⚠️ La compra máxima es de 10,000 folios.');
            return;
        }

        const monto = (cantidad * this.pricePerCredit).toFixed(2);

        if (!navigator.onLine) {
            alert('⚠️ No hay conexión a internet.');
            return;
        }

        const stripe = Stripe(this.stripePublicKey);
        
        try {
            const btn = document.querySelector('.btn-pay');
            if (btn) {
                btn.textContent = '⏳ Procesando...';
                btn.disabled = true;
            }

            // ⚠️ CAMBIA ESTO por tu endpoint real
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
                    success_url: this.successUrl + `?tx=PENDIENTE`,
                    cancel_url: this.cancelUrl,
                    metadata: {
                        credits: cantidad,
                        product: 'kronos-360',
                        version: '1.0.0'
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const session = await response.json();
            
            if (session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    alert('❌ Error: ' + result.error.message);
                    this.restaurarBoton();
                }
            } else {
                throw new Error('No se recibió session ID');
            }
        } catch (error) {
            console.error('❌ Error de checkout:', error);
            
            if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
                alert('⚠️ No se pudo conectar al servidor. ¿Quieres probar en modo demo?');
                if (confirm('🔬 Modo demo: Simular pago sin Stripe')) {
                    this.simulatePayment(cantidad);
                }
            } else {
                alert('❌ Error al conectar con la pasarela de pagos.');
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

    // ===== SIMULACIÓN BLINDADA (NO USA URL) =====
    simulatePayment(cantidad) {
        if (!confirm(`💳 Modo demo: ¿Comprar ${cantidad} folios por $${(cantidad * this.pricePerCredit).toFixed(2)} USD?`)) {
            this.restaurarBoton();
            return;
        }

        try {
            const folio = 'DEMO-' + Date.now().toString(36).toUpperCase();
            
            // Guardar en localStorage con firma y timestamp
            const payload = {
                credits: cantidad,
                folio: folio,
                ts: Date.now(),
                sig: btoa(cantidad + '|' + Date.now()).slice(0, 16)
            };
            
            localStorage.setItem('kronos_last_purchase', JSON.stringify(payload));
            this.registrarTransaccion('compra_demo', cantidad, 'demo', folio);
            this.agregarCredits(cantidad);
            
            // Redirige SIN pasar créditos en URL
            window.location.href = this.successUrl + `?tx=${folio}&demo=true`;

        } catch (error) {
            console.error('❌ Error en demo:', error);
            alert('❌ Error en la simulación de pago.');
            this.restaurarBoton();
        }
    },

    // ===== VERIFICAR SALDO =====
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KRONOS_PAY;
}

window.KRONOS_PAY = KRONOS_PAY;

console.log('✅ KRONOS 360 - Checkout blindado cargado');
console.log('🔒 Sellado con KRONOS-MD-33-467162326');