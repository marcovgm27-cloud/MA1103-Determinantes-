# Determinantes · MA1103

Estudio asincrónico de la Semana 12. **MA1103 Cálculo y Álgebra Lineal**, Escuela de Matemática, Instituto Tecnológico de Costa Rica. Docente: Marco Vinicio Gutiérrez Montenegro.

Sitio: https://marcovgm27-cloud.github.io/MA1103-Determinantes-/

## Ejecutar y publicar

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Sitio estático, sin compilación, servidor de aplicación ni claves. KaTeX y las fuentes Latin Modern están incluidos localmente. GitHub Pages está configurado desde **main → / (root)**, con rutas relativas y `.nojekyll`. Cada actualización de `main` activa un nuevo despliegue.

## Orden del recurso

Hay 14 etapas: bienvenida, conocimientos previos, cinco pares de video y actividad, reto integrador y PDF. Se exige acertar **todos los ejercicios** de cada etapa para continuar.

| Video | Tema confirmado por el docente | Actividad |
| --- | --- | --- |
| 1 | Repaso de propiedades | Filas proporcionales y factores escalares; distinguir original de transformado |
| 2 | Demostraciones usando propiedades | Determinantes escritos por entradas, sin vectores; demostración con una operación cada vez |
| 3 | Cálculo por dos caminos | Linealidad y nuevo ejercicio de cálculo por operaciones |
| 4 | Operaciones entre filas y columnas | Determinantes de orden cuatro |
| 5 | Regla de Cramer | Construcción de determinantes y soluciones de sistemas de tres y cuatro incógnitas |

Los videos permanecen en Google Drive, en el orden facilitado. Se requiere acceso **Cualquier persona con el enlace → Lector** y permiso para reproducir.

**Finalización de videos:** el iframe de Drive no proporciona una API para verificar tiempo reproducido, finalización o adelantos. A petición del docente se omite el control de adelantos. El estudiante debe marcar «Confirmo que vi el video completo» para continuar. La interfaz y el comprobante identifican esta acción como una declaración, no como reproducción automáticamente verificada. No se atribuye tiempo activo a la reproducción de Drive.

## Ejercicios parametrizados

Cada recorrido recibe una semilla aleatoria de 128 bits mediante `crypto.getRandomValues`. Con ella se generan matrices, determinantes, escalas, sistemas, soluciones, distractores y su orden. La misma semilla reproduce la variante al recargar; los reinicios generan una nueva. Los distintos navegadores reciben variantes independientes. Sin un servicio central no se puede garantizar que dos estudiantes nunca coincidan en algún ejercicio.

El estado usa `ma1103-determinantes-v3` y no reutiliza avances de versiones anteriores. Cambiar o reiniciar el recorrido no modifica la preferencia de tema. En equipos compartidos se debe pulsar «Reiniciar progreso» antes de que comience otra persona.

En `js/curriculum.js`, `createCourse(seed)` crea el contenido. `choice` mezcla las opciones y conserva el índice de la correcta. Las explicaciones y respuestas se calculan con los mismos parámetros. Las matrices tienen orden tres o cuatro, excepto menores intermedios de cálculo. Las matrices de Cramer se generan con determinante distinto de cero y soluciones enteras pequeñas.

### Escalar frente a recíproco

Si se multiplica una sola fila o columna de A por k para obtener B:

```tex
\det B=k\det A, \qquad \det A=\frac{1}{k}\det B \quad(k\ne0).
```

Si se multiplica toda una matriz de orden n:

```tex
\det(kA)=k^n\det A.
```

El recíproco se usa al despejar el determinante **original**. No se cambia esta propiedad matemática. Los ejercicios de las actividades 1 y 2 indican explícitamente cuál se solicita y muestran ambas relaciones.

## Tiempo activo y requisito de 60 minutos

El inicio advierte la regla de forma expresa. El contador suma únicamente intervalos en **ejercicios**, mientras la página esté visible, tenga foco y haya una interacción reciente de teclado, puntero, entrada, cambio o rueda. No se cuenta mover el ratón sin más. Tras **45 segundos sin interacción**, se pausa. También se pausa al salir de la pestaña, perder el foco, reproducir los videos o trabajar en papel. No se suman períodos entre recargas, suspensión del equipo o saltos del reloj de pared.

`StudyClock` utiliza `performance.now` y muestras cortas. No recupera como actividad el tiempo de inactividad previo a una nueva acción. El tiempo acumulado se conserva en el navegador, pero al recargar hace falta una interacción nueva para seguir sumando.

Si se termina el reto con menos de **60 minutos activos**, no se habilita la práctica: se borra el avance de ese recorrido, se vuelve a la bienvenida y se genera otra variante. Deben completarse nuevamente todos los niveles. Repetir ejercicios durante un recorrido conserva accesos ganados; el reinicio global o el reinicio por tiempo insuficiente genera parámetros nuevos.

