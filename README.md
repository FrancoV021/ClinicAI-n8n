# ClinicAI — Landing Page & AI Voice Automation

> **Medicina de Vanguardia con Inteligencia Artificial**  
> Landing page premium para una clínica médica ficticia. Proyecto de portafolio con integración a n8n via Webhook y Agente de Voz automatizado para Triage.

![ClinicAI Preview](images/hero_visual.png)

---

## 📋 Descripción

**ClinicAI** es una solución integral orientada al sector salud (HealthTech) que combina una landing page de estilo **Dark Luxury** con un robusto backend de automatización. El sistema permite que, tras completar un formulario de solicitud de turnos, los datos se envíen directamente a un workflow de **n8n** vía webhook, el cual registra la información en un CRM e inicia una llamada telefónica mediante un agente de voz con IA para realizar un triage inicial.

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

---

## 🎨 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura de la página |
| **CSS3 Vanilla** | Estilos, variables, animaciones, glassmorphism |
| **JavaScript (ES6+)** | Lógica, animaciones, validación, fetch al webhook |
| **n8n** | Automatización backend y orquestación de datos |
| **Retell AI** | Agente de voz inteligente para Triage y confirmación[cite: 1] |
| **Google Sheets** | CRM y base de datos para registro de pacientes[cite: 1] |

---

## 🎯 Funcionalidades

### Animaciones & UX
- **Partículas de fondo** animadas (colores azul/cyan).
- **Navbar con efecto scroll** (glassmorphism).
- **Cards de servicio con flip 3D** (hover en desktop, tap en mobile).
- **Contadores animados** en la sección de estadísticas.
- **Scroll reveal** con `IntersectionObserver`.

### Modal de Turnos & Integración n8n
- **Validación completa** del lado del cliente.
- **Envío asíncrono:** Al hacer submit, envía un `POST` JSON al endpoint de n8n.
- **Automatización de Voz:** n8n dispara una llamada de **Retell AI** que:
    *   Valida la intensidad de los síntomas del paciente[cite: 1].
    *   Brinda recomendaciones de cuidados iniciales (triage)[cite: 1].
    *   Confirma fecha y hora del turno seleccionado[cite: 1].

---

## 📦 Payload del Webhook

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

---

## ⚙️ Configuración para Producción

- Webhook: Cambiar la URL de test a producción en script.js línea 135.
- n8n Workflow: Asegurarse de que el nodo de Google Sheets y el de Retell AI estén conectados al Webhook de entrada.
- Prompt del Agente: Configurar el agente de voz en Retell con las directrices de triage médico y empatía profesional[cite: 1].

---

## 🛠️ Flujo de Automatización (Backend)

Para demostrar la integridad del sistema, el flujo de trabajo se desglosa de la siguiente manera:

- Webhook Inbound: Nodo que escucha el POST del frontend con los datos del paciente.  

- Data Transformation: Nodo de función para limpiar el número de teléfono y formatear el nombre.  

- CRM Integration: Nodo de Google Sheets que inserta la fila con un ID único.  

- Voice AI Trigger: Nodo HTTP que envía el agent_id y el to_number a la API de Retell.  

- Prompt Engineering: El agente utiliza un prompt estructurado para triage médico, validando síntomas y confirmando el turno.

---

## 👤 Autor

**Franco Santacatalina**
Proyecto de portafolio — Diseño & Desarrollo Web + Automatización n8n

---

*© 2025 ClinicAI. Proyecto de portafolio — todos los datos son ficticios.*
