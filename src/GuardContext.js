import React, { createContext, useContext, useState } from 'react';

export const GuardContext = createContext();

export function GuardProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);



  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

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

