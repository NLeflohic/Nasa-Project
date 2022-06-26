const {MongoClient} = require ('mongodb');
const request = require ('supertest');
const app = require('../../app');
// const { mongoConnect, mongoDisconnect } = require ('../../services/mongo');


describe('Launches API', () => {
// beforeAll(async () => {
//   const connection = await mongoConnect();
//   console.log (connection);
// })

// afterAll(async () => {
//   mongoDisconnect();
// })
let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect("mongodb+srv://nasa-api2:dgZ7zFLizkIspaS6@cluster0.slajv.mongodb.net/nasadb?retryWrites=true&w=majority");
  console.log (connection);
  db = await connection.db();
  console.log (db)
});

afterAll(async () => {
  await connection.close();
});

// beforeEach(async () => {
//   jest.setTimeout(30000)
// })

describe('Test GET /launches', () => {
  test ('It should respond with 200 success', async () => {
    const response = await request(app)
    .get('/launches')
    .expect('Content-Type', /json/)
    .expect(200);
  })
})

describe ('Test POST /launch', () => {
  const completeLaunchData = {
    mission: "USS Entreprise",
    rocket: "NCC 1707-D",
    target: "Kepppler TEST",
    launchDate: "January 4, 2028"
  };

  const launchDataWithoutDate = {
    mission: "USS Entreprise",
    rocket: "NCC 1707-D",
    target: "Kepppler TEST",
  }

  const completeLaunchDataWithFalseDate = {
    mission: "USS Entreprise",
    rocket: "NCC 1707-D",
    target: "Kepppler TEST",
    launchDate: "Hello"
  };


  test ('It should respond 201 created', async () => {
  const response = await request (app)
    .post('/launches')
    .send (completeLaunchData)
    .expect('Content-Type', /json/)
    .expect(201);

  const requestDate = new Date (completeLaunchData.launchDate).valueOf();
  const responseDate = new Date (response.body.launchDate).valueOf();
  expect(requestDate).toBe(responseDate);

  expect(response.body).toMatchObject (launchDataWithoutDate)
  });

  test('It should catch missing required properties', async () => {
    const response = await request (app)
    .post('/launches')
    .send (launchDataWithoutDate)
    .expect('Content-Type', /json/)
    .expect(400);

    expect(response.body).toStrictEqual ({
      error: "Missing launch property",
    });
  });
  test('It should catch invalid dates', async () => {
    const response = await request (app)
    .post('/launches')
    .send (completeLaunchDataWithFalseDate)
    .expect('Content-Type', /json/)
    .expect(400);

    expect(response.body).toStrictEqual ({
      error: "Invalid launch date",
    });
  });
})
});
