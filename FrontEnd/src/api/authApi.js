import api from "./apiConfig";

export const login = (loginData) => api.post("/login", loginData);
export const signup = (signupData) => api.post("/signup", signupData);
export const logout = () => api.get("/logout");
export const getUser = () => api.get("/getUser");
export const firebaseAuth = (data) => api.post("/firebase-auth", data);
export const forgotPassword = (email) => api.post("/forgotpass", { email });
export const resetPassword = (id, token, newPassword) => api.post(`/resetPassword/${id}/${token}`, { newPassword });
export const editProfile = (newName) => api.post("/editProfile", { newName });
export const updateFullProfile = (data) => api.post("/updateFullProfile", data);
export const deleteAccount = (password) => api.post("/deleteAccount", { password });
export const updateNotifSettings = (data) => api.post("/updateNotifSettings", data);
