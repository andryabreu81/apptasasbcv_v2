# 📊 Dashboard de Tasas BCV — Plantilla Sneat Admin (React)

Aplicación web responsiva desarrollada en **React (con Vite)** con el diseño e interfaz de la plantilla **Sneat Bootstrap Admin Template**, diseñada para consultar, calcular y visualizar en tiempo real las cotizaciones de divisas oficiales del **Banco Central de Venezuela (BCV)** consumiendo el servicio API REST local en Node.js.

---

## 🎨 Características de Diseño (Sneat Bootstrap Admin Template)

- **Estética Oficial Sneat**:
  - Paleta de colores: Primario `#696CFF` (Indigo Sneat), Éxito `#71DD37`, Advertencia `#FFAB00`, Peligro `#FF3E1D`, Info `#03C3EC`.
  - Tarjetas elevadas con sombras suaves (`rgba(67, 89, 113, 0.12)`), bordes redondeados (`12px-16px`) y micro-animaciones.
  - Modo Oscuro / Claro conmutables al instante mediante el botón de sol/luna en la barra superior.
- **Estructura de Navegación Sneat**:
  - **Sidebar Lateral**: Colapsable en dispositivos móviles con fondo backdrop difuminado.
  - **Navbar Flotante**: Con barra de búsqueda en tiempo real, indicador de estado de la API, alternador de tema y botón de recarga.
  - **Footer Formal**: Con metadatos de sincronización bancaria.
- **100% Responsivo**:
  - Celulares, tabletas y computadoras de escritorio.

---

## 🚀 Funcionalidades Principales

1. **Monitoreo de Fechas Oficiales**:
   - Tarjetas destacadas de **Fecha Valor Vigente** y **Fecha de Operación** con formateo en español.
   - Banner informativo con el mensaje del servicio devuelto por el API del BCV.
2. **KPIs y Métricas Rápidas**:
   - Resumen para **USD / VES**, **EUR / VES**, **Spread Promedio** y total de divisas activas.
3. **Tarjetas de Cotización (Cards)**:
   - Tarjetas destacadas para **USD ($)**, **EUR (€)**, **RUB (₽)**, **COP (Col$)**, **CNY (¥)** y **TRY (₺)**.
   - Indicador de Tasa Venta oficial, Tasa Compra y cálculo del Spread (+% y diferencial en Bs.).
4. **Calculadora Cambiaria en Vivo**:
   - Conversión bidireccional instantánea:
     - `Moneda Extranjera ➔ Bolívares (Bs.)`
     - `Bolívares (Bs.) ➔ Moneda Extranjera`
   - Selector entre tasa de **Venta** o **Compra**.
   - Chips de montos rápidos (+10, +50, +100, +500, +1000).
   - Botón para **Copiar Resultado** al portapapeles.
5. **Tabla Detallada de Cotizaciones**:
   - Filtro y buscador en vivo por código o país.
   - Ordenamiento por mayor/menor tasa o alfabético.
   - Botón para **Copiar Reporte Formal** para compartir en WhatsApp / Telegram.
   - Botón para **Imprimir / Exportar a PDF**.
6. **Configuración y Resiliencia**:
   - Conexión al endpoint local: `http://localhost:3003/apitasasbcv/getValoresBCV`.
   - Modal de configuración (⚙️) con botón para **Probar Conexión** en vivo y presets rápidos.
   - Sistema de datos de contingencia para operar sin interrupciones si el backend está en mantenimiento.

---

## 🛠️ Estructura del Proyecto

```
/var/www/html/apptasasbcv/
├── index.html                  # Plantilla HTML5 con fuentes Public Sans y metadatos
├── vite.config.js              # Configuración de empaquetador Vite
├── package.json                # Dependencias (React 18, Vite, Lucide Icons)
├── src/
│   ├── main.jsx                # Punto de entrada de React
│   ├── App.jsx                 # Componente principal con navegación y layout
│   ├── styles/
│   │   └── sneat.css           # Sistema de diseño y variables Sneat CSS
│   ├── services/
│   │   └── api.js              # Cliente HTTP para el endpoint del backend local
│   ├── utils/
│   │   └── formatters.js       # Formateadores numéricos es-VE, fechas y reportes
│   └── components/
│       ├── Sidebar.jsx         # Menú lateral colapsable Sneat
│       ├── Navbar.jsx          # Barra superior con estado y acciones
│       ├── DateBanner.jsx      # Tarjetas de fechas oficiales BCV
│       ├── QuickMetrics.jsx    # Tarjetas de métricas rápidas (KPIs)
│       ├── CurrencyCards.jsx   # Tarjetas de tasas principales
│       ├── Converter.jsx       # Calculadora y conversor interactivo
│       ├── RatesTable.jsx      # Tabla completa con filtros y exportación
│       └── ConfigModal.jsx     # Diálogo para probar y cambiar URL de API
```

---

## 💻 Instrucciones para Iniciar

### 1. Iniciar en Modo Desarrollo (Vite)
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3005`.

### 2. Construir para Producción
```bash
npm run build
```

### 3. Conexión con el Backend en Node.js
Para que la aplicación reciba los datos en vivo, ejecuta el servicio de Node.js en `/var/www/html/apitasasbcv`:
```bash
cd /var/www/html/apitasasbcv
npm start # o node src/index.js
```
El backend correrá en el puerto `3003` y la aplicación consumirá automáticamente `http://localhost:3003/apitasasbcv/getValoresBCV`.
