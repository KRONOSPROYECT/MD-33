
---

## 📄 `docs/data-retention.md`

```markdown
# Política de Retención de Datos - KRONOS 360

## 1. Períodos de retención

| Tipo de datos | Período | Justificación |
|---------------|---------|---------------|
| Folios activos | Indefinido | Necesidad de trazabilidad |
| Escaneos | 365 días | Auditoría y análisis |
| Sellos | Indefinido | Integridad de la cadena |
| Registros de auditoría | 365 días | Cumplimiento legal |
| Datos de documentos | 30 días | Verificación temporal |
| Transacciones | 365 días | Historial de compras |
| Logs de errores | 90 días | Debugging y monitoreo |

## 2. Proceso de eliminación

### Automática

- Escaneos > 365 días: eliminación automática
- Documentos no verificados > 30 días: eliminación automática
- Logs de errores > 90 días: eliminación automática

### Manual

- Por solicitud del usuario (derechos ARCO)
- Por violación de seguridad
- Por cierre de cuenta

### Forzada

- Por requerimiento legal
- Por orden judicial

## 3. Backup

| Tipo | Frecuencia | Retención | Ubicación |
|------|------------|-----------|-----------|
| Local (navegador) | Tiempo real | Indefinido | Dispositivo |
| Exportación manual | A solicitud | Indefinido | Archivo descargado |
| Datos de usuario | Tiempo real | Indefinido | localStorage/IndexedDB |

## 4. Excepciones

- Los folios revocados se mantienen para evitar reuso
- Los sellos no se eliminan para mantener la cadena
- Registros de auditoría pueden extenderse por requerimiento legal
- Datos de transacciones pueden extenderse por obligación fiscal

## 5. Responsabilidades

| Rol | Responsabilidad |
|-----|-----------------|
| Usuario | Gestionar sus propios datos |
| Sistema | Eliminación automática según política |
| Administrador | Supervisión y cumplimiento |

## 6. Derechos del usuario

- **Acceso**: Obtener copia de sus datos
- **Rectificación**: Corregir datos incorrectos
- **Supresión**: Eliminar datos personales
- **Limitación**: Restringir procesamiento
- **Portabilidad**: Exportar datos en formato estándar

## 7. Contacto

- **Privacidad**: privacidad@kronos360.com
- **Soporte**: soporte@kronos360.com

---

*Última actualización: 2026-09-03*