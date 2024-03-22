import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';
/*
interface MangaListItemProps {
  imageUrl: string;
  title: string;
  numberOfBooks?: number;
  sellList: string[];
  wantList: string[];
}

const MangaListItem: React.FC<MangaListItemProps> = ({ imageUrl, title, numberOfBooks, wantList }) => {
  return (
    <Card sx={{ display: 'flex', margin: 2, alignItems: 'center', padding: 1 }}>
      <CardMedia
        component="img"
        sx={{ width: 151, height: 151 }}
        image={imageUrl}
        alt={`Cover of ${title}`}
      />
      <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Typography component="div" variant="h5">
          {title} 全巻 {numberOfBooks}巻
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            欲しい
          </Typography>
          {wantList.map((item, index) => (
            <Chip key={index} label={item} sx={{ mb: 0.5 }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MangaListItem;
*/

interface MangaListItemProps {
  sellImage: string;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: { title: string; isOwned: boolean }[];
}

const MangaListItem: React.FC<MangaListItemProps> = ({ sellImage, sellTitle, numberOfBooks, wishTitles }) => {
  return (
    <Card sx={{ display: 'flex', margin: 2, alignItems: 'center', padding: 1 }}>
      <CardMedia
        component="img"
        sx={{ width: 151, height: 151 }}
        image={sellImage}
        alt={`Cover of ${sellTitle}`}
      />
      <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Typography component="div" variant="h5">
          {sellTitle} 全巻 {numberOfBooks}巻
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            欲しい
          </Typography>
          {wishTitles.map((item, index) => (
            <Chip key={index} label={item.title} sx={{ mb: 0.5 }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default MangaListItem;
