const router = require("express").Router();
const noteController = require("../Controllers/noteController");
const authenticator = require("../Middlewares/authMiddleware");

// Apply authenticator middleware to all note routes
router.use(authenticator);

router.get("/getNote", noteController.getNotes);
router.post("/postNote", noteController.postNote);
router.patch("/updateNote/:id", noteController.updateNote);
router.delete("/deleteNote/:id", noteController.deleteNote);

module.exports = router;
