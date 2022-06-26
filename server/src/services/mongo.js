const mongoose = require ('mongoose');

const MONGO_URL = "mongodb+srv://nasa-api2:dgZ7zFLizkIspaS6@cluster0.slajv.mongodb.net/nasadb?retryWrites=true&w=majority"

mongoose.connection.on('open', () => {
  console.log('Mongo DB connection ready !');
})

mongoose.connection.on('error', (error) => {
  console.log (error);
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect () {
  await mongoose.disconnect();
}

module.exports = {mongoConnect, mongoDisconnect};
