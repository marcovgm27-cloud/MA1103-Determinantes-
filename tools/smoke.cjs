const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.SITE_URL || 'http://127.0.0.1:8000';
const driveIds=['14DCgJjfCNkerH56JgdkdBQpZnKKtaTvO','1Eg1h-VmaM8QdprLMkUVFB7wVXCtPoKOy','1NT4MSBQH31zRYQIAB51HOzY6nXxmlzgb','1aLG4Bw7X_9_xvtZ_eqDrDvTEFQLQI6sw','1yKDycHv7-faiBqTNcs6UhuW0rL8onpGF'];
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  try {
    for(const width of [1440,390]) {
      const context=await browser.newContext({viewport:{width,height:1000},colorScheme:'light'});
      const page=await context.newPage(), errors=[], failedLocal=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failedLocal.push(r.url());});
      // External playback is tested separately; keep the local functional run deterministic.
      await page.route('https://drive.google.com/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<p>Video externo: marcador de la prueba local.</p>'}));
      await page.goto(base);
      async function check() {
        assert.equal(await page.locator('.math-error,.katex-error').count(),0,'TeX must render');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
        assert(await page.evaluate(()=>parseFloat(getComputedStyle(document.body).fontSize)>=20),'Larger body font');
      }
      await check();
      assert.equal(await page.locator('#route button:disabled').count(),13);
      assert.equal(await page.locator('#download').count(),0);
      await page.getByRole('button',{name:'Activar modo oscuro'}).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      await page.screenshot({path:`/tmp/determinantes-${width}-dark.png`,fullPage:true});
      await page.getByRole('button',{name:'Activar modo claro'}).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      await page.screenshot({path:`/tmp/determinantes-${width}-light.png`,fullPage:true});
      await page.getByRole('button',{name:'Comenzar',exact:true}).click();
      async function submit(id,answer,entries) {
        const form=page.locator(`[data-question="${id}"]`);
        if(entries)for(let i=0;i<entries.length;i++)await form.locator(`[name=m${i}]`).fill(String(entries[i]));
        if(Array.isArray(answer)) {
          for(let i=0;i<answer.length;i++)await form.locator(`[name=${['x','y','z','w'][i]}]`).fill(String(answer[i]));
        } else if(await form.locator('input[type=radio]').count()) await form.locator('input[type=radio]').nth(answer).check();
        else await form.locator('[name=answer]').fill(String(answer));
        await form.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await check();
      }
      async function next(stage) {await page.locator(`[data-next="${stage}"]`).click();await check();}
      const videos=[];
      async function video() {
        videos.push(await page.locator('iframe').getAttribute('src'));
        assert.equal(await page.locator('iframe').count(),1,'One video before each activity');
        assert.equal(await page.locator('.video-link').getAttribute('href'),videos.at(-1).replace('/preview','/view'));
        await check();await page.locator('#video-next').click();
      }
      await submit('p1',1);assert.match(await page.locator('[data-question=p1] .feedback').innerText(),/filas/);
      await submit('p1',0);await submit('p2',0);assert(await page.locator('[data-next="1"]').isDisabled());
      await submit('p3',1);await next(1);await video();
      await submit('a12',0);assert.match(await page.locator('[data-question=a12] .feedback').innerText(),/cada fila/);
      await submit('a12',0);assert.match(await page.locator('[data-question=a12] .feedback').innerText(),/exponente/);
      await submit('a12',0);assert.match(await page.locator('[data-question=a12] .feedback [data-tex]').last().getAttribute('data-tex'),/-16/);
      await submit('a12',-16);await submit('a11',0);await submit('a13',15);await next(3);await video();
      await submit('b11',0);await submit('b12',0);await submit('b13',6);await next(5);await video();
      await submit('d31',0);await submit('d32',-7);assert(await page.locator('[data-next="7"]').isDisabled());
      await submit('d33',-7);await next(7);await video();
      await submit('d41',0);await submit('d42',2);await submit('d43',4);await next(9);await video();
      assert.equal(await page.locator('[data-question=c3d1]').count(),0,'Cannot skip determinants');
      assert.equal(await page.locator('[name=x]').count(),0,'Cannot skip to solution');
      const A3=[[2,-1,1],[1,3,-2],[3,1,2]],b3=[8,-7,11];
      const A4=[[1,2,-1,1],[2,5,0,1],[-1,0,6,-2],[3,7,1,6]],b4=[9,15,-13,34];
      // Correct determinant with an incorrect matrix must not unlock the next step.
      await submit('c3d0',16,[0,-1,1,1,3,-2,3,1,2]);
      assert.equal(await page.locator('[data-question=c3d1]').count(),0);
      for(const [prefix,A,b,ds,solution] of [['c3',A3,b3,[16,32,-16,48],[2,-1,3]],['c4',A4,b4,[2,2,4,-2,6],[1,2,-1,3]]]) {
        for(let k=0;k<ds.length;k++) {
          const matrix=k===0?A:A.map((row,i)=>row.map((v,j)=>j===k-1?b[i]:v));
          await submit(`${prefix}d${k}`,ds[k],matrix.flat());
        }
        await submit(`${prefix}sol`,solution);
      }
      await submit('concept',1);await next(11);
      await submit('r1',162);await submit('r2',-4);assert(await page.locator('[data-next="12"]').isDisabled());
      await submit('r3',[2,-1,1,3]);await next(12);
      assert.match(await page.locator('#content').innerText(),/jueves 22 de octubre de 2026/);
      const response=await page.request.get(`${base}/pdf/actividad-final-determinantes.pdf`);
      assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,5).toString(),'%PDF-');
      const download=page.waitForEvent('download');await page.locator('#download').click();assert.equal((await download).suggestedFilename(),'actividad-final-determinantes.pdf');
      assert.equal(await page.locator('#percent').innerText(),'100 %');
      await page.reload();assert.equal(await page.locator('#percent').innerText(),'100 %');
      assert.equal(await page.locator('#download').count(),1);
      // Repetition preserves earned access after reload.
      await page.locator('#topnav [data-go="10"]').click();await page.locator('#video-next').click();await page.locator('#retry').click();
      await page.reload();assert.equal(await page.locator('#percent').innerText(),'100 %');
      assert.equal(await page.locator('#topnav [data-go="13"]').isEnabled(),true);
      page.once('dialog',d=>d.dismiss());await page.locator('#reset').click();assert.equal(await page.locator('#percent').innerText(),'100 %');
      page.once('dialog',d=>d.accept());await page.locator('#reset').click();assert.equal(await page.locator('#percent').innerText(),'0 %');
      assert.equal(await page.locator('#route button:disabled').count(),13);
      assert.deepEqual(videos,driveIds.map(id=>`https://drive.google.com/file/d/${id}/preview`));
      assert.deepEqual(errors,[]);assert.deepEqual(failedLocal,[]);
      console.log(`PASS ${width}px: five videos and activities, TeX, thresholds, hints, 3×3/4×4 Cramer, gated construction, PDF, theme persistence, progress, repeat, reset and layout.`);
      await context.close();
    }
    const context=await browser.newContext({colorScheme:'dark'}), page=await context.newPage();
    await page.goto(base);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    await page.evaluate(()=>localStorage.setItem('ma1103-determinantes-v2','broken-json'));
    await page.reload();assert.equal(await page.locator('#percent').innerText(),'0 %');
    await context.close();
    const noStorage=await browser.newContext();await noStorage.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});
    const fallback=await noStorage.newPage();await fallback.goto(base);await fallback.getByRole('button',{name:'Comenzar',exact:true}).click();
    assert.match(await fallback.locator('#storage-notice').innerText(),/No se puede guardar/);
    await fallback.getByRole('button',{name:'Activar modo oscuro'}).click();assert.equal(await fallback.locator('html').getAttribute('data-theme'),'dark');
    await noStorage.close();console.log('PASS: system dark mode, corrupt storage recovery and storage-disabled fallback.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
