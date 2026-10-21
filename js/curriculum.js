/* Banco parametrizado: una semilla nueva por recorrido, conservada al recargar. */
window.DeterminantesCourse = (() => {
  'use strict';
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const math=(strings,...values)=>`<span class="math inline" data-tex="${escape(String.raw(strings,...values))}"></span>`;
  const matrix=rows=>`\\begin{pmatrix}${rows.map(r=>r.join('&')).join('\\\\')}\\end{pmatrix}`;
  const determinant=rows=>`\\begin{vmatrix}${rows.map(r=>r.join('&')).join('\\\\')}\\end{vmatrix}`;
  const display=tex=>`<div class="math" data-tex="${escape(tex)}"></div>`;
  // Exact for the small integer matrices used by this course (orders at most four).
  function det(A) {if(A.length===1)return A[0][0];return A[0].reduce((sum,v,j)=>sum+(j%2?-1:1)*v*det(A.slice(1).map(row=>row.filter((_,k)=>k!==j))),0);}
  function randomSeed() {return Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16).padStart(8,'0')).join('');}
  function createCourse(seed) {
    let hash=2166136261;for(const c of seed)hash=Math.imul(hash^c.charCodeAt(0),16777619);
    const random=()=>{hash+=0x6D2B79F5;let t=hash;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
    const integer=(min,max)=>min+Math.floor(random()*(max-min+1));
    const pick=items=>items[integer(0,items.length-1)];
    const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=integer(0,i);[items[i],items[j]]=[items[j],items[i]];}return items;};
    const q=(id,prompt,options,answer,explanation,hints,tex='',extra={})=>({id,prompt,options,answer,explanation,hints,tex,...extra});
    function choice(id,prompt,options,explanation,hints,tex='',extra={}) {
      const shuffled=shuffle(options.map((text,i)=>({text,correct:i===0})));
      return q(id,prompt,shuffled.map(o=>o.text),shuffled.findIndex(o=>o.correct),explanation,hints,tex,extra);
    }
    const prod=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((s,v,k)=>s+v*B[k][j],0)));
    function triangularFamily(n) {
      const U=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>j<i?0:j===i?(i===0?1:pick([-2,-1,1,2,3])):pick([-2,-1,1,2,3])));
      const L=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>j>i?0:j===i?1:pick([-2,-1,1,2])));
      return {A:prod(L,U),U,L,D:U.reduce((d,r,i)=>d*r[i],1)};
    }
    const k=integer(2,4),original=pick([-6,-4,-2,2,4,6]),n=pick([3,4]),newDet=original*k**n;
    const rowK=pick([-3,-2,2,3]),rowD=pick([-6,-4,4,6]),delta=pick([-7,-5,5,7]);
    const family3=triangularFamily(3),family4=triangularFamily(4),other4=triangularFamily(4),other3=triangularFamily(3);
    let A;do {A=Array.from({length:3},()=>Array.from({length:3},()=>integer(-3,4)));}while(det(A)===0||A[0].some(v=>v===0)||(()=>{const L=A.map(r=>r.slice()),R=A.map(r=>r.slice());L[0][2]=0;R[0][0]=R[0][1]=0;return det(L)===0||det(R)===0||det(L)*det(R)===det(A);})());
    const left=A.map(r=>r.slice()),right=A.map(r=>r.slice());left[0][2]=0;right[0][0]=right[0][1]=0;
    const solution3=Array.from({length:3},()=>pick([-3,-2,-1,1,2,3]));
    const solution4=Array.from({length:4},()=>pick([-3,-2,-1,1,2,3]));
    const rhs=(M,x)=>M.map(r=>r.reduce((s,v,j)=>s+v*x[j],0));
    const system=(M,b)=>`\\begin{cases}${M.map((row,i)=>row.map((v,j)=>v===0?'':`${v>0&&j>0?'+':''}${v===1?'':v===-1?'-':v}${['x','y','z','w'][j]}`).join('').replace(/^\+/,'')+'='+b[i]).join('\\\\')}\\end{cases}`;
    const videos=[
      {id:'14DCgJjfCNkerH56JgdkdBQpZnKKtaTvO',title:'Repaso de las propiedades de los determinantes',preparation:'Repasa filas proporcionales, cambios de signo y factores escalares.'},
      {id:'1Eg1h-VmaM8QdprLMkUVFB7wVXCtPoKOy',title:'Demostraciones usando las propiedades',preparation:'Justifica igualdades de determinantes directamente con sus entradas y una propiedad cada vez, sin introducir vectores.'},
      {id:'1NT4MSBQH31zRYQIAB51HOzY6nXxmlzgb',title:'Un determinante por dos caminos',preparation:'Compara linealidad y operaciones. Muestra cada operación elemental por separado.'},
      {id:'1aLG4Bw7X_9_xvtZ_eqDrDvTEFQLQI6sw',title:'Operaciones entre filas y columnas',preparation:'Combina operaciones controlando sus factores y signos.'},
      {id:'1yKDycHv7-faiBqTNcs6UhuW0rL8onpGF',title:'Regla de Cramer',preparation:'Construye los determinantes auxiliares sustituyendo una sola columna cada vez.'}
    ];
    const rows=integer(3,5),cols=pick([3,4,5,6].filter(v=>v!==rows&&v!==rows+1)),diag=[integer(1,4),integer(2,5),integer(2,5)],a=integer(1,3),b=integer(1,3),c=integer(1,3),t=integer(2,4);
    const proportional=[[a,b,c],[t*a,t*b,t*c],[integer(1,4),-integer(1,3),integer(2,5)]];
    const hintsProp=['Distingue el determinante original del transformado.','Escribe primero la igualdad de la propiedad; después despeja la cantidad solicitada.','Si una fila se multiplica por un factor, el determinante nuevo lleva ese factor. Al despejar el original se usa el recíproco.'];
    const quizzes={
      1:[
        choice('p1',`Una matriz tiene ${rows} filas y ${cols} columnas. ¿Cuál es su orden?`,[math`${rows}\times${cols}`,math`${cols}\times${rows+1}`,math`${rows+1}\times${cols}`,math`${cols}\times${rows+1+cols}`],'Se escribe primero el número de filas y después el de columnas: '+math`${rows}\times${cols}`+'.',['Cuenta primero las filas.','El orden se escribe filas por columnas.','El orden es '+math`${rows}\times${cols}`+'.']),
        choice('p2','¿Cuál es triangular superior?',[
          math`${matrix([[diag[0],a,b],[0,diag[1],c],[0,0,diag[2]]])}`,
          math`${matrix([[diag[0],a,b],[c,diag[1],0],[0,0,diag[2]]])}`,
          math`${matrix([[diag[0],0,b],[0,diag[1],c],[a,0,diag[2]]])}`
        ],'Todas las entradas debajo de la diagonal principal deben ser cero.',['Observa solo las entradas debajo de la diagonal.','Las posiciones segunda fila/primera columna, tercera fila/primera columna y tercera fila/segunda columna deben ser cero.','La matriz triangular superior tiene las tres posiciones inferiores nulas.']),
        choice('p3',`Si ${math`\det A=${delta}`} y se intercambian dos filas, ¿cuál es el nuevo determinante?`,[math`${-delta}`,math`${delta}`,math`${2*delta}`,math`${-2*delta}`],'Un intercambio cambia el signo: '+math`\det B=-\det A=${-delta}`+'.',hintsProp),
        choice('p4',`Una fila es ${t} veces otra fila distinta. ¿Qué ocurre con el determinante?`,['Es cero.','Queda multiplicado por '+math`${t}`+'.','Queda dividido por '+math`${t}`+'.','Cambia de signo si '+math`${t}`+' es par.'],'Dos filas proporcionales implican determinante cero.',['Comprueba si las filas aportan información independiente.','Extraer el factor deja dos filas iguales.','Dos filas iguales tienen determinante cero.'])
      ],
      3:[
        choice('a11','Sin expandir, elige el valor del determinante y una justificación válida.',[
          math`0`+': se extrae el factor '+math`${t}`+' de la segunda fila y quedan dos filas iguales.',
          math`${t}`+': se extrae el factor de la segunda fila y las filas iguales aportan uno.',
          math`0`+': las filas proporcionales pueden intercambiarse sin cambiar el signo.',
          math`${-t}`+': las filas proporcionales se cancelan y aportan el factor con signo opuesto.'
        ],'La segunda fila es '+math`${t}`+' veces la primera. Al extraer ese factor quedan dos filas iguales; por tanto el determinante es cero.',[
          'Compara las entradas de las dos primeras filas.',
          'Extrae el factor común de la segunda fila y observa qué sucede.',
          math`\det A=${t}\cdot0=0`+'. El factor no se convierte en el determinante final.'
        ],'A='+matrix(proportional),{checkMatrix:proportional,checkDet:0}),
        q('a12',`Sea ${math`B=${k}A`}, donde ${math`A`} es de orden ${math`${n}\times${n}`} y ${math`\det B=${newDet}`}. Calcula el determinante ORIGINAL ${math`\det A`}.`,null,original,
          math`\det B=${k}^{${n}}\det A`+'. Por tanto, '+math`\det A=\frac{1}{${k}^{${n}}}\det B=${original}`+'. El recíproco aparece al despejar el original, no al calcular el nuevo.',[
            'Se multiplican todas las filas; primero relaciona los dos determinantes.',
            math`\det B=${k}^{${n}}\det A`+'. La pregunta pide despejar '+math`\det A`+'.',
            math`\det A=\frac{${newDet}}{${k**n}}=${original}`+'.'
          ],'',{scalarCheck:{order:n,k,original,newDet}}),
        q('a13',`Una sola fila de ${math`A`} se multiplica por ${math`${rowK}`} para obtener ${math`B`}. Si ${math`\det B=${rowK*rowD}`}, calcula ${math`\det A`}.`,null,rowD,
          math`\det B=${rowK}\det A`+', luego '+math`\det A=\frac{1}{${rowK}}\det B=${rowD}`+'. Solo se escala una fila; no se eleva el factor al orden.',[
            'Distingue una sola fila de toda la matriz.',
            'El determinante nuevo es el escalar por el original; ahora debes despejar el original.',
            math`\det A=\frac{${rowK*rowD}}{${rowK}}=${rowD}`+'.'
          ],'',{scalarCheck:{order:1,k:rowK,original:rowD,newDet:rowK*rowD}})
      ],
      5:[
        choice('b11',`Sabiendo que ${math`\begin{vmatrix}a&b&c\\d&e&f\\g&h&i\end{vmatrix}=${delta}`}, justifica el valor del siguiente determinante.`,[
          math`${-delta}`+': se intercambian dos filas una sola vez.',
          math`${delta}`+': todo cambio de posición de filas conserva el determinante.',
          math`${-delta}`+': transponer una matriz invierte el signo.',
          math`${delta}`+': un intercambio equivale a multiplicar dos filas por menos uno.'
        ],'Las dos primeras filas están intercambiadas: '+math`\det B=-\det A=${-delta}`+'. No se necesita introducir vectores ni desarrollar por cofactores.',[
          'Compara el orden de las filas de los dos determinantes.',
          'Solo se ha realizado un intercambio de dos filas.',
          'Un intercambio aporta el factor '+math`-1`+'.'
        ],determinant([['d','e','f'],['a','b','c'],['g','h','i']])),
        choice('b12','¿Qué única operación de fila deja dos filas proporcionales y demuestra que el determinante es cero?',[
          math`F_3\leftarrow F_3-F_1`,math`F_3\leftarrow F_3+F_1`,math`F_1\leftarrow F_1-F_2`,math`F_2\leftarrow F_2-F_3`
        ],'Se realiza una sola operación, que conserva el determinante:'+display(String.raw`\begin{vmatrix}a&b&c\\d&e&f\\a+${t}d&b+${t}e&c+${t}f\end{vmatrix}\xrightarrow{F_3\leftarrow F_3-F_1}\begin{vmatrix}a&b&c\\d&e&f\\${t}d&${t}e&${t}f\end{vmatrix}=0`)+ 'La tercera fila queda como '+math`${t}`+' veces la segunda. No se aplican tres operaciones simultáneas.',[
          'Compara la tercera fila con la primera y la segunda.',
          'Resta únicamente la primera fila a la tercera.',
          'La tercera fila queda como múltiplo de la segunda; el determinante es cero.'
        ],determinant([['a','b','c'],['d','e','f'],[`a+${t}d`,`b+${t}e`,`c+${t}f`]])),
        q('b13',`Al multiplicar una sola columna de ${math`A`} por ${math`${k}`} se obtiene ${math`B`}, con ${math`\det B=${k*delta}`}. Determina el original ${math`\det A`} y justifica la relación en tu cuaderno.`,null,delta,
          math`\det B=${k}\det A`+'. Al recuperar el original se usa el recíproco: '+math`\det A=\frac{1}{${k}}\det B=${delta}`+'.',[
            'Se transforma una sola columna; el factor aparece una sola vez.',
            'Despeja el determinante original en la igualdad de la propiedad.',
            math`\det A=\frac{${k*delta}}{${k}}=${delta}`+'.'
          ],'',{scalarCheck:{order:1,k,original:delta,newDet:k*delta}})
      ],
      7:[
        choice('d31','Para calcular por linealidad, ¿qué descomposición de una sola fila es válida?',[
          math`\det A=${determinant(left)}+${determinant(right)}`,
          math`\det A=${determinant(left)}-${determinant(right)}`,
          math`\det A=${determinant(left)}\cdot${determinant(right)}`
        ],'Se separa únicamente la primera fila como suma; las otras dos filas se mantienen idénticas en los dos términos.',['La linealidad en una fila produce una suma de determinantes.','No alteres las demás filas al separar la primera.','Se suman los determinantes, no se multiplican ni se restan.'],'A='+matrix(A)),
        q('d32','Calcula el determinante anterior mediante esa descomposición por linealidad. Escribe ambos cálculos en tu cuaderno.',null,det(A),
          math`\det A=${det(left)}+(${det(right)})=${det(A)}`+'.',['Calcula ambos términos de la descomposición.','El segundo término se simplifica por los ceros de su primera fila.','Los términos valen '+math`${det(left)}`+' y '+math`${det(right)}`+'.'],determinant(A),{checkMatrix:A,checkDet:det(A)}),
        q('d33','Nuevo ejercicio: calcula este determinante por operaciones entre filas. Muestra cada transformación por separado.',null,other3.D,
          'Anula las entradas bajo el primer pivote y después la entrada bajo el segundo pivote. Las sumas de múltiplos de otra fila conservan el determinante. La matriz triangular final es '+display(matrix(other3.U))+'Su determinante es el producto de la diagonal: '+math`${other3.D}`+'.',[
            'El primer pivote es uno: crea ceros sin escalar filas.',
            'Primero aplica '+math`F_2\leftarrow F_2-(${other3.L[1][0]})F_1`+'. Después, en un paso distinto, '+math`F_3\leftarrow F_3-(${other3.L[2][0]})F_1`+'.',
            'Finalmente aplica '+math`F_3\leftarrow F_3-(${other3.L[2][1]})F_2`+'. El producto de los pivotes es '+math`${other3.D}`+'.'
          ],determinant(other3.A),{checkMatrix:other3.A,checkDet:other3.D})
      ],
      9:[
        choice('d41','¿Qué operación crea un cero en la segunda posición de la primera fila y conserva el determinante?',[
          math`C_2\leftarrow C_2-(${family4.A[0][1]})C_1`,math`C_2\leftarrow C_2+(${family4.A[0][1]})C_1`,math`C_1\leftarrow C_1-(${family4.A[0][1]})C_2`,math`C_2\leftarrow(${family4.A[0][1]})C_1`
        ],'Se resta el múltiplo indicado de una columna distinta; no se reemplaza la columna por un múltiplo de otra. La entrada superior queda en cero.',['La primera entrada de la primera columna es uno.','Conserva la columna de destino al restar el múltiplo.','La suma de un múltiplo de otra columna no cambia el determinante.'],'A='+matrix(family4.A)),
        q('d42','Calcula el determinante combinando operaciones de columnas y de filas. Explica cada paso.',null,family4.D,
          'Crea ceros en la primera fila mediante sumas de columnas. En el menor restante, aplica sumas de filas hasta triangularizar. El valor es '+math`${family4.D}`+'.',['Usa la primera columna para anular las otras entradas de la primera fila.','Todas esas sumas de columnas conservan el determinante.','La diagonal de una triangular equivalente es '+math`${family4.U.map((r,i)=>r[i]).join(',')}`+'.'],determinant(family4.A),{checkMatrix:family4.A,checkDet:family4.D}),
        q('d43','Calcula este otro determinante de orden cuatro mediante operaciones elementales.',null,other4.D,
          'Una triangular equivalente, obtenida solo con sumas de filas, es '+display(matrix(other4.U))+ 'El producto de la diagonal es '+math`${other4.D}`+'.',['Usa el pivote uno de la primera fila.','Elimina por columnas, mostrando una operación de fila cada vez.','El producto final de los pivotes es '+math`${other4.D}`+'.'],determinant(other4.A),{checkMatrix:other4.A,checkDet:other4.D})
      ],
      11:[],12:[]
    };
    function cramerQuestions(M,solution,prefix) {
      const b=rhs(M,solution),variables=['x','y','z','w'].slice(0,M.length),D=det(M),context=system(M,b);
      const matrices=[M,...variables.map((_,k)=>M.map((row,i)=>row.map((v,j)=>j===k?b[i]:v)))];
      const items=matrices.map((entries,k)=>{
        const symbol=k===0?'D':`D_${variables[k-1]}`,answer=det(entries);
        return q(`${prefix}d${k}`,k===0?`Sistema de ${M.length} incógnitas: construye ${math`D`} y calcula su valor.`:`Construye ${math`${symbol}`} sustituyendo únicamente la columna de ${math`${variables[k-1]}`} y calcula su valor.`,null,answer,
          math`${symbol}=${answer}`+'. '+(k===0?'Es distinto de cero: existe una única solución.':'Las otras columnas deben conservarse.'),[
            k===0?'Respeta el orden de ecuaciones y variables.':'La columna sustituida debe coincidir con los términos independientes.',
            'Calcula el determinante sin perder factores o cambios de signo.',
            math`${symbol}=${answer}`+'. Revisa tanto las entradas como el cálculo.'
          ],'',{matrix:entries,context,group:`Sistema de ${M.length} incógnitas`});
      });
      items.push(q(`${prefix}sol`,'Determina las incógnitas mediante los cocientes de Cramer.',null,solution,
        variables.map((v,i)=>math`${v}=\frac{${det(matrices[i+1])}}{${D}}=${solution[i]}`).join('; ')+'. Comprueba la solución en las ecuaciones.',[
          'Divide cada determinante auxiliar por el principal.',math`D=${D}`+'.',math`${matrix(solution.map(v=>[v]))}`+' es la solución.'
        ],'',{variables,context,group:`Sistema de ${M.length} incógnitas`,systemMatrix:M,rhs:b}));
      return items;
    }
    quizzes[11]=[...cramerQuestions(family3.A,solution3,'c3'),...cramerQuestions(family4.A,solution4,'c4'),choice('concept','¿Qué condición permite aplicar directamente Cramer?',[
      math`\det A\ne0`,math`\det A=0`,'Que todos los determinantes auxiliares sean distintos de cero.','Que los coeficientes y los términos independientes sean enteros.'
    ],'El denominador común debe ser distinto de cero.',['Observa el denominador de los cocientes.','No basta con que los determinantes auxiliares no sean cero.',math`\det A\ne0`+'.'])];
    const retoK=integer(2,4),retoD=pick([-3,-2,2,3]);
    quizzes[12]=[
      q('r1',`Sea ${math`B=${retoK}A`} con matrices de orden cuatro. Si ${math`\det B=${retoD*retoK**4}`}, recupera ${math`\det A`}.`,null,retoD,
        math`\det A=\frac{1}{${retoK}^4}\det B=${retoD}`+'.',hintsProp,'',{scalarCheck:{order:4,k:retoK,original:retoD,newDet:retoD*retoK**4}}),
      q('r2','Calcula este determinante de orden cuatro y justifica las operaciones.',null,other4.D,'Las sumas de filas lo reducen a una triangular cuyo producto diagonal es '+math`${other4.D}`+'.',['Crea ceros con el primer pivote uno.','No escales filas si no es necesario.','El producto de la diagonal es '+math`${other4.D}`+'.'],determinant(other4.A),{checkMatrix:other4.A,checkDet:other4.D}),
      q('r3','Resuelve directamente por Cramer este sistema de tres incógnitas.',null,solution3,
        'El determinante principal es '+math`${family3.D}`+' y los cocientes dan '+math`${matrix(solution3.map(v=>[v]))}`+'.',['Sustituye una columna por vez.','Calcula los tres determinantes auxiliares antes de dividir.','Divide cada auxiliar por '+math`${family3.D}`+'.'],system(family3.A,rhs(family3.A,solution3)),{variables:['x','y','z'],systemMatrix:family3.A,rhs:rhs(family3.A,solution3)})
    ];
    const activities=['Repaso de propiedades','Demostraciones con determinantes','Linealidad y operaciones','Filas y columnas combinadas','Cramer en tres y cuatro incógnitas'];
    const stages=[{title:'Bienvenida',type:'welcome'},{title:'Conocimientos previos',type:'quiz',minimum:4}];
    videos.forEach((video,i)=>{stages.push({title:`Video ${i+1}`,type:'video',video,number:i+1});stages.push({title:`Actividad ${i+1} · ${activities[i]}`,heading:activities[i],type:'quiz',minimum:quizzes[3+2*i].length,number:i+1});});
    stages.push({title:'Reto integrador',type:'quiz',minimum:3},{title:'Práctica final · PDF',type:'pdf'});
    return {seed,quizzes,stages,escape,math,matrix,determinant};
  }
  return {createCourse,randomSeed,escape,math,matrix,determinant,det};
})();
