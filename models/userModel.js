import { faker } from '@faker-js/faker';
import { hashPassword } from '../utils/genericFns.js';
import crypto from 'crypto';

class User {
  constructor(userData) {
    this.user_id = faker.string.numeric(12);
    this.role = userData?.role ?? 'user';
    this.user_email = userData?.user_email ?? faker.internet.email();
    this.user_location =
      userData?.user_location ??
      faker.location.streetAddress({
        useFullAddress: true,
      });
    this.user_info = userData?.user_info ?? {
      Gender: faker.person.gender(),
      'Phone-Number': faker.phone.number(),
      Bio: faker.person.bio(),
    };
    this.password = hashPassword(userData?.password ?? 'Luffy*7238');
    this.vehicle_info = userData?.vehicle_info ?? undefined;
    this.passwordChangedAt = undefined;
  }

  async passwordChanged(JWTTimestamp) {
    if (this.passwordChangedAt !== undefined) {
      const changedTime = this.passwordChangedAt.getTime() / 1000;
      return JWTTimestamp < changedTime;
    }
    return false;
  }

  async createPasswordResetToken() {
    // Creating a random string using built-in crypto module
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encrypting the token to store it in the database
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
}

export default User;
