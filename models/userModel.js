import { faker } from '@faker-js/faker';

class User {
  constructor(user_email, user_location, user_info, password, vehicle_info) {
    this.user_id = this.generateUserID();
    this.user_email = user_email;
    this.user_location = user_location;
    this.user_info = user_info;
    this.password = password;
    this.vehicle_info = vehicle_info;
  }

  generateUserID() {
    const userId = faker.string.numeric(12);
    return userId;
  }
}

module.exports = User;
