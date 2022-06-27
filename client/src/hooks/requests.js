const API_URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  const response = await fetch(API_URL + '/planets');
  return await response.json();
}

//load launches and sort by number
async function httpGetLaunches() {
  const response = await fetch(API_URL + '/launches');
  const fetchLaunches = await response.json();
  console.log(fetchLaunches);
  return fetchLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  console.log('send' + launch);
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
