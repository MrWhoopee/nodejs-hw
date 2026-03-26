import createHttpError from 'http-errors';

export const ensureNoteExists = (note) => {
  if (!note || note.length === 0) {
    throw createHttpError(404, 'Note not found');
  }
};
