const Note = require("../models/Note");

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
};


exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const note = await Note.create({ user: req.user.id, title, content, category });

    const io = req.app.get("io");
    io.emit("refreshNotes"); 

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not Authorized" });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.category = req.body.category || note.category;

    await note.save();

    const io = req.app.get("io");
    io.emit("refreshNotes");

    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not Authorized" });

    await note.deleteOne();

    const io = req.app.get("io");
    io.emit("refreshNotes");

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
};
