import express from 'express';
import { pool } from '../server';

const router = express.Router();

// Get all surveys
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, reward_points, estimated_time, 
              status, created_at FROM surveys WHERE status = 'active' 
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get survey by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM surveys WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit survey response
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, responses } = req.body;

    if (!userId || !responses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert survey response
    const result = await pool.query(
      `INSERT INTO survey_responses (survey_id, user_id, responses, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [id, userId, JSON.stringify(responses)]
    );

    // Get survey reward
    const surveyResult = await pool.query(
      `SELECT reward_points FROM surveys WHERE id = $1`,
      [id]
    );

    if (surveyResult.rows.length > 0) {
      // Add points to user
      await pool.query(
        `UPDATE user_earnings SET total_points = total_points + $1 
         WHERE user_id = $2`,
        [surveyResult.rows[0].reward_points, userId]
      );
    }

    res.status(201).json({
      message: 'Survey submitted successfully',
      response: result.rows[0]
    });
  } catch (error) {
    console.error('Submit survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export = router;