import { Router, Response } from 'express';
import { query } from '../db/connection.js';
import { generateChatResponse } from '../services/ai.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Send chat message
router.post('/message', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, goal } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Get AI response
    const aiResponse = await generateChatResponse({ message, goal });

    // Save user message
    await query(
      'INSERT INTO chat_messages (user_id, role, message) VALUES ($1, $2, $3)',
      [userId, 'user', message]
    );

    // Save AI response
    await query(
      'INSERT INTO chat_messages (user_id, role, message) VALUES ($1, $2, $3)',
      [userId, 'assistant', aiResponse.text]
    );

    res.json({
      message: aiResponse.text,
      type: aiResponse.type,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat history
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT role, message, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT 50',
      [req.userId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
