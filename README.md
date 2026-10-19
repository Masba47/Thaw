<div align="center">
<h1>❄️ Thaw</h1>
<h3>Cumplimiento ambiental, quedando registrado</h3>
<p>Gestión socioambiental transparente para proyectos de ingeniería,<br>diseñada para Avalanche.</p>
<p>
<img src="https://img.shields.io/badge/Avalanche-L1-E84142?style=for-the-badge&logo=avalanche&logoColor=white" alt="Avalanche L1">
<img src="https://img.shields.io/badge/Estado-Idea-3B82F6?style=for-the-badge" alt="Estado: prototipo">
<img src="https://img.shields.io/badge/Hecho%20en-Chile-0033A0?style=for-the-badge" alt="Hecho en Chile">
<img src="https://img.shields.io/badge/Licencia-MIT-22C55E?style=for-the-badge" alt="Licencia MIT">
</p>
<p>
<a href="#por-que-thaw">¿Por qué Thaw?</a> ·
<a href="#que-hace">Qué hace</a> ·
<a href="#como-funciona">Cómo funciona</a> ·
<a href="#estado-actual">Estado actual</a> ·
<a href="#hoja-de-ruta">Hoja de ruta</a>
</p>
</div>
<img src="src/img/main panel.png" alt="Main Panel">
<hr>

<h2 id="por-que-thaw">❄️ ¿Por qué Thaw?</h2>

<p>Thaw significa deshielo. Lo que estaba congelado, opaco y disperso entre planillas, correos y PDFs queda por fin a la vista de todos.</p>

<p>Todo proyecto de ingeniería de gran escala, como una minera, una planta de energía o una obra de infraestructura, se aprueba con una lista de compromisos ambientales y sociales. En Chile, esos compromisos viven en la Resolución de Calificación Ambiental, la RCA. Con los años pasa lo de siempre:</p>

<ul>
<li>Las evidencias se pierden o se editan después de entregadas.</li>
<li>Los plazos se vencen sin que nadie lo note a tiempo.</li>
<li>Las comunidades no tienen una forma simple de comprobar si lo prometido se está cumpliendo.</li>
<li>Fiscalizadores, titulares y vecinos trabajan con versiones distintas de la verdad.</li>
</ul>

<h2>💡 La idea</h2>

<p>Thaw convierte cada condición de un permiso ambiental en un compromiso rastreable, con responsable, plazo y evidencia requerida. Todo queda anclado de forma verificable en Avalanche, para que cualquiera pueda comprobar que nada fue alterado.</p>

<h2 id="que-hace">✨ Qué hace</h2>

<table>
<thead>
<tr><th></th><th>Función</th><th>Descripción</th></tr>
</thead>
<tbody>
<tr><td>📋</td><td><b>Registro de compromisos</b></td><td>Cada condición de la resolución de aprobación se registra como un compromiso asociado a un proyecto.</td></tr>
<tr><td>🔐</td><td><b>Evidencia anclada</b></td><td>Los informes de monitoreo, resultados de laboratorio y fotografías se guardan fuera de la cadena. Solo su huella SHA-256 y su marca de tiempo quedan en el registro.</td></tr>
<tr><td>⚖️</td><td><b>Atestaciones por rol</b></td><td>El titular entrega, un revisor independiente valida y el regulador audita.</td></tr>
<tr><td>🏘️</td><td><b>Capa comunitaria</b></td><td>Los vecinos ven el avance, confirman o disputan evidencias y registran acuerdos, sin necesidad de wallet ni de pagar gas.</td></tr>
<tr><td>⏰</td><td><b>Seguimiento de plazos</b></td><td>Cada compromiso pasa por estados claros: pendiente, entregado, validado, vencido o cerrado.</td></tr>
<tr><td>🔎</td><td><b>Verificación de integridad</b></td><td>Si alguien vuelve a subir un archivo, Thaw recalcula su huella y muestra si coincide con la registrada.</td></tr>
</tbody>
</table>

<h2 id="como-funciona">🔄 Cómo funciona</h2>

<ol>
<li><b>Resolución de aprobación:</b> se registran sus condiciones como compromisos.</li>
<li><b>Titular:</b> entrega la evidencia de cada compromiso.</li>
<li><b>Anclaje:</b> la huella SHA-256 de la evidencia queda anclada en Avalanche.</li>
<li><b>Revisor independiente:</b> valida la evidencia.</li>
<li><b>Regulador:</b> audita el proceso.</li>
<li><b>Comunidad:</b> verifica o disputa lo registrado.</li>
</ol>

<h2>🏔️ Por qué Avalanche</h2>

<ul>
<li><b>Finalidad rápida y comisiones bajas.</b> Esto hace viable anclar muchas evidencias pequeñas.</li>
<li><b>L1 personalizable.</b> Reguladores y consultoras podrían operar validadores y definir sus propias reglas de acceso, mientras el público conserva la capacidad de verificar el registro.</li>
<li><b>Cuentas abstractas.</b> Permiten una experiencia sin fricción para las comunidades.</li>
</ul>

<h2 id="estado-actual">🧪 Estado actual</h2>

<blockquote><b>Prototipo con datos simulados.</b> El anclaje en cadena está simulado dentro de la aplicación.</blockquote>

<table>
<thead>
<tr><th></th><th>Avance</th></tr>
</thead>
<tbody>
<tr><td>✅</td><td>Flujo completo de compromisos, evidencias y validación</td></tr>
<tr><td>✅</td><td>Verificación de integridad por huella</td></tr>
<tr><td>✅</td><td>Vistas por rol, incluida la comunitaria</td></tr>
<tr><td>🔧</td><td>Contrato <code>CommitmentRegistry</code> en Solidity, en desarrollo</td></tr>
<tr><td>🗓️</td><td>Despliegue en Avalanche Fuji, próximo paso</td></tr>
</tbody>
</table>

<h2>🧰 Tecnologías</h2>

<p>El prototipo fue creado en Google AI Studio. La arquitectura objetivo es la siguiente:</p>

<table>
<thead>
<tr><th>Capa</th><th>Tecnologías</th></tr>
</thead>
<tbody>
<tr><td>Contratos</td><td>Solidity, Foundry</td></tr>
<tr><td>Frontend</td><td>TypeScript, React, Next.js, wagmi, viem</td></tr>
<tr><td>Backend y datos</td><td>PostgreSQL</td></tr>
<tr><td>Experiencia sin wallet</td><td>Account Abstraction</td></tr>
<tr><td>Red</td><td>Avalanche L1</td></tr>
</tbody>
</table>

<h2 id="hoja-de-ruta">🧭 Hoja de ruta</h2>

<ol>
<li>Contrato mínimo de registro de compromisos y evidencias, probado con Foundry.</li>
<li>Despliegue en Avalanche Fuji y conexión del frontend a la red real.</li>
<li>Onboarding sin wallet para comunidades mediante cuentas abstractas.</li>
<li>Piloto con un proyecto real junto a una consultora ambiental.</li>
</ol>

<h2>📄 Licencia</h2>

<p>Distribuido bajo licencia <a href="LICENSE">MIT</a>.</p>
