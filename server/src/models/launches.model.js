const axios = require("axios");
const launchesModel = require("./launches.schema");
const planets = require("./launches.schema");

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-1652 b",
  customer: ["Nasa"],
  upcoming: true,
  success: true,
};

async function saveLaunch(launch) {
  const planet = planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error("Oops! Planet could not be found!");
  }

  await launchesModel.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

saveLaunch(launch);

async function getAllLaunches() {
  return await launchesModel.find(
    {},
    {
      __v: 0,
      __id: 0,
    }
  );
}

async function getLastFlightNumber() {
  const lastestLaunch = await launchesModel.findOne().sort("-flightNumber");

  if (!lastestLaunch) {
    return 100;
  }
  return lastestLaunch.flightNumber;
}

async function existsLaunchWithId(launchId) {
  return await launchesModel.findOne({
    flightNumber: launchId,
  });
}

async function addNewLaunch(launch) {
  const getLastestFlightNumber = (await getLastFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    customer: ["Nasa"],
    upcoming: true,
    success: true,
    flightNumber: getLastestFlightNumber,
  });
  await saveLaunch(launch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesModel.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.ok === 1 && aborted.modifiedCount === 1;
}

const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchesData() {
  await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      populate: {
        path: "rocket",
        select: {
          name: 1,
        },
      },
    },
  });
}

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  launches,
  addNewLaunch,
  getAllLaunches,
  loadLaunchesData,
};
