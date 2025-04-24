
# 📋 Planificación de Plataforma Web de Solicitud de Personal (MVP)

## ✅ Fase 1 – Producto Mínimo Viable (MVP)

### Semana 1 – Back y Front funcionales en local

**Día 1–2: Setup básico**
- [x] Backend Flask funcional con `/ping` y `/solicitudes`
- [x] PostgreSQL conectado vía SQLAlchemy
- [x] Docker + Docker Compose corriendo localmente

**Día 3–4: Frontend React**
- [x] Crear app React
- [x] Instalar y configurar TailwindCSS
- [x] Hacer ping a la API desde el frontend (`/ping`)

**Día 5–7: Formulario + listado**
- [ ] Formulario en React que envíe a `/solicitudes`
- [ ] Página que muestre las solicitudes existentes (GET)

### Semana 2 – Estabilización y despliegue

**Día 8–9: Validaciones y estado**
- [ ] Validaciones frontend y backend mínimas
- [ ] Mostrar mensajes de éxito/error

**Día 10–11: Dockerizar frontend**
- [ ] Dockerfile para frontend
- [ ] Agregar a `docker-compose.yml`

**Día 12–14: Despliegue**
- [ ] Subir a Render, Railway o VPS personal
- [ ] Probar desde navegador externo

## 💰 Costos asociados al MVP

| Recurso                        | Opción gratuita         | Opción pagada                | Costo estimado |
|-------------------------------|-------------------------|------------------------------|----------------|
| Hosting backend (Render)      | Sí, con límite de uso   | Desde $7/mes                 | ~$7            |
| Hosting frontend (Vercel)     | Sí                      | Opcional                     | $0–5           |
| PostgreSQL (Render/Railway)   | Sí, con límite de datos | Desde $5–10/mes              | ~$5            |
| Dominio personalizado         | No                      | Sí                           | ~$10–15/año    |
| Certificado SSL               | Sí (Let’s Encrypt)      | Incluido en la mayoría       | $0             |

**Total mensual mínimo:** $0–12 USD  
**Total mensual completo:** ~$15–25 USD

## 🚀 Proyección a solución completa

Características futuras:
- Autenticación de usuarios (JWT)
- Firma digital (DocuSign, Firma Electrónica)
- Control de estados, historial, y documentos
- Notificaciones por correo
- Dashboard avanzado
- CI/CD + hosting profesional
