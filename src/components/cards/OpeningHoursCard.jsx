import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

function OpeningHoursCard() {
  return (
    <Card>
      <CardHeader title="Godziny otwarcia" />
      <CardContent>
        <Typography>wtorki, środy, czwartki</Typography>
        <Typography>od 18:00 do 21:00</Typography>
      </CardContent>
    </Card>
  );
}

export default OpeningHoursCard;
