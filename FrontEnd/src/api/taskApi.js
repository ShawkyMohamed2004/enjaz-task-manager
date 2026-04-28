import api from "./apiConfig";

export const getTasks = () => api.get("/task/getTask");
export const postTask = (newTask) => api.post("/task/postTask", newTask);
export const updateTask = (id, updateData) => api.patch(`/task/updateTask/${id}`, updateData);
export const deleteTask = (id) => api.delete(`/task/deleteTask/${id}`);
