"""Compare every rendered page against the accepted release fixture."""
import json, subprocess, tempfile, hashlib, re
from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageChops, ImageDraw
root=Path('artifacts/flowdocmake')
new=Path(json.loads((root/'full/checkpoint.json').read_text())['pdf']['path'])
baseline=Path('../flowdoc-service/artifacts/release030/area98/release030.pdf')
a,b=PdfReader(baseline),PdfReader(new)
assert len(a.pages)==len(b.pages)==98
assert all(x.extract_text()==y.extract_text() for x,y in zip(a.pages,b.pages))
def nonimage(page):
 return re.sub(rb'q [^\n]+ /Im\d+ Do Q',b'IMAGE',page.get_contents().get_data())
assert all(nonimage(x)==nonimage(y) for x,y in zip(a.pages,b.pages))
different=[]
with tempfile.TemporaryDirectory(prefix='flowdocmake-pixels-') as tmp:
 for name,pdf in [('a',baseline),('b',new)]:
  subprocess.run(['pdftoppm','-r','72','-png',str(pdf),str(Path(tmp)/name)],check=True)
 for x,y in zip(sorted(Path(tmp).glob('a-*.png')),sorted(Path(tmp).glob('b-*.png'))):
  with Image.open(x) as ix,Image.open(y) as iy:
   if ix.size!=iy.size or ImageChops.difference(ix.convert('RGB'),iy.convert('RGB')).getbbox():different.append(x.name)
 paths=sorted(Path(tmp).glob('b-*.png'))
 for start in range(0,len(paths),12):
  sheet=Image.new('RGB',(1200,1780),'#dddddd');draw=ImageDraw.Draw(sheet)
  for j,p in enumerate(paths[start:start+12]):
   im=Image.open(p).convert('RGB');im.thumbnail((295,415));x=(j%4)*300;y=(j//4)*590;sheet.paste(im,(x,y+25));draw.text((x+5,y+5),str(start+j+1),fill='black')
  sheet.save(root/'full'/('sheet-'+str(start//12+1)+'.png'))
report={'pages':98,'allPageTextIdentical':True,'allNonImageDrawingCommandsIdentical':True,'differentRenderedPages':different,'difference':'Service image preparation changes image dimensions/resampling versus direct-Core baseline; not pixel-identical','sha256':hashlib.sha256(new.read_bytes()).hexdigest()}
(root/'full/pdf-check.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
