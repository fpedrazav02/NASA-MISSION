const {
  launches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  getAllLaunches,
} = require("../../models/launches.model");

const launchesModel = require("../../models/launches.schema");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);
  addNewLaunch(launch);
  res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log(launchId);

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpAbortLaunch,
  httpGetAllLaunches,
  httpAddNewLaunch,
};
