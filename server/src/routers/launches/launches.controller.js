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

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);
  await addNewLaunch(launch);
  res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log(launchId);

  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: "true",
  });
}

module.exports = {
  httpAbortLaunch,
  httpGetAllLaunches,
  httpAddNewLaunch,
};
