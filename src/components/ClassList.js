import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient.js';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the classes data from Supabase
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*');

        if (error) throw error;

        setClasses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Dance Classes</h1>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            <h2>{classItem.name}</h2>
            <p><strong>Type:</strong> {classItem.type}</p>
            <p><strong>Level:</strong> {classItem.difficulty_level}</p>
            <p><strong>Description:</strong> {classItem.description}</p>
            <p><strong>Status:</strong> {classItem.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
