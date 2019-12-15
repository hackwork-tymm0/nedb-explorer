console.log("generating database...");

const NeDB = require("nedb");

const db = new NeDB({ filename: "./example/test.db" });
db.loadDatabase();

db.insert({name : "Boris the Blade", year: 1946});
db.insert({foo : "bar", leet: 1337});
db.insert({car: "Tesla", model: "X"})