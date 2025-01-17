import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const UserSelection = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);  // List of users
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('id, full_name');
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
      <label htmlFor="userSelect">Select User:</label>
      <select
        id="userSelect"
        onChange={(e) => onUserSelect(e.target.value)}
        style={{ padding: '10px', margin: '10px 0' }}
      >
        <option value="">--Select User--</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.full_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelection;
