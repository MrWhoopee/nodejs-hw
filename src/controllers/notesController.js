import { Note } from '../models/note.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { ensureNoteExists } from '../utils/ensureNoteExists.js';

export const getAllNotes = ctrlWrapper(async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
});

export const getNoteById = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  ensureNoteExists(note);
  res.status(200).json(note);
});

export const createNote = ctrlWrapper(async (req, res) => {
  const note = await Note.create(req.body);

  res.status(201).json(note);
});

export const updateNote = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
  ensureNoteExists(note);
  res.status(200).json(note);
});

export const deleteNote = ctrlWrapper(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);
  ensureNoteExists(note);
  res.status(200).json(note);
});
