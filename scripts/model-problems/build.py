"""Step 3 of 3: reduce the cached NHTSA pulls to src/content/model-problems.json,
the dataset the data-backed "[model] common problems" pages render.

Inputs, all free public NHTSA data, cached by pull.py and inv.py in $MP_CACHE:
  raw/<slug>/<MODEL>__<year>__c.json  complaints (api.nhtsa.gov/complaints/complaintsByVehicle)
  raw/<slug>/<MODEL>__<year>__r.json  recalls    (api.nhtsa.gov/recalls/recallsByVehicle)
  inv_<slug>.json                     investigations (static.nhtsa.gov/odi/ffdd/inv/FLAT_INV.zip)

Nothing is estimated: every number is a count of NHTSA records on the pull
date. Usage: python scripts/model-problems/build.py YYYY-MM-DD   (the pull date)

To add a model: add it to models.json, run pull.py <slug>, inv.py, build.py,
then add the article prose to src/content/articles.json with a <!--data-->
marker between the intro and the body.
"""
import json, os, re, statistics, sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get('MP_CACHE') or os.path.join(HERE, '.cache')
OUT = os.path.join(HERE, '..', '..', 'src', 'content', 'model-problems.json')
PULLED = sys.argv[1] if len(sys.argv) > 1 else None
if not PULLED or not re.match(r'^\d{4}-\d{2}-\d{2}$', PULLED):
    sys.exit('usage: build.py YYYY-MM-DD (the date the data was pulled)')
# Model years after this are too new to judge: the same four-year rule the
# 17 hand-built model guides use.
JUDGE_THROUGH = 2021
MODELS = json.load(open(os.path.join(HERE, 'models.json'), encoding='utf-8'))

# Phrases searched for in the complaint narratives. A complaint can match more
# than one. These are keyword counts, not diagnoses, and the page says so.
THEMES = [
    ('oil', 'Oil consumption or oil leaks', r"\boil (consumption|leak|leaking|burning)|burn(s|ed|ing)? (a lot of |through |excessive |so much )?oil|consum(es|ed|ing|ption of) (engine )?oil|low oil (pressure|level|light|warning)"),
    ('engine', 'Engine failure, seizure or knocking', r"\bseiz(e|ed|es|ing|ure)\b|\bknock(s|ed|ing)?\b|rod bearing|engine (failure|failed|blew|blown|died|replacement|replaced|seized)|threw a rod|catastrophic"),
    ('stall', 'Stalling or loss of power while driving', r"\bstall(s|ed|ing)?\b|loss of (motive )?power|lost (all )?power|power loss"),
    ('transmission', 'Transmission problems', r"\btransmission\b"),
    ('cvt', 'CVT (continuously variable transmission)', r"\bcvt\b|continuously variable"),
    ('hesitation', 'Hesitation, jerking or surging', r"hesitat|\bjerk(s|ed|ing|y)?\b|\bsurg(e|es|ed|ing)\b|\blurch|shudder"),
    ('brakes', 'Brakes', r"\bbrak(e|es|ing)\b"),
    ('autobrake', 'Automatic emergency braking or collision warning', r"automatic emergency brak|pre-?collision|collision (avoidance|mitigation|warning)|phantom brak|brak(ed|es|ing) (on its own|by itself)"),
    ('airbag', 'Air bags', r"\bair ?bags?\b"),
    ('electrical', 'Electrical faults or battery drain', r"\belectrical\b|battery (drain|died|dies|dead)|dead battery|drain(s|ed|ing)? the battery"),
    ('screen', 'Infotainment screen, radio or backup camera', r"infotainment|touch ?screen|\bradio\b|back ?up camera|rear ?view camera|\bdisplay\b"),
    ('fire', 'Fire, smoke or a burning smell', r"\bfire\b|caught fire|\bsmoke\b|burning smell|smell of burning"),
    ('steering', 'Steering', r"\bsteering\b"),
    ('ac', 'Air conditioning', r"\ba/c\b|air condition|\bac (compressor|system|unit|stopped|blows|does not|doesn)"),
    ('fuel', 'Fuel pump, fuel leak or fuel smell', r"fuel pump|fuel leak|gas leak|(smell|odor)(s|ed)? (of |like )?(gas|fuel)|(fuel|gas) (smell|odor)"),
    ('windshield', 'Windshield cracks', r"windshield (crack|chip)|cracked windshield|windshield (has|had|developed) a crack"),
    ('sunroof', 'Sunroof', r"sun ?roof|moon ?roof|panoramic"),
    ('water', 'Water leaks', r"water (leak|intrusion|coming in|in the)|leak(s|ed|ing)? water"),
    ('turbo', 'Turbocharger', r"\bturbo"),
    ('startstop', 'Auto start-stop', r"start[- /]stop|auto stop|idle stop"),
    ('timing', 'Timing chain or belt', r"timing (chain|belt)"),
    ('rust', 'Rust or corrosion', r"\brust(ed|ing|y)?\b|corro(sion|ded)"),
    ('frame', 'Frame', r"\bframe\b"),
    ('seatbelt', 'Seat belts', r"seat ?belts?"),
    ('lights', 'Headlights', r"head ?lights?|head ?lamps?|low beams?|high beams?"),
    ('checkengine', 'Check-engine light', r"check engine|engine light"),
    ('acceleration', 'Unintended acceleration', r"unintended acceleration|accelerat(ed|es|ing) (on its own|by itself)|sudden(ly)? accelerat"),
    ('suspension', 'Ball joints, control arms or suspension', r"ball joint|control arm|suspension"),
    ('coolant', 'Coolant leaks or overheating', r"coolant|overheat|antifreeze|water pump|radiator"),
    ('headgasket', 'Head gasket', r"head gasket"),
    ('wheelbearing', 'Wheel bearings', r"wheel bearing"),
    ('doors', 'Doors, locks or latches', r"door (lock|latch|handle)|door (will not|would not|won'?t) (open|close|lock)"),
]
THEME_RE = [(k, label, re.compile(p, re.I)) for k, label, p in THEMES]


