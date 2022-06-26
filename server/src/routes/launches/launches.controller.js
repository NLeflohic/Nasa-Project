//const { launches } = require ('../../models/launches.model');
const { launchesModel, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require ('../../models/launches.model');

async function httpGetLaunches (req, res) {
  //return res.status(200).json(Array.from(launches.values()));
  return res.status(200).json(await launchesModel());
};

async function httpAddNewLaunch (req, res) {
  const launch = req.body;
  console.log ('receive ' + launch);

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: "Missing launch property"
    });
  }

  launch.launchDate  = new Date (launch.launchDate);
  if (isNaN (launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch (req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    })
  };

  const aborted = await abortLaunchById(launchId);
  // return res.status(200).json(aborted);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  };

  return res.status(200).json({
    ok: true
  });
}

module.exports = { httpGetLaunches , httpAddNewLaunch, httpAbortLaunch};
