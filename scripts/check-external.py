#!/usr/bin/env python3
"""Read-only public legal URL checks. Never submits forms or changes protection.
Exit 0: available; 1: unavailable/error; 2: automated check blocked by Cloudflare.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import urllib.error
import urllib.request

URLS = ['https://api.deviny.me/legal/privacy.html', 'https://api.deviny.me/legal/terms.html']

def inspect(url):
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            sample = response.read(2048).decode('utf-8', 'replace')
            html = 'text/html' in response.headers.get('Content-Type', '')
            return {'url': url, 'http_status': response.status,
                    'result': 'available' if html and '<html' in sample.lower() else 'unexpected_content'}
    except urllib.error.HTTPError as error:
        body = error.read(2048).decode('utf-8', 'replace')
        blocked = error.code == 403 and 'cloudflare' in error.headers.get('Server', '').lower() and '1010' in body
        return {'url': url, 'http_status': error.code,
                'result': 'automated_request_blocked' if blocked else 'http_error',
                'reason': 'Cloudflare 1010: browser integrity protection; origin access not established' if blocked else str(error)}
    except (OSError, ValueError) as error:
        return {'url': url, 'result': 'network_error', 'reason': str(error)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(inspect, URLS))
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'method': 'public GET, no credentials or protection bypass',
              'results': results, 'scope': 'Response availability only; no legal approval or live form submission.'}
    output = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output)
    print(output, end='')
    if any(row['result'] not in ['available', 'automated_request_blocked'] for row in results): return 1
    return 2 if any(row['result'] == 'automated_request_blocked' for row in results) else 0

if __name__ == '__main__':
    raise SystemExit(main())
