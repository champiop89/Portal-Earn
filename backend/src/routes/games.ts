import express from 'express';
import { pool } from '../server';

const router = express.Router();

// Get all games
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, image_url, platform, 
              genre, reward_points, status, created_at FROM games 
       WHERE status = 'active' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM games WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Record game completion
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Insert game completion
    const result = await pool.query(
      `INSERT INTO user_game_completions (game_id, user_id, completed_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING *`,
      [id, userId]
    );

    // Get game reward
    const gameResult = await pool.query(
      `SELECT reward_points FROM games WHERE id = $1`,
      [id]
    );

    if (gameResult.rows.length > 0) {
      // Add points to user
      await pool.query(
        `UPDATE user_earnings SET total_points = total_points + $1 
         WHERE user_id = $2`,
        [gameResult.rows[0].reward_points, userId]
      );
    }

    res.status(201).json({
      message: 'Game completion recorded',
      completion: result.rows[0]
    });
  } catch (error) {
    console.error('Complete game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export = router;