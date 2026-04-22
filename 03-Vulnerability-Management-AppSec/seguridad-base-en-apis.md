# Seguridad en Aplicaciones y APIs (AppSec)

## 🗝️ Conceptos Fundamentales
Para que una API sea segura, debe cumplir con el modelo **CIA** (Confidencialidad, Integridad y Disponibilidad).

## 🛡️ Mecanismos de Protección
1. **Autenticación (JWT):** No basta con usuario y clave; usamos Tokens temporales cifrados.
2. **Sanitización de Datos:** Nunca confiar en lo que el usuario envía para evitar inyecciones.
3. **CORS (Cross-Origin Resource Sharing):** Decirle a la API que solo acepte peticiones desde MI propia web.

## 🧪 Herramientas de Auditoría
- **Postman/Insomnia:** Para probar los Endpoints.
- **OWASP ZAP:** Para buscar fallos automáticos en la API.
