import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import app from './app.js';

// Safety net for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('UNHANDLED EXCEPTION! 🔴 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

// Creating a new MongoClient
const client = new MongoClient(DB);

async function run() {
  try {
    // Connecting to the MongoDB server
    await client.connect((err) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
      }

      console.log('Connected to MongoDB successfully');
    });

    const database = client.db('NerveSparks');
    const cars = database.collection('cars');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

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
