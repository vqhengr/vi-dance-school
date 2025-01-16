import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function SignIn({ onSignIn }) {
  // Function to handle sign-in with Google
  const handleSignInGoogle = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during Google sign-in:', error);
    } else {
      onSignIn(user); // Pass user data back to App.js
    }
  };

  // Function to handle sign-in with Facebook
  const handleSignInFacebook = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });

    if (error) {
      console.error('Error during Facebook sign-in:', error);
    } else {
      onSignIn(user); // Pass user data back to App.js
    }
  };

  return (
    <>
      <CssBaseline />
      <SignInContainer direction="column">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
            Sign in
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSignInGoogle}
              startIcon={<GoogleIcon />}
              sx={{ textTransform: 'none' }}
            >
              Sign in with Google
            </Button>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={handleSignInFacebook}
              startIcon={<FacebookIcon />}
              sx={{ textTransform: 'none' }}
            >
              Sign in with Facebook
            </Button> */}
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}
