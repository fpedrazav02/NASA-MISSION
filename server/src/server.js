const http = require('http');
const mongoose = require('mongoose');

const { app } = require('./app');
const { loadPlanetData, loadPlanetsData } = require('./models/planets.model.js');

const PORT = process.env.PORT || 8000;
const MONGO_URL = 'mongodb+srv://fpedrazav02:g07pq7u8JnqxP014@cluster0.nenauq6.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);


mongoose.connection.once('open', () => {
  console.log('MongoDB is ON');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  })
}

startServer();
