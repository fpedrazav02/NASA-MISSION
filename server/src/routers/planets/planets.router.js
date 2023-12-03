const express = require('express');
const planetsController = require('./planets.controller.js');

const planetsRouter = express.Router();

planetsRouter.get('/planets', async () => planetsController.httpGetAllPlanets());

module.exports = planetsRouter;