**Límite del control:** el seguimiento es local. Las interacciones y el mínimo temporal no demuestran comprensión, identidad, autoría ni ausencia de IA. Los datos de `localStorage` y el JavaScript son editables por quien controla el navegador. Una comprobación institucional resistente a manipulación necesitaría autenticación, almacenamiento y validación del lado servidor. No se presentan estas medidas como detección de IA.

## PDF común y comprobante separado

`pdf/actividad-final-determinantes.pdf` es **el mismo archivo, byte por byte, para todos los estudiantes**. No se le añaden nombres, tiempos o parámetros. Contiene tres problemas nuevos, sencillos y directos, sin aplicaciones ni soluciones:

1. Demostrar que un determinante es cero extrayendo un factor y usando filas iguales.
2. Calcular un determinante de orden tres por linealidad y por operaciones, un paso cada vez.
3. Resolver directamente un sistema de tres incógnitas mediante Cramer.

La fecha de entrega se mantiene: **jueves 22 de octubre de 2026, a más tardar a las 5:00 p. m., en TEC Digital, hora de Costa Rica**.

El tiempo y el nombre se muestran en un **comprobante separado**, accesible solo al terminar el recorrido y cumplir el mínimo temporal. Se abre en otra ventana y permite imprimir o guardar como PDF con la función del navegador. Usa Latin Modern, incluye la semilla y las fechas en hora de Costa Rica, y distingue la declaración de visualización de videos del tiempo activo registrado. El tiempo corresponde al recorrido **antes de descargar**; no se puede medir el tiempo posterior de resolver un PDF impreso. El comprobante no altera la práctica común.

El bloqueo de descarga solo es un control de la interfaz: un archivo estático público puede abrirse por su URL directa. No es protección de acceso ni evaluación autenticada.

Para editar y compilar el PDF común:

```sh
python3 tools/generar_pdf.py
```

Requiere TeX Live (`pdflatex`, Latin Modern, AMSMath, microtype, geometry, fancyhdr, enumitem e hyperref). El script compila dos veces con shell escape desactivado, comprueba errores, caracteres ausentes y desbordamientos, y deja los auxiliares en una carpeta temporal. Los estudiantes y GitHub Pages no necesitan TeX Live.

## Archivos y tipografía

- `index.html`: estructura, cabecera, progreso y contador.
- `css/styles.css`: tipografía Latin Modern, tamaño ampliado y temas claro/oscuro.
- `js/theme.js`: selector de tema y persistencia bajo `ma1103-theme`.
- `js/curriculum.js`: generación parametrizada, videos y contenido pedagógico.
- `js/activity.js`: contador de actividad y condición temporal.
- `js/app.js`: respuestas, navegación, declaraciones de videos y desbloqueos.
- `js/pdf-receipt.js`: documento imprimible del comprobante individual, separado del PDF común.
- `comprobante.html` y `js/receipt-view.js`: ventana del comprobante en el mismo origen, con fuentes locales aptas para impresión.
- `pdf/actividad-final-determinantes.tex`: fuente LaTeX de la práctica común.
- `vendor/`: KaTeX y fuentes Latin Modern con sus licencias.

Los textos conservan HTML semántico con la tipografía de LaTeX. Las expresiones se escriben en TeX, con `math`, `matrix`, `determinant` y `display`, y KaTeX produce HTML y MathML accesible. Las entradas del estudiante se escapan antes de mostrarlas.

## Validación

Desde la raíz del repositorio:

```sh
python3 tools/test-parameters.py
node tools/test-activity.cjs
```

La primera prueba compara 5.500 casos de 250 variantes contra eliminación independiente con fracciones exactas, comprueba escalares, sistemas y opciones sin duplicados. La segunda prueba usa un reloj simulado para verificar inactividad, foco, visibilidad, suspensión, recarga y el umbral exacto de 60 minutos. No utiliza esperas reales de una hora ni modifica el umbral de producción.

Con el servidor activo, Playwright y Chromium:

```sh
NODE_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/smoke.cjs
```

Adapta `NODE_PATH` a tu instalación; `SITE_URL` y `CHROMIUM_PATH` permiten cambiar el servidor o el navegador. La prueba recorre el contenido en escritorio y móvil, verifica parámetros persistentes, respuestas, matrices de Cramer, confirmaciones de videos, temas, descarga idéntica del PDF común y comprobante imprimible separado. Comprueba el reinicio completo al terminar con menos de 60 minutos. Para el camino exitoso prepara un estado de prueba con el requisito temporal cumplido; el reloj se prueba de forma independiente. No hay una opción de producción para saltarse el mínimo.

Las respuestas externas de Drive se sustituyen por un marcador en la prueba local. Esto prueba el recorrido, no la reproducción real de los archivos de Drive.
