import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  content: {
    backgroundColor: theme.palette.main
  }
}));

export default function DocuCard({ documentInfo }) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={'/images/' + documentInfo.thumbnail}
          title={documentInfo.originalName}
        />
      </CardActionArea>
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2">
          {documentInfo.originalName}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" variant="contained" onClick={() => window.open('/documents/' + documentInfo.filename, '_blank')}>
          Download
        </Button>
      </CardActions>
    </Card>
  );
}
