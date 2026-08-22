const Service = require('../models/service.model');
const { parsePagination } = require('../utils/paginate');

const getServices = (req, res, next) => {
  try {
    const pagination = parsePagination(req.query, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });

    if (!pagination.isValid) {
      return res.status(400).json({
        error: pagination.error,
      });
    }

    const result = Service.findPaginated({
      page: pagination.page,
      limit: pagination.limit,
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getServices,
};
