import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import UserProfile from './components/UserProfile';

const App = () => {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState( {
    id: '12345',
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'https://example.com/profile-pic.jpg',  // Optional
    roles: ['user', 'admin'],  // Optional, depending on user permissions
    isActive: true,  // Optional, indicates whether the user is active
    createdAt: '2025-01-15T12:00:00Z',  // Timestamp when the account was created
    updatedAt: '2025-01-15T12:00:00Z',  // Timestamp when the account was last updated
  });

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
