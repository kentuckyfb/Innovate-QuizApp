// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://afqaghnwdixbvwbyktfs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcWFnaG53ZGl4YnZ3YnlrdGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDYxNzUsImV4cCI6MjA1OTUyMjE3NX0.-sG6FVavtWxnAIRkJ3ypKR2JWl-QTL0CY6wBUxJn7-o';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User data saving function
export const saveUserInfo = async (userData: {
  name: string;
  phone: string;
  personality_result?: string;
}) => {
  try {
    const { data, error } = await supabase.from('quiz_users').insert([
      {
        name: userData.name,
        phone: userData.phone,
        quiz_type: 'avrudu',
        personality_result: userData.personality_result || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error saving user data:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error saving user data:', err);
    return false;
  }
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    
    // Calling signInWithPassword directly with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Check for errors during the sign-in process
    if (error) {
      console.error('Error signing in:', error);
      console.log('Error object:', error);
      console.log('Error message:', error.message);
      throw error;
    }
    
    
    // Return the response data containing session and user information
    return data;  // { user, session }
  } catch (err: any) {
    // Log any unexpected errors
    console.error('Unexpected error during sign in:', err);
    console.log('Error stack trace:', err.stack);
    
    // Re-throw the error so it can be handled downstream
    throw err;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    throw err;
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }

    return data.session;
  } catch (err) {
    console.error('Unexpected error getting session:', err);
    throw err;
  }
};

// Function to check if user is an admin
export const isAdmin = async () => {
  try {
    const session = await getSession();
    return !!session; // For now, any authenticated user is considered an admin

    // In a production app, you might want to check a specific role:
    // const { data, error } = await supabase
    //   .from('admin_users')
    //   .select('*')
    //   .eq('user_id', session?.user.id)
    //   .single();
    // return !!data;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
};
