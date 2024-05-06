import { faker } from '@faker-js/faker';

class Car {
  constructor(carData) {
    this.car_id = faker.vehicle.vin();
    this.type = carData?.type ?? faker.vehicle.type();
    this.model = carData?.model ?? faker.vehicle.model();
    this.name =
      carData?.name ?? faker.vehicle.manufacturer() + ' ' + this.model;
    this.car_info = carData?.car_info ?? {
      Color: faker.vehicle.color(),
      'License Plate': faker.vehicle.vrm(),
    };
  }
}

export default Car;
