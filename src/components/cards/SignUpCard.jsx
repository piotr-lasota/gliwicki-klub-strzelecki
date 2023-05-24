import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CardActionArea } from 'gatsby-theme-material-ui';
import React from 'react';

export default function SignUpCard() {
  return (
    <CardActionArea to="https://www.survio.com/survey/d/S9C9E6Q8R7H5H5J5K">
      <Card sx={{ background: (theme) => theme.palette.success.light }}>
        <CardHeader
          title="Rekrutacja"
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Typography align="left">
            Szanowni kandydaci, ogłaszamy{' '}
            <b>okno rekrutacyjne otwarte do 30.06.2023</b>.
            <br />
            Serdecznie zapraszamy do wzięcia udziału w procesie umożliwiającym
            dołączenie do <b>K.S. Gliwicki Klub Strzelecki</b>.
            <br />
            Życzymy powodzenia w rekrutacji!
            <br />
            <br />
            kliknij, by wypełnić formularz
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}
