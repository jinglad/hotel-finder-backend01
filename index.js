const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri =
  "mongodb+srv://houseFinder:HouseFinder38@cluster0.vpsgc.mongodb.net/houseFinder?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.send("Hotel Finder");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const rentCollection = client.db("houseFinder").collection("rentCollection");

  app.get("/fullBookingList", (req, res) => {
    rentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
