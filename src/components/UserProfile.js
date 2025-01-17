import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to redirect to SignIn page
import supabase from '../services/supabaseClient'; // Import your supabase client

const UserProfile = ({ user }) => {
  const [userDetails, setUserDetails] = useState(null); // State to store user data from 'users' table
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Fetch user details from the 'users' table
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch the user details from the 'users' table based on the user_id
        const { data, error } = await supabase
          .from('users')
          .select('*, roles(name)')  // Join roles to get the role name
          .eq('user_id', user.id)
          .single(); // Get single user data

        if (error) {
          console.error('Error fetching user details:', error);
        } else {
          setUserDetails(data); // Set the user data to state
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
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

  if (!userDetails) {
    return <p>Loading user details...</p>; // Show loading message until user details are fetched
  }

  return (
    <div>
      <h2>Welcome, {userDetails.full_name}</h2>
      <img src={userDetails.profile_picture_url || 'https://via.placeholder.com/150'} alt="Profile" />
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {userDetails.roles?.name || 'N/A'}</p> {/* Display role name from roles table */}
      <p><strong>Status:</strong> {userDetails.status || 'Active'}</p>

      {/* Sign out button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default UserProfile;
