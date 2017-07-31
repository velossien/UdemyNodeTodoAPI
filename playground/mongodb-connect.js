// const MongoClient = require("mongodb").MongoClient; can be replaced by destructuring below.
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
    if(err){
        //return so it stops the function from continuing if there is an error
        return console.log("Unable to connect to MongoDB server.");
    }
    console.log("Connected to MongoDB Server");

    // db.collection("Todos").insertOne({
    //     text: "Something to do",
    //     complete: false
    // },(err,result)=>{
    //     if (err) {
    //         return console.log("unable to insert todo", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //insert new doc into Users (name, age, location)

    // db.collection("Users").insertOne({
    //     name: "Tara Grim",
    //     age: "28",
    //     location:"BOHHSTAN"
    // },(err, result)=>{
    //     if(err){
    //         console.log("Unable to insert User.");
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    // });

    db.close(); //closes connection
});
