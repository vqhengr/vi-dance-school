import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient.js';  // Assuming you have supabaseClient.js file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the users data from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users data along with their role (joining roles table)
        const { data, error } = await supabase
          .from('users')
          .select('*, roles(name)')  // Join the roles table to get the role name
          .order('created_at', { ascending: false });  // Optionally order by creation date

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
            <p><strong>Full Name:</strong> {user.full_name || 'N/A'}</p>  {/* Display the full name */}
            <p><strong>Role:</strong> {user.roles?.name || 'N/A'}</p>  {/* Display the user's role name */}
            <p><strong>Created At:</strong> {user.created_at}</p>
            <p><strong>Last Login:</strong> {user.last_sign_in_at}</p>
            <p><strong>Status:</strong> {user.status || 'Active'}</p>  {/* Display user's status */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
