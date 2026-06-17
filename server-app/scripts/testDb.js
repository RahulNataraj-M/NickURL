import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'test';

if (!uri) {
  console.error('No MONGODB_URI in env');
  process.exit(1);
}

const run = async () => {
  try {
    const conn = await mongoose.createConnection(uri, { dbName, serverSelectionTimeoutMS: 10000 });
    console.log('Connected to', dbName);

    const cols = await conn.db.listCollections().toArray();
    console.log('Collections:', cols.map(c => c.name));

    const res = await conn.db.collection('shorturls').insertOne({ userId: 'test-run', fullUrl: 'https://example.com', createdAt: new Date() });
    console.log('Inserted id:', res.insertedId.toString());

    const doc = await conn.db.collection('shorturls').findOne({ _id: res.insertedId });
    console.log('Found doc:', doc);

    await conn.close();
    process.exit(0);
  } catch (err) {
    console.error('DB error:', err && err.message ? err.message : err);
    process.exit(2);
  }
};

run();
