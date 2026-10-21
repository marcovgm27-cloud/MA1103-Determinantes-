# Determinantes · MA1103

Recurso estático de estudio asincrónico de la Semana 12 para el curso **MA1103 Cálculo y Álgebra Lineal**, Escuela de Matemática, Instituto Tecnológico de Costa Rica. Docente: Marco Vinicio Gutiérrez Montenegro.

## Ejecutar localmente

Desde la raíz del repositorio:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Abre el sitio con un navegador mediante el servidor HTTP. No requiere compilación, backend, claves ni instalación de dependencias para estudiantes. KaTeX 0.16.22 está incluido localmente con su licencia; únicamente los videos requieren conexión con YouTube. No se utiliza seguimiento analítico.

## Estructura

- `index.html`: estructura, datos institucionales y navegación.
- `css/styles.css`: diseño responsive y accesibilidad visual.
- `js/app.js`: preguntas, respuestas, pistas, navegación y estado.
- `vendor/katex/`: distribución oficial de KaTeX y fuentes locales.
- `pdf/actividad-final-determinantes.pdf`: actividad de tres problemas, sin soluciones.
- `tools/generar_pdf.py`: fuente editable del PDF; requiere Python, ReportLab y las fuentes DejaVu Sans.
- `tools/smoke.cjs`: prueba integral de navegador con Playwright y Chromium.

## Editar preguntas y fórmulas

El objeto `quizzes` de `js/app.js` agrupa las preguntas por etapa. Cada llamada a `question` contiene un identificador único, enunciado, opciones (o `null` para respuesta numérica), respuesta esperada, explicación, pistas progresivas y, opcionalmente, una fórmula TeX. En selección múltiple, la respuesta correcta es el índice de la opción empezando por cero. Los números admiten signo, punto o coma decimal; el reto de Cramer recibe dos valores.

`matrix` y `det` construyen expresiones TeX; `m` permite incluirlas en opciones. KaTeX produce HTML y MathML accesible. Los textos de contenido son de confianza y se editan en el código, no desde entradas del alumnado. Para cambiar los tres determinantes de la actividad de Cramer, actualiza tanto las preguntas como los mapas `matrices` y `matrixAnswers` de construcción de entradas.

Al modificar significativamente el contenido o las respuestas, cambia `KEY` para evitar reutilizar avances de una versión anterior.

## Cambiar videos

En la función `render`, el mapa `data` de las etapas 2, 4 y 6 contiene el título, identificador de YouTube y texto de preparación. Sustituye solo el identificador, no una URL completa. Se genera el iframe con título accesible y un enlace alternativo a YouTube. Verifica que el propietario permita la inserción y que el video sea accesible en el país de los estudiantes.

## Desbloqueo y progreso

La ruta contiene diez etapas: bienvenida, previos, tres pares de video y actividad, reto y PDF. Cada etapa depende de la anterior. Los previos requieren 3 de 4 aciertos; las actividades 1 y 2 requieren 2 de 3; Cramer exige construir y evaluar D, Dₓ y Dᵧ, calcular x e y y responder la pregunta conceptual. El reto exige los tres problemas correctos. Los videos se completan mediante el botón de continuar después de estudiarlos; no se mide tiempo de reproducción.

Cada etapa completada aporta un 10 %. La última etapa se marca al pulsar la descarga. Se guardan automáticamente las respuestas, intentos, pistas, etapa actual y logros en `localStorage` bajo `ma1103-determinantes-v1`. Se permite repetir una sección conservando los accesos ya ganados. El reinicio completo requiere confirmación. Si el navegador impide guardar, se informa y se mantiene el avance solo durante la sesión abierta.

La descarga está ausente del contenido y el acceso PDF de la navegación está deshabilitado hasta completar el reto. Como corresponde a un sitio estático público, el archivo puede abrirse mediante su URL directa y los datos del navegador son editables; el bloqueo es pedagógico, no un control de autorización.

## PDF

Para regenerarlo después de editar su fuente:

```sh
python3 tools/generar_pdf.py
```

Contiene exactamente tres problemas: una demostración por propiedades, un determinante 4 × 4 y un contexto de precios con un sistema 3 × 3 de solución única. No contiene soluciones. El PDF es un archivo ya generado y no exige Python en GitHub Pages.

## Verificación

Con el servidor activo, instala Playwright en un directorio de herramientas fuera del repositorio, o usa el proporcionado por tu entorno, y ejecuta:

```sh
NODE_PATH=/ruta/a/node_modules node tools/smoke.cjs
```

Por defecto utiliza `/usr/bin/chromium`; se puede definir `CHROMIUM_PATH`. La prueba verifica ruta, umbrales, respuestas, pistas progresivas, matrices de Cramer, descarga, persistencia, confirmación del reinicio, ausencia de errores JS y desbordamiento en móvil. Crea capturas en `/tmp`. Comprueba los tres identificadores de video, pero la reproducción externa se debe verificar aparte. Las herramientas de prueba no se publican como dependencias del sitio.

Durante la implementación se verificaron los determinantes y soluciones por eliminación exacta con fracciones. La prueba integral pasó en Chromium. La reproducción de YouTube no pudo validarse: el proxy del entorno devolvió 403 a sus dominios.

## Publicar con GitHub Pages

1. Sube los archivos a la rama `main` del repositorio, conservando sus rutas relativas.
2. En GitHub, abre **Settings → Pages → Build and deployment**.
3. Elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda.
4. Espera el despliegue y abre la dirección que GitHub indique.
5. Recorre las actividades y verifica videos y descarga en el dominio publicado.

El archivo `.nojekyll` indica que los archivos deben servirse directamente. No se necesita un proceso de construcción. La implementación local no activa Pages ni publica cambios automáticamente.
