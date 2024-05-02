import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

// Safety net for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('UNHANDLED EXCEPTION! 🔴 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const uri = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

// Creating a new MongoClient
const client = new MongoClient(uri);

export let db = Db;

async function connect(dbName) {
  try {
    // Connecting to the MongoDB server
    const conn = await client.connect((err) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
      }
      console.log('Connected to MongoDB successfully');
    });
    db = conn.db(dbName);
    return client;
  } catch (err) {
    console.error('Error:', err);
  }
}

connect(process.env.DATABASE_NAME).catch(console.dir);

import app from './app.js';

const port = 8000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});

// Safety net for unhandled rejected promises
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 🔴 Shutting down...');
  // server.close waits for the pending requests to complete before exiting the application
  server.close(() => {
    process.exit(1);
  });
});
