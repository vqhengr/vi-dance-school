import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient';  // Assuming supabase client setup

const ClassSignUp = ({ user }) => {
  const [classSchedules, setClassSchedules] = useState([]);  // List of class schedules
  const [enrolledClasses, setEnrolledClasses] = useState([]);  // Classes student is already enrolled in
  const [loading, setLoading] = useState(true);  // Loading state for the schedules
  const [error, setError] = useState(null);  // Error handling state
  const [confirmSignUp, setConfirmSignUp] = useState(null);  // Confirmation modal state
  const [selectedClass, setSelectedClass] = useState(null);  // Selected class schedule for sign up

  // Fetch class schedules and check enrollments
  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        // Fetch class schedules
        const { data, error } = await supabase.from('class_schedule').select('*');
        if (error) throw error;
        setClassSchedules(data);

        // Fetch classes the student is already enrolled in
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('class_schedule_id')
          .eq('user_id', user.id)
          .eq('enrollment_status', 'active');  // Only active enrollments

        if (enrollmentsError) throw enrollmentsError;

        // Map enrolled class schedules to the user's enrolled classes
        const enrolledClassIds = enrollments.map(enrollment => enrollment.class_schedule_id);
        setEnrolledClasses(enrolledClassIds);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassSchedules();
  }, [user.id]);

  // Handle class sign-up
  const handleSignUp = (classScheduleId) => {
    if (enrolledClasses.includes(classScheduleId)) {
      alert("You are already enrolled in this class.");
    } else {
      setSelectedClass(classScheduleId);
      setConfirmSignUp(true);
    }
  };

  // Confirm sign-up and create the enrollment record
  const confirmEnrollment = async () => {
    if (selectedClass) {
      try {
        const { error } = await supabase.from('enrollments').insert([
          {
            user_id: user.id,
            class_schedule_id: selectedClass,
            enrollment_status: 'active',
            payment_status: 'pending',  // Initial payment status
          },
        ]);
        
        if (error) throw error;
        alert('Successfully enrolled!');
        setConfirmSignUp(false); // Close confirmation
        setEnrolledClasses([...enrolledClasses, selectedClass]); // Add to enrolled classes
      } catch (error) {
        alert('Error enrolling: ' + error.message);
      }
    }
  };

  if (loading) return <p>Loading class schedules...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Available Class Schedules</h1>
      <ul>
        {classSchedules.map((schedule) => (
          <li key={schedule.id}>
            <h3>{schedule.class_id}</h3>  {/* Assuming class_id corresponds to class name or identifier */}
            <p><strong>Day:</strong> {schedule.day_of_week}</p>
            <p><strong>Time:</strong> {schedule.start_time}</p>
            <p><strong>Location:</strong> {schedule.location}</p>
            <button
              onClick={() => handleSignUp(schedule.id)}
              disabled={enrolledClasses.includes(schedule.id)}
            >
              {enrolledClasses.includes(schedule.id) ? 'Already Enrolled' : 'Sign Up'}
            </button>
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {confirmSignUp && (
        <div className="confirmation-modal">
          <p>Are you sure you want to enroll in this class?</p>
          <button onClick={confirmEnrollment}>Confirm</button>
          <button onClick={() => setConfirmSignUp(false)}>Cancel</button>
        </div>
      )}

      {/* Display student's enrolled classes */}
      <h2>Your Enrolled Classes</h2>
      <ul>
        {enrolledClasses.map((classId) => (
          <li key={classId}>Class ID: {classId}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassSignUp;
