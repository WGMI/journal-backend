import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

router.use(authenticate); // all routes require auth

router.get('/', getAllCategories); // GET /categories
router.post('/', createCategory); // POST /categories
router.put('/:id', updateCategory); // PUT /categories/:id
router.delete('/:id', deleteCategory); // DELETE /categories/:id

export default router;
