const http = require ('http');
const app = require('./app');

const {loadPlanetsData} = require ('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = "mongodb+srv://nasa-api2:dgZ7zFLizkIspaS6@cluster0.slajv.mongodb.net/nasadb?retryWrites=true&w=majority"

const server = http.createServer(app);
const mongoos = require ('mongoose');
const { default: mongoose } = require('mongoose');

mongoose.connection.on('open', () => {
  console.log('Mongo DB connection ready !');
})

mongoose.connection.on('error', (error) => {
  console.log (error);
})

async function startServer () {
  await mongoose.connect(MONGO_URL);
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
