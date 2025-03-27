import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import entryRoutes from './routes/entries';
import categoryRoutes from './routes/categories';
import summaryRoutes from './routes/summary';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/entries', entryRoutes);
app.use('/categories', categoryRoutes);
app.use('/summary', summaryRoutes);

app.get('/', (req, res) => {
  res.send('Journal App Backend Running');
});

export default app;
