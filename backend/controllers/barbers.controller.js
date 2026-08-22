const Barber = require('../models/barber.model');

const getBarbers = (req, res, next) => {
  try {
    const rawPage = req.query.page !== undefined ? req.query.page : 1;
    const rawLimit = req.query.limit !== undefined ? req.query.limit : 10;

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        error: 'Le paramètre "page" doit être un entier supérieur ou égal à 1.',
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        error: 'Le paramètre "limit" doit être un entier compris entre 1 et 50.',
      });
    }

    const result = Barber.findPaginated({ page, limit });

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
