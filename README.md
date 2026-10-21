# Determinantes · MA1103

Recurso estático de estudio asincrónico de la Semana 12 del curso **MA1103 Cálculo y Álgebra Lineal**, Escuela de Matemática, Instituto Tecnológico de Costa Rica. Docente: Marco Vinicio Gutiérrez Montenegro.

## Ejecutar el sitio

Desde la raíz del repositorio:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

No requiere compilación, backend ni claves. KaTeX y las fuentes están incluidos localmente. Los videos requieren acceso a Google Drive y deben estar compartidos como **Cualquier persona con el enlace → Lector**, con reproducción habilitada. No se mide el tiempo de reproducción; el estudiante continúa después de estudiar cada video.

## Tipografía, fórmulas y temas

Todos los textos, controles y campos utilizan **Latin Modern Roman**, la familia tipográfica de LaTeX, con fuentes OpenType locales regulares, negritas y cursivas. Se mantienen como HTML semántico para conservar el ajuste de líneas, la selección y la accesibilidad. Las expresiones matemáticas se escriben en **TeX** y se renderizan con **KaTeX 0.16.22**, incluyendo MathML accesible; no son imágenes. El tamaño base es de 22 px en escritorio y 20 px en móvil, con fórmulas al tamaño del texto circundante.

El botón superior alterna entre **modo claro y oscuro**. La preferencia se guarda en `ma1103-theme`; si no existe una preferencia explícita, se respeta el tema del sistema. Si el navegador bloquea el almacenamiento, el selector sigue funcionando durante la sesión.

## Ruta y contenido de los videos

El orden corresponde a los temas y enlaces confirmados por el docente:

| Video | Tema | Actividad siguiente |
| --- | --- | --- |
| 1 | Repaso de propiedades | Dependencia en orden cuatro, escalamiento de una matriz de orden tres y cambios de signo/factor |
| 2 | Demostraciones por propiedades | Linealidad y alternancia, demostración simbólica y encadenamiento de operaciones |
| 3 | Un determinante por dos caminos | Determinante de orden tres por linealidad y por operaciones |
| 4 | Filas, columnas y operaciones combinadas | Dos determinantes de orden cuatro |
| 5 | Regla de Cramer | Construcción y cálculo de determinantes en sistemas de tres y cuatro incógnitas |

Hay **14 etapas**: bienvenida, previos, cinco pares de video y actividad, reto integrador y PDF. Cada etapa exige completar la anterior. Se requieren 3 de 4 aciertos en previos; 2 de 3 en las actividades 1, 2 y 4; todos los ejercicios en la actividad 3; y todos los pasos en la actividad 5 y el reto. En Cramer se construye cada matriz y se calcula su determinante antes de introducir las soluciones. Un determinante correcto con entradas de matriz equivocadas no permite avanzar.

El porcentaje es el número de etapas completadas dividido entre 14, redondeado al entero más cercano. La última etapa se completa al pulsar la descarga. La repetición de ejercicios conserva los accesos ganados; reiniciar todo el progreso requiere confirmación.

Los nuevos ejercicios usan `ma1103-determinantes-v2`. El avance anterior de la versión de diez etapas no desbloquea las nuevas actividades. No se borra la clave antigua: se utiliza una clave distinta para esta nueva ruta.

El bloqueo es pedagógico: en un sitio estático público, el PDF sigue siendo accesible por su URL directa y los datos locales del navegador son editables. Desde la interfaz no se ofrece la descarga hasta terminar el reto.

## Estructura y edición

- `index.html`: estructura y datos institucionales.
- `css/styles.css`: tamaño de lectura, fuentes, variables de temas y diseño responsive.
- `js/theme.js`: tema inicial, selector y persistencia.
- `js/curriculum.js`: videos, preguntas, explicaciones, pistas, matrices y reglas de avance.
- `js/app.js`: validación de respuestas, progresión, navegación y almacenamiento.
- `vendor/katex/`: distribución oficial de KaTeX, con fuentes y licencia.
- `vendor/latin-modern/`: fuentes de texto locales y licencia GUST.
- `pdf/actividad-final-determinantes.tex`: fuente LaTeX editable de la práctica.
- `pdf/actividad-final-determinantes.pdf`: PDF ya compilado para estudiantes.
- `tools/generar_pdf.py`: compilación segura de LaTeX a PDF, con auxiliares temporales.
- `tools/smoke.cjs`: prueba integral con Playwright y Chromium.