def tidy_component(c):
    head = c.split(':')[0].strip()
    if not head or head == 'UNKNOWN OR OTHER':
        return None
    return head.lower().capitalize()


def ddmmyyyy(s):
    # The recalls feed writes ReportReceivedDate as DD/MM/YYYY.
    m = re.match(r'(\d{2})/(\d{2})/(\d{4})', s or '')
    return f'{m.group(3)}-{m.group(2)}-{m.group(1)}' if m else None


ABBREV = re.compile(r'\b(INC|CO|CORP|LTD|MFG|NO|NOS|JR|ST|LLC|U\.S|APPROX)\.', re.I)
ACRONYMS = ['ABS', 'SRS', 'ECU', 'ECM', 'PCM', 'TCM', 'BCM', 'IPDM', 'TPMS', 'VIN', 'FMVSS', 'NHTSA', 'LED', 'EPS', 'MDPS', 'ESC',
            'CVT', 'A/C', 'SUV', 'HVAC', 'DRL', 'OCS', 'SDM', 'AWD', 'FWD', '4WD', '2WD', 'RWD', 'LCD', 'HID', 'GPS', 'USB', 'PRNDL',
            'GMC', 'ODS', 'TSB', 'HEV', 'PHEV', 'DSP', 'ELR', 'ALR', 'SRS', 'OEM']
PROPER = ['Toyota', 'Lexus', 'Scion', 'Kia', 'Hyundai', 'Honda', 'Acura', 'Subaru', 'Mazda', 'Chevrolet', 'General Motors', 'Takata',
          'Denso', 'Bosch', 'Continental', 'Federal Motor Vehicle Safety Standard', 'National Highway Traffic Safety Administration',
          'Tundra', 'Corolla', 'Highlander', 'Pilot', 'Sorento', 'Santa Fe', 'Elantra', 'Tucson', 'Forester', 'Crosstrek', 'Acadia',
          'Traverse', 'Trax', 'Zone A', 'January', 'February', 'March', 'April', 'June', 'July', 'August', 'September',
          'October', 'November', 'December']


