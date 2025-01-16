import React from 'react';
import supabase from '../services/supabaseClient'; // Import your supabase client

const SignIn = ({ onSignIn }) => {
  const handleSignIn = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during sign-in:', error);
    } else {
      onSignIn(user); // Pass user data back to App.js
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
