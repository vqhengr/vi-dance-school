import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);  // List of enrollments
  const [loading, setLoading] = useState(true);  // Loading state for enrollments
  const [error, setError] = useState(null);  // Error state for any issues

  // Fetch all enrollments and user full names
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // Fetch enrollments from the enrollments table
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('class_schedule_id, user_id');  // Only fetch class_schedule_id and user_id

        if (enrollmentError) throw enrollmentError;

        // For each enrollment, fetch the class name and user full name
        const enrichedEnrollments = await Promise.all(
          enrollmentData.map(async (enrollment) => {
            // Fetch class name based on class_schedule_id
            const { data: classData, error: classError } = await supabase
              .from('class_schedule')
              .select('class_id')
              .eq('id', enrollment.class_schedule_id)
              .single(); // Get the class_id for the class schedule

            if (classError) {
              console.error('Error fetching class schedule:', classError);
              return null; // Skip this enrollment if class data fetch fails
            }

            // Fetch the class name from the classes table based on class_id
            const { data: classNameData, error: classNameError } = await supabase
              .from('classes')
              .select('name')
              .eq('id', classData.class_id)
              .single(); // Fetch the class name using class_id

            if (classNameError) {
              console.error('Error fetching class name:', classNameError);
              return null; // Skip this enrollment if class name fetch fails
            }

            // Fetch the user's full name from the users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('full_name')
              .eq('user_id', enrollment.user_id)
              .single(); // Fetch full name of the user

            if (userError) {
              console.error('Error fetching user details:', userError);
              return null; // Skip this enrollment if user data fetch fails
            }

            // Return enriched enrollment data with class name and user full name
            return {
              ...enrollment,
              full_name: userData.full_name,
              class_name: classNameData.name, // Add class name
            };
          })
        );

        // Filter out any null values (in case of errors) and set the enriched enrollments data
        setEnrollments(enrichedEnrollments.filter(enrollment => enrollment !== null));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <p>Loading enrollments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Enrollments</h1>
      {enrollments.length > 0 ? (
        <ul>
          {enrollments.map((enrollment) => (
            <li key={`${enrollment.class_schedule_id}-${enrollment.user_id}`}>
              <p><strong>Class Schedule ID:</strong> {enrollment.class_schedule_id}</p>
              <p><strong>Class Name:</strong> {enrollment.class_name}</p>  {/* Display the class name */}
              <p><strong>Full Name:</strong> {enrollment.full_name}</p>  {/* Display the user's full name */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No enrollments found.</p>
      )}
    </div>
  );
};

export default EnrollmentList;
