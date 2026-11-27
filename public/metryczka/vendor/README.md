# Biblioteki i zasoby zewnętrzne

Pliki w tym katalogu są dołączane do aplikacji metryczki bez procesu budowania.
Poniżej rejestr wersji, źródeł i licencji.

| Plik | Pakiet | Wersja | Źródło | Licencja |
|---|---|---|---|---|
| `pdf-lib.js` | [`pdf-lib`](https://www.npmjs.com/package/pdf-lib) | 1.17.1 | https://github.com/Hopding/pdf-lib | MIT — [`pdf-lib.LICENSE.txt`](pdf-lib.LICENSE.txt) |
| `fontkit.js` | [`@pdf-lib/fontkit`](https://www.npmjs.com/package/@pdf-lib/fontkit) | 1.1.1 | https://github.com/Hopding/fontkit | MIT — [`fontkit.LICENSE.txt`](fontkit.LICENSE.txt) |
| `LiberationSans-Regular.ttf` | `liberation-fonts` | 2.1.5 | https://github.com/liberationfonts | SIL OFL 1.1 — [`LiberationSans-LICENSE.txt`](LiberationSans-LICENSE.txt) |
| `LiberationSans-Bold.ttf` | `liberation-fonts` | 2.1.5 | https://github.com/liberationfonts | SIL OFL 1.1 — [`LiberationSans-LICENSE.txt`](LiberationSans-LICENSE.txt) |

## Weryfikacja wersji

Wersje `pdf-lib` i `@pdf-lib/fontkit` potwierdzono przez porównanie SHA-256
z plikami z oficjalnych paczek npm:

- `pdf-lib.js` = `pdf-lib@1.17.1` → `dist/pdf-lib.min.js`
  (`0f9a5cad07941f0826586c94e089d89b918c46e5c17cf2d5a3c6f666e3bc694f`)
- `fontkit.js` = `@pdf-lib/fontkit@1.1.1` → `dist/fontkit.umd.min.js`
  (`d8df561b9fba98e24f2e5130e40948809281bbbc55a20c412359f1a0a5eb35a6`)

Fonty Liberation deklarują wersję 2.1.5 w tablicy `name` pliku TTF.

## Uwagi o zależnościach

Oba pliki `.js` to zminifikowane bundle zawierające kod zależności.

- `pdf-lib.js` zawiera m.in. `@pdf-lib/standard-fonts` (MIT),
  `@pdf-lib/upng` (MIT), `pako` (MIT/Zlib) i `tslib` (0BSD). Na początku
  pliku znajduje się nota o kodzie Microsoft objętym licencją Apache-2.0
  (helpery `tslib`).
- `fontkit.js` to fork `@pdf-lib/fontkit` (na bazie
  [fontkit](https://github.com/foliojs/fontkit) Devona Govetta). Bundle
  zawiera m.in. `@pdf-lib/brotli`, `@pdf-lib/restructure`,
  `@pdf-lib/unicode-properties`, `unicode-trie`, `tiny-inflate`, `pako`,
  `base64-arraybuffer`, `buffer`, `clone`, `codepoints`, `deep-equal`,
  `dfa` i `iconv-lite` — wszystkie na licencji MIT (poza `pako`: MIT/Zlib).

## Odtworzenie plików

```bash
npm pack pdf-lib@1.17.1
tar xzf pdf-lib-1.17.1.tgz
cp package/dist/pdf-lib.min.js public/metryczka/vendor/pdf-lib.js

npm pack @pdf-lib/fontkit@1.1.1
tar xzf pdf-lib-fontkit-1.1.1.tgz
cp package/dist/fontkit.umd.min.js public/metryczka/vendor/fontkit.js
```

Przy aktualizacji należy zaktualizować wersję w tabeli powyżej, sprawdzić
ewentualne zmiany w licencjach zależności i w razie potrzeby odświeżyć pliki
`*.LICENSE.txt`.
