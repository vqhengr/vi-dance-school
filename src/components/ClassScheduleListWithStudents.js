import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const ClassScheduleListWithStudents = () => {
  const [classSchedules, setClassSchedules] = useState([]);  // List of class schedules
  const [loading, setLoading] = useState(true);  // Loading state for class schedules
  const [error, setError] = useState(null);  // Error state for any issues

  // Fetch class schedules and their enrolled students
  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        // Fetch class schedules from the class_schedule table
        const { data: classData, error: classError } = await supabase
          .from('class_schedule')
          .select('*');  // Select all columns for class schedules

        if (classError) throw classError;

        // For each class schedule, fetch the students enrolled in it and the class name
        const enrichedClassSchedules = await Promise.all(
          classData.map(async (schedule) => {
            // Fetch the class name based on class_id from the classes table
            const { data: classData, error: classError } = await supabase
              .from('classes')
              .select('name')
              .eq('id', schedule.class_id)
              .single(); // Fetch the class name

            if (classError) {
              console.error('Error fetching class name:', classError);
              return null; // Skip this schedule if class data fetch fails
            }

            // Fetch students enrolled in this class schedule
            const { data: enrolledStudents, error: studentError } = await supabase
              .from('enrollments')
              .select('user_id') // Only fetch user_id
              .eq('class_schedule_id', schedule.id) // Filter by class_schedule_id
              .eq('enrollment_status', 'active'); // Only active enrollments

            if (studentError) throw studentError;

            // Fetch the details (full_name) of the enrolled students
            const studentsDetails = await Promise.all(
              enrolledStudents.map(async (enrollment) => {
                const { data: userData, error: userError } = await supabase
                  .from('users')
                  .select('full_name')
                  .eq('user_id', enrollment.user_id)
                  .single(); // Fetch user's full name

                if (userError) {
                  console.error('Error fetching user details:', userError);
                  return null; // Skip this user if error occurs
                }

                return userData.full_name; // Return the full_name
              })
            );

            // Add class name and students' full names to class schedule
            return {
              ...schedule,
              class_name: classData.name, // Add class name
              enrolledStudents: studentsDetails.filter(student => student !== null), // Filter out nulls (errors)
            };
          })
        );

        setClassSchedules(enrichedClassSchedules);
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
      <h1>Class Schedules and Enrolled Students</h1>
      {classSchedules.length > 0 ? (
        classSchedules.map((schedule) => (
          <div key={schedule.id}>
            <h2>Class Schedule ID: {schedule.id}</h2>
            <p><strong>Class Name:</strong> {schedule.class_name}</p> {/* Display the class name */}
            <p><strong>Day:</strong> {schedule.day_of_week}</p>
            <p><strong>Time:</strong> {schedule.start_time}</p>
            <p><strong>Location:</strong> {schedule.location}</p>

            <h3>Enrolled Students:</h3>
            {schedule.enrolledStudents.length > 0 ? (
              <ul>
                {schedule.enrolledStudents.map((student, index) => (
                  <li key={index}>
                    <p><strong>{student}</strong></p> {/* Display the student's full name */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled in this class.</p>
            )}
          </div>
        ))
      ) : (
        <p>No class schedules available.</p>
      )}
    </div>
  );
};

export default ClassScheduleListWithStudents;
