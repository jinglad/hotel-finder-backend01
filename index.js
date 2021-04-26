const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpsgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("ordersPic"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hotel Finder");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const rentCollection = client.db("houseFinder").collection("rentCollection");
  const requestCollection = client
    .db("houseFinder")
    .collection("requestCollection");

  const AdminCollection = client
    .db("houseFinder")
    .collection("adminCollection");

  app.get("/fullBookingList", (req, res) => {
    rentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //Add Order by Client
  app.post("/postOrder", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const price = req.body.price;
    const title = req.body.title;
    const location = req.body.location;
    const bathroom = req.body.bathroom;
    const bedroom = req.body.bedroom;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    rentCollection
      .insertOne({
        name,
        email,
        price,
        title,
        location,
        bathroom,
        bedroom,
        image,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/customerOrders", (req, res) => {
    rentCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
        console.log(documents);
      });
  });

  app.post("/addRequest", (req, res) => {
    let request = req.body;
    requestCollection.insertOne(request).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/requests", (req, res) => {
    requestCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/makeAdmin", (req, res) => {
    let request = req.body;
    AdminCollection.insertOne(request).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/isAdmin", (req, res) => {
    AdminCollection.find({ admin: req.query.email }).toArray(
      (err, documents) => {
        res.send(documents);
      }
    );
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
