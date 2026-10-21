const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:8000';
const key='ma1103-determinantes-v3';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const seeds=[];
  for(const width of [1440,390]) {
   const context=await browser.newContext({viewport:{width,height:1000},colorScheme:'light'});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://drive.google.com/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<p>External preview fixture</p>'}));
   await page.goto(base);const original=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);seeds.push(original.seed);
   const course=await page.evaluate(seed=>window.DeterminantesCourse.createCourse(seed),original.seed);
   const check=async()=>{assert.equal(await page.locator('.math-error,.katex-error').count(),0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));};
   await page.getByRole('button',{name:'Comenzar',exact:true}).click();assert.equal(await page.locator('#student-name').count(),1,'Name required');
   await page.getByRole('button',{name:'Activar modo oscuro'}).click();await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
   assert.equal((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).seed,original.seed,'Refresh preserves parameters');
   await page.getByRole('button',{name:'Activar modo claro'}).click();
   // Seed the already-tested time prerequisite; the unit test exercises clock advancement.
   const fixture=await page.evaluate(k=>{const state=JSON.parse(localStorage.getItem(k));state.metrics={activeMs:3600001,actions:10};return state;},key);
   await page.addInitScript(({key,fixture})=>{if(window!==window.top)return;if(!sessionStorage.getItem('success-fixture')){localStorage.setItem(key,JSON.stringify(fixture));sessionStorage.setItem('success-fixture','1');}},{key,fixture});
   await page.reload();await page.locator('#student-name').fill('Estudiante de prueba Álvarez');await page.getByRole('button',{name:'Comenzar',exact:true}).click();
   async function submit(q,wrongMatrix=false,wrongAnswer=false) {
    const form=page.locator(`[data-question="${q.id}"]`);
    if(q.matrix)for(let i=0;i<q.matrix.flat().length;i++)await form.locator(`[name=m${i}]`).fill(String(q.matrix.flat()[i]+(wrongMatrix&&i===0?1:0)));
    if(q.options)await form.locator('input[type=radio]').nth(wrongAnswer?(q.answer+1)%q.options.length:q.answer).check();
    else if(q.variables)for(let i=0;i<q.variables.length;i++)await form.locator(`[name=${q.variables[i]}]`).fill(String(q.answer[i]));
    else await form.locator('[name=answer]').fill(String(wrongAnswer?q.answer+1:q.answer));
    await form.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await check();
   }
   const videos=[];
   for(let stage=1;stage<=12;stage++) {
    if(course.stages[stage].type==='video') {
     videos.push(await page.locator('iframe').getAttribute('src'));
     assert(await page.locator('#video-next').isDisabled());
     await page.locator('#video-confirm').check();await page.locator('#video-next').click();
    } else {
     const qs=course.quizzes[stage];
     if(stage===3) {await submit(qs[1],false,true);assert.equal(await page.locator('[data-question=a12] .success').count(),0);}
     if(stage===11) {assert.equal(await page.locator('[data-question=c3d1]').count(),0);await submit(qs[0],true);assert.equal(await page.locator('[data-question=c3d1]').count(),0);}
     for(const q of qs)await submit(q);
     await page.locator(`[data-next="${stage}"]`).click();
    }
   }
   assert.equal(videos.length,5);assert.deepEqual(videos,course.stages.filter(s=>s.type==='video').map(s=>`https://drive.google.com/file/d/${s.video.id}/preview`));
   const download=page.waitForEvent('download');await page.locator('#download').click();const file=await download;const dest=`/tmp/practica-registro-${width}.pdf`;await file.saveAs(dest);assert(fs.statSync(dest).size>30000);
   const common=await page.request.get(`${base}/pdf/actividad-final-determinantes.pdf`);assert.deepEqual(fs.readFileSync(dest),await common.body(),'Practice PDF must be byte-for-byte identical for all users');
   const popupEvent=context.waitForEvent('page',{timeout:10000});await page.locator('#receipt').click();const popup=await popupEvent;await popup.locator('main').waitFor({timeout:10000});await popup.evaluate(()=>Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Fonts did not load')),10000))]));assert.match(await popup.locator('main').innerText(),/60 minutos/);assert.match(await popup.locator('main').innerText(),/Estudiante de prueba Álvarez/);await popup.pdf({path:`/tmp/comprobante-${width}.pdf`,preferCSSPageSize:true,printBackground:true});await popup.close();
   assert.equal(await page.locator('#percent').innerText(),'100 %');await page.reload();assert.equal(await page.locator('#percent').innerText(),'100 %');
   await page.screenshot({path:`/tmp/determinantes-v3-${width}-pdf.png`,fullPage:true});
   page.once('dialog',d=>d.accept());await page.locator('#reset').click();const reset=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   assert.notEqual(reset.seed,original.seed);assert.equal(reset.metrics.activeMs,0);assert.equal(reset.completed.length,0);
   await page.getByRole('button',{name:'Activar modo oscuro'}).click();await page.screenshot({path:`/tmp/determinantes-v3-${width}-dark.png`,fullPage:true});
   assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width}px: randomized course, all answers, inverse scalars, Cramer gates, explicit video declarations, theme, identical common PDF, separate printable record, persistence and reset.`);
  }
  assert.notEqual(seeds[0],seeds[1],'Different browsers get different exercises');
  // A full but too-fast course must automatically restart, not merely delay a link.
  const context=await browser.newContext(),page=await context.newPage();await page.goto(base);
  const fastFixture=await page.evaluate(k=>{
   const state=JSON.parse(localStorage.getItem(k)),course=window.DeterminantesCourse.createCourse(state.seed);
   state.current=12;state.studentName='Recorrido rápido';state.completed=Array.from({length:12},(_,i)=>i);state.metrics={activeMs:30000,actions:20};
   for(const stage of course.stages.filter(s=>s.type==='video'))state.videos[stage.video.id]={confirmed:true,confirmedAt:Date.now()};
   for(const [n,qs] of Object.entries(course.quizzes))if(+n<12)for(const q of qs)state.answers[q.id]={value:q.answer,...(q.matrix?{entries:q.matrix.flat()}:{})};
   return state;
  },key);await page.addInitScript(({key,fixture})=>{if(window!==window.top)return;if(!sessionStorage.getItem('fast-fixture')){localStorage.setItem(key,JSON.stringify(fixture));sessionStorage.setItem('fast-fixture','1');}},{key,fixture:fastFixture});await page.reload();const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  const reto=await page.evaluate(seed=>window.DeterminantesCourse.createCourse(seed).quizzes[12],before.seed);
  for(const q of reto) {
   const f=page.locator(`[data-question="${q.id}"]`);
   if(q.variables)for(let i=0;i<q.variables.length;i++)await f.locator(`[name=${q.variables[i]}]`).fill(String(q.answer[i]));
   else await f.locator('[name=answer]').fill(String(q.answer));
   await f.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();
  }
  const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.equal(after.current,0);assert.notEqual(after.seed,before.seed);assert.equal(after.metrics.activeMs,0);assert.equal(after.completed.length,0);assert.equal(Object.keys(after.answers).length,0);assert.equal(await page.locator('#download').count(),0);assert.match(await page.locator('[role=alert]').innerText(),/menos de 60 minutos/);
  await context.close();console.log('PASS: finishing below 60 active minutes forces a complete restart with fresh parameters and no PDF access.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
