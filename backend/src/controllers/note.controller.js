import Note from "../models/note.model.js";

// get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add a note
const addANote = async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.user.id });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a note
const updateANote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the authenticated user is the owner of the note
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note" });
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body }, // Update note fields
      { new: true } // Return the updated note
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete a note
const deleteANote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the authenticated user is the owner of the note
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this note" });
    }

    // Delete the note
    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { addANote, updateANote, deleteANote, getNotes };
