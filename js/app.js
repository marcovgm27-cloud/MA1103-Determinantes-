(() => {
  'use strict';
  const {quizzes,stages,escape,math} = window.DeterminantesCourse;
  const KEY = 'ma1103-determinantes-v2';
  const $ = selector => document.querySelector(selector);
  const lock = '<svg class="lock" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>';
  const last = stages.length-1;
  const fresh = () => ({completed:[],answers:{},attempts:{},hints:{},current:0});
  let state=fresh(), storageOK=true;
  function parseNumber(value) {
    const text=String(value??'').trim().replace(',','.');
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return Number(text);
    const fraction=text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
    return fraction && Number(fraction[2])!==0 ? Number(fraction[1])/Number(fraction[2]) : NaN;
  }
  function answerCorrect(q,answer) {
    if(!answer) return false;
    const valid=Array.isArray(q.answer)?Array.isArray(answer.value)&&q.answer.every((v,i)=>v===answer.value[i]):answer.value===q.answer;
    return valid && (!q.matrix || Array.isArray(answer.entries)&&q.matrix.flat().every((v,i)=>v===answer.entries[i]));
  }
  function passed(q) { return answerCorrect(q,state.answers[q.id]); }
  function score(n) { return quizzes[n].filter(passed).length; }
  function available(n) { return Number.isInteger(n)&&n>=0&&n<=last&&(n===0||state.completed.includes(n-1)); }
  try {
    const raw=JSON.parse(localStorage.getItem(KEY));
    if(raw && typeof raw==='object') {
      for(const q of Object.values(quizzes).flat()) {
        if(raw.answers?.[q.id] && typeof raw.answers[q.id]==='object') state.answers[q.id]=raw.answers[q.id];
        if(Number.isInteger(raw.attempts?.[q.id])) state.attempts[q.id]=Math.max(0,raw.attempts[q.id]);
        if(Number.isInteger(raw.hints?.[q.id])) state.hints[q.id]=Math.min(3,Math.max(0,raw.hints[q.id]));
      }
      // Completed stages remain earned when exercises are repeated.
      for(let n=0;n<stages.length;n++) {
        const earned=(Array.isArray(raw.completed)&&raw.completed.includes(n)) || (quizzes[n]&&score(n)>=stages[n].minimum);
        if(!earned) break;
        state.completed.push(n);
      }
      if(available(raw.current)) state.current=raw.current;
    }
  } catch { storageOK=false; }
  function save() {
    try {localStorage.setItem(KEY,JSON.stringify(state));} catch {storageOK=false;}
    $('#storage-notice').textContent=storageOK?'Tu avance se guarda en este navegador.':'No se puede guardar en este navegador. El avance se conservará solo mientras esta página permanezca abierta.';
  }
  function complete(n) {if(available(n)&&!state.completed.includes(n))state.completed.push(n);save();}
  function renderMath(root=document) {
    root.querySelectorAll('[data-tex]').forEach(el=>{
      try {katex.render(el.dataset.tex,el,{throwOnError:true,displayMode:!el.classList.contains('inline'),output:'htmlAndMathml'});}
      catch {el.textContent=el.dataset.tex;el.classList.add('math-error');}
    });
  }
  function navigation() {
    $('#route').innerHTML=stages.map((stage,n)=>`<button data-go="${n}" ${available(n)?'':'disabled'} class="${state.current===n?'active ':''}${state.completed.includes(n)?'done':''}" ${state.current===n?'aria-current="step"':''}><span class="step-icon">${state.completed.includes(n)?'✓':String(n+1).padStart(2,'0')}</span><span>${stage.title}</span>${available(n)?'':lock}</button>`).join('');
    $('#topnav').innerHTML=[[0,'Inicio'],[1,'Previos'],...[2,4,6,8,10].map((n,i)=>[n,`Video ${i+1}`]),[12,'Reto'],[13,'PDF']].map(([n,title])=>`<button data-go="${n}" ${available(n)?'':'disabled'} class="${state.current===n?'active':''}" ${state.current===n?'aria-current="step"':''}>${title} ${state.completed.includes(n)?'✓':available(n)?'':lock}</button>`).join('');
    const percent=Math.round(state.completed.length/stages.length*100);
    $('#percent').textContent=`${percent} %`;$('#progress').value=percent;$('#progress').textContent=`${percent} %`;
    $('#progress-caption').textContent=`${state.completed.length} de ${stages.length} etapas completadas`;
  }
  function go(n) {if(!available(n))return;state.current=n;save();render();$('#content').focus();}
  function numericField(name,label,value='',disabled=false) {
    return `<label class="number-label">${label}<input class="number-input" name="${name}" type="text" inputmode="decimal" autocomplete="off" required value="${escape(value)}" ${disabled?'disabled':''}></label>`;
  }
  function qHTML(q,index) {
    const progressive=state.current===11, done=passed(q), answer=state.answers[q.id];
    if(progressive&&!quizzes[11].slice(0,index).every(passed))return `<article class="card question locked"><p class="question-number">PASO ${index+1} · BLOQUEADO ${lock}</p><h3>${q.group||'Condición de Cramer'}</h3><p class="muted">Completa el paso anterior para continuar.</p></article>`;
    const order=q.matrix?.length;
    const matrixFields=q.matrix?`<fieldset class="matrix-entry"><legend>Construye el determinante: introduce sus ${order*order} entradas.</legend><div class="matrix-grid" style="--order:${order}">${q.matrix.flat().map((v,i)=>numericField(`m${i}`,`<span class="sr-only">Fila ${Math.floor(i/order)+1}, columna ${i%order+1}</span>`,done?v:answer?.entries?.[i]??'',done)).join('')}</div></fieldset>`:'';
    const controls=q.options?`<fieldset><legend>Selecciona una respuesta</legend>${q.options.map((option,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" required ${answer?.value===i?'checked':''} ${done?'disabled':''}><span>${option}</span></label>`).join('')}</fieldset>`:q.variables?`<div class="solution-grid">${q.variables.map((variable,i)=>numericField(variable,`Valor de ${math`${variable}`}`,done?q.answer[i]:answer?.value?.[i]??'',done)).join('')}</div>`:numericField('answer','Tu respuesta numérica',done?q.answer:answer?.value??'',done);
    const feedback=done?q.explanation:answer?(q.hints.length?q.hints[Math.min(state.attempts[q.id]||1,3)-1]:`Revisa tu elección. ${q.explanation}`):'';
    return `<form class="card question" data-question="${q.id}"><p class="question-number">${progressive?'PASO':'EJERCICIO'} ${String(index+1).padStart(2,'0')} ${done?'· COMPLETADO ✓':''}</p><h3>${q.prompt}</h3>${q.context?`<div class="math" data-tex="${escape(q.context)}"></div>`:''}${q.tex?`<div class="math" data-tex="${escape(q.tex)}"></div>`:''}${matrixFields}${controls}<div class="button-row"><button class="${done?'secondary':'primary'}" type="submit" ${done?'disabled':''}>${done?'Respuesta verificada ✓':'Comprobar respuesta'}</button>${q.hints.length&&!done?`<button type="button" class="text-button" data-hint="${q.id}">Consultar una pista</button>`:''}</div><div class="feedback ${done?'success':''}" role="status" aria-live="polite">${feedback}</div>${state.hints[q.id]&&!done?`<div class="feedback" role="note">Pista: ${q.hints[state.hints[q.id]-1]}</div>`:''}</form>`;
  }
  const deadline='<strong>Entrega:</strong> jueves 22 de octubre de 2026, a más tardar a las <strong>5:00 p. m.</strong> en la plataforma <strong>TEC Digital</strong> (hora de Costa Rica).';
  function render() {
    navigation();const n=state.current,stage=stages[n];let html='';
    if(stage.type==='welcome')html=`<section class="card intro"><div class="section-label">Bienvenida / Semana 12</div><h2>Comprender, demostrar y resolver.</h2><p class="lead">Estudia las propiedades de los determinantes, construye demostraciones y compara procedimientos de cálculo por linealidad y por operaciones entre filas y columnas. Finalmente, aplica la regla de Cramer a sistemas de tres y cuatro incógnitas.</p><div class="note"><h3>¿Cómo trabajar este recurso?</h3><ul class="instructions"><li>Estudia los cinco videos en orden y completa la actividad que sigue a cada uno.</li><li>Trabaja los cálculos y las justificaciones en tu cuaderno antes de comprobar tus respuestas.</li><li>Las pistas son progresivas. Puedes repetir las actividades y tu progreso se guarda automáticamente.</li><li>Al finalizar el reto integrador podrás descargar la práctica en PDF.</li></ul></div><p class="deadline">${deadline}</p><div class="button-row"><button class="primary" id="begin">Comenzar <span aria-hidden="true">→</span></button><span class="meta">A tu ritmo · Determinantes de órdenes tres y cuatro</span></div></section><div class="features"><div class="feature"><span>01 / ARGUMENTAR</span><h3>Propiedades y demostraciones</h3><p>Justifica cada transformación.</p></div><div class="feature"><span>02 / CALCULAR</span><h3>Linealidad y operaciones</h3><p>Compara caminos y combina métodos.</p></div><div class="feature"><span>03 / RESOLVER</span><h3>Regla de Cramer</h3><p>Trabaja con tres y cuatro incógnitas.</p></div></div>`;
    if(stage.type==='video') {
      const {video,number}=stage;
      html=`<section class="card"><div class="section-label">Video ${number} / Explorar</div><h2>${video.title}</h2><div class="video"><iframe src="https://drive.google.com/file/d/${video.id}/preview" title="Video ${number}: ${video.title}" allow="autoplay; encrypted-media; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="video-link" href="https://drive.google.com/file/d/${video.id}/view" target="_blank" rel="noopener noreferrer">Abrir el Video ${number} en Google Drive ↗</a><div class="note"><h3>Antes de continuar</h3><p>${video.preparation}</p><p>Cuando termines de estudiar el video, continúa con la actividad.</p></div><button class="primary" id="video-next">Ir a la actividad ${number} <span aria-hidden="true">→</span></button></section>`;
    }
    if(stage.type==='quiz') {
      const count=quizzes[n].length;
      html=`<section class="card"><div class="section-label">${n===1?'Conocimientos previos':n===12?'Reto integrador':`Actividad ${stage.number}`}</div><h2>${stage.heading||stage.title}</h2><p class="muted">${stage.minimum===count?'Completa correctamente todos los ejercicios para continuar.':`Responde correctamente al menos ${stage.minimum} de ${count} ejercicios para continuar.`}${n===11?' Construye y calcula los determinantes de cada sistema antes de introducir las incógnitas.':''}</p><p class="score" role="status">${score(n)} de ${count} respuestas correctas${state.completed.includes(n)?' · Siguiente etapa desbloqueada ✓':''}</p></section>`;
      html+=quizzes[n].map(qHTML).join('');
      html+=`<div class="button-row"><button class="primary" data-next="${n}" ${state.completed.includes(n)?'':'disabled'}>${n===12?'Ver actividad final':n===11?'Ir al reto integrador':`Ir al Video ${n===1?1:stage.number+1}`} <span aria-hidden="true">→</span></button></div><button class="text-button" id="retry">Repetir los ejercicios de esta sección</button>`;
    }
    if(stage.type==='pdf')html=`<section class="card intro"><span class="badge">RECORRIDO COMPLETADO ✓</span><h2>¡Has completado el estudio asincrónico de la Semana 12!</h2><p class="lead">Ya puedes descargar la actividad final de Determinantes.</p><ul class="completion-list">${['Conocimientos previos','Repaso de propiedades','Demostraciones','Cálculo por dos caminos','Operaciones entre filas y columnas','Cramer de órdenes tres y cuatro','Reto integrador'].map(title=>`<li>${title}<span aria-label="Completado">✓</span></li>`).join('')}</ul><div class="note"><h3>Tu siguiente paso</h3><p>Desarrolla los tres problemas de la práctica: propiedades, cálculo de determinantes y regla de Cramer. Justifica todos los procedimientos. El PDF está compuesto en LaTeX y no incluye soluciones.</p><p>${deadline}</p></div><a class="download" href="pdf/actividad-final-determinantes.pdf" download="actividad-final-determinantes.pdf" id="download">Descargar actividad final <span aria-hidden="true">↓</span></a><p class="meta">PDF · Tres problemas · Sin soluciones</p></section>`;
    $('#content').innerHTML=html;renderMath();save();
  }
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.matches('[data-go]'))go(Number(target.dataset.go));
    if(target.id==='begin'){complete(0);go(1);}
    if(target.id==='video-next'){complete(state.current);go(state.current+1);}
    if(target.matches('[data-next]'))go(Number(target.dataset.next)+1);
    if(target.matches('[data-hint]')) {
      const id=target.dataset.hint;state.hints[id]=Math.min((state.hints[id]||0)+1,3);save();render();document.querySelector(`[data-hint="${id}"]`)?.focus();
    }
    if(target.id==='retry') {for(const q of quizzes[state.current]){delete state.answers[q.id];delete state.attempts[q.id];delete state.hints[q.id];}save();render();$('#content').focus();}
    if(target.id==='reset'&&confirm('¿Deseas reiniciar todo tu progreso? Se borrarán tus respuestas y se bloquearán las etapas siguientes.')){state=fresh();save();render();$('#content').focus();}
    if(target.id==='download'&&available(last)){complete(last);navigation();}
  });
  document.addEventListener('submit',event=>{
    const form=event.target.closest('[data-question]');if(!form)return;event.preventDefault();
    const n=state.current,q=quizzes[n]?.find(item=>item.id===form.dataset.question);if(!q||passed(q))return;
    if(n===11&&!quizzes[n].slice(0,quizzes[n].indexOf(q)).every(passed))return;
    const data=new FormData(form);
    const value=q.variables?q.variables.map(v=>parseNumber(data.get(v))):q.options?Number(data.get('answer')):parseNumber(data.get('answer'));
    const answer={value};if(q.matrix)answer.entries=q.matrix.flat().map((_,i)=>parseNumber(data.get(`m${i}`)));
    state.answers[q.id]=answer;
    if(!answerCorrect(q,answer))state.attempts[q.id]=(state.attempts[q.id]||0)+1;
    if(score(n)>=stages[n].minimum)complete(n);save();render();
    const feedback=document.querySelector(`[data-question="${q.id}"] .feedback`);if(feedback){feedback.tabIndex=-1;feedback.focus({preventScroll:true});}
  });
  render();
})();
