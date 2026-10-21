(() => {
'use strict';
const KEY = 'ma1103-determinantes-v1';
const $ = (s) => document.querySelector(s);
const lock = '<svg class="lock" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>';
const m = (tex) => `<span class="math inline" data-tex="${tex.replaceAll('"','&quot;')}"></span>`;
const matrix = (rows) => `\\begin{pmatrix}${rows.map(r=>r.join('&')).join('\\\\')}\\end{pmatrix}`;
const det = (rows) => `\\begin{vmatrix}${rows.map(r=>r.join('&')).join('\\\\')}\\end{vmatrix}`;
const steps = ['Bienvenida','Conocimientos previos','Video 1 · Propiedades','Actividad 1 · Propiedades','Video 2 · Operaciones','Actividad 2 · Operaciones','Videos 3–5','Actividad 3 · Cramer','Reto integrador','Actividad final · PDF'];
const question = (id, prompt, options, answer, explanation, hints = [], tex = '') => ({id,prompt,options,answer,explanation,hints,tex});
const quizzes = {
1: [
question('p1','Una matriz tiene 3 filas y 4 columnas. ¿Cuál es su orden?', ['3 × 4','4 × 3','3 × 3'],0,'El orden se escribe filas × columnas: 3 × 4.'),
question('p2','¿Cuál de estas matrices es triangular superior?', [m(matrix([[1,2,3],[0,4,5],[0,0,6]])),m(matrix([[1,0,0],[2,4,0],[3,5,6]])),m(matrix([[1,2,0],[3,4,5],[0,1,6]]))],0,'En una matriz triangular superior, todas las entradas debajo de la diagonal principal son cero.'),
question('p3','¿Qué efecto tiene intercambiar dos filas sobre el determinante?', ['No cambia','Cambia de signo','Siempre se hace cero'],1,'Cada intercambio de dos filas multiplica el determinante por −1.'),
question('p4','Si una matriz cuadrada tiene dos filas iguales, ¿cuánto vale su determinante?', ['1','0','Depende del orden'],1,'Dos filas iguales son linealmente dependientes; por eso el determinante es cero.')
],
3: [
question('a11','Sin expandir por cofactores, determina det(A) y elige la justificación.', ['0: la segunda fila es el doble de la primera','0: hay un cero en la matriz','5: es la última entrada'],0,'Correcto. La segunda fila es el doble de la primera: las filas son dependientes y el determinante es cero.', ['Observa la relación entre las filas.','Compara cada entrada de la segunda fila con la primera.','La segunda fila es 2 veces la primera. Esta dependencia implica det(A) = 0.'], 'A='+matrix([[1,2,3],[2,4,6],[0,1,5]])),
question('a12','Si det(A) = 5 y A es de orden 2 × 2, ¿cuánto vale det(3A)?',null,45,'Se multiplican las dos filas por 3. Por tanto, det(3A) = 3² · 5 = 45.', ['Multiplicar toda la matriz afecta a cada fila.','Para una matriz de orden n, el factor total es la potencia n del escalar.','Usa det(kA) = kⁿ det(A): 3² · 5 = 45.']),
question('a13','B se obtiene intercambiando dos filas de A. Si det(A) = −7, ¿cuánto vale det(B)?',null,7,'Un intercambio cambia el signo: det(B) = −det(A) = 7.', ['Recuerda el efecto de un intercambio.','Multiplica el determinante original por −1.','Un intercambio cambia el signo: −(−7) = 7.'])
],
5: [
question('a21','¿Qué operación conviene realizar primero para crear un cero bajo el primer pivote?', [m('F_2\\leftarrow F_2-2F_1'),m('F_1\\leftarrow 2F_1'),m('F_1\\leftrightarrow F_3'),m('F_3\\leftarrow 3F_3')],0,'Sumar un múltiplo de una fila a otra no cambia el determinante y permite crear ceros.', ['Busca crear un cero sin modificar el determinante.','La primera entrada de F₂ es el doble de la de F₁.','F₂ ← F₂ − 2F₁ crea un cero y conserva el determinante.'], 'A='+matrix([[1,2,1],[2,5,3],[3,8,6]])),
question('a22','Calcula el siguiente determinante.',null,1,'Con F₃ ← F₃ − 2F₂ queda una matriz triangular con diagonal 1, 1, 1. El determinante es 1.', ['Busca triangularizar con una suma de filas.','Aplica F₃ ← F₃ − 2F₂.','La diagonal resultante es 1, 1, 1; su producto es 1.'],det([[1,2,1],[0,1,1],[0,2,3]])),
question('a23','¿Qué ocurre con el determinante si multiplicamos una sola fila por 4?', ['Queda multiplicado por 4','Queda multiplicado por 4³','No cambia'],0,'El determinante es lineal en cada fila: multiplicar una sola fila por 4 multiplica el determinante por 4.', ['Distingue una fila de toda la matriz.','Solo se introduce un factor 4.','Al multiplicar una fila por 4, el determinante queda multiplicado por 4.'])
],
7: [
question('c1','Paso 1. Construye la matriz de coeficientes y calcula D.',null,-3,'D = 2(−1) − 1(1) = −3. Es distinto de cero, así que Cramer puede aplicarse.', ['Conserva el orden de las variables x, y.','La matriz de coeficientes es ((2,1),(1,−1)).','D = 2(−1) − 1(1) = −3.'], 'D='+det([[2,1],[1,-1]])),
question('c2','Paso 2. Sustituye la columna de x por los términos independientes y calcula Dₓ.',null,-6,'Dₓ = 5(−1) − 1(1) = −6.', ['Sustituye solo la primera columna por 5 y 1.','Conserva la columna de y: 1, −1.','Dₓ = 5(−1) − 1(1) = −6.'], 'D_x='+det([[5,1],[1,-1]])),
question('c3','Paso 3. Sustituye la columna de y y calcula Dᵧ.',null,-3,'Dᵧ = 2(1) − 5(1) = −3.', ['Reemplaza ahora la segunda columna.','La primera columna sigue siendo 2, 1.','Dᵧ = 2(1) − 5(1) = −3.'], 'D_y='+det([[2,5],[1,1]])),
question('c4','Paso 4. Calcula x = Dₓ / D.',null,2,'x = (−6)/(−3) = 2.', ['Divide el determinante de x por D.','Ambos determinantes tienen el mismo signo.','x = (−6)/(−3) = 2.']),
question('c5','Paso 5. Calcula y = Dᵧ / D.',null,1,'y = (−3)/(−3) = 1. Verificación: 2·2 + 1 = 5 y 2 − 1 = 1.', ['Divide el determinante de y por D.','El numerador y el denominador son iguales y no nulos.','y = (−3)/(−3) = 1.']),
question('c6','¿Cuándo puede aplicarse directamente la regla de Cramer a un sistema cuadrado?', ['Cuando D = 0','Cuando el determinante de la matriz de coeficientes es distinto de cero','Siempre que haya tres ecuaciones'],1,'Si D ≠ 0, la matriz es invertible y el sistema tiene una única solución.', ['La división por D debe estar definida.','Piensa qué valor del denominador impediría calcular los cocientes.','Se requiere D ≠ 0 para aplicar directamente la regla de Cramer.'])
],
8: [
question('r1','Propiedades. Determina det(A) sin desarrollar por cofactores.',null,0,'La segunda fila es el doble de la primera. Por dependencia de filas, det(A) = 0.', ['Compara las dos primeras filas.','F₂ = 2F₁.','Dos filas proporcionales implican det(A) = 0.'], 'A='+matrix([['a','b','c'],['2a','2b','2c'],['d','e','f']])),
question('r2','Operaciones. Calcula eficientemente este determinante.',null,1,'Usa F₂ ← F₂ − F₁ y F₃ ← F₃ − 2F₁; luego F₃ ← F₃ − F₂. La diagonal es 1, 1, 1.', ['Crea ceros bajo la primera entrada.','Usa F₂ ← F₂ − F₁ y F₃ ← F₃ − 2F₁.','Con F₃ ← F₃ − F₂ queda diagonal 1, 1, 1 y determinante 1.'],det([[1,2,3],[1,3,4],[2,5,8]])),
question('r3','Cramer. Introduce la solución (x, y) del sistema.',null,[2,3],'D = −3, Dₓ = −6, Dᵧ = −9; por tanto x = 2, y = 3. Se cumple 2 + 3 = 5 y 4 − 3 = 1.', ['Construye D y sustituye una columna cada vez.','D = −3. Calcula Dₓ y Dᵧ.','Dₓ = −6 y Dᵧ = −9; divide cada uno por D = −3.'], '\\begin{cases}x+y=5\\\\2x-y=1\\end{cases}')
]
};
const blank = () => ({completed:[],answers:{},attempts:{},hints:{},current:0});
let state = blank();
let storageOK = true;
try { const raw = JSON.parse(localStorage.getItem(KEY)); if(raw && typeof raw==='object') {
// Restore only known answer records, then derive unlocks from evidence.
for(const q of Object.values(quizzes).flat()) {
const a=raw.answers?.[q.id];
if(a && typeof a==='object' && typeof a.correct==='boolean') state.answers[q.id]=a;
if(Number.isInteger(raw.attempts?.[q.id]) && raw.attempts[q.id]>=0) state.attempts[q.id]=raw.attempts[q.id];
if(Number.isInteger(raw.hints?.[q.id])) state.hints[q.id]=Math.max(0,Math.min(3,raw.hints[q.id]));
}
state.completed=Array.isArray(raw.completed)?raw.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<=9):[];
state.current=Number.isInteger(raw.current)?raw.current:0;
} } catch {storageOK=false;}
function passed(q){return state.answers[q.id]?.correct===true;}
function score(n){return quizzes[n].filter(passed).length;}
function achieved(n){if(quizzes[n]) return score(n)>=(n===1?3:n===3||n===5?2:quizzes[n].length);return state.completed.includes(n);}
// Only a contiguous chain counts, even if old data is inconsistent.
state.completed=steps.map((_,n)=>n).filter(n=>state.completed.includes(n)||achieved(n));
let chain=[];for(let n=0;n<10;n++){if(!state.completed.includes(n))break;chain.push(n);}state.completed=chain;
function available(n){return n===0||state.completed.includes(n-1);}
if(!available(state.current)||state.current<0||state.current>9)state.current=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;} $('#storage-notice').textContent=storageOK?'Tu avance se guarda en este navegador.':'El almacenamiento no está disponible. El avance se conserva solo mientras esta página esté abierta.';}
function complete(n){if(!state.completed.includes(n)&&available(n))state.completed.push(n);save();}
function renderMath(root=document){root.querySelectorAll('[data-tex]').forEach(el=>{try{katex.render(el.dataset.tex,el,{throwOnError:true,displayMode:!el.classList.contains('inline'),output:'htmlAndMathml'});}catch{el.textContent=el.dataset.tex;el.classList.add('math-error');}});}
function navigation(){
$('#route').innerHTML=steps.map((title,n)=>`<button data-go="${n}" ${available(n)?'':'disabled'} class="${n===state.current?'active ':''}${state.completed.includes(n)?'done':''}" ${n===state.current?'aria-current="step"':''}><span class="step-icon">${state.completed.includes(n)?'✓':String(n+1).padStart(2,'0')}</span><span>${title}</span>${available(n)?'':lock}</button>`).join('');
$('#topnav').innerHTML=[[0,'Inicio'],[1,'Previos'],[2,'Video 1'],[4,'Video 2'],[6,'Videos 3–5'],[8,'Reto final'],[9,'PDF']].map(([n,t])=>`<button data-go="${n}" ${available(n)?'':'disabled'} class="${state.current===n?'active':''}" ${state.current===n?'aria-current="step"':''}>${t} ${state.completed.includes(n)?'✓':!available(n)?lock:''}</button>`).join('');
const pct=state.completed.length*10;$('#percent').textContent=`${pct} %`;$('#progress').value=pct;$('#progress').textContent=`${pct} %`;$('#progress-caption').textContent=`${state.completed.length} de 10 etapas completadas`;
}
function go(n){if(!available(n))return;state.current=n;save();render();$('#content').focus();}
function nextButton(n,label='Continuar'){return `<div class="button-row"><button class="primary" data-next="${n}" ${state.completed.includes(n)?'':'disabled'}>${label}<span aria-hidden="true">→</span></button></div>`;}
function qHTML(q,index,progressive=false){
const matrices={c1:[[2,1],[1,-1]],c2:[[5,1],[1,-1]],c3:[[2,5],[1,1]]};
const a=state.answers[q.id],done=passed(q),qs=quizzes[state.current],unlocked=!progressive||index===0||qs.slice(0,index).every(passed);
if(!unlocked)return `<article class="card question"><p class="question-number">PASO ${index+1} · BLOQUEADO ${lock}</p><h3>${q.prompt}</h3><p class="muted">Completa el paso anterior para continuar.</p></article>`;
return `<form class="card question" data-question="${q.id}"><p class="question-number">${progressive?'PASO':'EJERCICIO'} ${String(index+1).padStart(2,'0')} ${done?' · COMPLETADO ✓':''}</p><h3>${q.prompt}</h3>${matrices[q.id]?`<fieldset class="matrix-entry"><legend>Construye el determinante: introduce sus cuatro entradas.</legend><div class="matrix-grid">${matrices[q.id].flat().map((v,j)=>`<label><span class="sr-only">Fila ${Math.floor(j/2)+1}, columna ${j%2+1}</span><input type="text" inputmode="decimal" name="m${j}" required aria-label="Fila ${Math.floor(j/2)+1}, columna ${j%2+1}" ${done?'disabled':''} value="${done?v:''}"></label>`).join('')}</div></fieldset>`:q.tex?`<div class="math" data-tex="${q.tex}"></div>`:''}${q.options?`<fieldset><legend>Selecciona una respuesta</legend>${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${a?.value===i?'checked':''} required ${done?'disabled':''}><span>${o}</span></label>`).join('')}</fieldset>`:Array.isArray(q.answer)?['x','y'].map((v,i)=>`<label class="number-label">Valor de ${v}<input class="number-input" type="text" inputmode="decimal" name="${v}" required autocomplete="off" ${done?'disabled':''} value="${done?q.answer[i]:''}"></label>`).join(''):`<label class="number-label" for="input-${q.id}">Tu respuesta numérica</label><input id="input-${q.id}" class="number-input" type="text" inputmode="decimal" name="answer" required autocomplete="off" ${done?'disabled':''} value="${done?q.answer:''}">`}<div class="button-row"><button class="${done?'secondary':'primary'}" type="submit" ${done?'disabled':''}>${done?'Respuesta verificada ✓':'Comprobar respuesta'}</button>${q.hints.length&&!done?`<button type="button" class="text-button" data-hint="${q.id}">Consultar una pista</button>`:''}</div><div class="feedback ${done?'success':''}" role="status" aria-live="polite">${done?q.explanation:a?feedback(q):''}</div>${state.hints[q.id]&&!done?`<div class="feedback" role="note">Pista: ${q.hints[Math.min(state.hints[q.id],3)-1]}</div>`:''}</form>`;
}
function feedback(q){const attempts=state.attempts[q.id]||0;if(!q.hints.length)return `Revisa tu elección. ${q.explanation}`;return q.hints[Math.min(Math.max(attempts,1),3)-1];}
function render(){navigation();const n=state.current;let html='';
if(n===0)html=`<section class="card intro"><div class="section-label">01 / Bienvenida</div><h2>Tres ideas, un recorrido.</h2><p class="lead">En este estudio asincrónico trabajarás tres ideas fundamentales sobre determinantes: el uso de sus propiedades para justificar resultados, el cálculo eficiente mediante operaciones elementales y la aplicación de la regla de Cramer para resolver sistemas de ecuaciones lineales.</p><div class="note"><h3>¿Cómo trabajar este recurso?</h3><ul class="instructions"><li>Completa las actividades en orden para desbloquear cada etapa.</li><li>Puedes volver a las secciones disponibles y repetir los ejercicios.</li><li>Tu progreso se guarda automáticamente en este navegador.</li><li>Al finalizar, podrás descargar una actividad en PDF.</li></ul></div><div class="button-row"><button class="primary" id="begin">Comenzar <span aria-hidden="true">→</span></button><span class="meta">A tu ritmo · Con retroalimentación en cada paso</span></div></section><div class="features"><div class="feature"><span>01 / COMPRENDER</span><h3>Propiedades</h3><p>Justifica sin calcular de más.</p></div><div class="feature"><span>02 / SIMPLIFICAR</span><h3>Operaciones</h3><p>Transforma y controla el determinante.</p></div><div class="feature"><span>03 / APLICAR</span><h3>Regla de Cramer</h3><p>Conecta determinantes y sistemas.</p></div></div>`;
else if([2,4,6].includes(n)){
const data={2:['Propiedades de los determinantes','14DCgJjfCNkerH56JgdkdBQpZnKKtaTvO','En la siguiente actividad deberás utilizar propiedades de los determinantes para justificar resultados sin desarrollar innecesariamente todos los cálculos.'],4:['Cálculo de determinantes mediante operaciones','1Eg1h-VmaM8QdprLMkUVFB7wVXCtPoKOy','El objetivo ahora es transformar convenientemente una matriz para facilitar el cálculo del determinante, controlando cómo cada operación modifica su valor.'],6:['Regla de Cramer','1NT4MSBQH31zRYQIAB51HOzY6nXxmlzgb','Ahora aplicarás determinantes para resolver sistemas lineales mediante la regla de Cramer.']}[n];
html=`<section class="card"><div class="section-label">Video ${n/2} / Explorar</div><h2>${data[0]}</h2><div class="video"><iframe src="https://drive.google.com/file/d/${data[1]}/preview" title="Video ${n/2}: ${data[0]}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="video-link" href="https://drive.google.com/file/d/${data[1]}/view" target="_blank" rel="noopener noreferrer">Abrir el video en Google Drive ↗</a>${n===6?[[4,'1aLG4Bw7X_9_xvtZ_eqDrDvTEFQLQI6sw'],[5,'1yKDycHv7-faiBqTNcs6UhuW0rL8onpGF']].map(([number,id])=>`<section class="video-continuation" aria-labelledby="video-${number}-title"><h3 id="video-${number}-title">Video ${number} · Continuación</h3><div class="video"><iframe src="https://drive.google.com/file/d/${id}/preview" title="Video ${number}: continuación" allow="autoplay; encrypted-media; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="video-link" href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener noreferrer">Abrir el Video ${number} en Google Drive ↗</a></section>`).join(''):''}<div class="note"><h3>Antes de continuar</h3><p>${data[2]}</p><p>Cuando termines de estudiar el video, continúa con la actividad.</p></div><button class="primary" id="video-next">Ir a la actividad <span aria-hidden="true">→</span></button></section>`;
}else if(quizzes[n]){
const titles={1:['Activa lo que sabes','Responde correctamente al menos 3 de las 4 preguntas para continuar.'],3:['Justificar con propiedades','Responde correctamente al menos 2 de los 3 ejercicios para desbloquear el Video 2.'],5:['Calcular con operaciones','Responde correctamente al menos 2 de los 3 ejercicios para desbloquear el Video 3.'],7:['Cramer, paso a paso','Completa cada determinante antes de calcular la solución. Todos los pasos y la pregunta conceptual deben ser correctos.'],8:['Conecta las tres ideas','Resuelve los tres problemas para habilitar la actividad final. Puedes consultar pistas.']}[n];
html=`<section class="card"><div class="section-label">${n===1?'Conocimientos previos':n===8?'Reto integrador':`Actividad ${n===3?1:n===5?2:3}`}</div><h2>${titles[0]}</h2><p class="muted">${titles[1]}</p>${n===7?`<div class="math" data-tex="\\begin{cases}2x+y=5\\\\x-y=1\\end{cases}"></div><p class="meta">En cada paso se muestra la matriz que debes construir y evaluar.</p>`:''}<p class="score" role="status">${score(n)} de ${quizzes[n].length} respuestas correctas${state.completed.includes(n)?' · Siguiente etapa desbloqueada ✓':''}</p></section>`;
html+=quizzes[n].map((q,i)=>qHTML(q,i,n===7)).join('');html+=nextButton(n,n===8?'Ver actividad final':n===7?'Ir al reto integrador':n===1?'Ir al Video 1':`Ir al Video ${n===3?2:3}`);html+=`<button class="text-button" id="retry">Repetir los ejercicios de esta sección</button>`;
}else if(n===9){html=`<section class="card intro"><span class="badge">RECORRIDO COMPLETADO ✓</span><h2>¡Has completado el estudio asincrónico de la Semana 12!</h2><p class="lead">Ya puedes descargar la actividad final de Determinantes.</p><ul class="completion-list">${['Conocimientos previos','Propiedades','Operaciones','Regla de Cramer','Reto integrador'].map(t=>`<li>${t}<span aria-label="Completado">✓</span></li>`).join('')}</ul><div class="note"><h3>Tu siguiente paso</h3><p>Desarrolla tres problemas de propiedades, operaciones elementales y regla de Cramer. Justifica tus procedimientos e interpreta los resultados. El PDF no incluye soluciones.</p></div><a class="download" href="pdf/actividad-final-determinantes.pdf" download="actividad-final-determinantes.pdf" id="download">Descargar actividad final <span aria-hidden="true">↓</span></a><p class="meta">PDF · 3 problemas · Sin soluciones</p></section>`;}
$('#content').innerHTML=html;renderMath();save();
}
function parseNumber(value){const s=String(value??'').trim().replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)?Number(s):NaN;}
document.addEventListener('click',e=>{
const target=e.target.closest('button,a');if(!target)return;
if(target.matches('[data-go]'))go(Number(target.dataset.go));
if(target.id==='begin'){complete(0);go(1);}
if(target.id==='video-next'){complete(state.current);go(state.current+1);}
if(target.matches('[data-next]'))go(Number(target.dataset.next)+1);
if(target.matches('[data-hint]')){const id=target.dataset.hint;state.hints[id]=Math.min((state.hints[id]||0)+1,3);save();render();document.querySelector(`[data-question="${id}"] [data-hint]`)?.focus();}
if(target.id==='retry'){
for(const q of quizzes[state.current]){delete state.answers[q.id];delete state.attempts[q.id];delete state.hints[q.id];}
// Repetition keeps previously earned access; completion is a durable achievement.
save();render();$('#content').focus();}
if(target.id==='reset'&&confirm('¿Deseas reiniciar todo tu progreso? Se borrarán tus respuestas y se bloquearán las etapas siguientes.')){state=blank();save();render();$('#content').focus();}
if(target.id==='download'&&available(9)){complete(9);navigation();}
});
document.addEventListener('submit',e=>{
const form=e.target.closest('[data-question]');if(!form)return;e.preventDefault();const n=state.current,q=quizzes[n].find(q=>q.id===form.dataset.question);if(!q||passed(q))return;
const index=quizzes[n].indexOf(q);if(n===7&&!quizzes[n].slice(0,index).every(passed))return;
const fd=new FormData(form);let value=q.options?Number(fd.get('answer')):Array.isArray(q.answer)?[parseNumber(fd.get('x')),parseNumber(fd.get('y'))]:parseNumber(fd.get('answer'));
const matrixAnswers={c1:[2,1,1,-1],c2:[5,1,1,-1],c3:[2,5,1,1]};
const matrixOK=!matrixAnswers[q.id]||matrixAnswers[q.id].every((v,i)=>parseNumber(fd.get(`m${i}`))===v);
const correct=matrixOK&&(Array.isArray(q.answer)?q.answer.every((v,i)=>v===value[i]):value===q.answer);
state.answers[q.id]={value,correct};if(!correct)state.attempts[q.id]=(state.attempts[q.id]||0)+1;
if(achieved(n))complete(n);save();render();const updated=document.querySelector(`[data-question="${q.id}"]`);if(updated){updated.querySelector('.feedback').tabIndex=-1;updated.querySelector('.feedback').focus({preventScroll:true});}
});
render();
})();
