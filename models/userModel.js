import { faker } from '@faker-js/faker';
import { hashPassword } from '../utils/genericFns.js';

class User {
  constructor(userData) {
    this.user_id = this.generateUserID();
    this.role = 'user';
    this.user_email = userData.user_email;
    this.user_location = userData.user_location;
    this.user_info = userData.user_info;
    this.password = hashPassword(userData.password);
    this.vehicle_info = userData.vehicle_info;
  }

  generateUserID() {
    const userId = faker.string.numeric(12);
    return userId;
  }
}

export default User;
