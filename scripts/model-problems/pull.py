"""Step 1 of 3: pull NHTSA complaints and recalls for every model in models.json.

Free public API, no key. Responses are cached under $MP_CACHE (default
scripts/model-problems/.cache, gitignored) so build.py can be re-run without
refetching. Delete the cache folder to refresh.

NHTSA files some years under variant names (2010 Tundra is "TUNDRA CREW CAB",
"TUNDRA DOUBLE CAB" and "TUNDRA REGULAR CAB"; newer years add "<MODEL> ICE"),
so names are discovered per make and year from
api.nhtsa.gov/products/vehicle/models and matched against each model's
pattern rather than typed. Hybrids, plug-ins, EVs and fuel cells are excluded.

Usage: python scripts/model-problems/pull.py [slug ...]
Note: NHTSA's CDN rejects some custom user agents with a 403, hence curl's.
"""
import json, os, re, sys, time, urllib.request, urllib.parse, urllib.error
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get('MP_CACHE') or os.path.join(HERE, '.cache')
MODELS = json.load(open(os.path.join(HERE, 'models.json'), encoding='utf-8'))
EXCLUDED = re.compile(r'HYBRID|\bHV\b|\bHEV\b|PLUG-IN|PHEV|\bEV\b|ELECTRIC|FUEL CELL', re.I)


def fetch(url, tries=5):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'curl/8.4.0', 'Accept': '*/*'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            # The recalls endpoint answers an empty result with HTTP 400 and a
            # valid JSON body ({"Count":0,...}). That body is the answer.
            try:
                body = json.loads(e.read().decode('utf-8'))
                if isinstance(body, dict) and 'results' in body:
                    return body
            except Exception:  # noqa: BLE001
                pass
            last = e
        except Exception as e:  # noqa: BLE001
            last = e
        time.sleep(3 * (i + 1))
    raise RuntimeError(f'{url}: {last}')


def names_for(make, year, issue):
    d = os.path.join(CACHE, 'products')
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, f'{make}_{year}_{issue}.json')
    if os.path.exists(p):
        return json.load(open(p, encoding='utf-8'))
    qs = urllib.parse.urlencode({'modelYear': year, 'make': make, 'issueType': issue})
    data = fetch(f'https://api.nhtsa.gov/products/vehicle/models?{qs}')
    names = sorted({r['model'] for r in data.get('results') or []})
    json.dump(names, open(p, 'w', encoding='utf-8'))
    return names


def job(m, year):
    rx = re.compile(m['match'], re.I)
    ex = re.compile(m['exclude'], re.I) if m.get('exclude') else None
    d = os.path.join(CACHE, 'raw', m['slug'])
    os.makedirs(d, exist_ok=True)
    got = {}
    for kind, base in (('c', 'https://api.nhtsa.gov/complaints/complaintsByVehicle'), ('r', 'https://api.nhtsa.gov/recalls/recallsByVehicle')):
        for name in names_for(m['make'], year, kind):
            if not rx.search(name) or EXCLUDED.search(name) or (ex and ex.search(name)):
                continue
            safe = re.sub(r'[^A-Z0-9]+', '_', name.upper()).strip('_')
            p = os.path.join(d, f'{safe}__{year}__{kind}.json')
            if not (os.path.exists(p) and os.path.getsize(p) > 20):
                qs = urllib.parse.urlencode({'make': m['make'], 'model': name, 'modelYear': year})
                data = fetch(f'{base}?{qs}')
                data['_model'] = name
                json.dump(data, open(p, 'w', encoding='utf-8'))
            got.setdefault(kind, []).append(name)
    return m['slug'], year, got


def main():
    want = set(sys.argv[1:])
    jobs = [(m, y) for m in MODELS if (not want or m['slug'] in want) for y in range(m['from'], m['to'] + 1)]
    print(len(jobs), 'model-years', flush=True)
    with ThreadPoolExecutor(5) as pool:
        for slug, year, got in pool.map(lambda a: job(*a), jobs):
            print(slug, year, got, flush=True)


if __name__ == '__main__':
    main()
