export const isLoggedIn = () => {
  return !!localStorage.getItem("lablink_token");
};

export const getToken = () => {
  return localStorage.getItem("lablink_token");
};

export const logout = () => {
  localStorage.removeItem("lablink_token");
  localStorage.removeItem("lablink_user");
  // Optional: Clear zustand store if you have access, or reload page
};