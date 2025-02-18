import React, { createContext, useContext, useState } from 'react';

export const GuardContext = createContext();

export function GuardProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      setUser(credentials); 
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <GuardContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        setIsAuthenticated
      }}
    >
      {children}
    </GuardContext.Provider>
  );
}

