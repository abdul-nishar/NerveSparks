import { faker } from '@faker-js/faker';

class Deal {
  constructor(dealData) {
    this.deal_id = faker.string.numeric(12);
    this.car_id = dealData?.car_id ?? undefined;
    this.deal_info = dealData?.deal_info ?? {
      status: ['completed', 'ongoing'][Math.floor(Math.random() * 2)],
      Date: faker.date.past(),
    };
  }
}

export default Deal;
