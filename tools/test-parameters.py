"""Verifica 250 variantes con eliminación exacta independiente de la lógica JS."""
import json
import subprocess
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = r"""
const fs=require('node:fs'),vm=require('node:vm');
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync('js/curriculum.js','utf8'),box);
const cases=[];
for(let i=0;i<250;i++) {
 const seed=i.toString(16).padStart(32,'0'),course=box.window.DeterminantesCourse.createCourse(seed);
 for(const qs of Object.values(course.quizzes))for(const q of qs) {
  if(q.options&&new Set(q.options).size!==q.options.length)throw Error('Opciones duplicadas: '+q.id);
  if(q.matrix||q.checkMatrix||q.scalarCheck||q.systemMatrix)cases.push(q);
 }
}
process.stdout.write(JSON.stringify(cases));
"""

def determinant(matrix):
    a = [[Fraction(v) for v in row] for row in matrix]
    value = Fraction(1)
    for i in range(len(a)):
        j = next((j for j in range(i, len(a)) if a[j][i]), None)
        if j is None:
            return 0
        if j != i:
            a[i], a[j] = a[j], a[i]
            value = -value
        pivot = a[i][i]
        value *= pivot
        for j in range(i + 1, len(a)):
            factor = a[j][i] / pivot
            a[j] = [v - factor * w for v, w in zip(a[j], a[i])]
    return value

cases = json.loads(subprocess.check_output(['node', '-e', SCRIPT], cwd=ROOT))
for case in cases:
    if case.get('matrix'):
        assert determinant(case['matrix']) == case['answer'], case['id']
    if case.get('checkMatrix'):
        assert determinant(case['checkMatrix']) == case['checkDet'], case['id']
    if case.get('scalarCheck'):
        v = case['scalarCheck']
        assert v['newDet'] == v['k'] ** v['order'] * v['original'], case['id']
        assert case['answer'] == v['original'], case['id']
    if case.get('systemMatrix'):
        assert determinant(case['systemMatrix']) != 0, case['id']
        actual = [sum(v*x for v, x in zip(row, case['answer'])) for row in case['systemMatrix']]
        assert actual == case['rhs'], case['id']
assert determinant([[1, 2, 1], [2, 5, 3], [1, 3, 4]]) == 2
pdf_system = [[1, 1, 1], [2, -1, 1], [1, 2, -1]]
assert determinant(pdf_system) == 7
assert [sum(v*x for v, x in zip(row, [2, 1, -1])) for row in pdf_system] == [2, 2, 5]
print(f'PASS: {len(cases)} cálculos parametrizados en 250 variantes; opciones sin duplicados y resultados del PDF comprobados con fracciones exactas.')
