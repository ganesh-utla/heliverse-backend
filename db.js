const { MongoClient } = require("mongodb");
require("dotenv").config();

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
try {
    client.connect();
    console.log("Connected");
}
catch (e) {
    console.log(e);
}

module.exports = {
    client
};
