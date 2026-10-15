"""Read a PDF and generate page evidence; never writes the source or a draft."""
import argparse,json,hashlib,subprocess
from collections import Counter
from pathlib import Path
from pypdf import PdfReader
from pypdf.generic import ContentStream
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--output',required=True);p.add_argument('--render',action='store_true');a=p.parse_args()
source=Path(a.source).resolve();out=Path(a.output).resolve();out.mkdir(parents=True,exist_ok=True)
inventory=out/'inventory.json'
if inventory.exists():raise SystemExit('Use a new output directory; inventory already exists')
pdf=PdfReader(source);pages=[]
def image_draws(stream,resources,ancestors=frozenset()):
 count=0
 for args,operation in ContentStream(stream,pdf).operations:
  if operation!=b'Do':continue
  obj=resources.get('/XObject',{}).get(args[0])
  if obj is None:continue
  obj=obj.get_object()
  if obj.get('/Subtype')=='/Image':count+=1
  elif obj.get('/Subtype')=='/Form' and id(obj) not in ancestors:
   count+=image_draws(obj,obj.get('/Resources',resources),ancestors|{id(obj)})
 return count
for i,page in enumerate(pdf.pages,1):
 fonts=Counter()
 def visit(text,cm,tm,font,size):
  if text.strip():fonts[(str(font.get('/BaseFont','unknown')) if font else 'unknown',round(float(size),2))]+=len(text.strip())
 text=page.extract_text(visitor_text=visit)
 pages.append({'page':i,'widthPt':float(page.mediabox.width),'heightPt':float(page.mediabox.height),'text':text,'fonts':[{'name':k[0],'sizePt':k[1],'characters':v} for k,v in fonts.most_common()],'imageDrawCount':image_draws(page.get_contents(),page['/Resources']),'imageResourceCount':len(page.images),'annotationCount':len(page.get('/Annots',[]))})
result={'source':{'path':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pageCount':len(pages)},'pages':pages,'boundary':'Machine inventory is not a record of visual inspection. Classify all parts after inspecting page images.'}
if a.render:
 subprocess.run(['pdftoppm','-r','96','-png',str(source),str(out/'page')],check=True)
 paths=sorted(out.glob('page-*.png'))
 for start in range(0,len(paths),12):
  sheet=Image.new('RGB',(1200,1380),'#dddddd');draw=ImageDraw.Draw(sheet)
  for j,path in enumerate(paths[start:start+12]):
   with Image.open(path) as page:
    thumb=page.convert('RGB');thumb.thumbnail((295,420));x=(j%4)*300;y=(j//4)*460;sheet.paste(thumb,(x,y+24));draw.text((x+5,y+5),str(start+j+1),fill='black')
  sheet.save(out/('sheet-'+str(start//12+1)+'.png'))
 result['renderDirectory']=str(out)
inventory.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'inventory':str(inventory),'source':result['source'],'rendered':a.render}))
