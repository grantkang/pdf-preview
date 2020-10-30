import React from 'react';
import { Input, Button, Box } from '@material-ui/core';
import AppContext from '../lib/context';

export default function UploadForm(props) {
  const context = React.useContext(AppContext);

  const handleSubmit = e => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      context.uploadFile(data);
    }
    e.target.reset();
  };

  return (
    <React.Fragment>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="center">
          <Input name="file" type="file" inputProps={{ accept: 'application/pdf' }} />
          <Button color="primary" variant="contained" type="submit">Upload File</Button>
        </Box>
      </form>
    </React.Fragment>
  );
}
