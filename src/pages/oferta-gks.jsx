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
    <Card sx={{ minHeight: 200 }}>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default function Offer() {
  return (
    <Container maxWidth="lg">
      <SEO noTitleTemplate />
      <Box mt={4}>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid item xs={12}>
            <Container maxWidth="xs">
              <Button to="/">
                <StaticImage
                  src="../images/logo-gks-black.png"
                  alt="Logo klubu"
                />
              </Button>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 1 }}>
              <CardHeader title="Podsumowanie warunków" />
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
                      <Typography>Wpisowe: 300 PLN</Typography>
                      <Typography>Składka kwartalna: 200 PLN</Typography>
                    </SummaryCard>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
