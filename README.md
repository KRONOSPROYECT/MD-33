# 🔒 KRONOS 360

## Capa de Confianza Anti-Falsificación

> *"El equilibrio no es quietud, es la danza entre creación y auditoría."*

---

## 🎯 Propósito

Sistema de trazabilidad y antifalsificación con sellado **KRONOS-MD-33-467162326**.

- ✅ 100% GitHub Pages
- ✅ Sin servidor
- ✅ Offline con Service Worker
- ✅ PWA instalable
- ✅ Verificación de documentos
- ✅ Hash encadenado

---

## 🔐 Sellos

| Sello | Valor |
|-------|-------|
| Genesis | KRONOS-MD-33-467162326 |
| Algoritmo | SHA-256 + MD-33 |
| Números | 4-6-7-16-23-26 |
| Versión | 1.0.0 |

---

## 📦 Estructura
MD-33/
├── index.html                 # Landing principal · Capa de Confianza
├── verify.html                # Verificador de folios y documentos
├── dashboard.html             # Panel de administración (demo local)
├── manifest.json              # PWA · instalable en móviles
├── sw.js                      # Service Worker · offline
├── 404.html                   # Página de error personalizada
├── robots.txt                 # Control de crawlers
├── sitemap.xml                # Mapa del sitio para SEO
├── security.txt               # Contacto de seguridad
├── .gitignore                 # Archivos ignorados por Git
├── CHANGELOG.md               # Historial de versiones
├── README.md                  # Documentación principal
│
├── css/
│   ├── style.css              # Estilos globales
│   ├── responsive.css         # Adaptación a móviles/tablets
│   └── accessibility.css      # WCAG 2.1 AA · alto contraste
│
├── js/
│   ├── main.js                # Event listeners · inicialización
│   ├── config.js              # Configuración centralizada
│   ├── folio-generator.js     # Generación de folios únicos
│   ├── trazabilidad.js        # Auditoría y trazabilidad
│   ├── dashboard.js           # Panel de administración
│   ├── quantum-seal.js        # Hash encadenado KRONOS-MD-33
│   ├── offline-vault.js       # Almacenamiento IndexedDB · offline
│   ├── forensic.js            # Motor forense · detección de fraudes
│   ├── document-verifier.js   # Verificador de documentos (hash)
│   ├── qr-generator.js        # Generador de códigos QR
│   ├── audit-exporter.js      # Exportación forense (JSON)
│   ├── integrity-check.js     # Verificación de integridad del sistema
│   ├── privacy.js             # Políticas de privacidad · GDPR
│   └── error-handler.js       # Manejo centralizado de errores
│
├── assets/
│   ├── icons/                 # (opcional) iconos para PWA
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── data/
│       ├── folios-demo.json   # Datos de ejemplo para la demo
│       ├── compliance.json    # Matriz ISO/NOM (informativa)
│       ├── revocations.json   # Lista de folios revocados
│       └── schema-version.json # Versionado de esquemas
│
├── schemas/
│   ├── folio.schema.json      # Esquema de validación de folio
│   ├── certificate.schema.json # Esquema de certificado
│   ├── audit-event.schema.json # Esquema de eventos de auditoría
│   └── document-result.schema.json # Esquema de resultado de documento
│
├── docs/
│   ├── threat-model.md        # Modelo de amenazas
│   ├── privacy-model.md       # Política de privacidad
│   ├── incident-response.md   # Plan de respuesta a incidentes
│   └── data-retention.md      # Política de retención de datos
│
├── tests/
│   ├── folio-generator.test.js
│   ├── quantum-seal.test.js
│   ├── offline-vault.test.js
│   ├── forensic.test.js
│   └── document-verifier.test.js
│
└── .well-known/
    └── security.txt           # Punto de contacto para seguridad (estándar)