# ClinicAI — Landing Page

> **Medicina de Vanguardia con Inteligencia Artificial**
> Landing page premium para una clínica médica ficticia. Proyecto de portafolio con integración a n8n via Webhook.

![ClinicAI Preview](images/hero_visual.png)

---

## 📋 Descripción

ClinicAI es una landing page de estilo **Dark Luxury** diseñada para una clínica médica potenciada por IA. Cuenta con guardia 24hs, Shock Room y más de 10 especialidades médicas. El proyecto integra un formulario de solicitud de turnos que envía los datos directamente a un workflow de **n8n** via webhook.

---

## 🗂️ Estructura del Proyecto

```
ClinicAI/
├── index.html        # Estructura principal de la landing page
├── styles.css        # Estilos (Dark Luxury, glassmorphism, animaciones)
├── script.js         # Lógica JS: animaciones, modal, validación, webhook
├── images/
│   ├── logo.png              # Logo principal de ClinicAI
│   ├── hero_visual.png       # Imagen principal del Hero
│   ├── service_1.png         # Guardia — Médico Clínico
│   ├── service_2.png         # Guardia — Pediatría
│   ├── service_3.png         # Guardia — Shock Room
│   └── service_4.png         # Cardiología destacada
└── README.md
```

---

## 🎨 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura de la página |
| **CSS3 Vanilla** | Estilos, variables, animaciones, glassmorphism |
| **JavaScript (ES6+)** | Lógica, animaciones, validación, fetch al webhook |
| **Google Fonts** | `Plus Jakarta Sans` + `Inter` |
| **n8n** | Automatización backend via Webhook |

---

## 🧩 Secciones de la Landing

| ID | Sección | Descripción |
|---|---|---|
| `#hero` | Hero | Título principal, CTA, imagen flotante, badges |
| `#social-proof` | Avales | Logos de certificaciones (ANMAT, COFESA, OMS, etc.) |
| `#servicios` | Guardia & Urgencias | Cards 3D con efecto flip (Clínico, Pediatría, Shock Room, Cardiología) |
| `#especialidades` | Especialidades | Grid de 10 especialidades con CTA por tarjeta |
| `#stats` | Nosotros / Stats | Contadores animados (15.000+ pacientes, 99% satisfacción, etc.) |
| `#testimonios` | Testimonios | 3 reseñas de pacientes con glassmorphism |
| `#contacto` | CTA Final | Llamada a la acción con teléfono y WhatsApp |
| Footer | Footer | Links de navegación, redes sociales, datos de contacto |
| Modal | Formulario de Turno | Modal con formulario completo + integración n8n |

---

## 🎯 Funcionalidades

### Animaciones & UX
- **Partículas de fondo** animadas (50 partículas, colores azul/cyan)
- **Navbar** con efecto scroll (glassmorphism al hacer scroll)
- **Hero reveal** on load con delays escalonados
- **Scroll reveal** con `IntersectionObserver` en todas las secciones
- **Contadores animados** en la sección de stats
- **Cards de servicio con flip 3D** (hover en desktop, tap en mobile)
- **Floating badges** animados en el hero
- **Smooth scroll** en todos los ancla internos
- **Menú hamburguesa** responsive para mobile

### Modal de Turnos
- Se abre desde múltiples CTAs (navbar, hero, cards de especialidad)
- Pre-selecciona la especialidad según el botón de origen
- Validación completa del lado del cliente
- Estados visuales: loading spinner, éxito, error
- Cierre con botón X, click en overlay o tecla `Escape`
- Fecha mínima bloqueada a hoy (no permite fechas pasadas)

### Integración n8n Webhook
- Al hacer submit, envía un `POST` con `Content-Type: application/json`
- Muestra pantalla de éxito si `response.ok`
- Muestra banner de error si falla, sin perder los datos del form

---

## 📦 Payload del Webhook

Cuando el usuario completa y envía el formulario, se envía el siguiente JSON al endpoint de n8n:

```json
{
  "nombre": "María",
  "apellido": "González",
  "nombre_completo": "María González",
  "dni": "30123456",
  "telefono": "11 1234-5678",
  "email": "maria@email.com",
  "especialidad": "Cardiología",
  "fecha": "2025-06-15",
  "horario": "10:00 - 11:00",
  "obra_social": "OSDE",
  "motivo_consulta": "Control anual de rutina",
  "timestamp": "2025-05-13T17:30:00.000Z",
  "origen": "ClinicAI Web — Formulario de Turnos"
}
```

### Campos del formulario

