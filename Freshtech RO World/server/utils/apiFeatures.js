class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Building the query.
    let queryObj = { ...this.queryString }; // creating the hard copy of the element.
    const excludeFields = ['sort', 'limit', 'page', 'fields']; // excluding these fields elements to prevent errors on pagination, sorting and limiting the data.
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(selectBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const limit = this.queryString.limit * 1 || 100;
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
