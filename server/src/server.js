const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const { app } = require("./app");
const { loadPlanetsData } = require("./models/planets.model.js");
const { loadLaunchesData } = require("./models/launches.model.js");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB is ON");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL);
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
}

startServer();
