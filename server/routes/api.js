import { Router } from 'express';
import { pool } from '../database/db.js';
import { runOrchestrator } from '../agents/orchestrator.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ---------- USERS ----------
// Called right after Firebase login to create/sync the MySQL profile.
router.post('/users/sync', requireAuth, async (req, res) => {
  const { name, email, age, profile_image } = req.body;
  const { uid } = req.user;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
    if (existing.length) return res.json(existing[0]);
    const [result] = await pool.query(
      'INSERT INTO users (firebase_uid, name, email, age, profile_image) VALUES (?,?,?,?,?)',
      [uid, name, email, age, profile_image || null]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user-impact', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE firebase_uid = ?', [req.user.uid]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- WASTE / AGENTS ----------
router.post('/analyze-waste', async (req, res) => {
  const { imageUrl, userId } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });
  try {
    const report = await runOrchestrator({ imageUrl });

    let scanId = null;
    let persisted = false;
    try {
      const [result] = await pool.query(
        `INSERT INTO waste_scans (user_id, image_url, waste_type, materials, condition_text, current_value, future_value, solutions, impact_score)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          userId, imageUrl, report.vision.wasteType, JSON.stringify(report.material.recoverable),
          report.vision.condition, report.economy.currentValue, report.economy.futureValue,
          JSON.stringify(report.startup), report.impact.earthRecoveryScore,
        ]
      );
      scanId = result.insertId;
      const agentEntries = Object.entries(report);
      for (const [agentName, output] of agentEntries) {
        await pool.query(
          'INSERT INTO agent_results (scan_id, agent_name, input_data, output_data) VALUES (?,?,?,?)',
          [scanId, agentName, JSON.stringify({ imageUrl }), JSON.stringify(output)]
        );
      }
      persisted = true;
    } catch (dbErr) {
      console.warn('[savior db fallback]', dbErr.message);
    }

    res.status(201).json({ scanId, report, persistedToDatabase: persisted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- FOOD SHARING ----------
router.post('/food-share', requireAuth, async (req, res) => {
  const { userId, foodName, quantity, location, price, freshnessStatus } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO food_share (user_id, food_name, quantity, location, price, freshness_status) VALUES (?,?,?,?,?,?)',
      [userId, foodName, quantity, location, price, freshnessStatus || 'fresh']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/food-share', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM food_share ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- NGO CAMPAIGNS + DONATIONS ----------
router.get('/campaigns', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ngo_campaigns ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/donate', requireAuth, async (req, res) => {
  const { userId, campaignId, amount } = req.body;
  try {
    await pool.query('INSERT INTO donations (user_id, campaign_id, amount, impact_created) VALUES (?,?,?,?)',
      [userId, campaignId, amount, `Contributed ₹${amount} toward campaign #${campaignId}`]);
    await pool.query('UPDATE ngo_campaigns SET current_amount = current_amount + ? WHERE id = ?', [amount, campaignId]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- LEADERBOARD ----------
router.get('/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.name, u.impact_score, u.eco_points FROM users u ORDER BY u.impact_score DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
