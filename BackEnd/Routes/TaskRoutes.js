const router = require("express").Router();
const taskController = require("../Controllers/taskController");
const authenticator = require("../Middlewares/authMiddleware");

// Apply authenticator middleware to all task routes
router.use(authenticator);

router.get("/getTask", taskController.getTasks);
router.post("/postTask", taskController.postTask);
router.patch("/updateTask/:id", taskController.updateTask);
router.delete("/deleteTask/:id", taskController.deleteTask);

module.exports = router;
