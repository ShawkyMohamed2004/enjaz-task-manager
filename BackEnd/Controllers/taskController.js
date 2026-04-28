const dataModel = require("../Models/DataModel");

// Get All Tasks
exports.getTasks = async (req, res) => {
  const { _id } = req.user;
  try {
    let userContext = await dataModel.findById(_id);
    if (!userContext) {
      userContext = await new dataModel({ _id: _id }).save();
    }
    res.json(userContext.tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Create New Task
exports.postTask = async (req, res) => {
  const { _id } = req.user;
  const newTask = req.body;
  try {
    await dataModel.findByIdAndUpdate(_id, { $push: { tasks: newTask } }, { upsert: true });
    res.json({ success: "Posted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { done, task } = req.body;
  const updateObj = {};
  if (done !== undefined) updateObj["tasks.$.done"] = done;
  if (task !== undefined) updateObj["tasks.$.task"] = task;

  try {
    await dataModel.findOneAndUpdate(
      { "tasks.id": id },
      { $set: updateObj },
      { new: true }
    );
    res.json({ success: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  try {
    await dataModel.findByIdAndUpdate(_id, { $pull: { tasks: { id: id } } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
