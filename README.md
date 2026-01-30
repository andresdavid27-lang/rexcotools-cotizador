# Rexcotools - Plataforma de Cotización Técnica v1.0

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-Logic-blue)

**Rexcotools** es una plataforma SaaS moderna diseñada para optimizar el proceso de cotización de herramientas de mecanizado e insertos de carburo. Este sistema permite generar cotizaciones técnicas profesionales en segundos, gestionando clientes y productos de manera eficiente.

## 🚀 Características Principales

- **Cotizador Inteligente**: Cálculo automático de precios, subtotales e impuestos en tiempo real.
- **Búsqueda Rápida**: Filtrado instantáneo de clientes (por RUC/Nombre) y productos (por Código ISO/ANSI/Descripción).
- **Gestión de Datos (Admin)**: 
  - Carga masiva de inventario y cartera de clientes mediante archivos CSV.
  - Persistencia local de datos (LocalStorage) para facilitar demos y uso offline sin backend complejo.
- **Exportación Profesional**:
  - 📄 **PDF**: Generación de cotizaciones formales con marca de agua y formato corporativo.
  - 📊 **Excel**: Descarga de datos estructurados para contabilidad o gestión interna.

## 🛠 Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI**: React + Tailwind CSS + Shadcn/ui
- **Lenguaje**: TypeScript
- **Procesamiento de Archivos**: `papaparse` (CSV), `xlsx` (Excel), `jspdf` (PDF)

## 📋 Requisitos Previos

- **Node.js**: v18.17 o superior (Recomendado: v20 LTS).
- **npm**: Incluido con Node.js.

## ⚙️ Guía de Instalación y Despliegue

### Ejecución Local

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd mech-quote-platform
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000) en su navegador.

### Construcción para Producción

Para generar una versión optimizada para producción:

```bash
npm run build
npm start
```

## 🔧 Configuración (Personalización Regional)

### Ajuste de Impuestos (IVA/VAT)
El sistema está configurado por defecto con una tasa de impuesto del **15%** (Ecuador). Para ajustar esto para Colombia (19%) u otros países:

1. Abra el archivo: `src/lib/utils.ts`
2. Modifique la constante `IVA_RATE`:
   ```typescript
   // Para Colombia (19%) cambiar a 0.19
   export const IVA_RATE = 0.15; 
   ```
3. Guarde el archivo. El sistema recalculará automáticamente todos los valores.

## 📖 Manual de Uso

### 1. Carga de Datos (Setup Inicial)
El sistema inicia con datos de demostración. Para cargar sus propios datos:
1. Haga clic en el botón **"Configuración de Datos"** (icono de engranaje ⚙️).
2. **Clientes**: Suba un archivo `.csv` con las columnas: `ruc`, `razon_social`, `email`, `address`.
3. **Productos**: Suba un archivo `.csv` con las columnas: `code_iso`, `description`, `brand`, `price_usd`.

### 2. Generación de Cotización
1. **Seleccionar Cliente**: Use el buscador para encontrar al cliente.
2. **Agregar Items**: Busque insertos por código o descripción y haga clic para agregar.
3. **Ajustar Cantidades**: Modifique las cantidades en la tabla de resumen.
4. **Exportar**: Use los botones "Excel" o "PDF" al pie de la cotización para descargar el documento.

---
**Rexcotools** - *Soluciones en Mecanizado*
Desarrollado para el Futuro de las Neurociencias Aplicadas al Marketing.
