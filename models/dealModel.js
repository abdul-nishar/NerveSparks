import { faker } from '@faker-js/faker';

class Deal {
  constructor(dealData) {
    this.deal_id = this.generateDealId();
    this.car_id = dealData.car_id;
    this.deal_info = dealData.deal_info;
  }

  generateDealId() {
    const dealId = faker.string.numeric(12);
    return dealId;
  }
}

export default Deal;
