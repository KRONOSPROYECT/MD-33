# Plan de Respuesta a Incidentes - KRONOS 360

## 1. Tipos de incidentes

| Nivel | Descripción | Ejemplo |
|-------|-------------|---------|
| **Crítico** | Compromiso del sistema | Fuga de datos, manipulación |
| **Alto** | Violación de integridad | Folio falsificado detectado |
| **Medio** | Intento de ataque | Escaneos sospechosos |
| **Bajo** | Comportamiento anómalo | Errores no críticos |

## 2. Respuesta por nivel

### Crítico

1. Aislar el sistema
2. Notificar a seguridad
3. Revocar folios comprometidos
4. Generar reporte forense
5. Notificar a afectados
6. Actualizar lista de revocaciones
7. Revisar logs de acceso

### Alto

1. Verificar integridad
2. Aislar folio afectado
3. Actualizar lista de revocaciones
4. Monitorear actividad
5. Generar reporte de incidente

### Medio

1. Registrar evento
2. Analizar patrón
3. Fortalecer controles
4. Monitoreo adicional

### Bajo

1. Registrar en log
2. Revisión periódica
3. Notificar al usuario

## 3. Contactos

| Rol | Contacto |
|-----|----------|
| Seguridad | security@kronos360.com |
| Incidente | incident@kronos360.com |
| Legal | legal@kronos360.com |
| Soporte | soporte@kronos360.com |

## 4. Registro de incidentes

Todos los incidentes deben registrarse con:

- Fecha y hora
- Tipo de incidente
- Descripción detallada
- Acciones tomadas
- Resultado
- Lecciones aprendidas

## 5. Plantilla de reporte

```markdown
# Reporte de Incidente - KRONOS 360

## Información básica
- **ID del incidente**: INC-YYYY-MM-DD-001
- **Fecha y hora**: [timestamp]
- **Reportado por**: [nombre]
- **Nivel**: [Crítico/Alto/Medio/Bajo]

## Descripción
[Descripción detallada del incidente]

## Impacto
- **Activos afectados**: [lista]
- **Usuarios afectados**: [cantidad]

## Acciones tomadas
1. [acción 1]
2. [acción 2]
3. [acción 3]

## Estado actual
- [ ] Contenido
- [ ] En investigación
- [ ] Resuelto
- [ ] Cerrado

## Lecciones aprendidas
- [lección 1]
- [lección 2]

## Firma
[responsable]