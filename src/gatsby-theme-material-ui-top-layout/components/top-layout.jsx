/* eslint-disable import/no-extraneous-dependencies, react/prop-types */
import React from 'react';
import ThemeTopLayout from 'gatsby-theme-material-ui-top-layout/src/components/top-layout';
import { Box } from '@mui/material';

export default function TopLayout({ children, theme }) {
  return (
    <ThemeTopLayout theme={theme}>
      <Box sx={{ background: '#efefef' }}>{children}</Box>
    </ThemeTopLayout>
  );
}
