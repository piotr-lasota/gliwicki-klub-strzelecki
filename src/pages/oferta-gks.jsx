import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { StaticImage } from 'gatsby-plugin-image';
import { Button } from 'gatsby-theme-material-ui';
import SEO from '../components/SeoHelmet';

function SummaryCard({ title, children }) {
  return (
    <Card
      sx={{
        minHeight: 200,
        background: (theme) => theme.palette.primary.light
      }}
    >
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

function SummaryItem() {
  return (
    <Grid item xs={12}>
      <Card sx={{ p: 1 }}>
        <CardHeader
          title="Podsumowanie warunków"
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Warunki członkostwa">
                <Typography>Ukończone 21 lat</Typography>
                <Typography>Niekaralność</Typography>
                <Typography>Deklaracja</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Treningi">
                <Typography>Wtorki, środy, czwartki</Typography>
                <Typography>18:00-21:00</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Atuty">
                <Typography>Licencja PZSS</Typography>
                <Typography>Dwie kryte strzelnice</Typography>
                <Typography>Broń klubowa</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard title="Składki">
                <Typography>Wpisowe: 300zł</Typography>
                <Typography>Składka kwartalna: 200zł</Typography>
              </SummaryCard>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

function FirearmsLicenseItem() {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="Pozwolenie na broń"
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography>
                Wszyscy spełniający warunki Ustawy o Broni i Amunicji otrzymują
                w Polsce pozwolenie na broń.
              </Typography>

              <Typography sx={{ mt: 3 }}>Te warunki to:</Typography>
              <Typography>
                <ul>
                  <li>przynależność do klubu z licencją PZSS</li>
                  <li>zdanie egazminu na patent strzelecki</li>
                  <li>otrzymanie licencji zawodniczej</li>
                  <li>badania psychologiczne i starty w zawodach</li>
                </ul>
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent
                  sx={{
                    background: (theme) => theme.palette.success.light
                  }}
                >
                  <Typography>
                    Wszyscy, którzy spełniają warunki Ustawy otrzymują
                    pozwolenie na broń obligatoryjnie. Warunek podstawowy to
                    członkostwo w Klubie.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Returns() {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="Co otrzymasz za 67zł miesięcznie?"
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Typography>
                <ul>
                  <li>kryte osie strzeleckie 25m</li>
                  <li>kryte osie strzeleckie 50m</li>
                  <li>opieka instruktorska</li>
                  <li>broń klubowa</li>
                  <li>stanowiska strzeleckie</li>
                  <li>tarcze</li>
                  <li>tarczociągi</li>
                  <li>system treningowy Steel Alive</li>
                  <li>napoje gazowane</li>
                  <li>kawa</li>
                </ul>
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography>
                    Masz wiatrówkę, ASG, czarnoprochowca- nie ma problemu,
                    możesz też strzelać z tej broni na naszej strzelnicy.
                    Amunicja do broni palnej w dobrej cenie płatna wg. zużycia.
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Jaka to dobra cena? Dla członków , tak jak w sklepie. Dla
                    posiadaczy pozwolenia jeszcze taniej.
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Do tego 2 imprezy integracyjne. Pierwsza wiosenna strzelecka
                    w plenerze- na koszt firmy, płacisz tylko za dodatkową
                    amunicję, podstawowy zestaw broni i amunicji oraz konsumpcja
                    w pakiecie. Druga na koniec roku, bez strzelaniny.
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Organizujemy Gliwicki Turniej Strzelecki- 3 rundy.
                    Zaliczenie 2 rund pozwala uzyskać wymagane regulaminami PZSS
                    starty do utrzymania licencji zawodniczej, co jest warunkiem
                    koniecznym utrzymania pozwolenia na broń.
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Do tego wszystko w towarzystwie pasjonatów broni palnej,
                    takich jak Ty. Wszystkie sprawy związane z bronią i
                    strzelectwem załatwisz na miejscu w Klubie, do zakupu
                    własnej broni i amunicji włącznie.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Limitations() {
  return (
    <Grid item xs={12}>
      <Card sx={{ background: (theme) => theme.palette.warning.light }}>
        <CardHeader title="Uwaga" titleTypographyProps={{ align: 'center' }} />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography align="center" variant="h6">
              Gliwicki Klub Strzelecki nie prowadzi indywidualnych strzelań
              komercyjnych. Dostęp do strzelnicy i broni jest możliwy wyłącznie
              dla członków klubu lub grup zorganizowanych po wcześniejszym
              uzgodnieniu.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function Offer() {
  return (
    <Container maxWidth="lg">
      <SEO title="Oferta" />
      <Box my={4}>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid item xs={12}>
            <Container maxWidth="xs">
              <Button to="/" sx={{ p: 0, m: 0 }}>
                <StaticImage
                  src="../images/logo-gks-black.png"
                  alt="Logo klubu"
                />
              </Button>
            </Container>
          </Grid>

          <SummaryItem />
          <FirearmsLicenseItem />
          <Returns />
          <Limitations />
        </Grid>
      </Box>
    </Container>
  );
}
