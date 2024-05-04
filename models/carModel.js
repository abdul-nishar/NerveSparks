import { faker } from '@faker-js/faker';

class Car {
  constructor(carData) {
    this.car_id = this.generateCarId();
    this.type = carData.type;
    this.name = carData.name;
    this.model = carData.model;
    this.car_info = carData.car_info;
  }

  generateCarId() {
    const car_id = faker.vehicle.vin();
    return car_id;
  }
}

export default Car;
