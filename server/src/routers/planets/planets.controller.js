//require Models
const { getAllPlanets } = require("../../models/planets.model.js");
const planetsRouter = require("./planets.router.js");

async function httpGetAllPlanets(req, res) {
  planets = await getAllPlanets();
  console.log(typeof res);
  if (typeof planets !== undefined) {
    return res.status(200).send(planets);
  }
  return res.json({});
}

module.exports = {
  httpGetAllPlanets,
};
