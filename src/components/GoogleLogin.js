import React, { useState } from 'react';
 
import supabase from '../services/supabaseClient.js';

const GoogleLogin = () => {
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during Google login:', error.message);
    } else {
      setUser(user);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      {user && (
        <div>
          <h2>Welcome, {user.user_metadata.full_name}</h2>
          <img src={user.user_metadata.avatar_url} alt="Profile" />
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
