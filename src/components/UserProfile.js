import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to redirect to SignIn page
import supabase from '../services/supabaseClient'; // Import your supabase client

const UserProfile = ({ user }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // User creation logic (in UserProfile.js)
  useEffect(() => {
    const createUserRecord = async () => {
      try {
        // Check if the user exists in the 'users' table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single(); // Get the user data if exists

        if (error && error.code === 'PGRST116') {
          // User does not exist, create a new record in the 'users' table
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                user_id: user.id,
                full_name: user.user_metadata.full_name,
                phone_number: user.user_metadata.phone_number || null,
                address: null, // Optionally, you can add more fields
                profile_picture_url: user.user_metadata.avatar_url,
                user_role: 'student', // Default to 'student'
                status: 'active', // Default to active status
              },
            ]);

          if (createError) {
            console.error('Error creating user record:', createError);
          } else {
            console.log('User record created successfully');
          }
        }
      } catch (error) {
        console.error('Error checking user record:', error);
      }
    };

    createUserRecord();
  }, [user]);

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