def sentences(text):
    text = re.sub(r'\s+', ' ', text or '').strip()
    # Keep "Inc." and "No. 110" from ending a sentence.
    text = ABBREV.sub(lambda m: m.group(0).replace('.', '․'), text)
    # A sentence can end inside quotes: 'STANDARD NO. 110, "TIRE SELECTION AND RIMS."  THESE ...'
    parts = re.split(r'(?:(?<=[.!?])|(?<=[.!?]["\']))\s+(?=[A-Z("\'])', text)
    return [p.replace('․', '.') for p in parts if p.strip()]


def sentence_case(text):
    """Older NHTSA summaries are in capitals. Read them in sentence case, with
    known acronyms and names restored."""
    letters = [c for c in text if c.isalpha()]
    if not letters or sum(c.isupper() for c in letters) / len(letters) < 0.8:
        return text
    t = text.lower()
    t = re.sub(r'(^|[.!?]["\']?\s+["\']?)([a-z])', lambda m: m.group(1) + m.group(2).upper(), t)
    # Quoted standard names read as titles: "tire selection and rims" -> "Tire Selection and Rims".
    t = re.sub(r'(["\'])([a-z][^"\']{3,80})\1', lambda m: m.group(1) + re.sub(r'\b([a-z])([a-z]{3,})', lambda w: w.group(1).upper() + w.group(2), m.group(2)) + m.group(1), t)
    for a in ACRONYMS:
        t = re.sub(r'(?<![A-Za-z0-9])' + re.escape(a.lower()) + r'(?![A-Za-z0-9])', a, t)
    for p in PROPER:
        t = re.sub(r'\b' + re.escape(p.lower()) + r'\b', p, t)
    return t


def recall_defect(summary, consequence=''):
    """NHTSA summaries open with one or more scope sentences ('<Maker> is
    recalling certain ... vehicles.'). Keep NHTSA's own wording of the defect:
    the first two sentences after the scope. Falls back to the consequence."""
    all_s = sentences(summary)
    s = list(all_s)
    while s and re.search(r'\brecall', s[0], re.I):
        s = s[1:]
    # Campaign bookkeeping ("Hyundai informed the agency that it was adding
    # more vehicles") is not the defect.
    s = [x for x in s if not re.search(r'informed (the agency|NHTSA)|total number of vehicles|adding (more|additional) vehicles|supersedes', x, re.I)]
    out = ' '.join(s[:2]).strip()
    if not out and all_s:
        # Older summaries put the defect in the scope sentence itself:
        # "... is recalling certain 2010 Corolla vehicles for failing to comply
        # with ... No. 208". Keep the part after "vehicles for/because".
        m = re.search(r'\b(?:vehicles|trucks|cars|units|assemblies|equipment)\b[^.]*?\b(?:for|because|as|in which|where|that)\s+(.+)$', all_s[0], re.I)
        if m:
            clause = m.group(1).strip().rstrip('.')
            out = clause[:1].upper() + clause[1:] + '.'
    cons = ' '.join(sentences(consequence)[:1]).strip()
    if not out:
        out = cons
    elif len(out) < 160 and cons and not re.search(r'does not meet the standard', cons, re.I) and cons.lower() not in out.lower():
        out = f'{out} {cons}'
    if not out:
        out = ' '.join(all_s[:1]).strip()
    out = sentence_case(out)
    return out[:420].rstrip() + ('...' if len(out) > 420 else '')


