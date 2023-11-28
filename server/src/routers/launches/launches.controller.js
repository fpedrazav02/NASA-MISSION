const { launches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()));
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
  getAllLaunches,
  httpAddNewLaunch,
}
