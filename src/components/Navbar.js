import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem } from '@mui/material';
import supabase from '../services/supabaseClient'; // Assuming you have Supabase client setup

const Navbar = ({ userRole, user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Sign out function
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Vi Dance School
          </Typography>
        </Box>

        <Box>
          <Button component={Link} to="/user-profile" color="inherit">
            User Profile
          </Button>

          {userRole === 'student' && (
            <Button component={Link} to="/class-sign-up" color="inherit">
              Class Sign Up
            </Button>
          )}

          {(userRole === 'admin' || userRole === 'staff') && (
            <>
              <Button component={Link} to="/class-list" color="inherit">
                Class List
              </Button>
              <Button component={Link} to="/user-list" color="inherit">
                User List
              </Button>
              <Button component={Link} to="/enrollment-list" color="inherit">
                Enrollment List
              </Button>
              <Button component={Link} to="/class-schedule-list" color="inherit">
                Class Schedule List
              </Button>
              <Button component={Link} to="/admin-enroll" color="inherit">
                Admin Enroll
              </Button>
              <Button component={Link} to="/class-schedule-list-with-students" color="inherit">
                Class Schedule With Students
              </Button>
            </>
          )}

          {/* Profile and Sign Out */}
          <Button color="inherit" onClick={handleMenuOpen}>
            {user?.user_metadata?.full_name || 'Profile'}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
