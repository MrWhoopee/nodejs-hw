import { Note } from '../models/note.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { ensureNoteExists } from '../utils/ensureNoteExists.js';

export const getAllNotes = ctrlWrapper(async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  const filter = { userId: req.user._id };

  if (search) {
    filter.$text = { $search: search };
  }

  if (tag) {
    filter.tag = tag;
  }

  const noteQuery = Note.find(filter);

  const [totalNotes, notes] = await Promise.all([
    noteQuery.clone().countDocuments(),
    noteQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
});

export const getNoteById = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  ensureNoteExists(note);
  res.status(200).json(note);
});

export const createNote = ctrlWrapper(async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(note);
});

export const updateNote = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' },
  );
  ensureNoteExists(note);
  res.status(200).json(note);
});

export const deleteNote = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  ensureNoteExists(note);
  res.status(200).json(note);
});
