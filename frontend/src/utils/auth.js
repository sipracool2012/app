export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  if (!user || user === 'undefined' || user === 'null') {
    localStorage.removeItem('currentUser'); // clean up any corrupted value
    return null;
  }
  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem('currentUser'); // clean up unparseable value
    return null;
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

export const logout = () => {
  removeToken();
  removeCurrentUser();
};

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = getToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};
