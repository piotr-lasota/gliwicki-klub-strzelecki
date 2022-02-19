import React from 'react';
import { Typography } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Gliwicki Klub Strzelecki © ${new Date().getFullYear()}.`}
    </Typography>
  );
}

export default Copyright;
