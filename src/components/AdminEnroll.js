import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const AdminEnroll = () => {
  const [users, setUsers] = useState([]);  // List of users
  const [classSchedules, setClassSchedules] = useState([]);  // List of available class schedules
  const [selectedUser, setSelectedUser] = useState(null);  // Selected user (UUID)
  const [selectedClassSchedule, setSelectedClassSchedule] = useState(null);  // Selected class schedule ID
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [successMessage, setSuccessMessage] = useState(''); // Success message for enrollment

  useEffect(() => {
    // Fetch users (admins would have permissions to view all users)
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('user_id, full_name');
        if (error) throw error; // Handle error
        setUsers(data); // Update users state
        console.log('Fetched users:', data); // Debugging log
      } catch (error) {
        setError(`Error fetching users: ${error.message}`);
        console.error('Error fetching users:', error);
      }
    };

    // Fetch available class schedules
    const fetchClassSchedules = async () => {
      try {
        const { data, error } = await supabase.from('class_schedule').select('id, class_id, day_of_week, start_time, location');
        if (error) throw error; // Handle error
        setClassSchedules(data); // Update class schedules state
        console.log('Fetched class schedules:', data); // Debugging log
      } catch (error) {
        setError(`Error fetching class schedules: ${error.message}`);
        console.error('Error fetching class schedules:', error);
      }
    };

    fetchUsers();
    fetchClassSchedules();
  }, []);

  // Handle Sign Up action
  const handleSignUp = async () => {
    if (!selectedUser || !selectedClassSchedule) {
      setError('Please select both a user and a class schedule.');
      return;
    }

    console.log('Selected User:', selectedUser);  // Debugging log
    console.log('Selected Class Schedule:', selectedClassSchedule); // Debugging log

    try {
      const { error } = await supabase.from('enrollments').insert([
        {
          user_id: selectedUser,  // This should be user.user_id (UUID)
          class_schedule_id: selectedClassSchedule,  // Use class_schedule.id
          enrollment_status: 'active',
        },
      ]);

      if (error) throw error;

      setSuccessMessage('User successfully enrolled!');
      setError(null);
    } catch (error) {
      setError(`Error enrolling user: ${error.message}`);
      setSuccessMessage('');
    }
  };

  // After data is fetched, stop loading
  useEffect(() => {
    if (users.length > 0 && classSchedules.length > 0) {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [users, classSchedules]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Class Enrollment</h1>
      <div>
        <label htmlFor="userSelect">Select User:</label>
        <select
          id="userSelect"
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser || ""}
          style={{ padding: '10px', margin: '10px 0' }}
        >
          <option value="">--Select User--</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="classSelect">Select Class Schedule:</label>
        <select
          id="classSelect"
          onChange={(e) => setSelectedClassSchedule(e.target.value)}
          value={selectedClassSchedule || ""}
          style={{ padding: '10px', margin: '10px 0' }}
        >
          <option value="">--Select Class Schedule--</option>
          {classSchedules.map((classSchedule) => (
            <option key={classSchedule.id} value={classSchedule.id}>
              Class ID: {classSchedule.class_id} - {classSchedule.day_of_week} at {classSchedule.start_time} ({classSchedule.location})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSignUp}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Sign Up User
      </button>

      {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
    </div>
  );
};

export default AdminEnroll;
