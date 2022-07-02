const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
//const launches = new Map();

//  let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

//example data
// const launch = {
//   flightNumber: 100, //flight_number
//   mission: 'kepler exploration', //name
//   rocket: 'Explore IS1', //rocket.name
//   launchDate: new Date('December 27, 2030'), //date_local
//   target: 'Kepler-442 b', //n/a
//   customers: ['ZTM', 'NASA'], //payload.customers per payload
//   upcoming: true, //upcoming
//   success: true, //success
// };

//saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading data from spaceX');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading data');
    throw new Error('Launch data not download from api !');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];

    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      //customers: customers,
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded !');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

//launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
  //  return launches.has(launchId);
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  //return Array.from(launches.values());
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({
      flightNumber: 1,
    })
    .skip(skip) //number result to skip
    .limit(limit); //number of results
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

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('Planet not found !');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Ztm', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  // await launches.updateOne ({
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function abortLaunchById(launchId) {
  //const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
