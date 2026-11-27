'use strict';

/*
 * Wspólne źródło prawdy dla układu metryczki. Wartości w punktach są tożsame
 * z jednostkami pt używanymi w CSS, więc ten sam plik obsługuje podgląd HTML
 * i rysowanie wektorowe w PDF.
 */
window.LAYOUT = {
  // procentowe szerokości kolumn w nagłówku meta
  META_COLS: [11.6, 12.7, 8.4, 6, 11, 8.4, 15.8, 26.1],
  // szerokości wierszy (w punktach — tożsame z jednostkami CSS pt)
  ROW_W: 536.4,
  LABEL_W: 85.5,
  NAZWISKO_COMB_W: 450.9,
  IMIE_COMB_W: 334,
  ROK_LABEL_W: 50.1,
  ROK_COMB_W: 66.8,
  KLUB_VALUE_W: 200.4,
  SIEDZIBA_LABEL_W: 50.1,
  // tabela wyników: etykieta + 10 kolumn + suma + uwagi
  SCORE_COLS: [13.2, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 6.6, 12.5, 6.5],
  // teksty
  PHONE: '+48 602 293 201',
  DECL_TEXT: 'Oświadczam, że stan mojego zdrowia, w dniu dzisiejszym pozwala na udział w zawodach strzeleckich oraz, że zapoznałem się z regulaminem strzelnicy i przepisami bezpieczeństwa.'
};
