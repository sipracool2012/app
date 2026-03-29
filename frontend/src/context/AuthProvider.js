import React, { createContext, useState, useContext } from 'react';
import { getToken, getCurrentUser, logout } from '../utils/auth';

export const AuthContext = createContext(null);

// Convenience hook
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  // Lazy initialisers read from localStorage *synchronously* during the very
  // first render, so there is never a flash of unauthenticated state after a
  // hard reload.
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout(); // clears token + currentUser from localStorage
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
