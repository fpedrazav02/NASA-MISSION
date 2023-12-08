const axios = require("axios");
const launchesModel = require("./launches.schema");
const planets = require("./launches.schema");

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-1652 b",
  customers: ["Nasa"],
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

async function getAllLaunches(skip, limit) {
  return await launchesModel
    .find(
      {},
      {
        __v: 0,
        __id: 0,
      }
    )
    .skip(skip)
    .limit(limit)
    .sort({
      flightNumber: 1,
    });
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
    customers: ["Nasa"],
    upcoming: true,
    success: true,
    flightNumber: getLastestFlightNumber,
    destination: launch.target,
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

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    return;
  }
  const response = await axios.post(SPACE_X_URL, {
    query: {},
    options: {
      pagination: false,
      populate: {
        path: "rocket",
        select: {
          name: 1,
        },
      },
      populate: {
        path: "payloads",
        select: {
          customers: 1,
        },
      },
    },
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["data_local"],
      upcoming: launchDoc["upcoming"],
      succes: launchDoc["success"],
      customers: customers,
    };
    saveLaunch(launch);
  }
}

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  addNewLaunch,
  getAllLaunches,
  loadLaunchesData,
};
