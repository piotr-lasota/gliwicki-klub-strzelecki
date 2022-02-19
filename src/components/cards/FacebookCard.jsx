import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CardActionArea } from 'gatsby-theme-material-ui';

function FacebookCard() {
  return (
    <Card
      sx={{
        background: 'rgb(45, 136, 255)',
        color: 'white'
      }}
    >
      <CardActionArea to="https://www.facebook.com/GliwickiKlubStrzelecki">
        <CardHeader title="Facebook" />
        <CardContent>
          <Typography>@GliwickiKlubStrzelecki</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default FacebookCard;