### Preguntas y matemáticas

En `js/curriculum.js`, `quizzes` agrupa las preguntas según su etapa. La función `q` recibe identificador, enunciado, opciones (o `null`), respuesta, explicación, pistas y una expresión TeX opcional. La selección múltiple usa índices desde cero; las respuestas numéricas admiten signo, punto o coma decimal y fracciones como `1/2`.

Usa la plantilla etiquetada `math` para expresiones dentro de texto, `matrix` para matrices y `determinant` para determinantes. El campo `tex` de una pregunta genera una expresión en bloque. Los textos de contenido son de confianza y se editan en el código. Los datos que el estudiante introduce no se interpretan como HTML ni TeX.

`cramerQuestions` construye las preguntas de cada sistema a partir de su matriz, vector independiente, determinantes esperados y solución. Al cambiar un sistema, actualiza y comprueba todos esos datos. La propiedad `matrix` indica que además del resultado numérico se deben validar las entradas del determinante; `variables` identifica las incógnitas de una respuesta vectorial.

### Videos y desbloqueos

El arreglo `videos` tiene cinco objetos con `id`, `title` y `preparation`. `id` es solo el identificador del archivo de Drive, no la URL completa. Se genera un iframe `/file/d/ID/preview` y un enlace alternativo `/file/d/ID/view`. El arreglo `activities` configura los umbrales; `stages` intercala video y actividad para conservar el orden. Cambia la versión de `KEY` si una futura modificación hace incompatibles los avances guardados.

## Práctica en LaTeX

El PDF tiene dos páginas A4, tipografía Latin Modern y composición académica sobria. Contiene **exactamente tres problemas**, sin soluciones:

1. Demostración de una identidad por linealidad y alternancia.
2. Cálculo de un determinante de orden tres por dos caminos y uno de orden cuatro con operaciones combinadas.
3. Cramer: sistema de orden tres y contexto de precios de cuatro artículos con sistema de orden cuatro.

La fecha de entrega figura en el sitio y el PDF: **jueves 22 de octubre de 2026, a más tardar a las 5:00 p. m., en TEC Digital, hora de Costa Rica**.

Para regenerar tras editar el `.tex`:

```sh
python3 tools/generar_pdf.py
```

Requiere `pdflatex` de TeX Live y los paquetes Latin Modern, AMSMath, microtype, geometry, fancyhdr, enumitem e hyperref. El script compila dos veces, desactiva shell escape, verifica errores y desbordamientos y guarda únicamente el PDF final. El servidor y GitHub Pages no necesitan TeX Live: sirven el PDF ya generado.

## Verificación

Con el servidor activo, utiliza Playwright y Chromium disponibles en tu entorno:

```sh
NODE_PATH=/ruta/a/node_modules node tools/smoke.cjs
```

Se puede configurar `SITE_URL` y `CHROMIUM_PATH`; por defecto se usan el servidor local en el puerto 8000 y `/usr/bin/chromium`. En el entorno cloud preparado:

```sh
NODE_PATH=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules node tools/smoke.cjs
```

La prueba recorre todas las actividades en escritorio y móvil: valida TeX, tamaños de texto, cinco videos en orden, umbrales, pistas progresivas, construcción de matrices de Cramer de ambos órdenes, descarga, persistencia, repetición, reinicio y modo claro/oscuro. También comprueba el tema del sistema y los casos de almacenamiento corrupto o bloqueado. Genera capturas en `/tmp`. Durante la prueba local se sustituyen las respuestas externas de Drive por un marcador para probar el sitio de forma determinista; **esto no prueba la reproducción de los videos reales**.

Los nuevos determinantes, soluciones, argumentos simbólicos y el sistema contextual del PDF se comprobaron de forma independiente con aritmética exacta. La reproducción de Drive no pudo comprobarse desde el entorno: el proxy devuelve 403 al dominio de Drive.

## GitHub Pages

La publicación está configurada desde **main → / (root)**. Los archivos usan rutas relativas y `.nojekyll`; no necesitan una compilación del sitio. Al subir nuevos cambios a `main`, GitHub Pages vuelve a desplegar automáticamente.

Sitio: https://marcovgm27-cloud.github.io/MA1103-Determinantes-/

Si se configura en otro repositorio: abre **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda. Espera a que el despliegue termine. Comprueba el recorrido, los cinco videos y la descarga en el sitio publicado.
