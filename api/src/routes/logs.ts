import { Router, Response } from 'express';
import { query } from '../db/connection.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Log a workout
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan_id, workout_id, entries } = req.body;
    const userId = req.userId;

    if (!workout_id || !entries) {
      return res.status(400).json({ error: 'workout_id and entries required' });
    }

    const result = await query(
      'INSERT INTO workout_logs (user_id, plan_id, workout_id, entries) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, plan_id, workout_id, JSON.stringify(entries)]
    );

    res.status(201).json({ log: result.rows[0] });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's workout logs
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM workout_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ logs: result.rows });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
