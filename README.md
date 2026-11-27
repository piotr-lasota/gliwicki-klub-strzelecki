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
└── metryczka/          # aplikacja do wypełniania metryczek PDF
    └── data/kluby.json  # lista klubów do wyszukiwarki
```

## Aplikacja metryczki

Dostępna pod `/metryczka/`. Dane zawodnika i zawodów wpisuje się raz,
a checkboxami wybiera od 1 do 4 konkurencji: BIG PISTOL (BP),
LITTLE PISTOL (LP), SMALL RIFLE (SR) i SHOTGUN.

Do wygenerowania PDF lub wydruku wymagane są pola **Imię**, **Nazwisko**,
**Klub**, **Rok urodzenia**, **Data zawodów** oraz co najmniej jedna
konkurencja. Przyciski pozostają nieaktywne, dopóki formularz nie jest
kompletny. Po najechaniu na nieaktywny przycisk pojawia się podpowiedź
z informacją, czego brakuje.

- Podgląd metryczek to czysty HTML/CSS w układzie oryginalnego formularza
  (bez grafiki w tle) — dwie metryczki na stronę A4.
- Pole **Klub** jest wyszukiwarką klubów z listy
  `public/metryczka/data/kluby.json` (po nazwie skróconej i pełnej).
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

## Pull requesty

Pull request z brancha w tym repozytorium uruchamia GitHub Actions
i tworzy podgląd strony dla tego PR-a. Po zamknięciu PR-a workflow usuwa
środowisko podglądowe.

Pull request z forka **nie utworzy strony podglądowej** — forki nie mają
dostępu do sekretów repozytorium, więc wdrożenie się nie wykona. Aby
zobaczyć zmiany z forka na żywo, maintainer musi przenieść je na branch
w tym repozytorium. Dzięki temu podglądy nie powstają automatycznie dla
każdego zgłoszenia i nie zużywają zasobów Azure przez boty.

Pull request wysyła mail do mnie więc zauważę :-)

## Rozwój

Strona nie wymaga Node.js ani procesu budowania. Do lokalnego podglądu
wystarczy dowolny serwer HTTP uruchomiony w katalogu `public/`, np.:

```bash
python3 -m http.server 8000 --directory public
```
