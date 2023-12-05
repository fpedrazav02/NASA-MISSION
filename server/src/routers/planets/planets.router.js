const express = require("express");
const planetsController = require("./planets.controller.js");

const planetsRouter = express.Router();

planetsRouter.get(
  "/planets",
  async (req, res) => await planetsController.httpGetAllPlanets(req, res)
);

module.exports = planetsRouter;