def build(m):
    slug = m['slug']
    raw = os.path.join(CACHE, 'raw', slug)
    years = {}
    comp_total = Counter()
    theme_total = Counter()
    theme_years = defaultdict(Counter)
    seen_odi = set()
    recalls = {}
    names_used = set()
    pairs = defaultdict(dict)  # (model name, year) -> {'c': path, 'r': path}
    for fn in os.listdir(raw):
        mm = re.match(r'(.+)__(\d{4})__([cr])\.json$', fn)
        if mm:
            pairs[(mm.group(1), int(mm.group(2)))][mm.group(3)] = os.path.join(raw, fn)
    for (_safe, y), paths in sorted(pairs.items(), key=lambda kv: (kv[0][1], kv[0][0])):
        c = json.load(open(paths['c'], encoding='utf-8')) if 'c' in paths else {'results': []}
        r = json.load(open(paths['r'], encoding='utf-8')) if 'r' in paths else {'results': []}
        for d_ in (c, r):
            if d_.get('_model') and (d_.get('results') or []):
                names_used.add(d_['_model'])
        row = years.setdefault(y, {'year': y, 'complaints': 0, 'crashes': 0, 'fires': 0, 'injuries': 0, 'recalls': set(), '_comp': Counter()})
        for x in c.get('results') or []:
            key = (x.get('odiNumber'), y)
            if key in seen_odi:
                continue
            seen_odi.add(key)
            row['complaints'] += 1
            row['crashes'] += 1 if x.get('crash') else 0
            row['fires'] += 1 if x.get('fire') else 0
            # Complaints that REPORT an injury, not the sum of the field: the
            # field is free-typed and one 2006 Pilot complaint says 99. Deaths
            # are not published at all; narratives often describe causes that
            # have nothing to do with a defect.
            row['injuries'] += 1 if int(x.get('numberOfInjuries') or 0) > 0 else 0
            comps = set(filter(None, (tidy_component(p) for p in (x.get('components') or '').split(','))))
            for cc in comps:
                row['_comp'][cc] += 1
                comp_total[cc] += 1
            text = x.get('summary') or ''
            for k, _label, rx in THEME_RE:
                if rx.search(text):
                    theme_total[k] += 1
                    theme_years[k][y] += 1
        for x in r.get('results') or []:
            camp = (x.get('NHTSACampaignNumber') or '').strip()
            if not camp:
                continue
            row['recalls'].add(camp)
            rec = recalls.setdefault(camp, {
                'campaign': camp,
                'date': ddmmyyyy(x.get('ReportReceivedDate')),
                'component': (x.get('Component') or '').split(':')[0].strip().lower().capitalize(),
                'componentFull': (x.get('Component') or '').strip(),
                'defect': recall_defect(x.get('Summary'), x.get('Consequence') or ''),
                'parkIt': bool(x.get('parkIt')),
                'parkOutside': bool(x.get('parkOutSide')),
                'years': set(),
            })
            rec['years'].add(y)

    ys = sorted(y for y, v in years.items() if v['complaints'] or v['recalls'])
    rows = []
    for y in ys:
        v = years[y]
        rows.append({
            'year': y, 'complaints': v['complaints'], 'crashes': v['crashes'], 'fires': v['fires'],
            'injuries': v['injuries'], 'recalls': len(v['recalls']),
            'top': [{'c': k, 'n': n} for k, n in v['_comp'].most_common(3)],
        })
    judged = [r for r in rows if r['year'] <= JUDGE_THROUGH]
    median = statistics.median([r['complaints'] for r in judged]) if judged else 0
    # Years to avoid: up to three judged years with the most complaints, each at
    # least twice the median. Other judged years at twice the median are "high".
    # Newer years already at twice the median are called out separately.
    # "Fewest" looks only at the last 15 judged years, so a 25-year-old car is
    # never recommended for having fewer complaints from an era when fewer
    # owners filed them online; a year under a tenth of the median is "sparse"
    # (often a short or skipped model year) and never recommended.
    over = sorted([r for r in judged if median and r['complaints'] >= 2 * median], key=lambda r: -r['complaints'])
    worst = {r['year'] for r in over[:3]}
    recent_floor = JUDGE_THROUGH - 14
    for r in rows:
        n = r['complaints']
        if r['year'] in worst:
            r['flag'] = 'most'
        elif r['year'] > JUDGE_THROUGH:
            r['flag'] = 'newhigh' if median and n >= 2 * median else 'new'
        elif median and n >= 2 * median:
            r['flag'] = 'high'
        elif median and n >= 1.25 * median:
            r['flag'] = 'above'
        elif median and n < 0.1 * median:
            r['flag'] = 'sparse'
        elif median and n <= 0.5 * median and r['year'] >= recent_floor:
            r['flag'] = 'fewest'
        else:
            r['flag'] = 'typical'
    fewest = sorted([r for r in rows if r['flag'] == 'fewest'], key=lambda r: r['complaints'])[:3]
    summary = {
        'worst': [{'year': r['year'], 'n': r['complaints']} for r in over[:3]],
        'high': sorted([r['year'] for r in rows if r['flag'] == 'high']),
        'newHigh': [{'year': r['year'], 'n': r['complaints']} for r in rows if r['flag'] == 'newhigh'],
        'fewest': [{'year': r['year'], 'n': r['complaints']} for r in fewest],
        'topJudged': [{'year': r['year'], 'n': r['complaints']} for r in sorted(judged, key=lambda r: -r['complaints'])[:3]],
        'recentFloor': recent_floor,
    }
    total = sum(r['complaints'] for r in rows)
    themes = []
    for k, label, _ in THEME_RE:
        n = theme_total[k]
        if not n:
            continue
        top_years = [{'year': yy, 'n': nn} for yy, nn in theme_years[k].most_common(3)]
        themes.append({'key': k, 'label': label, 'n': n, 'share': round(100 * n / total, 1) if total else 0, 'topYears': top_years})
    themes.sort(key=lambda t: -t['n'])
    yrs_with_data = {r['year'] for r in rows}
    inv = json.load(open(os.path.join(CACHE, f'inv_{slug}.json'), encoding='utf-8'))
    investigations = []
    for i in inv:
        # Only years this page covers: the file also lists overseas or
        # pre-launch years for some nameplates.
        iy = [y for y in i['years'] if y in yrs_with_data]
        if not iy:
            continue
        investigations.append({
            'action': i['action'], 'subject': i['subject'].strip().rstrip('.'),
            'opened': f"{i['opened'][:4]}-{i['opened'][4:6]}-{i['opened'][6:8]}" if i['opened'] else None,
            'closed': f"{i['closed'][:4]}-{i['closed'][4:6]}-{i['closed'][6:8]}" if i['closed'] else None,
            'campaign': i['campaign'], 'years': iy, 'component': i['component'],
        })
    rec_list = []
    for rec in recalls.values():
        rec['years'] = sorted(rec['years'])
        rec_list.append(rec)
    rec_list.sort(key=lambda r: (r['date'] or '', r['campaign']), reverse=True)
    return {
        'name': m['name'], 'make': m['make'], 'nhtsaModels': sorted(names_used),
        'pulled': PULLED, 'judgeThrough': JUDGE_THROUGH, 'median': median, 'summary': summary,
        'totals': {
            'complaints': total, 'crashes': sum(r['crashes'] for r in rows), 'fires': sum(r['fires'] for r in rows),
            'injuries': sum(r['injuries'] for r in rows),
            'recalls': len(rec_list), 'investigations': len(investigations),
            'firstYear': rows[0]['year'] if rows else None, 'lastYear': rows[-1]['year'] if rows else None,
        },
        'years': list(reversed(rows)),
        'components': [{'c': k, 'n': n} for k, n in comp_total.most_common(10)],
        'themes': themes[:12],
        'recalls': rec_list,
        'investigations': investigations,
    }


out = {}
for m in MODELS:
    if not os.path.isdir(os.path.join(CACHE, 'raw', m['slug'])):
        print('no cache for', m['slug'], '(run pull.py first)')
        continue
    d = build(m)
    out[f"{m['slug']}-common-problems"] = d
    t, sm = d['totals'], d['summary']
    print(f"{m['slug']:20} {t['firstYear']}-{t['lastYear']} complaints {t['complaints']:6} recalls {t['recalls']:3} "
          f"investigations {t['investigations']:2} median {d['median']} avoid={[(x['year'], x['n']) for x in sm['worst']]}")
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print('wrote', os.path.normpath(OUT))
