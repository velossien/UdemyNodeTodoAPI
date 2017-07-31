// const MongoClient = require("mongodb").MongoClient; can be replaced by destructuring below.
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        //return so it stops the function from continuing if there is an error
        return console.log("Unable to connect to MongoDB server.");
    }
    console.log("Connected to MongoDB Server");

    // db.collection("Todos").find({
    //     _id: new ObjectID("597a91d45c7612441fa8cf41")
    // }).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    // db.collection("Todos").find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    db.collection("Users").find({name:"Tara Grimm"}).toArray().then((docs) => {
        console.log("Users");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("Unable to fetch Users", err);
    });

    db.collection("Users").find({name:"Tara Grimm"}).count().then((count) => {
        console.log(`Users count: ${count}`);
    }, (err) => {
        console.log("Unable to fetch Users", err);
    });


    // db.close(); //closes connection
});
