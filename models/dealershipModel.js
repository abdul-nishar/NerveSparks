import { faker } from '@faker-js/faker';
import { hashPassword } from '../utils/genericFns.js';

class Dealership {
  constructor(dealershipData) {
    this.dealership_id = this.generateUserID();
    this.role = 'dealership';
    this.dealership_name = dealershipData.dealership_name;
    this.dealership_email = dealershipData.dealership_email;
    this.dealership_location = dealershipData.dealership_location;
    this.dealership_info = dealershipData.dealership_info;
    this.password = hashPassword(dealershipData.password);
    this.cars = dealershipData.cars || [];
    this.deals = dealershipData.deals || [];
    this.sold_vehicles = dealershipData.sold_vehicles || [];
  }

  generateUserID() {
    const dealershipId = faker.string.numeric(12);
    return dealershipId;
  }
}

export default Dealership;
