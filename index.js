const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const userRouter = require("./user");

const app = express();
const port = process.env.port || 5000;
const client = db.client;

app.use(bodyParser.json());
app.use(cors());


app.use('/api/users', userRouter);




app.listen(port, () => console.log("Server is running at", port));