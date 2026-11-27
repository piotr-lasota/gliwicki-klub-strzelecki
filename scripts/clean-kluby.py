#!/usr/bin/env python3
"""Usuwa wiodące i końcowe spacje z pól tekstowych w kluby.json.

Dane klubów pochodzą z eksportu SOZ PZSS (klucz "soz.pzss.org.pl") i mogą
zawierać artefakty w postaci białych znaków na początku lub końcu wartości.
Uruchamiaj ten skrypt po każdym ponownym imporcie/eksporcie danych:

    python3 scripts/clean-kluby.py

Skrypt jest idempotentny, zachowuje kolejność kluczy oraz format pliku
(wcięcie 2 spacje, UTF-8, bez escapowania znaków narodowych).
"""

import json
from pathlib import Path

TEXT_FIELDS = ('ShortName', 'FullName', 'Street', 'HouseNumber', 'AppartmentNumber', 'City')
DEFAULT_PATH = Path(__file__).resolve().parent.parent / 'public' / 'metryczka' / 'data' / 'kluby.json'


def clean(path):
    data = json.loads(path.read_text(encoding='utf-8'))
    cleaned = 0
    for club in data['soz.pzss.org.pl']:
        for key in TEXT_FIELDS:
            value = club.get(key)
            if isinstance(value, str) and value != value.strip():
                club[key] = value.strip()
                cleaned += 1
    if cleaned:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{path}: wyczyszczono {cleaned} pól.')
    return cleaned


if __name__ == '__main__':
    clean(DEFAULT_PATH)
