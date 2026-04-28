import api from "./apiConfig";

export const getTodos = () => api.get("/todo/getTodo");
export const postTodo = (todo) => api.post("/todo/postTodo", todo);
export const updateTodo = (todoId, updates) => api.patch(`/todo/updateTodo/${todoId}`, updates);
export const deleteTodo = (todoId) => api.delete(`/todo/deleteTodo/${todoId}`);
