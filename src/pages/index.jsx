import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { StaticImage } from 'gatsby-plugin-image';
import Copyright from '../components/Copyright';
import FacebookCard from '../components/cards/FacebookCard';
import SEO from '../components/SeoHelmet';
import LocationCard from '../components/cards/LocationCard';
import OpeningHoursCard from '../components/cards/OpeningHoursCard';

export default function Index() {
  return (
    <Container maxWidth="xs">
      <SEO noTitleTemplate />
      <Box mt={4}>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid item xs={12}>
            <StaticImage src="../images/logo-gks-black.png" alt="Logo klubu" />
          </Grid>
          <Grid item xs={12}>
            <OpeningHoursCard />
          </Grid>
          <Grid item xs={12}>
            <LocationCard />
          </Grid>
          <Grid item xs={12}>
            <FacebookCard />
          </Grid>
          <Grid item xs={12}>
            <Copyright />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
