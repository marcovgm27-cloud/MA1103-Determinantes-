"""Genera la actividad académica sin soluciones. Requiere reportlab."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT = Path(__file__).resolve().parents[1]
FONT = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
pdfmetrics.registerFont(TTFont('Academic', str(FONT)))
pdfmetrics.registerFont(TTFont('AcademicBold', str(FONT.with_name('DejaVuSans-Bold.ttf'))))
c=canvas.Canvas(str(ROOT/'pdf/actividad-final-determinantes.pdf'), pagesize=(595.28,841.89))
c.setTitle('Determinantes — Actividad final — Semana 12')
c.setAuthor('Marco Vinicio Gutiérrez Montenegro')
blue=HexColor('#123e70'); ink=HexColor('#18304b')
y=790

def text(s,size=10,bold=False,gap=16):
    global y
    c.setFillColor(ink);c.setFont('AcademicBold' if bold else 'Academic',size)
    for line in simpleSplit(s,'AcademicBold' if bold else 'Academic',size,483):
        c.drawString(56,y,line);y-=gap

def matrix(rows):
    global y
    c.setFont('Academic',11); top=y+10; col=46; left=80
    for row in rows:
        for j,v in enumerate(row): c.drawCentredString(left+j*col,y,str(v))
        y-=19
    c.setStrokeColor(ink);c.setLineWidth(.8)
    for x in [left-20,left+(len(rows[0])-1)*col+20]:c.line(x,top,x,y+7)
    y-=10

def heading(s):
    global y
    y-=13;text(s,12,True,19)

c.setFillColor(blue);c.rect(0,828,596,14,fill=1,stroke=0)
text('Instituto Tecnológico de Costa Rica',12,True)
text('Escuela de Matemática · MA1103 Cálculo y Álgebra Lineal',9)
y-=14;text('Determinantes',25,True,32)
text('Actividad final · Estudio asincrónico Semana 12',11)
text('Marco Vinicio Gutiérrez Montenegro',9)
y-=12;text('Nombre: ____________________________________  Grupo: __________',9)
text('Presenta tu desarrollo en hojas aparte. Justifica cada paso y conserva el orden de los problemas.',9)
heading('Problema 1 — Propiedades')
text('Sean u, v y w vectores fila de longitud 3, y sea δ el determinante de la matriz cuyas filas son u, v y w. Demuestra, usando propiedades, que el determinante de la matriz con filas u + v, v + w y w + u es 2δ.')
text('Usa la linealidad en las filas y el efecto de los intercambios. No desarrolles por cofactores ni asignes valores particulares a los vectores.')
heading('Problema 2 — Operaciones')
text('Calcula eficientemente el siguiente determinante de orden 4:')
matrix([[1,1,0,1],[2,3,1,2],[0,1,2,1],[1,2,2,4]])
text('Muestra las operaciones elementales utilizadas, indica cómo cada operación afecta al determinante y justifica el valor final a partir de una matriz triangular.')
heading('Problema 3 — Regla de Cramer')
text('La Escuela de Matemática prepara paquetes de tres tipos de material: cuadernos, lápices y reglas. Un paquete con un cuaderno, un lápiz y una regla cuesta ₡1500; otro con dos cuadernos, un lápiz y tres reglas cuesta ₡3100; y uno con un cuaderno, dos lápices y dos reglas cuesta ₡2200. Cada artículo mantiene el mismo precio en todos los paquetes.')
text('Sean x, y y z los precios unitarios de un cuaderno, un lápiz y una regla, respectivamente. Resuelve mediante la regla de Cramer:')
for s in ['a) Plantea el sistema y construye la matriz de coeficientes.','b) Calcula D y explica por qué existe una solución única.','c) Construye y calcula los determinantes Dₓ, Dᵧ y Dz.','d) Determina x, y y z mediante los cocientes de Cramer.','e) Interpreta la solución en el contexto y verifica los tres precios de los paquetes.']:
    text(s,9.5,False,15)
c.setStrokeColor(HexColor('#dce4ec'));c.line(56,50,539,50)
c.setFont('Academic',8);c.drawString(56,35,'MA1103 · Determinantes · Actividad final');c.drawRightString(539,35,'1 / 1')
c.save()
print('PDF generado:', ROOT/'pdf/actividad-final-determinantes.pdf', 'Última línea:',y)
