import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

let initialized = false;
function initFirebase() {
  if (initialized) return;
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path && fs.existsSync(path)) {
    const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf-8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    console.warn('[auth] No Firebase service account found — requests will not be verified. Add server/firebase-service-account.json for production use.');
  }
  initialized = true;
}

export async function requireAuth(req, res, next) {
  initFirebase();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing Authorization bearer token' });

  try {
    if (!admin.apps.length) {
      // Dev fallback so the prototype still runs without Firebase creds configured.
      req.user = { uid: 'dev-user', email: 'dev@savior.ai' };
      return next();
    }
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
