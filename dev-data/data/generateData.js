import fs from 'fs';
import { faker } from '@faker-js/faker';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateCarData = function () {
  try {
    function generateFakeCar() {
      const car_id = faker.vehicle.vin();
      const type = faker.vehicle.type();
      const model = faker.vehicle.model();
      const name = faker.vehicle.manufacturer() + ' ' + model;
      const color = faker.vehicle.color();
      const licensePlate = faker.vehicle.vrm();

      return {
        car_id,
        type,
        name,
        model,
        car_info: {
          Color: color,
          'License Plate': licensePlate,
        },
      };
    }

    const numberOfCars = 20;
    const fakeCars = JSON.stringify(
      Array.from({ length: numberOfCars }, generateFakeCar)
    );

    const filePath = `${__dirname}/carData.json`;

    fs.writeFileSync(filePath, fakeCars, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Data has been written to the file');
    });
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const generateUserData = function () {
  try {
    function generateFakeUser() {
      const user_email = faker.internet.email();
      const user_id = faker.string.numeric(12);
      const user_location = faker.location.streetAddress({
        useFullAddress: true,
      });
      const user_info = {
        Gender: faker.person.gender(),
        'Phone-Number': faker.phone.number(),
        Bio: faker.person.bio(),
      };
      const password = faker.internet.password({ length: 12 });
      return {
        user_email,
        user_id,
        user_location,
        user_info,
        password,
        vehicle_id: [],
      };
    }

    const numberOfUsers = 12;
    const fakeUsers = JSON.stringify(
      Array.from({ length: numberOfUsers }, generateFakeUser)
    );

    const filePath = `${__dirname}/userData.json`;

    fs.writeFileSync(filePath, fakeUsers, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('Data has been written to the file');
    });
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--carData') {
  generateCarData();
} else if (process.argv[2] === '--userData') {
  generateUserData();
}

console.log(process.argv);
