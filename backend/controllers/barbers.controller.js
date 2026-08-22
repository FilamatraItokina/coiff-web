const Barber = require('../models/barber.model');
const { parsePagination } = require('../utils/paginate');

const getBarbers = (req, res, next) => {
  try {
    const pagination = parsePagination(req.query, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });

    if (!pagination.isValid) {
      return res.status(400).json({
        error: pagination.error,
      });
    }

    const result = Barber.findPaginated({
      page: pagination.page,
      limit: pagination.limit,
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

const getBarberById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "L'identifiant du barbier est invalide.",
      });
    }

    const barber = Barber.findPublicById(id);

    if (!barber) {
      return res.status(404).json({
        error: 'Barber not found',
      });
    }

    return res.status(200).json(barber);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getBarbers,
  getBarberById,
};
