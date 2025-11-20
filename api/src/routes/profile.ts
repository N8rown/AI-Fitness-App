import { Router, Response } from 'express';
import { query } from '../db/connection.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Update user profile (onboarding)
router.post('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { goal, experience, equipment, schedule, unit } = req.body;
    const userId = req.userId;

    // Upsert profile
    const result = await query(
      `INSERT INTO user_profiles (user_id, goal, experience, equipment, schedule, unit)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET 
         goal = $2, experience = $3, equipment = $4, schedule = $5, unit = $6
       RETURNING *`,
      [userId, goal, experience, equipment, schedule, unit]
    );

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM user_profiles WHERE user_id = $1', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
