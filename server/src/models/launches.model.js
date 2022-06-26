const launches = require ('./launches.mongo');
const planets = require ('./planets.mongo');
//const launches = new Map();

//  let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
  flightNumber: 100,
  mission: 'kepler exploration',
  rocket: 'Explore IS1',
  launchDate: new Date ('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);

async function existsLaunchWithId (launchId) {
//  return launches.has(launchId);
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber () {
  const latestLaunch = await launches
  .findOne ({})
  .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function launchesModel () {
  //return Array.from(launches.values());
  return await launches.find ({}, {'_id': 0, '__v': 0});
}

// function addNewLaunch (launch) {
//   latestFlightNumber++;
//   launches.set (latestFlightNumber,
//     Object.assign(launch, {
//       customer: ['Zero to mastery', 'NASA'],
//       upcoming: true,
//       success: true,
//       flightNumber: latestFlightNumber
//   }));
// }

async function scheduleNewLaunch (launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign (launch, {
    success:true,
    upcoming: true,
    customers: ['Ztm', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function saveLaunch (launch) {
  const planet = planets.findOne ({
    keplerName: launch.target
  });
  if (!planet) {
    throw new Error ('Planet not found !');
  };
  // await launches.updateOne ({
  await launches.findOneAndUpdate ({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  })
}



async function abortLaunchById (launchId) {
  //const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launches.updateOne({
    flightNumber: launchId},
    {
    upcoming: false,
    success: false
  });
  return aborted.modifiedCount === 1;
}

module.exports = {
  launchesModel,
  // addNewLaunch,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
