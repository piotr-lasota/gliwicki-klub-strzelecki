import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CardActionArea } from 'gatsby-theme-material-ui';

function ChildProtectionCard() {
  return (
    <Card>
      <CardActionArea to="https://gliwickiklubstrzelecki.blob.core.windows.net/documents/2026.02.17%20Standard%20Ochrony%20Ma%C5%82oletnich.pdf">
        <CardHeader title="Standardy ochrony małoletnich" />
        <CardContent>
          <Typography>
            Kliknij tutaj aby pobrać obowiązujące standardy ochrony małoletnich
            z dn. 17.02.2026
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ChildProtectionCard;
