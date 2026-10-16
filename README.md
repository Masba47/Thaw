<div align="center"> <img src="assets/logo.png" alt="Logo de Thaw" width="160"> <h1>Thaw</h1> <h3>Cumplimiento ambiental, quedando registrado.</h3> <p>Gestión socioambiental transparente para proyectos de ingeniería,<br>diseñada para Avalanche.</p> <p> <img src="https://img.shields.io/badge/Avalanche-L1-E84142?style=for-the-badge&logo=avalanche&logoColor=white" alt="Avalanche L1"> <img src="https://img.shields.io/badge/Estado-Prototipo-3B82F6?style=for-the-badge" alt="Estado: prototipo"> <img src="https://img.shields.io/badge/Hecho%20en-Chile-0033A0?style=for-the-badge" alt="Hecho en Chile"> <img src="https://img.shields.io/badge/Licencia-MIT-22C55E?style=for-the-badge" alt="Licencia MIT"> </p> <p> <a href="#-la-idea">La idea</a> · <a href="#-qué-hace">Qué hace</a> · <a href="#-cómo-funciona">Cómo funciona</a> · <a href="#-estado-actual">Estado</a> · <a href="#-hoja-de-ruta">Hoja de ruta</a> </p> </div> <br>
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
📋 Registro de compromisos: cada condición de la resolución de aprobación se registra como un compromiso asociado a un proyecto.
🔐 Evidencia anclada: informes de monitoreo, resultados de laboratorio y fotografías se guardan fuera de la cadena. Su huella SHA-256 y su marca de tiempo quedan en el registro.
🧑‍⚖️ Atestaciones por rol: el titular entrega, un revisor independiente valida y el regulador audita.
🏘️ Capa comunitaria: los vecinos ven el avance, confirman o disputan evidencias y registran acuerdos, sin necesidad de wallet ni de pagar gas.
⏰ Seguimiento de plazos: cada compromiso pasa por estados claros, de pendiente a entregado, validado, vencido o cerrado.
🔎 Verificación de integridad: si alguien vuelve a subir un archivo, Thaw recalcula su huella y muestra si coincide con la registrada.
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
L1 personalizable: reguladores y consultoras podrían operar validadores y definir sus propias reglas de acceso, mientras el público conserva la capacidad de verificar el registro.
Cuentas abstractas, que permiten una experiencia sin fricción para las comunidades.
🧪 Estado actual

Prototipo con libro mayor simulado. El cálculo de huellas SHA-256 y la verificación de archivos son reales. El anclaje en cadena está simulado dentro de la aplicación.

✅ Flujo completo de compromisos, evidencias y validación
✅ Verificación de integridad por huella
✅ Vistas por rol, incluida la comunitaria
🔧 Contrato CommitmentRegistry en Solidity, en desarrollo
🗓️ Despliegue en Avalanche Fuji, próximo paso
🧰 Tecnologías

Prototipo creado en Google AI Studio. Arquitectura objetivo:

Solidity · Foundry · TypeScript · React · Next.js · wagmi · viem · PostgreSQL · Account Abstraction · Avalanche L1

🗂️ Estructura del repositorio
text
Thaw/
├── README.md
├── assets/       logo e imágenes
├── docs/         arquitectura y diagramas
├── prototype/    código del prototipo
├── contracts/    contratos inteligentes
└── LICENSE
🧭 Hoja de ruta
Contrato mínimo de registro de compromisos y evidencias, probado con Foundry.
Despliegue en Avalanche Fuji y conexión del frontend a la red real.
Onboarding sin wallet para comunidades mediante cuentas abstractas.
Piloto con un proyecto real junto a una consultora ambiental.
