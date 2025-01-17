import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient.js';  // Assuming you have a supabaseClient.js file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the users data from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')  // Referencing the 'users' table from Supabase's auth system
          .select('*');    // Select all user data

        if (error) throw error;

        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Authenticated Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h2>{user.email}</h2>  {/* Display the user's email */}
            <p><strong>Full Name:</strong> {user.user_metadata.full_name || 'N/A'}</p>
            <p><strong>Created At:</strong> {user.created_at}</p>
            <p><strong>Last Login:</strong> {user.last_sign_in_at}</p>
            <p><strong>Status:</strong> {user.disabled ? 'Disabled' : 'Active'}</p> {/* Check if the user is disabled */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
