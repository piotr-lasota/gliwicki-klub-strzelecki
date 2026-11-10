# Gliwicki Klub Strzelecki — strona www

Statyczna strona klubu (HTML/CSS/JS) hostowana w Azure Static Web Apps.

## Struktura

```
public/
├── index.html          # strona główna
├── style.css
├── assets/             # logo i zdjęcie poglądowe
├── 404.html            # strona błędu
└── metryczka/          # aplikacja do wypełniania metryczek PDF
```

## Aplikacja metryczki

Dostępna pod `/metryczka/`. Pozwala przygotować od 1 do 4 metryczek
zawodnika i pobrać je jako PDF lub wydrukować. Dane są zapisywane
wyłącznie lokalnie w przeglądarce (`localStorage`).

## Wdrożenie

Push na `main` uruchamia GitHub Actions i wdraża zawartość katalogu
`public/` do Azure Static Web Apps. Konfiguracja hostingu znajduje się
w `staticwebapp.config.json`.

## Rozwój

Strona nie wymaga Node.js ani procesu budowania. Do lokalnego podglądu
wystarczy dowolny serwer HTTP uruchomiony w katalogu `public/`, np.:

```bash
python3 -m http.server 8000 --directory public
```
