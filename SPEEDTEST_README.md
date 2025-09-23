# NetControl - Speedtest Integration

## 🚀 Speedtest en la Página de Inicio

Se ha integrado una funcionalidad completa de prueba de velocidad de internet con **fallback automático** para máxima compatibilidad:

### ✨ Características:
- **Prueba de Velocidad Completa**: Download, Upload y Ping
- **Fallback Inteligente**: Si speedtest-cli falla (403 Forbidden), automáticamente usa método alternativo
- **Interfaz Moderna**: Botón con indicadores visuales y animaciones
- **Historial Completo**: Almacenamiento y visualización de todas las pruebas
- **Gráfico Dinámico**: Chart.js para mostrar tendencias de velocidad
- **Información Detallada**: Servidor, ISP, IP y ubicación
- **Colores Indicativos**: Verde (excelente), Amarillo (regular), Rojo (necesita mejora)

### 🔧 Arquitectura Técnica:

#### Backend (Flask):
- **Modelo SpeedTest**: Almacena datos en SQLite
- **Servicio Principal**: SpeedTest con speedtest-cli oficial
- **Servicio Fallback**: CustomSpeedTest usando requests HTTP
- **API Unificada**: Una sola ruta `/speedtest/start` con fallback transparente

#### Frontend (React):
- **Componente SpeedTest**: Widget principal con botón y resultados
- **Componente SpeedTestChart**: Gráfico de líneas del historial
- **Hook useSpeedTest**: Gestión de estado y polling automático
- **SpeedTestService**: Cliente API con manejo de errores

## Instalación y Configuración

### Backend:
```bash
cd server-flask
pip install -r requirements.txt
python main.py
```

### Frontend:
```bash
cd client-react
npm install
npm run dev
```

## Nuevas Dependencias

### Backend:
- `speedtest-cli==2.1.3` - Librería para pruebas de velocidad

### Frontend:
- `axios` - Cliente HTTP
- `chart.js` - Librería de gráficos
- `react-chartjs-2` - Wrapper de Chart.js para React

## Estructura de Archivos Agregados

```
server-flask/
├── app/
│   ├── models/
│   │   └── speedtest_model.py          # Modelo de base de datos
│   └── services/
│       └── speedtest_service.py        # Lógica del speedtest

client-react/
├── src/
│   ├── components/
│   │   ├── SpeedTest.jsx              # Componente principal
│   │   └── SpeedTestChart.jsx         # Gráfico del historial
│   ├── hooks/
│   │   └── useSpeedTest.js           # Hook personalizado
│   └── services/
│       └── speedTestService.js       # Servicio API
```

## Uso de la Funcionalidad

1. **Iniciar Prueba**: Click en "Iniciar Prueba" en la página de inicio
2. **Monitoreo**: El sistema muestra el progreso en tiempo real
3. **Resultados**: Se muestran automáticamente al completar
4. **Historial**: El gráfico se actualiza con cada nueva prueba
5. **Información**: Se guarda servidor, ISP y otros datos técnicos

## Consideraciones Técnicas

- Las pruebas consumen ancho de banda (10-100MB por prueba)
- Tiempo estimado: 30-60 segundos por prueba completa
- Los datos se almacenan permanentemente en SQLite
- Las pruebas se ejecutan en hilos separados (no bloquean la app)
- Polling cada 2 segundos durante las pruebas activas

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/speedtest/start` | Iniciar nueva prueba |
| GET | `/speedtest/status` | Estado actual |
| GET | `/speedtest/latest` | Última prueba |
| GET | `/speedtest/history?limit=N` | Historial (límite opcional) |
| GET | `/speedtest/averages?days=N` | Promedios por días |

## Próximas Mejoras Sugeridas

- [ ] Pruebas automáticas programadas
- [ ] Alertas por baja velocidad
- [ ] Exportar datos a CSV/PDF
- [ ] Comparación con velocidad contratada
- [ ] Múltiples servidores de prueba
- [ ] Configuración de umbrales personalizados