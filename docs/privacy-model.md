# Modelo de Privacidad - KRONOS 360

## 1. Datos almacenados

### Almacenamiento local (navegador)

- **Folios**: Identificadores únicos y metadatos
- **Escaneos**: Registros de auditoría con timestamp
- **Sellos**: Hash encadenado KRONOS-MD-33
- **Documentos**: Hashes de documentos verificados
- **Créditos**: Saldo de créditos disponibles
- **Transacciones**: Historial de compras
- **Preferencias**: Configuración del usuario

### Datos que NO se almacenan

- ❌ Imágenes originales de documentos
- ❌ Contenido de archivos (solo hash)
- ❌ Datos biométricos
- ❌ Información de tarjetas de crédito
- ❌ Contraseñas o credenciales
- ❌ Geolocalización sin consentimiento

## 2. Retención de datos

| Tipo de datos | Período | Justificación |
|---------------|---------|---------------|
| Folios activos | Indefinido | Necesidad de trazabilidad |
| Escaneos | 365 días | Auditoría y análisis |
| Sellos | Indefinido | Integridad de la cadena |
| Registros de auditoría | 365 días | Cumplimiento legal |
| Datos de documentos | 30 días | Verificación temporal |
| Transacciones | 365 días | Historial de compras |

## 3. Derechos del usuario (ARCO)

- **Acceso**: Exportar todos los datos
- **Rectificación**: Corregir datos incorrectos
- **Supresión**: Eliminar datos de un folio
- **Limitación**: Restringir procesamiento
- **Portabilidad**: Exportar en formato estándar

### Procedimiento para ejercer derechos

1. Enviar correo a `privacidad@kronos360.com`
2. Incluir nombre completo
3. Descripción del derecho a ejercer
4. Adjuntar identificación oficial
5. Tiempo de respuesta: 20 días hábiles

## 4. Seguridad

- **En tránsito**: HTTPS (requerido)
- **En reposo**: localStorage (protegido por navegador)
- **Hash**: SHA-256
- **Sellado**: KRONOS-MD-33
- **Control de acceso**: Sin servidor, datos locales

## 5. Consentimiento

El usuario debe aceptar explícitamente el almacenamiento de datos antes de usar el sistema.

### Retiro de consentimiento

- Eliminar datos desde el Dashboard
- Borrar localStorage del navegador
- Dejar de utilizar el Sistema

## 6. Contacto

- **Privacidad**: privacidad@kronos360.com
- **Seguridad**: security@kronos360.com

---

*Última actualización: 2026-09-03*