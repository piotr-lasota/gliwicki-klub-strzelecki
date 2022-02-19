import React from 'react';
import {Box, Container, Typography} from "@mui/material";
import SEO from "../components/SeoHelmet";

const NotFound = () => (
  <Container maxWidth="xs">
    <SEO title="Strona nie istnieje" description="Strona nie istnieje"/>
    <Box mt={4}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Ta strona nie istnieje
      </Typography>
    </Box>
  </Container>
);

export default NotFound;