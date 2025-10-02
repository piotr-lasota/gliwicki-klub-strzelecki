import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CardActionArea } from 'gatsby-theme-material-ui';
import React from 'react';

export default function SignUpCard() {
  return (
    <CardActionArea to="https://www.survio.com/survey/d/O3D5L3G9J6Q6R2E9C">
      <Card sx={{ background: (theme) => theme.palette.success.light }}>
        <CardHeader
          title="Rekrutacja"
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Typography align="left">
            Zapraszamy do Klubu Strzeleckiego: Wypełnij Ankietę i Dołącz do Nas!
            <br />
            Szukasz miejsca, gdzie Twoja pasja do strzelectwa spotka się z
            profesjonalizmem? Jeśli cenisz sobie bezpieczeństwo, precyzję i
            dobrą atmosferę, zapraszamy do naszego Klubu.
            <br />
            Ankieta rekrutacyjna to najłatwiejszy sposób, by rozpocząć swoją
            drogę do członkostwa.
            <br />
            <br />
            Co Zyskujesz, Dołączając do Nas?
            <ul>
              <li>
                Bezpieczne Środowisko: Umożliwiamy bezpieczne i odpowiedzialne
                uprawianie sportu strzeleckiego pod okiem doświadczonych osób.
              </li>
              <li>
                Rozwój Umiejętności: Zapewniamy dostęp do regularnych treningów
                i szkoleniowców, którzy pomogą Ci podnieść swoje kwalifikacje.
              </li>
              <li>
                Wspólna Pasja: Stajesz się częścią zorganizowanej społeczności,
                która łączy miłośników strzelectwa – od początkujących, po
                zaawansowanych.
              </li>
            </ul>
            Wypełnij Ankietę – Zrób Pierwszy Krok! Ten krótki formularz pomoże
            nam poznać Twoje podstawowe doświadczenie i motywację. Nie musisz
            być zawodowcem! Szukamy osób odpowiedzialnych, chętnych do nauki i
            gotowych aktywnie uczestniczyć w życiu Klubu.
            <br />
            <br />
            Jak Wygląda Proces Rekrutacji?
            <ol>
              <li>Wypełnienie Ankiety: Uzupełnij poniższy formularz online.</li>
              <li>
                Analiza Zgłoszenia: Zarząd Klubu zapozna się z Twoimi
                odpowiedziami.
              </li>
              <li>
                Spotkanie: Skontaktujemy się z Tobą, aby omówić szczegóły i
                zaprosić Cię na spotkanie zapoznawcze na strzelnicy.
              </li>
            </ol>
            Chcesz zacząć swoją przygodę ze strzelectwem lub rozwijać swoje
            umiejętności? Czekamy przez dwa tygodnie na Twoje zgłoszenie!
            <br />
            <br />
            ➡️Kliknij, aby wypełnić ankietę⬅️
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}
