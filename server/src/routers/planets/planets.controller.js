//require Models
const { getAllPlanets } = require('../../models/planets.model.js')

async function httpGetAllPlanets(req, res) {
  return res.json(await getAllPlanets());
};


module.exports = {
  httpGetAllPlanets,
}
