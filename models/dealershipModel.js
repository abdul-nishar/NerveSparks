import { faker } from '@faker-js/faker';
import { hashPassword } from '../utils/genericFns.js';

class Dealership {
  constructor(dealershipData) {
    this.dealership_id = faker.string.numeric(12);
    this.role = dealershipData?.role ?? 'dealership';
    this.dealership_name =
      dealershipData?.dealership_name ?? faker.company.name();
    this.dealership_email =
      dealershipData?.dealership_email ?? faker.internet.email();
    this.dealership_location =
      dealershipData?.dealership_location ??
      faker.location.streetAddress({
        useFullAddress: true,
      });
    this.dealership_info = dealershipData?.dealership_info ?? {
      'Phone-Number': faker.phone.number(),
    };
    this.password = hashPassword(dealershipData?.password ?? 'Luffy*7238');
    this.cars = dealershipData?.cars || [];
    this.deals = dealershipData?.deals || [];
    this.sold_vehicles = dealershipData?.sold_vehicles || [];
    this.passwordChangedAt = undefined;
  }

  async passwordVerification(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
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

export default Dealership;
