/* Contenido docente. Fórmulas en TeX; textos en Latin Modern en la interfaz. */
window.DeterminantesCourse = (() => {
  'use strict';
  const escape = (value) => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const math = (strings, ...values) => `<span class="math inline" data-tex="${escape(String.raw(strings,...values))}"></span>`;
  const matrix = rows => `\\begin{pmatrix}${rows.map(row=>row.join('&')).join('\\\\')}\\end{pmatrix}`;
  const determinant = rows => `\\begin{vmatrix}${rows.map(row=>row.join('&')).join('\\\\')}\\end{vmatrix}`;
  const A3 = [[2,-1,1],[1,3,-2],[3,1,2]], b3 = [8,-7,11];
  const A4 = [[1,2,-1,1],[2,5,0,1],[-1,0,6,-2],[3,7,1,6]], b4 = [9,15,-13,34];
  const B4 = [[2,1,0,-1],[4,3,1,0],[-2,0,2,3],[6,4,2,1]];
  const system3 = String.raw`\begin{cases}2x-y+z=8\\x+3y-2z=-7\\3x+y+2z=11\end{cases}`;
  const system4 = String.raw`\begin{cases}x+2y-z+w=9\\2x+5y+w=15\\-x+6z-2w=-13\\3x+7y+z+6w=34\end{cases}`;
  const q = (id,prompt,options,answer,explanation,hints=[],tex='') => ({id,prompt,options,answer,explanation,hints,tex});
  const videos = [
    {id:'14DCgJjfCNkerH56JgdkdBQpZnKKtaTvO', title:'Repaso de las propiedades de los determinantes', preparation:'Identifica qué propiedades conservan el determinante y cuáles modifican su signo o introducen un factor.'},
    {id:'1Eg1h-VmaM8QdprLMkUVFB7wVXCtPoKOy', title:'Demostraciones usando las propiedades', preparation:'Construye argumentos a partir de la linealidad, la alternancia y la dependencia entre filas. Evita desarrollar por cofactores cuando una propiedad resuelve el problema.'},
    {id:'1NT4MSBQH31zRYQIAB51HOzY6nXxmlzgb', title:'Un determinante por dos caminos', preparation:'Compara el cálculo mediante linealidad con el cálculo mediante operaciones elementales. Los dos procedimientos deben producir el mismo valor.'},
    {id:'1aLG4Bw7X_9_xvtZ_eqDrDvTEFQLQI6sw', title:'Operaciones entre filas y columnas', preparation:'Combina operaciones entre filas y columnas para crear ceros. Lleva un registro del efecto de cada transformación sobre el determinante.'},
    {id:'1yKDycHv7-faiBqTNcs6UhuW0rL8onpGF', title:'Regla de Cramer', preparation:'Construye los determinantes de los sistemas de tres y cuatro incógnitas. Sustituye una sola columna cada vez y comprueba que el determinante principal no sea cero.'}
  ];
  const quizzes = {
    1:[
      q('p1',`Una matriz tiene tres filas y cuatro columnas. ¿Cuál es su orden?`,[math`3\times4`,math`4\times3`,math`3\times3`],0,'El orden se escribe filas por columnas: '+math`3\times4`+'.'),
      q('p2','¿Cuál de estas matrices es triangular superior?', [math`${matrix([[1,2,3],[0,4,5],[0,0,6]])}`,math`${matrix([[1,0,0],[2,4,0],[3,5,6]])}`,math`${matrix([[1,2,0],[3,4,5],[0,1,6]])}`],0,'Todas las entradas debajo de la diagonal principal deben ser cero.'),
      q('p3','¿Qué efecto tiene intercambiar dos filas sobre el determinante?',['No cambia','Cambia de signo','Siempre se hace cero'],1,'Un intercambio multiplica el determinante por '+math`-1`+'.'),
      q('p4','Una matriz cuadrada tiene dos filas iguales. ¿Cuánto vale su determinante?',[math`1`,math`0`,'Depende del orden'],1,'Las filas son linealmente dependientes; por tanto, el determinante es cero.')
    ],
    3:[
      q('a11','Determina el valor y selecciona una justificación que use propiedades.',[
        math`\det A=0`+': la cuarta fila es la suma de la primera y la tercera.',
        math`\det A=0`+': contiene entradas nulas.',
        math`\det A=1`+': la primera entrada es uno.'
      ],0,'La relación '+math`F_4=F_1+F_3`+' implica dependencia lineal; por eso '+math`\det A=0`+'.',[
        'Compara la cuarta fila con las otras filas.',
        'Suma la primera y la tercera fila, entrada por entrada.',
        math`F_4=F_1+F_3`+'. Al aplicar '+math`F_4\leftarrow F_4-F_1-F_3`+' aparece una fila nula; el determinante es cero.'
      ],'A='+matrix([[1,2,0,-1],[2,1,3,0],[0,-1,2,4],[1,1,2,3]])),
      q('a12',`Si ${math`A\in\mathbb R^{3\times3}`} y ${math`\det A=-2`}, calcula ${math`\det(2A)`}.`,null,-16,'Se multiplica cada fila por dos: '+math`\det(2A)=2^3\det A=8(-2)=-16`+'.',[
        'Multiplicar toda la matriz afecta a cada fila.',
        'El exponente del escalar coincide con el orden de la matriz.',
        math`\det(kA)=k^n\det A`+'. Aquí '+math`2^3(-2)=-16`+'.'
      ]),
      q('a13',`Una matriz ${math`4\times4`} tiene determinante ${math`5`}. Se intercambian dos filas y se multiplica una sola columna por ${math`-3`}. ¿Cuál es el nuevo determinante?`,null,15,
        'El intercambio aporta '+math`-1`+' y el escalamiento de una columna aporta '+math`-3`+': '+math`(-1)(-3)5=15`+'.',[
          'Controla por separado el efecto de las dos operaciones.',
          'Solo se escala una columna; no eleves el factor al orden de la matriz.',
          math`\det B=(-1)(-3)\det A=15`+'.'
        ])
    ],
    5:[
      q('b11',`Sean ${math`u,v,w\in\mathbb R^3`} filas de una matriz con determinante ${math`\delta`}. Al sustituirlas por ${math`u+v,\ v+w,\ w+u`}, el nuevo determinante es ${math`2\delta`}. ¿Qué argumento lo demuestra?`,[
        'La linealidad produce ocho términos: seis tienen filas repetidas y los otros dos son permutaciones cíclicas de signo positivo.',
        'Cada fila tiene dos sumandos; por ello se multiplica automáticamente el determinante por ocho.',
        'Sumar vectores a todas las filas conserva siempre el determinante.'
      ],0,'Solo sobreviven '+math`\det(u,v,w)`+' y '+math`\det(v,w,u)`+'. La permutación cíclica usa dos intercambios; ambos términos valen '+math`\delta`+'.',[
        'Expande por linealidad en cada fila, sin usar cofactores.',
        'Descarta todos los términos que contienen dos filas iguales.',
        'Sobreviven exactamente dos términos de signo positivo: su suma es '+math`2\delta`+'.'
      ]),
      q('b12','Elige la demostración por propiedades de que este determinante es cero.',[
        math`F_4\leftarrow F_4-F_1-F_2`+' conserva el determinante y produce una fila nula.',
        'La presencia de letras obliga a que el determinante sea cero.',
        'Todas las matrices de orden cuatro tienen filas dependientes.'
      ],0,'La operación propuesta produce una fila nula, pues '+math`F_4=F_1+F_2`+'. Esta justificación funciona para cualquier valor de los parámetros.',[
        'Busca una relación lineal que no dependa de valores particulares.',
        'Compara la cuarta fila con la suma de las dos primeras.',
        math`F_4-F_1-F_2=0`+'. La suma de múltiplos de otras filas conserva el determinante.'
      ],determinant([['a','b','c','d'],['e','f','g','h'],['p','q','r','s'],['a+e','b+f','c+g','d+h']])),
      q('b13',`Sea ${math`A\in\mathbb R^{4\times4}`} con ${math`\det A=3`}. Se aplica ${math`C_1\leftarrow C_1+2C_3`}, luego un intercambio de filas y después ${math`F_2\leftarrow-2F_2`}. Determina ${math`\det B`}.`,null,6,
        'La suma de columnas conserva el valor; el intercambio y el escalamiento aportan '+math`(-1)(-2)`+'. Por tanto, '+math`\det B=6`+'.',[
          'Escribe un factor por cada operación y justifica cuándo vale uno.',
          'Sumar un múltiplo de una columna distinta conserva el determinante.',
          math`\det B=1\cdot(-1)\cdot(-2)\cdot3=6`+'.'
        ])
    ],
    7:[
      q('d31','Para calcular por linealidad, se descompone la primera fila en dos sumandos. ¿Qué igualdad es válida?',[
        math`\det A=\begin{vmatrix}2&-1&0\\1&4&-2\\3&2&1\end{vmatrix}+\begin{vmatrix}0&0&3\\1&4&-2\\3&2&1\end{vmatrix}`,
        math`\det A=\det\begin{pmatrix}2&0&0\\0&4&0\\0&0&1\end{pmatrix}`,
        'La linealidad permite separar todas las filas sumando solo dos determinantes.'
      ],0,'Se separa una sola fila y se mantienen idénticas las demás. Los dos determinantes valen '+math`23`+' y '+math`-30`+'.',[
        'La linealidad se aplica a una fila o columna cada vez.',
        math`(2,-1,3)=(2,-1,0)+(0,0,3)`+'.',
        'Al expandir en esa fila, las otras dos filas deben conservarse en ambos términos.'
      ],'A='+matrix([[2,-1,3],[1,4,-2],[3,2,1]])),
      q('d32','Calcula el determinante anterior usando la descomposición por linealidad. Desarrolla el procedimiento en tu cuaderno.',null,-7,
        math`\det A=23+(-30)=-7`+'. La suma proviene de separar únicamente la primera fila.',[
          'Calcula ambos determinantes de la descomposición.',
          'El segundo determinante se simplifica expandiendo por su primera fila.',
          math`\det A=23-30=-7`+'.'
        ],determinant([[2,-1,3],[1,4,-2],[3,2,1]])),
      q('d33','Vuelve a calcular el mismo determinante mediante operaciones. Intercambia primero las dos primeras filas, crea ceros y controla el cambio de signo.',null,-7,
        'Tras el intercambio, aplica '+math`F_2\leftarrow F_2-2F_1`+' y '+math`F_3\leftarrow F_3-3F_1`+'. Queda un bloque '+math`\begin{pmatrix}-9&7\\-10&7\end{pmatrix}`+' de determinante '+math`7`+'. El intercambio inicial da '+math`\det A=-7`+'.',[
          'El pivote uno permite evitar fracciones al crear los primeros ceros.',
          'Después del intercambio y las dos sumas de filas, el bloque inferior tiene determinante siete.',
          'El determinante transformado es siete; deshaz el cambio de signo del intercambio para obtener '+math`-7`+'.'
        ],determinant([[2,-1,3],[1,4,-2],[3,2,1]]))
    ],
    9:[
      q('d41','Selecciona una primera operación de columna que cree un cero en la primera fila sin cambiar el determinante.',[
        math`C_2\leftarrow C_2-2C_1`,math`C_1\leftarrow2C_1`,math`C_2\leftrightarrow C_4`
      ],0,'La segunda columna pasa a ser '+math`(0,1,2,1)^T`+'. Esta operación crea un cero en la primera fila y conserva el determinante. Después puedes combinar otras columnas para anular las entradas restantes de esa fila.',[
        'Resta a la segunda columna un múltiplo de la primera.',
        'La entrada superior de la segunda columna es el doble de la primera.',
        math`C_2\leftarrow C_2-2C_1`+' conserva el determinante. La nueva columna es '+math`(0,1,2,1)^T`+'.'
      ],'A='+matrix(A4)),
      q('d42','Calcula este determinante combinando filas y columnas. Empieza por las columnas para convertir la primera fila en una fila con un único elemento no nulo.',null,2,
        'Aplica '+math`C_2\leftarrow C_2-2C_1`+', '+math`C_3\leftarrow C_3+C_1`+' y '+math`C_4\leftarrow C_4-C_1`+'. El menor restante es '+math`\begin{vmatrix}1&2&-1\\2&5&-1\\1&4&3\end{vmatrix}=2`+'. Todas las sumas de columnas conservan el determinante.',[
          'Crea ceros en las posiciones segunda, tercera y cuarta de la primera fila.',
          'Después, en el menor de orden tres, resta dos veces su primera fila a la segunda y una vez a la tercera.',
          'El bloque final es '+math`\begin{vmatrix}1&1\\2&4\end{vmatrix}=2`+'.'
        ],determinant(A4)),
      q('d43','Calcula el siguiente determinante de orden cuatro. Utiliza sumas de filas para triangularizar y registra los pivotes.',null,4,
        'Aplica '+math`F_2\leftarrow F_2-2F_1`+', '+math`F_3\leftarrow F_3+F_1`+' y '+math`F_4\leftarrow F_4-3F_1`+'. Luego resta la nueva segunda fila a la tercera y a la cuarta, y la tercera a la cuarta. La diagonal es '+math`2,1,1,2`+'; su producto es '+math`4`+'.',[
          'La primera columna se reduce con múltiplos enteros de la primera fila.',
          'Los tres pivotes iniciales pueden elegirse como '+math`2,1,1`+'.',
          'Sin escalamientos ni intercambios, la diagonal triangular final es '+math`2,1,1,2`+' y el determinante es '+math`4`+'.'
        ],determinant(B4))
    ],
    11: [],
    12:[
      q('r1',`Propiedades. Una matriz ${math`4\times4`} tiene determinante ${math`-2`}. Calcula ${math`\det B`} si ${math`B`} se obtiene intercambiando dos columnas de ${math`3A`}.`,null,162,
        math`\det B=-3^4\det A=-81(-2)=162`+'.',[
          'Multiplicar toda la matriz no equivale a multiplicar una sola columna.',
          'El orden es cuatro; el factor del escalamiento es '+math`3^4`+'.',
          'El intercambio cambia el signo: '+math`-81(-2)=162`+'.'
        ]),
      q('r2','Operaciones combinadas. Calcula eficientemente el siguiente determinante.',null,-4,
        'Intercambia las dos primeras filas para recuperar la matriz trabajada en la actividad de operaciones. Su determinante es cuatro; el intercambio invierte su signo.',[
          'Compara las dos primeras filas con la matriz de la actividad anterior.',
          'Un único intercambio recupera una matriz de determinante cuatro.',
          'Al deshacer ese intercambio se obtiene '+math`-4`+'.'
        ],determinant([B4[1],B4[0],B4[2],B4[3]])),
      {...q('r3','Cramer. Resuelve el sistema de cuatro incógnitas. Calcula los cinco determinantes en tu cuaderno antes de introducir la solución.',null,[2,-1,1,3],
        math`D=4,\quad D_x=8,\quad D_y=-4,\quad D_z=4,\quad D_w=12`+'. Los cocientes de Cramer dan '+math`(x,y,z,w)=(2,-1,1,3)`+'.',[
          'Construye la matriz de coeficientes en el orden de variables indicado.',
          'El determinante principal es '+math`4`+'. Sustituye una sola columna en cada determinante auxiliar.',
          math`(D_x,D_y,D_z,D_w)=(8,-4,4,12)`+'. Divide cada valor por '+math`D=4`+'.'
        ],String.raw`\begin{cases}2x+y-w=0\\4x+3y+z=6\\-2x+2z+3w=7\\6x+4y+2z+w=13\end{cases}`), variables:['x','y','z','w']}
    ]
  };
  function cramerQuestions(A,b,values,solution,prefix,system) {
    const variables=['x','y','z','w'].slice(0,A.length), order=A.length;
    const determinantQuestions=[{matrix:A,symbol:'D',answer:values[0]},...variables.map((v,k)=>({matrix:A.map((r,i)=>r.map((x,j)=>j===k?b[i]:x)),symbol:`D_${v}`,answer:values[k+1]}))];
    const items=determinantQuestions.map((item,k)=>({
      ...q(`${prefix}d${k}`,k===0?`Sistema ${math`${order}\times${order}`}: construye el determinante principal ${math`D`} y calcula su valor.`:`Sistema ${math`${order}\times${order}`}: construye ${math`${item.symbol}`} sustituyendo solo la columna de ${math`${variables[k-1]}`} y calcula su valor.`,null,item.answer,
        k===0?`${math`D=${item.answer}\ne0`}. El sistema tiene solución única.`:`${math`${item.symbol}=${item.answer}`}. Las demás columnas permanecen iguales a las de la matriz de coeficientes.`,[
          k===0?'Copia los coeficientes respetando el orden de las variables.':'La columna sustituida debe ser exactamente el vector de términos independientes.',
          k===0?'Triangulariza sin perder los factores de cada operación.':`Conserva las demás columnas y usa el orden de ecuaciones del sistema.`,
          math`${item.symbol}=${item.answer}`+'. Revisa la construcción y las operaciones antes de volver a introducir los datos.'
        ]), matrix:item.matrix, context:system, group:`Sistema de ${order} incógnitas`
    }));
    items.push({...q(`${prefix}sol`,'Calcula las incógnitas mediante los cocientes de Cramer.',null,solution,
      variables.map((v,k)=>math`${v}=\frac{D_${v}}{D}=\frac{${values[k+1]}}{${values[0]}}=${solution[k]}`).join('; ')+'. Comprueba la solución sustituyendo en todas las ecuaciones.',[
        'Divide cada determinante auxiliar por el determinante principal.',
        math`D=${values[0]}`+'. Usa los determinantes que ya verificaste.',
        math`${matrix(solution.map(v=>[v]))}`+' es el vector solución.'
      ]),variables,context:system,group:`Sistema de ${order} incógnitas`});
    return items;
  }
  quizzes[11]=[
    ...cramerQuestions(A3,b3,[16,32,-16,48],[2,-1,3],'c3',system3),
    ...cramerQuestions(A4,b4,[2,2,4,-2,6],[1,2,-1,3],'c4',system4),
    q('concept','¿Cuándo puede aplicarse directamente la regla de Cramer a un sistema cuadrado?',[
      math`D=0`,math`D\ne0`,'Siempre que los coeficientes sean enteros'
    ],1,'Si '+math`D\ne0`+', la matriz de coeficientes es invertible y existe una única solución.',[
      'Observa el denominador de cada cociente.',
      'No se puede dividir por cero.',
      'Se requiere '+math`D\ne0`+'.'
    ])
  ];
  const activities = [
    {title:'Repaso de propiedades',minimum:2},
    {title:'Demostrar con propiedades',minimum:2},
    {title:'Un cálculo, dos caminos',minimum:3},
    {title:'Combinar filas y columnas',minimum:2},
    {title:'Cramer en tres y cuatro incógnitas',minimum:quizzes[11].length}
  ];
  const stages=[{title:'Bienvenida',type:'welcome'},{title:'Conocimientos previos',type:'quiz',minimum:3}];
  videos.forEach((video,i)=>{stages.push({title:`Video ${i+1}`,type:'video',video,number:i+1});stages.push({...activities[i],title:`Actividad ${i+1} · ${activities[i].title}`,heading:activities[i].title,type:'quiz',number:i+1});});
  stages.push({title:'Reto integrador',type:'quiz',minimum:3},{title:'Actividad final · PDF',type:'pdf'});
  return {quizzes,stages,escape,math,matrix,determinant};
})();
