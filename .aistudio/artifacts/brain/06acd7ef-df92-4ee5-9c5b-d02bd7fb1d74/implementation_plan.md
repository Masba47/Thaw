# Thaw - Renovación Minimalista Glaciar & Mimetismo Notion

Plan integral para renovar la interfaz y experiencia de usuario (UX/UI) de **Thaw**, aplicando principios de diseño minimalista, una paleta glaciar de blancos alpinos y cristal celeste, mimetismo de bases de datos estilo Notion, y una refinada dirección tipográfica inspirada en **Hark** y **Saaras V4 (Sarvam)**.

## Decisiones Críticas y Revisión del Usuario

> [!IMPORTANT]
> Se han incorporado las referencias y preferencias confirmadas:
> - **Inspiración Tipográfica ("Hark" + "Saaras V4")**:
>   - *Acento Editorial Serif (inspirado en Hark)*: Tipografía serif de alta costura, de líneas delicadas e itálicas elegantes (`Instrument Serif` / `Newsreader` / `Cormorant Garamond`) para el isotipo, títulos editoriales principales de proyectos y citas legales de resoluciones ambientales.
>   - *Lienzo Arquitectónico Sans (inspirado en Saaras V4 / Sarvam)*: Tipografía sans-serif geométrica, ligera y aireada (`Plus Jakarta Sans` / `DM Sans`), con espaciado nítido para la navegación fija sin bordes, propiedades estilo Notion y tablas de datos.
>   - *Datos Técnicos y Blockchain*: Monospace tabular limpio (`font-mono`) para hashes SHA-256, transacciones de Avalanche y telemetría de sensores.
> - **Atmósfera Visual**: Blanco alpino puro (`#ffffff`, `#f8fafc`) con toques de cristal esmerilado celeste (`#f0f9ff`, `border-sky-100/70`, acentos cian y azul glaciar).
> - **Estructura del Panel**: Mimetismo con bases de datos de Notion (propiedades de página compactas, selector de vista Tabla / Lista, filas limpias con íconos discretos y metadatos sin píldoras plásticas).
> - **Cabecera y Selector de Rol**: Cabecera fija sin bordes con pestañas de texto puro e indicador sutil de línea inferior.

---

## 1. Visión General y Concepto Minimalista

- **Propósito**: Transformar la plataforma de fiscalización y trazabilidad socioambiental en una herramienta de precisión elegante, hiperlimpia y libre de ruido visual, inspirada en la serenidad de los glaciares andinos y la claridad de Notion.
- **Público Objetivo**: Ingenieros ambientales de proyectos mineros/energéticos, auditores técnicos independientes, fiscalizadores de la Superintendencia del Medio Ambiente (SMA) y delegados comunitarios de cuencas altoandinas.
- **Valor Diferencial**: Eliminación del aspecto recargado típico de tableros de control; presentación de evidencias, hashes criptográficos SHA-256 y bloques de Avalanche con una estética aireada, tipografía de revista técnica y jerarquía impecable.

---

## 2. Experiencia de Usuario & Diseño Visual

### A. Tipografía Editorial & Arquitectónica (Inspirada en Hark & Saaras V4)
- **Titulares & Citas Editoriales (Hark Style)**:
  - Empleo de serif clásico con itálicas fluidas (*italic font-serif*) para titulares de proyecto (ej. *Complejo Minero & Solar Nevado Alto*) y encabezados clave, transmitiendo el rigor institucional y la solemnidad de la conservación del agua y los glaciares.
- **Interfaz y Controles (Saaras V4 Style)**:
  - Sans geométrica ultra limpia con peso `font-light` / `font-normal` y `tracking-tight` sutil para navegación, etiquetas de filtro, campos de formulario y descripciones técnicas.
- **Números Tabulares y Criptografía**:
  - `font-mono` con `tabular-nums` para alineación vertical exacta de bloques de Avalanche, sumas de verificación SHA-256 de 64 caracteres y coordenadas geográficas.

### B. Paleta de Colores Glaciar y Tratamiento de Superficies
- **Fondo Base**: Blanco alpino níveo (`#ffffff`) y nieve sutil (`#f8fafc`, `bg-slate-50/60`).
- **Superficies Glaciares**: Tarjetas y contenedores en blanco puro con bordes de hielo ultrafinos (`border-slate-200/60` o `border-sky-100/80`) y desenfoque de cristal translúcido (*frosted glass* `backdrop-blur-md`).
- **Acentos de Hielo y Deshielo**:
  - Azul glaciar primario: `#0284c7` (Sky 600) y `#0369a1` (Sky 700).
  - Agua de deshielo y cian: `#38bdf8` (Sky 400) y `#06b6d4` (Cyan 500).
  - Puntos de estado discretos: Verde manantial glaciar para validado, celeste para en revisión, ámbar suave para pendiente, carmesí desaturado para vencido.
- **Disciplina Anti-Píldora**: Cero cápsulas plásticas innecesarias. Metadatos representados como texto sobrio con separadores tipográficos (`·` o `/`).

### C. Cabecera Fija Sin Bordes con Pestañas de Texto Puro
- **Diseño**: Fondo blanco puro translúcido con desenfoque de cristal (`bg-white/80 backdrop-blur-lg`), sin líneas duras ni sombras pesadas.
- **Navegación**: Pestañas de texto sobrias (`Panel`, `Registro Notarizado`, `Portal Comunitario`) con indicador minimalista de barra inferior en azul hielo al estar activa.
- **Selector de Rol**: Desplegable estilizado como menú contextual de Notion, sin marcos de color saturado; texto plano con ícono sutil y lista de permisos limpia.
- **Selector de Idioma**: Botón de texto discreto `ES · EN` integrado armónicamente.

