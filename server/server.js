let express = require("express");
let bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

let { mongoose } = require("./db/mongoose");
let { Todo } = require("./models/todo");
let { User } = require("./models/user");

let app = express();
const port = process.env.PORT || 3000;

//configure middleware (using bodyParser to allow us to send JSON to our express app)
app.use(bodyParser.json());

//POST - ADDS TODO DOCUMENT TO COLLECTION
app.post("/todos", (req, res) => {

    //create To Do document from the request body (uses Mongoose model from other 
    let todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt

    });

    //save model to database
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});


//GET - FETCHES ALL DOCUMENTS IN THE TODO COLLECTION
app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos }); //better to send back an object instead of array so you can other properties in later such as custom status codes, etc.  Also, this is using es6 way of doing things, so instead of writing todos = todos can just write todos.
    }, (e) => {
        res.status(400).send(e);
    });
});

// CHALLENGE //
//GET - FETCHES DOCUMENT WITH A SPECIFIC ID
app.get("/todos/:id", (req, res) => {
    let id = req.params.id;

    //validate the id - send back empy block
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); //return this to stop rest of function from going ahead
    };

    //use findById to find the ID and send back error statuses if needed
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }, (err) => {
        res.status(400).send();
    })
})

// CHALLENGE //
//DELETES DOCUMENT FROM COLLECTION BY ID
app.delete("/todos/:id", (req, res) => {

    // get the id
    let id = req.params.id;

    //validate the id--> if not valid -return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    //remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };