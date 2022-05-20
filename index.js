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

    const bookingCollection = client.db("doctors_portal").collection("booking");

    ////11.get all services////
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    ////13.find available time slot////
    app.get("/available", async (req, res) => {
      const date = req.query.date;
      //step1:get all services
      const services = await serviceCollection.find().toArray();
      //step2:get booking of that day
      const query = { date: date };
      const bookings = await bookingCollection.find(query).toArray();
      //step3: for each service

      services.forEach((service) => {
        //step4: find booking of that service output:[{},{}..]
        const serviceBookings = bookings.filter(
          (book) => book.treatment === service.name
        );
        //step5: select slot for the service bookings:['',''.]
        const bookedSlots = serviceBookings.map((book) => book.slot);
        //step6: select those slot that are not bookedSlots
        const available = service.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        //step7: set available to slots to make it easier
        service.slots = available;
      });
      res.send(services);
    });

    ////14. get individual user appoinment(dashboard)
    app.get("/booking", async (req, res) => {
      const patient = req.query.patient;
      const query = { patient: patient }; //create object for make search query
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    ////12.insert booking////
    app.post("/booking", async (req, res) => {
      const booking = req.body;

      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exists = await bookingCollection.findOne(query);

      if (exists) {
        return res.send({ success: false, booking: exists });
      } else {
        const result = await bookingCollection.insertOne(booking);
        res.send({ success: true, result });
      }
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