### D. Mimetismo de Base de Datos Estilo Notion en el Panel
- **Cabecera de Proyecto como Página Notion**:
  - Título editorial limpio, sin cajas oscuras masivas ni gradientes densos.
  - Bloque de propiedades de página: *Titular*, *Resolución*, *Ubicación*, *Bioma*, *Red Subnet*.
  - Barra de progreso de cumplimiento sutil y lineal de 3px de alto integrada con los números totales.
- **Selector de Vistas Notion**:
  - Alternador de vistas: **Tabla** (columnas compactas: Cláusula, Compromiso, Categoría, Responsable, Plazo, Estado, Pruebas) y **Lista** (filas despejadas con vista de lectura rápida).
  - Barra de búsqueda y filtros inline compacta (`Buscar...`, `Filtro de Estado`, `Filtro de Categoría`).
- **Filas de Compromisos**:
  - Ícono sutil de documento/página (`FileText` o indicador de bioma).
  - Título con tipografía clara y hover suave (`hover:bg-slate-50/80`).
  - Metadatos en texto unboxed sin cápsulas plásticas.

### E. Detalle de Compromiso y Verificador Criptográfico
- **Modal de Detalle Estilo "Side Peek" / Vista de Página**: Panel limpio con las especificaciones técnicas ordenadas como bloques de Notion, línea de tiempo de evidencias simplificada con hashes formateados con elegancia.
- **Estación de Verificación de Evidencia**: Zona de arrastre de archivos con textura de escarcha minimalista, feedback instantáneo de coincidencia (`MATCH` / `MISMATCH`) con avisos limpios sin estridencias.
- **Portal Comunitario y Denuncias**: Vistas públicas de consulta ciudadana con formulario de ingreso de observaciones ambientales desprovisto de elementos superfluos.

---

## 3. Decisiones de Producto y Arquitectura

- **Decisión 1: Tipografía dual Serif Editorial + Sans Geométrica (Hark + Saaras V4)**
  - *Enfoque*: Cargar fuentes Google (`Instrument Serif` para acentos/títulos y `Plus Jakarta Sans` para UI/cuerpo) combinadas con monospace para hashes.
  - *Justificación*: Captura exactamente el contraste entre elegancia humana editorial ("introducing hark") y modernidad tecnológica minimalista ("Saaras V4"), diferenciando a Thaw del software genérico.
- **Decisión 2: Sustituir la cabecera oscura por un lienzo alpino puro**
  - *Enfoque*: Eliminar gradientes densos oscuros en el hero y barra superior, adoptando una atmósfera diáfana de alta cordillera nevada y cristal esmerilado.
  - *Justificación*: Se alinea directamente con la solicitud del usuario ("blanco alpino puro con cristal esmerilado celeste"), mejorando la legibilidad y sensación de calma.
- **Decisión 3: Introducir vistas de base de datos estilo Notion (Tabla / Lista)**
  - *Enfoque*: Permitir al usuario explorar los compromisos mediante una tabla de datos compacta o una lista editorial con propiedades visibles al estilo Notion.
  - *Justificación*: Facilita la auditoría técnica rápida y otorga una experiencia de usuario moderna y familiar para profesionales.
- **Decisión 4: Preservar 100% de la funcionalidad on-chain y bilingüe**
  - *Enfoque*: El cálculo de SHA-256 nativo con WebCrypto, la simulación de consenso en la Subnet Avalanche, la persistencia en `localStorage` y el soporte ES/EN se mantienen íntegros con la nueva estética.

---

## 4. Arquitectura de Componentes y Flujo

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Cabecera Fija Sin Bordes (Header)                     │
│  [Ícono Deshielo] Thaw (Serif)  ·  [Panel]  [Registro]  [Comunidad]    │
│  Indicador Subnet Minimalista  ·  Selector de Rol Texto  ·  [ES | EN]  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Panel Principal (Dashboard)                        │
│  • Título Editorial con Serif ("Complejo Minero & Solar Nevado Alto") │
│  • Bloque de Propiedades Notion (RCA 0412/2024, SMA, 3.850 msnm)      │
│  • Métrica de Cumplimiento Discreta (78% Validados)                    │
│                                                                        │
│  Controles de Base de Datos Notion:                                   │
│  [ Vista Tabla | Vista Lista ]   ·   [Buscar...]   ·   [Filtrar...]    │
│                                                                        │
│  Filas de Base de Datos:                                               │
│  ├── [Cláusula] Título de Compromiso · Categoría · Plazo · Estado     │
│  └── Clic abre Detalle de Página (Side-peek / Modal Despejado)         │
└────────────────────────────────────────────────────────────────────────┘
          │                                  │
          ▼                                  ▼
┌───────────────────────────────┐  ┌─────────────────────────────────────┐
│  Registro & Verificador       │  │  Portal Comunitario                 │
│  • Estación Arrastre Nívea    │  │  • Monitor de Salud de Cuenca       │
│  • Coincidencia Criptográfica │  │  • Libro de Reclamos Estilo Notion │
│  • Tabla Inmutable Limpia     │  │  • Formulario de Denuncia Mínimo    │
└───────────────────────────────┘  └─────────────────────────────────────┘
```

---

## Verificación y Calidad

1. **Compilación y Linteo**: Ejecutar `compile_applet` y `lint_applet` tras aplicar las modificaciones.
2. **Pruebas de Flujo**:
   - Comprobar fuentes tipográficas cargadas correctamente (Serif editorial para acentos y Sans ligera para UI).
   - Comprobar cambio fluido entre vista Tabla y Lista en el panel estilo Notion.
   - Probar cálculo de hash SHA-256 en navegador y simulación de Avalanche.
   - Probar verificación de coincidencia y detección de alteración en el registro.
   - Probar conmutación de idioma ES/EN y cambio de roles con permisos contextuales.
