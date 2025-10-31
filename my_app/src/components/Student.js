import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function Student() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '50px auto' };
  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <form>
          <div style={{ margin: 10 }}>
            <TextField id="outlined-nom" label="Nom" variant="outlined" fullWidth />
          </div>
          <div style={{ margin: 10 }}>
            <TextField id="outlined-prenom" label="Prénom" variant="outlined" fullWidth />
          </div>
          <Button variant="contained">Ajouter</Button>
        </form>
      </Paper>
    </Container>
  );
}
