import { Router, Response } from 'express';
import { query } from '../db/connection.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create fitness plan
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, plan_data } = req.body;
    const userId = req.userId;

    if (!name || !plan_data) {
      return res.status(400).json({ error: 'Name and plan_data required' });
    }

    const result = await query(
      'INSERT INTO fitness_plans (user_id, name, plan_data) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, JSON.stringify(plan_data)]
    );

    res.status(201).json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's plans
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM fitness_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single plan
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM fitness_plans WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept plan
router.put('/:id/accept', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE fitness_plans SET accepted = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Accept plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
