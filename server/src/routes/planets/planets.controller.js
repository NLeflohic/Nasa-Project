const { modelPlanets } = require('../../models/planets.model');

function httpGetAllPlanets (req, res) {
  return res.status(200).json(modelPlanets());
};


module.exports = {
  httpGetAllPlanets
}

