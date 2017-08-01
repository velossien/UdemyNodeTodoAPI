// const MongoClient = require("mongodb").MongoClient; can be replaced by destructuring below.
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        //return so it stops the function from continuing if there is an error
        return console.log("Unable to connect to MongoDB server.");
    }
    console.log("Connected to MongoDB Server");

    //LEARNING:
    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("597fc375ce04ff1c71ae2953")
    // }, {
    //     $set:{completed:false}
    // },{
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // });

    //CHALLENGES:

    //change name to different name in Users collection
    //increment age of same user in the User collection
    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("597a9813f5b2c8452fd290c9")
    }, {
            $set: { name: "Chris Grimm" },
            $inc: { age: 1 }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    // db.close(); closes connection (commented out while doing )
});