| Campo | Nombre en JSON | Requerido | Validación |
|---|---|---|---|
| Nombre | `nombre` | ✅ | No vacío |
| Apellido | `apellido` | ✅ | No vacío |
| Nombre completo | `nombre_completo` | — | Generado automáticamente |
| DNI | `dni` | ✅ | 7-10 dígitos numéricos |
| Teléfono | `telefono` | ✅ | No vacío |
| Email | `email` | ✅ | Formato email válido |
| Especialidad | `especialidad` | ✅ | Selección requerida |
| Fecha | `fecha` | ✅ | Fecha futura (min = hoy) |
| Horario | `horario` | ✅ | Selección requerida |
| Obra Social | `obra_social` | ❌ | Opcional, default: "No especificada" |
| Motivo consulta | `motivo_consulta` | ✅ | No vacío |
| Timestamp | `timestamp` | — | Generado automáticamente (ISO 8601) |
| Origen | `origen` | — | Fijo: "ClinicAI Web — Formulario de Turnos" |

---

## 🔗 Integración n8n

### Webhook configurado

```
URL de prueba (test):   http://localhost:5678/webhook-test/961d5cc8-5872-417c-ba9f-34eb915cde77
URL de producción:      http://localhost:5678/webhook/961d5cc8-5872-417c-ba9f-34eb915cde77
```

> **⚠️ Importante:** La URL activa en el código es la de **test** (`/webhook-test/`).
> Para producción, cambiar a `/webhook/` en `script.js` línea 135.

### Variable en script.js

```js
// script.js — línea 135
const WEBHOOK_URL = 'http://localhost:5678/webhook-test/961d5cc8-5872-417c-ba9f-34eb915cde77';
```

### Método de envío

```
Método:           POST
Content-Type:     application/json
Body:             JSON con los campos del formulario (ver tabla de Payload)
```

### Flujo de datos

```
Usuario completa form → Validación client-side → fetch() POST al webhook
   └─ OK (200)  → Pantalla de éxito con resumen del turno
   └─ Error     → Banner de error, form restaurado para reintentar
```

---

## 🚀 Cómo correr el proyecto

### Con npx serve (recomendado)

```bash
cd ClinicAI
npx -y serve . -p 3000
```

Abrir: [http://localhost:3000](http://localhost:3000)

### Con Live Server (VS Code)

Click derecho en `index.html` → *Open with Live Server*

### Con Python

```bash
python3 -m http.server 3000
```

> **Nota:** No abrir `index.html` directamente como archivo (`file://`), ya que los fetch al webhook pueden ser bloqueados por CORS.

---

## ⚙️ Configuración para Producción

1. **Cambiar la URL del webhook** en `script.js` línea 135:
   ```js
   // Cambiar de:
   const WEBHOOK_URL = 'http://localhost:5678/webhook-test/961d5cc8-5872-417c-ba9f-34eb915cde77';
   // A:
   const WEBHOOK_URL = 'http://localhost:5678/webhook/961d5cc8-5872-417c-ba9f-34eb915cde77';
   ```

2. **Actualizar datos de contacto** en `index.html`:
   - Teléfono real (líneas con `+541100000000`)
   - WhatsApp real (línea con `wa.me/5491100000000`)
   - Dirección real (Av. Corrientes 1234)
   - Email real (info@clinicai.com.ar)

3. **Activar el workflow en n8n** antes de poner en producción.

---

## 🎨 Design System

### Colores principales

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#3b82f6` | Azul principal, botones, acentos |
| `--primary-light` | `#60a5fa` | Hover, gradientes |
| `--accent` | `#06b6d4` | Cyan, gradiente de texto |
| `--bg` | `#030712` | Fondo base oscuro |
| `--surface` | `#0d1117` | Cards, contenedores |
| `--glass` | `rgba(255,255,255,0.04)` | Glassmorphism |
| `--text` | `#f1f5f9` | Texto principal |
| `--text-muted` | `#94a3b8` | Texto secundario |

### Tipografía

| Familia | Pesos | Uso |
|---|---|---|
| `Plus Jakarta Sans` | 400, 500, 600, 700, 800 | Headings, UI |
| `Inter` | 400, 500, 600 | Cuerpo, formularios |

### Efectos principales

- **Glassmorphism**: `backdrop-filter: blur(12px)` + borde semitransparente
- **Gradient text**: `background-clip: text` con gradiente azul→cyan
- **Glow rings**: sombras con color primario
- **Float animation**: keyframe `float` en imagen hero y badges
- **Flip 3D**: `transform-style: preserve-3d` + `rotateY(180deg)`

---

## 📱 Responsive

| Breakpoint | Comportamiento |
|---|---|
| `> 1024px` | Layout completo, flip cards on hover |
| `768px – 1024px` | Grid 2 columnas, ajustes de padding |
| `< 768px` | Menú hamburguesa, flip cards on tap, layout single column |

---

## 📂 Especialidades disponibles en el formulario

**🚨 Guardia:**
- Médico Clínico / Generalista
- Pediatría
- Shock Room

**📅 Consultorios Externos:**
- Cardiología · Dermatología · Gastroenterología · Ginecología
- Otorrinolaringología · Oftalmología · Traumatología
- Urología · Neurología · Endocrinología

---

## 👤 Autor

**Franco Santacatalina**
Proyecto de portafolio — Diseño & Desarrollo Web + Automatización n8n

---

*© 2025 ClinicAI. Proyecto de portafolio — todos los datos son ficticios.*
