import { faker } from '@faker-js/faker';

class Car {
  constructor(car_type, car_name, car_model, car_info) {
    this.car_id = this.generateCarId();
    this.type = car_type;
    this.name = car_name;
    this.model = car_model;
    this.car_info = car_info;
  }

  generateCarId() {
    const car_id = faker.vehicle.vin();
    return car_id;
  }
}

export default Car;
