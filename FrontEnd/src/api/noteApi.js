import api from "./apiConfig";

export const getNotes = () => api.get("/note/getNote");
export const postNote = (note) => api.post("/note/postNote", note);
export const updateNote = (id, updateData) => api.patch(`/note/updateNote/${id}`, updateData);
export const deleteNote = (id) => api.delete(`/note/deleteNote/${id}`);
