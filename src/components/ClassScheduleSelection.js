import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const ClassScheduleSelection = ({ onClassSelect }) => {
  const [classSchedules, setClassSchedules] = useState([]);  // List of class schedules
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch class schedules
  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        const { data, error } = await supabase.from('class_schedule').select('id, class_id, day_of_week, start_time');
        if (error) throw error;
        setClassSchedules(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassSchedules();
  }, []);

  if (loading) return <p>Loading class schedules...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <label htmlFor="classSelect">Select Class Schedule:</label>
      <select
        id="classSelect"
        onChange={(e) => onClassSelect(e.target.value)}
        style={{ padding: '10px', margin: '10px 0' }}
      >
        <option value="">--Select Class Schedule--</option>
        {classSchedules.map((schedule) => (
          <option key={schedule.id} value={schedule.id}>
            {`Class ID: ${schedule.class_id}, Day: ${schedule.day_of_week}, Time: ${schedule.start_time}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassScheduleSelection;
