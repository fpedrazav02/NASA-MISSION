const launches = new Map();
/* const launches = require('./launches.schema'); */


let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-442 b',
  customer: ['Nasa'],
  upcoming: true,
  success: true,
};

const launch2 = {
  flightNumber: 90,
  mission: 'Kepler Exploration IX',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-442 b',
  customer: ['Nasa'],
  upcoming: true,
  success: true,
};

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}


function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customer: ['Nasa'],
    upcoming: true,
    success: true,
  }))
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}


launches.set(launch.flightNumber, launch);
launches.set(launch2.flightNumber, launch2);

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  launches,
  addNewLaunch,
}
