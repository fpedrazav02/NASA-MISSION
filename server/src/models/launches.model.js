const launches = new Map();
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

  await launchesModel.updateOne(
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

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function addNewLaunch(launch) {
  saveLaunch(launch);
  // latestFlightNumber++;
  // launches.set(
  //   latestFlightNumber,
  //   Object.assign(launch, {
  //     flightNumber: latestFlightNumber,
  //     customer: ["Nasa"],
  //     upcoming: true,
  //     success: true,
  //   })
  // );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

// launches.set(launch.flightNumber, launch);

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  launches,
  addNewLaunch,
  getAllLaunches,
};
