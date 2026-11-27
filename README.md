# Gliwicki Klub Strzelecki — strona www

Statyczna strona klubu (HTML/CSS/JS) hostowana w Azure Static Web Apps.

## Struktura

```
public/
├── index.html          # strona główna
├── style.css
├── assets/             # logo i zdjęcie poglądowe
├── 404.html            # strona błędu
├── staticwebapp.config.json  # konfiguracja hostingu Azure
├── 2026-kluby.json     # lista klubów do wyszukiwarki
└── metryczka/          # aplikacja do wypełniania metryczek PDF
```

## Aplikacja metryczki

Dostępna pod `/metryczka/`. Dane zawodnika i zawodów wpisuje się raz,
a checkboxami wybiera od 1 do 4 konkurencji: BIG PISTOL (BP),
LITTLE PISTOL (LP), SMALL RIFLE (SR) i SHOTGUN.

- Podgląd metryczek to czysty HTML/CSS w układzie oryginalnego formularza
  (bez grafiki w tle) — dwie metryczki na stronę A4.
- Pole **Klub** jest wyszukiwarką klubów z listy
  `public/2026-kluby.json` (po nazwie skróconej i pełnej).
  Po wybraniu klubu pole **Siedziba klubu** uzupełnia się automatycznie
  adresem z listy.
- **Pobierz** generuje wektorowy PDF A4 o tym samym układzie co podgląd
  (bez skanu formularza i grafiki tła), po dwie metryczki na stronie A4.
  Drukować: A4, pionowo, 1 strona na arkusz, jednostronnie.
- **Drukuj** drukuje podgląd HTML (2 metryczki na A4).
- Data zawodów jest uzupełniana miejscowością Gliwice
  (np. „Gliwice, 2026.11.27”).
- Wyniki, stanowisko, zmiana i podpisy pozostają puste do uzupełnienia
  na zawodach.

Dane nie są nigdzie zapisywane — po zamknięciu strony trzeba je wpisać
ponownie. Wypełnienie metryczki nie jest zgłoszeniem na zawody.

## Wdrożenie

Push na `main` uruchamia GitHub Actions i wdraża zawartość katalogu
`public/` do Azure Static Web Apps. Konfiguracja hostingu znajduje się
w `public/staticwebapp.config.json` (katalog `app_location` z workflow —
Azure szuka pliku konfiguracji właśnie tam).

## Rozwój

Strona nie wymaga Node.js ani procesu budowania. Do lokalnego podglądu
wystarczy dowolny serwer HTTP uruchomiony w katalogu `public/`, np.:

```bash
python3 -m http.server 8000 --directory public
```
