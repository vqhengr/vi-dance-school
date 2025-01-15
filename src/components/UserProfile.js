import React from 'react';
import { Container, Typography } from '@mui/material';

const UserProfile = ({ user }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="body1" align="center">
        Email: {user.email}
      </Typography>
    </Container>
  );
};

export default UserProfile;
