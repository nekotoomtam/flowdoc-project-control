"""Read-only verification of the documentation fixture's rendered PDFs."""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

root = Path(sys.argv[1])
reports = []
for name, pages, version in [('baseline', 2, '1.0'), ('expanded', 4, '2.0')]:
    reader = PdfReader(root / (name + '.pdf'))
    assert len(reader.pages) == pages
    first = reader.pages[0].extract_text(extraction_mode='layout')
    assert re.search(r'2 Operations\s+' + str(pages) + r'\b', first), first
    refs = {p.indirect_reference.idnum: i + 1 for i, p in enumerate(reader.pages)}
    targets = []
    urls = []
    for ref in reader.pages[0].get('/Annots', []):
        annotation = ref.get_object()
        if '/Dest' in annotation:
            targets.append(refs[annotation['/Dest'][0].idnum])
        if '/A' in annotation:
            urls.append(annotation['/A'].get('/URI'))
    assert set(targets) == {1, pages}, targets
    assert 'https://example.com/manual' in urls
    for page in reader.pages:
        assert 'Version ' + version in page.extract_text()
    draw = json.loads((root / (name + '-draw.json')).read_text())
    for page in draw['pages']:
        img = page['images'][0]
        assert abs(img['widthPt'] - 190 * 72 / 25.4) < 1e-6
        assert abs(img['heightPt'] - 19 * 72 / 25.4) < 1e-6
        borders = page.get('borders', [])
        assert borders
        assert abs(min(min(b['x1Pt'], b['x2Pt']) for b in borders) - img['xPt']) < 1e-6
        assert abs(max(max(b['x1Pt'], b['x2Pt']) for b in borders) - img['xPt'] - img['widthPt']) < 1e-6
    reports.append({'name': name, 'pages': pages, 'tocTargetPages': sorted(set(targets)), 'imageTableAlignment': 'PASS', 'sharedVersion': version})
print(json.dumps({'status': 'PASS', 'reports': reports}, indent=2))
