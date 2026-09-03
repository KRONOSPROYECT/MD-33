document.addEventListener('DOMContentLoaded', function() {
    // Botón auditar
    const btnAuditar = document.getElementById('btn-auditar');
    if (btnAuditar) {
        btnAuditar.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof auditarFolio === 'function') {
                auditarFolio();
            }
        });
    }

    // Botón demo
    const btnDemo = document.getElementById('btn-demo');
    if (btnDemo) {
        btnDemo.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof cargarFoliosDemo === 'function') {
                cargarFoliosDemo();
            }
        });
    }

    // Botones "Próximamente"
    document.querySelectorAll('.btn-coming-soon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🚀 Próximamente disponible');
        });
    });

    // Botón "Contactar"
    const btnContact = document.querySelector('.btn-contact');
    if (btnContact) {
        btnContact.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📞 Contacta a ventas: ventas@kronos360.com');
        });
    }

    // Enter para auditar
    const folioInput = document.getElementById('folioInput');
    if (folioInput) {
        folioInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const btn = document.getElementById('btn-auditar');
                if (btn) btn.click();
            }
        });
    }

    console.log('✅ KRONOS 360 v1.0.0 cargado');
});