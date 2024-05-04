import { faker } from '@faker-js/faker';

class SoldVehicle {
  constructor(dealData) {
    this.vehicle_id = this.generateDealId();
    this.car_id = dealData.car_id;
    this.vehicle_info = dealData.vehicle_info;
  }

  generateDealId() {
    const vehicleId = faker.string.numeric(12);
    return vehicleId;
  }
}

export default SoldVehicle;
