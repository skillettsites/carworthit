"""Step 2 of 3: NHTSA defect investigations for every model in models.json.

Source: static.nhtsa.gov/odi/ffdd/inv/FLAT_INV.zip (tab-delimited, one row per
action number x make x model x year; field list at
static.nhtsa.gov/odi/ffdd/inv/INV.txt). Downloaded into $MP_CACHE if missing
and read straight out of the zip. Writes $MP_CACHE/inv_<slug>.json.

Usage: python scripts/model-problems/inv.py
"""
import io, json, os, re, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get('MP_CACHE') or os.path.join(HERE, '.cache')
MODELS = json.load(open(os.path.join(HERE, 'models.json'), encoding='utf-8'))
EXCLUDED = re.compile(r'HYBRID|\bHV\b|\bHEV\b|PLUG-IN|PHEV|\bEV\b|ELECTRIC|FUEL CELL', re.I)

os.makedirs(CACHE, exist_ok=True)
zpath = os.path.join(CACHE, 'FLAT_INV.zip')
if not os.path.exists(zpath):
    req = urllib.request.Request('https://static.nhtsa.gov/odi/ffdd/inv/FLAT_INV.zip', headers={'User-Agent': 'curl/8.4.0'})
    with urllib.request.urlopen(req, timeout=300) as r, open(zpath, 'wb') as f:
        f.write(r.read())

rules = []
for m in MODELS:
    rules.append((m['slug'], m['make'].upper(), re.compile(m['match'], re.I), re.compile(m['exclude'], re.I) if m.get('exclude') else None))

found = {m['slug']: {} for m in MODELS}
with zipfile.ZipFile(zpath) as z:
    name = next(n for n in z.namelist() if n.upper().endswith('.TXT'))
    with z.open(name) as raw:
        for line in io.TextIOWrapper(raw, encoding='latin-1'):
            p = line.rstrip('\r\n').split('\t')
            if len(p) < 11:
                continue
            action, make, model, year, comp, _mfr, odate, cdate, camp, subject, summary = p[:11]
            make, model = make.strip().upper(), model.strip().upper()
            for slug, mk, rx, ex in rules:
                if make != mk or not rx.search(model) or EXCLUDED.search(model) or (ex and ex.search(model)):
                    continue
                rec = found[slug].setdefault(action, {
                    'action': action, 'component': comp.strip(), 'opened': odate, 'closed': cdate or None,
                    'campaign': camp.strip() or None, 'subject': subject.strip(), 'years': set(), 'models': set(),
                })
                if year.strip().isdigit() and year.strip() != '9999':
                    rec['years'].add(int(year))
                rec['models'].add(model)

for slug, recs in found.items():
    out = []
    for r in recs.values():
        r['years'] = sorted(r['years'])
        r['models'] = sorted(r['models'])
        out.append(r)
    out.sort(key=lambda r: r['opened'], reverse=True)
    json.dump(out, open(os.path.join(CACHE, f'inv_{slug}.json'), 'w', encoding='utf-8'), indent=1)
    print(slug, len(out))
