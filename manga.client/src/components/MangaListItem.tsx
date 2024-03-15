import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface MangaListItemProps {
  imageUrl: string;
  title: string;
  description: string;
}

const MangaListItem: React.FC<MangaListItemProps> = ({ imageUrl, title, description }) => {
  return (
    <Card sx={{ display: 'flex', margin: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={imageUrl}
        alt={`Cover of ${title}`}
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h5">
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MangaListItem;
