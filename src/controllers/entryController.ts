import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getAllEntries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const entries = await prisma.entry.findMany({
      where: { userId: req.userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const getEntryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await prisma.entry.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!entry || entry.userId !== req.userId) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const createEntry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, date, categoryId } = req.body;
    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        date: new Date(date),
        categoryId,
        userId: req.userId!,
      },
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, date, categoryId } = req.body;

    const entry = await prisma.entry.findUnique({ where: { id: Number(id) } });

    if (!entry || entry.userId !== req.userId) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    const updated = await prisma.entry.update({
      where: { id: Number(id) },
      data: { title, content, date: new Date(date), categoryId },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.entry.findUnique({ where: { id: Number(id) } });

    if (!entry || entry.userId !== req.userId) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    await prisma.entry.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
