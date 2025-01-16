// services/SignInHandler.js
import { useState, useEffect } from "react";
import supabase from "./supabaseClient";

const useSignIn = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Fetch current user on initial load
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    fetchUser();

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return user;
};

export default useSignIn;
