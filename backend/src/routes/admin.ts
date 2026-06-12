import express from 'express';
import { pool } from '../server';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware to check admin status (basic implementation)
const isAdmin = async (req: any, res: any, next: any) => {
  // TODO: Implement proper JWT verification and admin role check
  next();
};

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, created_at, updated_at 
       FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new survey
router.post('/surveys', isAdmin, async (req, res) => {
  try {
    const { title, description, reward_points, estimated_time, questions } = req.body;

    if (!title || !reward_points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const surveyId = uuidv4();
    const result = await pool.query(
      `INSERT INTO surveys (id, title, description, reward_points, estimated_time, 
                           questions, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW())
       RETURNING *`,
      [surveyId, title, description, reward_points, estimated_time, JSON.stringify(questions)]
    );

    res.status(201).json({
      message: 'Survey created successfully',
      survey: result.rows[0]
    });
  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new game
router.post('/games', isAdmin, async (req, res) => {
  try {
    const { title, description, image_url, platform, genre, reward_points } = req.body;

    if (!title || !reward_points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const gameId = uuidv4();
    const result = await pool.query(
      `INSERT INTO games (id, title, description, image_url, platform, genre, 
                         reward_points, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())
       RETURNING *`,
      [gameId, title, description, image_url, platform, genre, reward_points]
    );

    res.status(201).json({
      message: 'Game created successfully',
      game: result.rows[0]
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalSurveys = await pool.query('SELECT COUNT(*) FROM surveys WHERE status = \'active\'');
    const totalGames = await pool.query('SELECT COUNT(*) FROM games WHERE status = \'active\'');
    const totalPointsDistributed = await pool.query('SELECT SUM(total_points) FROM user_earnings');

    res.json({
      totalUsers: totalUsers.rows[0].count,
      totalSurveys: totalSurveys.rows[0].count,
      totalGames: totalGames.rows[0].count,
      totalPointsDistributed: totalPointsDistributed.rows[0].sum || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export = router;