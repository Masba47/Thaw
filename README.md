<div align="center"> <img src="assets/logo.png" alt="Logo de Thaw" width="160" />
Thaw
Cumplimiento ambiental, quedando registrado.

Gestión socioambiental transparente para proyectos de ingeniería, diseñada para Avalanche.

<p> <img src="https://img.shields.io/badge/Avalanche-L1-E84142?style=for-the-badge&logo=avalanche&logoColor=white" alt="Avalanche" /> <img src="https://img.shields.io/badge/Estado-Prototipo-3B82F6?style=for-the-badge" alt="Estado: prototipo" /> <img src="https://img.shields.io/badge/Hecho%20en-Chile-0033A0?style=for-the-badge" alt="Hecho en Chile" /> <img src="https://img.shields.io/badge/Licencia-MIT-22C55E?style=for-the-badge" alt="Licencia MIT" /> </p> <p> <a href="#">🚀 Demo en vivo</a> · <a href="#">🎬 Video</a> · <a href="#">📑 Presentación</a> · <a href="docs/architecture.md">🏗️ Arquitectura</a> </p> </div>
❄️ ¿Por qué Thaw?

Thaw significa deshielo. Lo que estaba congelado, opaco y disperso entre planillas, correos y PDFs, queda por fin a la vista de todos.

Cada proyecto de ingeniería de gran escala, como una minera, una planta de energía o una obra de infraestructura, se aprueba con una lista de compromisos ambientales y sociales. En Chile, esos compromisos viven en la Resolución de Calificación Ambiental, la RCA. Con los años pasa lo de siempre:

Las evidencias se pierden o se editan después de entregadas.
Los plazos se vencen sin que nadie lo note a tiempo.
Las comunidades no tienen una forma simple de comprobar si lo prometido se está cumpliendo.
Fiscalizadores, titulares y vecinos trabajan con versiones distintas de la verdad.
💡 La idea

Thaw convierte cada condición de un permiso ambiental en un compromiso rastreable, con responsable, plazo y evidencia requerida. Todo queda anclado de forma verificable en Avalanche, para que cualquiera pueda comprobar que nada fue alterado.

✨ Qué hace
	Función	Descripción
📋	Registro de compromisos	Cada condición de la resolución de aprobación se registra como un compromiso asociado a un proyecto.
🔐	Evidencia anclada	Informes de monitoreo, resultados de laboratorio y fotografías se guardan fuera de la cadena. Su huella SHA-256 y su marca de tiempo quedan en el registro.
🧑‍⚖️	Atestaciones por rol	El titular entrega, un revisor independiente valida y el regulador audita.
🏘️	Capa comunitaria	Los vecinos ven el avance, confirman o disputan evidencias y registran acuerdos, sin necesidad de wallet ni de pagar gas.
⏰	Seguimiento de plazos	Cada compromiso pasa por estados claros: pendiente, entregado, validado, vencido o cerrado.
🔎	Verificación de integridad	Si alguien vuelve a subir un archivo, Thaw recalcula su huella y muestra si coincide con la registrada.
🔄 Cómo funciona
Resolución de aprobación
Compromisos registrados
Titular entrega evidencia
Huella SHA-256 anclada
Revisor valida
Regulador audita
Comunidad verifica odisputa
🏔️ Por qué Avalanche
Finalidad rápida y comisiones bajas, lo que hace viable anclar muchas evidencias pequeñas.
L1 personalizable: instituciones como reguladores y consultoras podrían operar validadores y definir sus propias reglas de acceso, mientras el público conserva la capacidad de verificar el registro.
Cuentas abstractas, que permiten una experiencia sin fricción para las comunidades.
🧪 Estado actual

Prototipo con libro mayor simulado. El cálculo de huellas SHA-256 y la verificación de archivos son reales. El anclaje en cadena está simulado dentro de la aplicación.

Componente	Estado
Flujo completo de compromisos, evidencias y validación	✅ Prototipado
Verificación de integridad por huella	✅ Funcional
Vistas por rol, incluida la comunitaria	✅ Prototipado
Contrato CommitmentRegistry en Solidity	🔧 En desarrollo
Despliegue en Avalanche Fuji	🗓️ Próximo paso
🧰 Tecnologías

Prototipo creado en Google AI Studio. Arquitectura objetivo:

Solidity · Foundry · TypeScript · React · Next.js · wagmi · viem · PostgreSQL · Account Abstraction · Avalanche L1

🗂️ Estructura del repositorio
Thaw/
├── README.md
├── assets/           logo e imágenes
├── docs/             arquitectura y diagramas
├── prototype/        código del prototipo
├── contracts/        contratos inteligentes
└── LICENSE
🧭 Hoja de ruta
Contrato mínimo de registro de compromisos y evidencias, probado con Foundry.
Despliegue en Avalanche Fuji y conexión del frontend a la red real.
Onboarding sin wallet para comunidades mediante cuentas abstractas.
Piloto con un proyecto real junto a una consultora ambiental.
👤 Equipo

Tomás, ingeniero civil industrial, Santiago, Chile 🇨🇱

<div align="center">

Del permiso a la evidencia. Cada compromiso, a la vista.

</div>
