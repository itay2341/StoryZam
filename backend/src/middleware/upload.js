import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (no need to save files to disk)
const storage = multer.memoryStorage();

// File filter - accept only audio files
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/aac',
    'audio/ogg',
    'audio/flac',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/webm',
    'audio/webm;codecs=opus',
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
