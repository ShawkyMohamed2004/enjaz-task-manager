const dataModel = require("../Models/DataModel");

// Get All Notes
exports.getNotes = async (req, res) => {
  const { _id } = req.user;
  try {
    let userContext = await dataModel.findById(_id);
    if (!userContext) {
      userContext = await new dataModel({ _id: _id }).save();
    }
    res.json(userContext.notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Create New Note
exports.postNote = async (req, res) => {
  const { _id } = req.user;
  const note = req.body;
  try {
    await dataModel.findByIdAndUpdate(_id, { $push: { notes: note } }, { upsert: true });
    res.json({ success: "Posted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { newText, newTitle, pinned, pinnedAt, newDate, newTime } = req.body;
  const updateObj = {};
  if (newText !== undefined) updateObj["notes.$.noteText"] = newText;
  if (newTitle !== undefined) updateObj["notes.$.title"] = newTitle;
  if (pinned !== undefined) updateObj["notes.$.pinned"] = pinned;
  if (pinnedAt !== undefined) updateObj["notes.$.pinnedAt"] = pinnedAt;
  if (newDate !== undefined) updateObj["notes.$.date"] = newDate;
  if (newTime !== undefined) updateObj["notes.$.time"] = newTime;

  try {
    await dataModel.findOneAndUpdate(
      { "notes.id": id },
      { $set: updateObj },
      { new: true }
    );
    res.json({ success: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  try {
    await dataModel.findByIdAndUpdate(_id, { $pull: { notes: { id: id } } }, { upsert: true });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};
