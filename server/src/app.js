const express = require('express');
const cors = require('cors');

const planetsRouter = require('./routers/planets/planets.router');
const launchesRouter = require('./routers/launches/launches.router');

const app = express();

//Use Routers
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(planetsRouter);
app.use(launchesRouter);

module.exports = {
  app,
}
