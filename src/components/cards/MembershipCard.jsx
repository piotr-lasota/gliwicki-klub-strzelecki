import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CardActionArea } from 'gatsby-theme-material-ui';
import { navigate } from 'gatsby';

function FacebookCard() {
  return (
    <Card>
      <CardActionArea onClick={() => navigate('/oferta-gks')}>
        <CardHeader title="Oferta i warunki" />
        <CardContent>
          <Typography>Kryte osie 25m i 50m, szeroki wybór broni,</Typography>
          <Typography>sklep z bronią i amunicją na miejscu,</Typography>
          <Typography>przyjazna kadra instruktorska,</Typography>
          <Typography>współzadodnictwo sportowe,</Typography>
          <Typography mt={3}>kliknij, by poznać szczegóły</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default FacebookCard;
