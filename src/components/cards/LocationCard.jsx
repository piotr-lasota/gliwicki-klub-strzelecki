import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography
} from '@mui/material';

function LocationCard() {
  return (
    <Card>
      <CardHeader title="Lokalizacja" />
      <CardMedia title="Location">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d589.8854839759094!2d18.653047829234595!3d50.29746185541623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDE3JzUwLjkiTiAxOMKwMzknMTIuOSJF!5e1!3m2!1sen!2spl!4v1629141206836!5m2!1sen!2spl"
          width="100%"
          height="200"
          title="Mapa Google"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </CardMedia>
      <CardContent>
        <Typography>ul. Kozielska 1A</Typography>
        <Typography>44-100 Gliwice</Typography>
      </CardContent>
    </Card>
  );
}

export default LocationCard;
