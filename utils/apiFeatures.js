class APIFeatures {
  constructor(database, collection, queryString) {
    this.database = database;
    this.collection = collection;
    this.queryString = queryString;
  }

  async filter() {
    // 1.1) Filtering
    const queryObj = { ...this.queryString };
    const excludedQueries = ['page', 'limit', 'sort', 'fields'];
    excludedQueries.forEach((query) => delete queryObj[query]);

    // 1.2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.collection = await this.database
      .collection(this.collection)
      .find(JSON.parse(queryStr))
      .toArray();
    return this;
  }

  // $ Additional API Features
  // sort() {
  //   if (this.queryString.sort) {
  //     const sortBy = this.queryString.sort.split(',').join(' ');
  //     this.query = this.query.sort(sortBy);
  //   } else {
  //     this.query = this.query.sort('-createdAt');
  //   }
  //   return this;
  // }

  // fieldSelection() {
  //   if (this.queryString.fields) {
  //     const fields = this.queryString.fields.split(',').join(' ');
  //     this.query = this.query.select(fields);
  //   } else {
  //     this.query = this.query.select('-__v');
  //   }
  //   return this;
  // }

  // paginate() {
  //   const page = +this.queryString.page || 1;
  //   const limit = +this.queryString.limit || 100;
  //   const skip = (page - 1) * limit;

  //   this.query = this.query.skip(skip).limit(limit);

  //   return this;
  // }
}

export default APIFeatures;
