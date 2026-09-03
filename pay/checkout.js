/**
 * ============================================================
 * KRONOS 360 - Checkout con créditos
 * Integración con Stripe y gestión de saldo local
 * ============================================================
 */

const KRONOS_PAY = {
    // ===== CONFIGURACIÓN =====
    stripePublicKey: 'pk_test_TU_CLAVE_PUBLICA', // ⚠️ Reemplazar
    productName: 'KRONOS 360 - Créditos de trazabilidad',
    pricePerCredit: 0.50,  // $0.50 USD por folio
    minCredits: 100,       // Compra mínima de 100 folios
    currency: 'USD',
    successUrl: 'https://KRONOSPROYECT.github.io/MD-33/pay/gracias.html',
    cancelUrl: 'https://KRONOSPROYECT.github.io/MD-33/#planes',

    // ===== INICIALIZAR =====
    init() {
        console.log('💳 KRONOS 360 - Checkout con créditos');
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

    // ===== OBTENER CRÉDITOS DESDE OFFLINE-VAULT =====
    obtenerCredits() {
        try {
            const vault = JSON.parse(localStorage.getItem('kronos_credits') || '{"balance":0}');
            return vault.balance || 0;
        } catch {
            return 0;
        }
    },

    // ===== AGREGAR CRÉDITOS (se llama desde gracias.html) =====
    agregarCredits(cantidad) {
        const actual = this.obtenerCredits();
        const nuevo = actual + cantidad;
        localStorage.setItem('kronos_credits', JSON.stringify({ balance: nuevo }));
        return nuevo;
    },

    // ===== GASTAR CRÉDITO (al generar un folio) =====
    gastarCredito() {
        const actual = this.obtenerCredits();
        if (actual <= 0) return false;
        const nuevo = actual - 1;
        localStorage.setItem('kronos_credits', JSON.stringify({ balance: nuevo }));
        return true;
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
    },

    // ===== INICIAR CHECKOUT (Stripe) =====
    async startCheckout() {
        const cantidad = parseInt(document.getElementById('cantidad-creditos')?.value) || this.minCredits;
        if (cantidad < this.minCredits) {
            alert(`La compra mínima es de ${this.minCredits} folios.`);
            return;
        }

        const monto = (cantidad * this.pricePerCredit).toFixed(2);

        // Si Stripe está disponible
        if (typeof Stripe !== 'undefined') {
            const stripe = Stripe(this.stripePublicKey);
            try {
                const response = await fetch('https://tu-backend.com/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cantidad: cantidad,
                        monto: monto,
                        currency: this.currency,
                        product: this.productName,
                        success_url: this.successUrl + `?credits=${cantidad}`,
                        cancel_url: this.cancelUrl
                    })
                });
                const session = await response.json();
                if (session.id) {
                    const result = await stripe.redirectToCheckout({ sessionId: session.id });
                    if (result.error) {
                        alert('Error al iniciar el pago: ' + result.error.message);
                    }
                } else {
                    alert('No se pudo crear la sesión de pago.');
                }
            } catch (error) {
                console.error('Error de checkout:', error);
                alert('Error al conectar con la pasarela de pagos.');
            }
        } else {
            // Modo demo (sin Stripe)
            this.simulatePayment(cantidad);
        }
    },

    // ===== SIMULACIÓN DE PAGO (demo) =====
    simulatePayment(cantidad) {
        if (confirm(`💳 Modo demo: ¿Comprar ${cantidad} folios por $${(cantidad * this.pricePerCredit).toFixed(2)} USD?`)) {
            // Simular éxito
            const folioTransaccion = 'KRONOS-' + Date.now().toString(36).toUpperCase();
            localStorage.setItem('kronos_last_purchase', JSON.stringify({
                credits: cantidad,
                folio: folioTransaccion,
                timestamp: new Date().toISOString()
            }));
            window.location.href = this.successUrl + `?credits=${cantidad}&demo=true`;
        }
    }
};

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => KRONOS_PAY.init());

// Exportar para módulos (opcional)
if (typeof module !== 'undefined') {
    module.exports = KRONOS_PAY;
}