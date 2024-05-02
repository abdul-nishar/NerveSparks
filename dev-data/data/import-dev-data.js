import fs from 'fs';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './config.env' });

const cars = JSON.parse(fs.readFileSync(`${__dirname}/carData.json`, 'utf-8'));
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/userData.json`, 'utf-8')
);

const importData = async (database) => {
  try {
    await database.collection('cars').insertMany(cars);
    await database.collection('users').insertMany(users);

    console.log('Data imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

const deleteData = async (database) => {
  try {
    await database.collection('cars').deleteMany({});
    await database.collection('users').deleteMany({});

    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

const uri = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

// Creating a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db(process.env.DATABASE_NAME);

    if (process.argv[2] === '--import') {
      importData(database);
    } else if (process.argv[2] === '--delete') {
      deleteData(database);
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
