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
```

## Aplikacja metryczki

Dostępna pod `/metryczka/`. Dane zawodnika i zawodów wpisuje się raz,
a checkboxami wybiera od 1 do 4 konkurencji: BIG PISTOL (BP),
LITTLE PISTOL (LP), SMALL RIFLE (SR) i SHOTGUN.

- **Pobierz do druku — A4** generuje dwie metryczki na każdej stronie A4.
  Przy trzech metryczkach trzecia jest w górnej połowie drugiej strony.
  Zapisany PDF należy drukować z programu do PDF: A4, pionowo,
  jedna strona na arkusz, jednostronnie.
- **Pobierz metryczki — A5** zachowuje osobne strony z edytowalnymi polami.
- Wydruk zachowuje oryginalny wzór PDF. Wyniki, stanowisko, zmiana
  i podpisy pozostają puste do uzupełnienia na zawodach.
- Aplikacja nie wywołuje automatycznie okna drukowania przeglądarki.

Dane są zapisywane wyłącznie lokalnie w przeglądarce (`localStorage`).
Na wspólnym komputerze po pracy należy użyć przycisku „Wyczyść”
i usunąć pobrane PDF. Wypełnienie metryczki nie jest zgłoszeniem na zawody.

Nowa wersja przenosi dane wspólne z lokalnego zestawu poprzedniej wersji;
konkurencje trzeba zaznaczyć ponownie. Stare wyniki nie są przenoszone.
Import JSON obsługuje eksporty nowej wersji z checkboxami.
Przycisk „Wyczyść” usuwa również wcześniejsze lokalne zapisy aplikacji.

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
