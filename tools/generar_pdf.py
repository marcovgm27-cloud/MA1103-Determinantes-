"""Compila la fuente LaTeX de la práctica sin dejar auxiliares en el repositorio."""
from pathlib import Path
import os
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'pdf/actividad-final-determinantes.tex'
if not shutil.which('pdflatex'):
    raise SystemExit('Se requiere pdflatex (TeX Live), con lmodern, amsmath, microtype, geometry, fancyhdr, enumitem y hyperref.')
with tempfile.TemporaryDirectory(prefix='ma1103-latex-') as directory:
    env = dict(os.environ, TEXMFVAR=directory + '/texmf-var', TEXMFCONFIG=directory + '/texmf-config')
    command = ['pdflatex', '-no-shell-escape', '-interaction=nonstopmode', '-halt-on-error', '-file-line-error', '-output-directory=' + directory, str(SOURCE)]
    for _ in range(2):
        result = subprocess.run(command, cwd=SOURCE.parent, env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if result.returncode:
            print(result.stdout)
            raise SystemExit(result.returncode)
    log = (Path(directory)/'actividad-final-determinantes.log').read_text(errors='replace')
    if 'Overfull' in log or 'Missing character' in log:
        print(log)
        raise SystemExit('Revisa el desbordamiento o los caracteres ausentes antes de publicar el PDF.')
    shutil.copyfile(Path(directory)/'actividad-final-determinantes.pdf', SOURCE.with_suffix('.pdf'))
print('PDF compilado desde LaTeX:', SOURCE.with_suffix('.pdf'))
