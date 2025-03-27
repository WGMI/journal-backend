import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
} from '../controllers/entryController';

const router = express.Router();

router.use(authenticate); // all routes below require auth

router.get('/', getAllEntries);
router.get('/:id', getEntryById);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
