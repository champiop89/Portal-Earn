import express from 'express';
import { pool } from '../server';

const router = express.Router();

// Get user profile
router.get('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, username, email, avatar_url, bio, created_at, updated_at 
       FROM users WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user earnings
router.get('/:id/earnings', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT total_points, withdrawn_points, pending_points, updated_at 
       FROM user_earnings WHERE user_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User earnings not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, bio, avatar_url } = req.body;

    const result = await pool.query(
      `UPDATE users SET username = COALESCE($1, username), 
                       bio = COALESCE($2, bio),
                       avatar_url = COALESCE($3, avatar_url),
                       updated_at = NOW()
       WHERE id = $4 RETURNING id, username, email, bio, avatar_url`,
      [username, bio, avatar_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activity history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 'survey' as type, s.title, sr.created_at, s.reward_points as points
       FROM survey_responses sr
       JOIN surveys s ON sr.survey_id = s.id
       WHERE sr.user_id = $1
       UNION ALL
       SELECT 'game' as type, g.title, ugc.completed_at as created_at, g.reward_points as points
       FROM user_game_completions ugc
       JOIN games g ON ugc.game_id = g.id
       WHERE ugc.user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export = router;