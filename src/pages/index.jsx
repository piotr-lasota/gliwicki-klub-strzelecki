import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { StaticImage } from 'gatsby-plugin-image';
import Copyright from '../components/Copyright';
import FacebookCard from '../components/cards/FacebookCard';
import SEO from '../components/SeoHelmet';
import LocationCard from '../components/cards/LocationCard';
import OpeningHoursCard from '../components/cards/OpeningHoursCard';
import MembershipCard from '../components/cards/MembershipCard';
import ChildProtectionCard from '../components/cards/ChildProtectionCard';
// import SignUpCard from '../components/cards/SignUpCard';

export default function Index() {
  return (
    <Container maxWidth="md">
      <SEO noTitleTemplate />
      <Box mt={4}>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <StaticImage src="../images/logo-gks-black.png" alt="Logo klubu" />
          </Grid>
          {/*<Grid size={{ xs: 12 }}>*/}
          {/*  <SignUpCard />*/}
          {/*</Grid>*/}
          <Grid size={{ xs: 12 }}>
            <MembershipCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <OpeningHoursCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LocationCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FacebookCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ChildProtectionCard />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Copyright />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
