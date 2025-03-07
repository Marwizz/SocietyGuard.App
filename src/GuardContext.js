import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const GuardContext = createContext();

export function GuardProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state



  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

    // Check for existing token on app start
    useEffect(() => {
      // Define async function inside useEffect
      const checkAuthStatus = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          if (userToken) {
            // Get user data from AsyncStorage
            const userData = await AsyncStorage.getItem('userData');
            
            if (userData) {
              // Parse the user data
              const parsedUserData = JSON.parse(userData);
              
              // Set user and authentication state
              setUser({ ...parsedUserData, token: userToken });
              setIsAuthenticated(true);
            } else {
              // If we have a token but no user data, we need to fetch user profile
              // You might want to implement a fetchUserProfile function
              // fetchUserProfile(userToken);
            }
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
        } finally {
          setIsLoading(false); // Set loading to false when done
        }
      };
  
      // Call the function
      checkAuthStatus();
    }, []);
  
  

  return (
    <GuardContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        
        
      }}
    >
      {children}
    </GuardContext.Provider>
  );
}

