import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient.js';  // Assuming you have a supabaseClient.js file

const ClassScheduleList = () => {
  const [classSchedules, setClassSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the class schedule data from Supabase
  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        // Fetch class schedules with class names from the 'classes' table
        const { data, error } = await supabase
          .from('class_schedule')
          .select('id, class_id, class_date, day_of_week, start_time, duration, location, status, classes(name)')  // Join 'classes' table to fetch class name
          .order('class_date');  // Optionally, order by class_date

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
      <h1>Class Schedules</h1>
      <ul>
        {classSchedules.map((schedule) => (
          <li key={schedule.id}>
            <h2>{schedule.classes.name}</h2> {/* Show the class name */}
            <p><strong>Class Date:</strong> {schedule.class_date}</p> {/* Show the class date */}
            <p><strong>Day:</strong> {schedule.day_of_week}</p>
            <p><strong>Start Time:</strong> {schedule.start_time}</p>
            <p><strong>Duration:</strong> {schedule.duration}</p>
            <p><strong>Location:</strong> {schedule.location}</p>
            <p><strong>Status:</strong> {schedule.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassScheduleList;
