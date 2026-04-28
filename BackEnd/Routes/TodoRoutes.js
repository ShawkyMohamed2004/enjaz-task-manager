const router = require("express").Router();
const todoController = require("../Controllers/todoController");
const authenticator = require("../Middlewares/authMiddleware");

// Apply authenticator middleware to all todo routes
router.use(authenticator);

router.get("/getTodo", todoController.getTodos);
router.post("/postTodo", todoController.postTodo);
router.patch("/updateTodo/:todoId", todoController.updateTodo);
router.delete("/deleteTodo/:todoId", todoController.deleteTodo);

module.exports = router;
