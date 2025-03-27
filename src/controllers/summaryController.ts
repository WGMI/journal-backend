import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const heatmap = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const rawEntries = await prisma.entry.findMany({
            where: { userId: req.userId },
            select: {
                date: true,
            },
        });

        const counts: Record<string, number> = {};

        for (const { date } of rawEntries) {
            const day = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
            counts[day] = (counts[day] || 0) + 1;
        }

        const result = Object.entries(counts).map(([date, count]) => ({ date, count }));

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const categories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        // First get all categories with their counts
        const categoryCounts = await prisma.entry.groupBy({
            by: ['categoryId'],
            _count: {
                _all: true
            },
            where: {
                userId,
            },
        });

        // Map the results to the desired format
        const formattedCategoryCounts = categoryCounts.map(item => ({
            categoryId: item.categoryId,
            count: item._count._all
        }));

        // Then fetch the category details and combine with counts
        /*const categoriesWithCounts = await Promise.all(
            categoryCounts.map(async (item) => {
                const category = await prisma.category.findUnique({
                    where: { id: item.categoryId },
                    select: { name: true, id: true }
                });
                
                return {
                    categoryId: item.categoryId,
                    name: category?.name,
                    count: item._count._all
                };
            })
        );*/

        res.json(formattedCategoryCounts);
    } catch (error) {
        next(error);
    }
}

export const wordcount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        // Fetch all entries for the user
        const entries = await prisma.entry.findMany({
            where: { userId },
            select: {
                date: true,
                content: true, // Assuming 'content' is the field where the text is stored
            },
        });

        const wordCounts: Record<string, number> = {};

        for (const { date, content } of entries) {
            const day = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length; // Count words
            wordCounts[day] = (wordCounts[day] || 0) + wordCount;
        }

        const result = Object.entries(wordCounts).map(([date, count]) => ({ date, count }));

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const sentiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const userId = req.userId;
      const startDate = req.query.startDate as string;
  
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
      // Fetch entries from given date
      const entries = await prisma.entry.findMany({
        where: {
          userId,
          date: {
            gte: new Date(startDate),
          },
        },
        select: {
          content: true,
        },
      });
  
      if (entries.length === 0) {
        res.status(404).json({ message: 'No journal entries found in the given range' });
        return;
      }
  
      // Combine entry content
      const combinedContent = entries.map(e => e.content).join('\n\n');
  
      // Call OpenAI
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content:
                `What is the sentiment of the following journal entries?\n\n` +
                `${combinedContent}\n\n` +
                `Respond with a single word only: Positive, Negative, or Neutral.`,
            },
          ],
          temperature: 0.5,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        res.status(500).json({ message: 'OpenAI API error', error: errorText });
        return;
      }
  
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content?.trim();
  
      if (!answer) {
        res.status(500).json({ message: 'No sentiment returned from OpenAI' });
        return;
      }
  
      res.json({ sentiment: answer });
    } catch (error) {
      next(error);
    }
  };

