// const MongoClient = require("mongodb").MongoClient; can be replaced by destructuring below.
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        //return so it stops the function from continuing if there is an error
        return console.log("Unable to connect to MongoDB server.");
    }
    console.log("Connected to MongoDB Server");

    //LEARNING:
    //deleteMany
    db.collection("Todos").deleteMany({ text: "Walk the dog" }).then((result) => {
        console.log(result);
    });

    //deleteOne
    db.collection("Todos").deleteOne({ text: "Eat lunch" }).then((result) => {
        console.log(result);
    });

    // findOneAndDelete
    db.collection("Todos").findOneAndDelete({ completed: false }).then((results) => {
        console.log(results);
    });


    // CHALLENGES
    db.collection("Users").deleteMany({ name: "Chris Grimm" }).then((result) => {
        console.log(result);
    });

    db.collection("Users").findOneAndDelete({
        _id: new ObjectID("597a9807ae6aee452b4fe66b")
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });

    // db.close(); //closes connection (commented out while doing )
});
