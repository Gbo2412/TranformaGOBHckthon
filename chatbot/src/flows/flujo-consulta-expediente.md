# Flujo: Consulta de Expediente

1. Bot saluda y pide número de expediente.
2. Bot pide clave de acceso.
3. Bot consulta `/api/expedientes/consulta`.
4. Bot devuelve estado, fecha de última actualización y siguiente paso.
5. Bot ofrece: ¿algo más? → notificaciones, descargar constancia, hablar con asesor.

## Errores
- Expediente no encontrado → sugerir verificar dígitos / mesa de partes.
- Clave inválida → ofrecer recuperación.
