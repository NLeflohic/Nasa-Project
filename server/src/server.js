const http = require ('http');
const app = require('./app');

const {loadPlanetsData} = require ('./models/planets.model');
const {mongoConnect} = require ('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const mongoose = require ('mongoose');


async function startServer () {
  await mongoConnect();
  await loadPlanetsData();

  server.listen (PORT, () => {
    console.log (`Listening on port ${PORT}`)
  });
}

startServer();
//nasa-api
//RrlBSxOyD7AyrjDp
//nasa-api2
//dgZ7zFLizkIspaS6

//
