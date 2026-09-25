# <img src="https://api.iconify.design/ph:network-bold.svg?color=%2338C2FF" height="32" valign="middle"/> NetControl - Network Management & Telemetry Enterprise Platform

Una plataforma web *Full-Stack* de nivel empresarial diseñada para el monitoreo, inventariado, diagnóstico de fallas y telemetría de infraestructura de redes en tiempo real. El ecosistema implementa una arquitectura completamente desacoplada mediante un cliente SPA altamente responsivo en **React** y un servidor de alta velocidad basado en **Python (Flask)** enfocado en la concurrencia y el procesamiento analítico de datos de red.

---

## <img src="https://api.iconify.design/ph:share-network-bold.svg?color=%2338C2FF" height="28" valign="middle"/> Arquitectura del Sistema

El proyecto está diseñado bajo un enfoque modular de microservicios locales:

*   **`client-react/`**: Cliente frontend optimizado con Vite. Implementa componentes interactivos, telemetría gráfica y manejo de estados asíncronos para la gestión de dispositivos, fallas técnicas y personal operativo.
*   **`server-flask/`**: API REST en Python estructurada bajo arquitectura de capas (Routes -> Services -> Models). Se encarga de procesar la lógica de negocio, interactuar con sockets/comandos del sistema, gestionar reportes y almacenar documentación técnica en formato PDF.

---

## <img src="https://api.iconify.design/ph:cpu-bold.svg?color=%2338C2FF" height="28" valign="middle"/> Módulos y Soluciones Core

*   **SpeedTest & Telemetría Gráfica:** Módulo dedicado (`SpeedTestChart`) que transforma métricas complejas de ancho de banda, latencia y jitter en gráficas analíticas interactivas consumidas desde servicios personalizados de pruebas de velocidad en Python.
*   **Gestión de Fallas y Operadores:** Sistema integrado de reportes técnicos (`useFailures` / `failures_model.py`) para el levantamiento de incidencias de red, asignación automatizada de técnicos y seguimiento de ciclos de reparación.
*   **Control de Inventario y Dispositivos:** Base de datos inteligente que centraliza la topología de la red, administrando especificaciones, direcciones IP/MAC, estados de conexión y documentación formal indexada mediante UUIDs de almacenamiento seguro.

---

## <img src="https://api.iconify.design/ph:code-bold.svg?color=%2338C2FF" height="28" valign="middle"/> Stack Tecnológico

*   **Client Core:** React.js / Vite / JavaScript (ES6+) / HTML5 & CSS3 Avanzado
*   **Server Core:** Python / Flask Framework / API REST / Gestión de entornos virtuales (`venv`)
*   **Comunicación:** JSON asíncrono vía Axios con políticas CORS habilitadas listos para producción
*   **Calidad de Código:** ESLint, configuraciones estrictas de compilación y respaldos modulares de enrutamiento

---

## <img src="https://api.iconify.design/ph:folder-open-bold.svg?color=%2338C2FF" height="28" valign="middle"/> Estructura del Código Fuente

El repositorio organiza el software de manera limpia para facilitar la escalabilidad:

```text
NetControl/
├── client-react/             # Capa de Presentación (React)
│   ├── src/
│   │   ├── components/       # Componentes de UI (Layout, Sidebar, Modales de detalles, Charts)
│   │   ├── hooks/            # Abstracción de lógica (useDevices, useFailures, useSpeedTest)
│   │   ├── pages/            # Vistas (Home, Dispositivos, Inventario, Técnicos, Fallas)
│   │   └── services/         # Clientes de red interconectados con la API de Python
├── server-flask/             # Capa de Datos y Negocio (Python)
│   ├── app/
│   │   ├── models/           # Definición de estructuras de datos (Devices, Inventory, Failures)
│   │   ├── services/         # Lógica pura de backend (Network Status, Custom SpeedTest Engines)
│   │   └── routes.py         # Orquestación de Endpoints RESTful
│   └── main.py               # Punto de entrada del servidor
