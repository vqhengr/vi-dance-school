import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import UserProfile from './components/UserProfile';
import supabase from './services/supabaseClient'; // Import supabase client

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if a user is already signed in when the app loads
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <UserProfile user={user} />
            ) : (
              <SignIn onSignIn={setUser} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
