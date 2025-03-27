import express from 'express';
import { authenticate } from '../middleware/auth';
import { categories, heatmap, wordcount, sentiment } from '../controllers/summaryController';
const router = express.Router();

router.use(authenticate);

router.get('/heatmap', heatmap);
router.get('/categories', categories);
router.get('/wordcount', wordcount);
router.get('/sentiment', sentiment);

export default router;
