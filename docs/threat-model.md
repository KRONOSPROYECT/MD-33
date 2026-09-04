# Modelo de Amenazas - KRONOS 360

## 1. Activos a proteger

| Activo | Descripción | Nivel de riesgo |
|--------|-------------|-----------------|
| Folios | Identificadores únicos de productos | Crítico |
| Hashes | Integridad de la cadena de confianza | Crítico |
| Datos de auditoría | Registros de trazabilidad | Alto |
| Documentos | Hashes de documentos verificados | Alto |
| Configuración | Parámetros del sistema | Medio |
| Créditos | Sistema de pago y saldo | Alto |

## 2. Amenazas identificadas

### Amenazas críticas

| Amenaza | Impacto | Probabilidad | Mitigación |
|---------|---------|--------------|------------|
| Manipulación de localStorage | Pérdida de integridad | Media | Verificación de integridad + firma |
| Clonación de folios | Fraude | Alta | Hash encadenado + revocación |
| Ataque XSS | Compromiso de datos | Media | CSP + sanitización |

### Amenazas altas

| Amenaza | Impacto | Probabilidad | Mitigación |
|---------|---------|--------------|------------|
| Intercepción de datos | Fuga de información | Baja | HTTPS obligatorio |
| Ataque de fuerza bruta | Generación de folios | Media | Longitud de folios + checksum |
| Inyección de créditos | Pérdida económica | Media | Firma + validación + límites |

### Amenazas medias

| Amenaza | Impacto | Probabilidad | Mitigación |
|---------|---------|--------------|------------|
| Pérdida de datos | Falta de trazabilidad | Media | Exportación periódica |
| Manipulación del cliente | Datos falsos | Alta | Validación de esquemas |
| Replay attack | Doble uso de compra | Media | Anti-replay con timestamp |

## 3. Suposiciones de seguridad

- El navegador es seguro
- HTTPS está habilitado
- El usuario no comparte su dispositivo
- Los datos en localStorage no son accesibles por terceros
- El usuario utiliza un navegador actualizado

## 4. Controles implementados

| Control | Implementación |
|---------|----------------|
| Integrity Check | `integrity-check.js` |
| Hash encadenado | `quantum-seal.js` |
| Validación de esquemas | `schemas/*.schema.json` |
| CSP | Headers de seguridad |
| Sanitización | Sin innerHTML no sanitizado |
| Offline | Service Worker |
| Anti-replay | `kronos_used_` en localStorage |
| Firma de compras | Hash + timestamp en `checkout.js` |
| Límite de créditos | Cap máximo de 100,000 |

## 5. Plan de respuesta

| Incidente | Acción | Responsable |
|-----------|--------|-------------|
| Folio comprometido | Revocar en `revocations.json` | Admin |
| Intento de XSS | Revisar CSP y logs | Security |
| Abuso de créditos | Validar firmas y limites | System |
| Pérdida de datos | Restaurar desde backup | User |

---

*Última actualización: 2026-09-03*