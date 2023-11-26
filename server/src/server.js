const http = require('http');

const { app } = require('./app');
const { loadPlanetData, loadPlanetsData } = require('./models/planets.model.js');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  })
}

startServer();
