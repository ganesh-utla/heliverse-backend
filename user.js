const express = require("express");
const db = require("./db");

const userRouter = express.Router();

const client = db.client;

userRouter.route('/')

.get(async (req, res, next) => {

    let query = {seqId: {$exists: false}};

    if (req.query) {
        if (req.query.searchText) {
            query['$or'] = [
                {first_name: new RegExp(".*" + req.query.searchText + ".*", 'i')},
                {last_name: new RegExp(".*" + req.query.searchText + ".*", 'i')},
                {email: new RegExp(".*" + req.query.searchText + ".*", 'i')}
            ]
        }
        if (req.query.gender) 
            query.gender = {$in: JSON.parse(req.query.gender)};
        if (req.query.domain) 
            query.domain = {$in: JSON.parse(req.query.domain)};
        if (req.query.available) {
            const tmp = JSON.parse(req.query.available);
            const arr = [];
            if (tmp.includes('Available')) arr.push(true);
            if (tmp.includes('Not Available')) arr.push(false);
            query.available = {$in: arr};
        }
    };
    if (req.query && req.query.usedfor==="user-count") {
        const result = await client.db("heliverse").collection("users").countDocuments(query);
        const data = {count: result};
        res.send(data);
    } else {
        const result = await client.db("heliverse").collection("users").find(query).skip(Number(req.query.skip)).limit(20).toArray();
        res.send(result);
    }

})

.post(async (req, res, next) => {
    const nextSeq = await client.db("heliverse").collection("users").findOneAndUpdate(
        { id: "userId" }, {$inc: {seqId : 1}}
    );
    let user = req.body;
    user.id = nextSeq.seqId;
    await client.db("heliverse").collection("users").insertOne(user);
    res.send("1 user added");
});

userRouter.route("/:id")

.put(async (req, res, next) => {
    const r = await client.db("heliverse").collection("users").updateOne({id: parseInt(req.params.id)}, {$set: req.body});
    res.send(`1 user updated ${r.matchedCount} ${r.modifiedCount}`);
})

.delete(async (req, res, next) => {
    const r = await client.db("heliverse").collection("users").deleteOne({id: parseInt(req.params.id)});
    res.send("1 user deleted" + ` ${r.deletedCount}`);
});


module.exports = userRouter;