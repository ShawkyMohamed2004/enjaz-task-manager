const dataModel = require("../Models/DataModel");

// Get All Todos
exports.getTodos = async (req, res) => {
  const { _id } = req.user;
  try {
    let userContext = await dataModel.findById(_id);
    if (!userContext) {
      userContext = await new dataModel({ _id: _id }).save();
    }
    res.json(userContext.todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// Create New Todo
exports.postTodo = async (req, res) => {
  const { _id } = req.user;
  const todo = req.body;
  try {
    await dataModel.findByIdAndUpdate(_id, { $push: { todos: todo } }, { upsert: true });
    res.json({ success: "Posted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Update Todo (Generic)
exports.updateTodo = async (req, res) => {
  const { todoId } = req.params;
  const updates = req.body; // Can contain title, status, dateAdded, etc.
  
  try {
    // Create an object with the fields prefixed for $set
    const updateQuery = {};
    for (const key in updates) {
      updateQuery[`todos.$.${key}`] = updates[key];
    }

    await dataModel.findOneAndUpdate(
      { "todos.todoId": todoId },
      { $set: updateQuery },
      { new: true }
    );
    res.json({ success: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Delete Todo
exports.deleteTodo = async (req, res) => {
  const { _id } = req.user;
  const { todoId } = req.params;
  try {
    await dataModel.findByIdAndUpdate(_id, { $pull: { todos: { todoId: todoId } } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
