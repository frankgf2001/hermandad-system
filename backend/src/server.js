import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import pool from './config/db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// 🔍 Verify DB connection
pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL successfully'))
  .catch(err => console.error('❌ MySQL connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
