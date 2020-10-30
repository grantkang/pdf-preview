import React, { useState } from 'react';
import { Typography, Container, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import AppContext from '../lib/context';
import UploadForm from './upload-form';
import DocuCard from './docu-card';

const useStyles = makeStyles({
  divider: {
    margin: '20px 0'
  }
});

export default function App(props) {
  const [documents, setDocuments] = useState([]);
  const classes = useStyles;

  const uploadFile = data => {
    axios.post('/api/upload',
      data,
      { headers: { 'Content-type': 'multipart/form-data' } })
      .then(response => {
        const document = response.data;
        const newState = documents.slice();
        newState.push(document);
        setDocuments(newState);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteFile = file => {
    axios.delete(`/api/delete/${file}`)
      .then(response => {
        const toBeDeleted = response.data;
        const newState = documents.filter(document => toBeDeleted.filename !== document.filename);
        setDocuments(newState);
      });
  };

  const contextValue = {
    uploadFile,
    deleteFile
  };

  const cards = documents.map(document => (
    <Grid item md={3} key={document.filename}>
      <DocuCard documentInfo={document} />
    </Grid>
  ));

  return (
    <AppContext.Provider value={contextValue}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center">PDF Preview</Typography>
        <UploadForm />
        <Divider className={classes.divider} />
        <Typography variant="h3" align="center">PDF Files</Typography>
        <Grid container spacing={2}>
          {cards}
        </Grid>
      </Container>
    </AppContext.Provider>
  );
}
