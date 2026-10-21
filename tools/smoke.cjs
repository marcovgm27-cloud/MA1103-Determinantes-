const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8000');
assert.equal(await page.locator('#route button:disabled').count(),9);
assert.equal(await page.locator('#download').count(),0);
await page.getByRole('button',{name:'Comenzar'}).click();
async function radio(id,i){const f=page.locator(`[data-question="${id}"]`);await f.locator('input[type=radio]').nth(i).check();await f.getByRole('button',{name:'Comprobar respuesta'}).click();}
async function number(id,val,mat){const f=page.locator(`[data-question="${id}"]`);if(mat)for(let i=0;i<4;i++)await f.locator(`[name=m${i}]`).fill(String(mat[i]));await f.locator('[name=answer]').fill(String(val));await f.getByRole('button',{name:'Comprobar respuesta'}).click();}
await radio('p1',1);assert.match(await page.locator('[data-question=p1] .feedback').innerText(),/filas/);
await radio('p1',0);await radio('p2',0);
assert.equal(await page.locator('[data-next="1"]').isDisabled(),true);
await radio('p3',1);assert.equal(await page.locator('[data-next="1"]').isEnabled(),true);
await page.locator('[data-next="1"]').click();
const videoIds=[];
videoIds.push(await page.locator('iframe').getAttribute('src'));
await page.locator('#video-next').click();
// First, second and third failures reveal progressively specific support.
await number('a12',15);assert.match(await page.locator('[data-question=a12] .feedback').innerText(),/cada fila/);
await number('a12',15);assert.match(await page.locator('[data-question=a12] .feedback').innerText(),/potencia/);
await number('a12',15);assert.match(await page.locator('[data-question=a12] .feedback').innerText(),/45/);
await number('a12',45);await radio('a11',0);await number('a13',7);
await page.locator('[data-next="3"]').click();videoIds.push(await page.locator('iframe').getAttribute('src'));await page.locator('#video-next').click();
await radio('a21',0);await number('a22',1);await radio('a23',0);await page.locator('[data-next="5"]').click();videoIds.push(await page.locator('iframe').getAttribute('src'));await page.locator('#video-next').click();
assert.equal(await page.locator('[name=x]').count(),0);assert.equal(await page.locator('[data-question=c2]').count(),0);
await number('c1',-3,[2,1,1,-1]);await number('c2',-6,[5,1,1,-1]);await number('c3',-3,[2,5,1,1]);await number('c4',2);await number('c5',1);await radio('c6',1);
await page.locator('[data-next="7"]').click();await number('r1',0);await number('r2',1);
assert.equal(await page.locator('[data-next="8"]').isDisabled(),true);
await page.locator('[data-question=r3] [name=x]').fill('2');await page.locator('[data-question=r3] [name=y]').fill('3');await page.locator('[data-question=r3]').getByRole('button',{name:'Comprobar respuesta'}).click();
await page.locator('[data-next="8"]').click();
const response=await page.request.get('http://127.0.0.1:8000/pdf/actividad-final-determinantes.pdf');assert.equal(response.status(),200);assert.match((await response.body()).subarray(0,5).toString(),/%PDF-/);
const download=page.waitForEvent('download');await page.locator('#download').click();assert.equal((await download).suggestedFilename(),'actividad-final-determinantes.pdf');
assert.equal(await page.locator('#percent').innerText(),'100 %');await page.reload();assert.equal(await page.locator('#percent').innerText(),'100 %');assert.equal(await page.locator('#download').count(),1);
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.screenshot({path:'/tmp/determinantes-final-mobile.png',fullPage:true});
page.once('dialog',d=>d.dismiss());await page.locator('#reset').click();assert.equal(await page.locator('#percent').innerText(),'100 %');
page.once('dialog',d=>d.accept());await page.locator('#reset').click();assert.equal(await page.locator('#percent').innerText(),'0 %');assert.equal(await page.locator('#route button:disabled').count(),9);
await page.screenshot({path:'/tmp/determinantes-mobile.png',fullPage:true});
await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/tmp/determinantes-desktop.png',fullPage:true});
assert.equal(await page.locator('.math-error').count(),0);assert.deepEqual(errors,[]);
console.log('PASS: sequential route, all activities, thresholds, hints, Cramer construction, download, persistence, reset confirmation, mobile overflow, console.');console.log('Video embeds:',videoIds);
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
