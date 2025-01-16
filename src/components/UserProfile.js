import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user.user_metadata.full_name}</h2>
      <img src={user.user_metadata.avatar_url} alt="Profile" />
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
