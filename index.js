const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const userRouter = require("./user");

const app = express();
const port = process.env.port || 5000;
const client = db.client;

const allowedUrls = ["http://localhost:3000", "https://heliverse-frontend-lfxx.vercel.app"];
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedUrls.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error())
      }
    },
    credentials: true
  }

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/api/users', userRouter);




app.listen(port, () => console.log("Server is running at", port));