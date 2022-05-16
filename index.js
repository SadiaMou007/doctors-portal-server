///////////////2////////////////
const { MongoClient, ServerApiVersion } = require("mongodb");

///////////////1s////////////////
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
///////////////1e////////////////

///////////////1s////////////////
app.use(cors());
app.use(express.json());
///////////////1e////////////////

///////////////2////////////////
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixhmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    //console.log("db connected");
    const serviceCollection = client
      .db("doctors_portal")
      .collection("services");

    ////get all services////
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
  } finally {
  }
}
run().catch(console.dir);

///////////////1s////////////////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("App listening on port");
});
///////////////1e////////////////
