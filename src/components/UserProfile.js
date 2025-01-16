import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to redirect to SignIn page
import supabase from '../services/supabaseClient'; // Import your supabase client

const UserProfile = ({ user }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Sign out function
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      navigate('/'); // Redirect to the home/sign-in page
    }
  };

  return (
    <div>
      <h2>Welcome, {user.user_metadata.full_name}</h2>
      <img src={user.user_metadata.avatar_url} alt="Profile" />
      <p>Email: {user.email}</p>

      {/* Sign out button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default UserProfile;
