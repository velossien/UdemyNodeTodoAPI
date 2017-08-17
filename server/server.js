//CHALLENGE: change server.js over to async/await format

require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");

let { mongoose } = require("./db/mongoose");
let { Todo } = require("./models/todo");
let { User } = require("./models/user");
let { authenticate } = require("./middleware/authenticate");

let app = express();
const port = process.env.PORT;

//configure middleware (using bodyParser to allow us to send JSON to our express app)
app.use(bodyParser.json());

//POST - ADDS TODO DOCUMENT TO COLLECTION
app.post("/todos", authenticate, async (req, res) => { //authenticate is a middleware that will make this route private

    //create To Do document from the request body (uses Mongoose model from other 
    let todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        _creator: req.user._id
    });

    try {
        const doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});


//GET - FETCHES ALL DOCUMENTS IN THE TODO COLLECTION
app.get("/todos", authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({
            _creator: req.user._id //only finds todos that the user created
        });
        res.send({ todos });//better to send back an object instead of array so you can other properties in later such as custom status codes, etc.  Also, this is using es6 way of doing things, so instead of writing todos = todos can just write todos.
    } catch (e) {
        res.status(400).send(e);
    }
});

// CHALLENGE //
//GET - FETCHES DOCUMENT WITH A SPECIFIC ID
app.get("/todos/:id", authenticate, async (req, res) => {
    let id = req.params.id;

    //validate the id - send back empy block
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); //return this to stop rest of function from going ahead
    };

    //use findById to find the ID and send back error statuses if needed
    try {
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    } catch (err) {
        res.status(400).send();
    }
})

// CHALLENGE //
//DELETE: DELETES DOCUMENT FROM COLLECTION BY ID
app.delete("/todos/:id", authenticate, async (req, res) => {
    // get the id
    let id = req.params.id;

    //validate the id--> if not valid -return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    try {
        //remove one todo by id and creator
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});

//PATCH: Update todo items
app.patch("/todos/:id", authenticate, async (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ["text", "completed"]); //allows you to pick which properties you want to be able to update - keeps users from updating ids, etc.

    //validates Id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    //changes completedAt based on if todo is complete or not
    if (_.isBoolean(body.completed) && body.completed) { //if it's a boolean and it's true
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

     //finds the todo by it's Id and updates it with a new body. Then send it back.
    try {
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, { $set: body }, { new: true })
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});

    /* ----------------------USERS---------------------------*/

    //CHALLENGE: POST /users
    app.post("/users", async (req, res) => {
        try {
            let body = _.pick(req.body, ["name", "age", "email", "password"]);

            let user = new User(body);

            /* Explanation of below:
                1.) First the user is saved and this creates a new user. We will find out before this point if the email was valid, etc.
                2.) Then the user is sent as a result to ".then" which sends it through to be used in "user.generateAuthToken"
                3.) user.generateAuthToken creates a access property and a custom hashed token and pushes it to user's empty tokens array.
                4.) the user is saved once again and the promise is returned that will return the value of "token" so that more can be chained on
                5.) back in server.js,  er now have user and token.  .then sends the token to res.header which sends the token back as an HTTP response header and then user is sent back as well.
            */

            user = await user.save();
            const token = await user.generateAuthToken();
            res.header("x-auth", token).send(user); // This sends the token back as an HTTP response header.  ".header" takes two parameters - header name (key), value you want header to be set to.  Also, "x-" is a custom header.
        } catch (e) {
            res.status(400).send(e);
        }
    });

    app.get("/users/me", authenticate, (req, res) => { //authenticate is a middleware (code was pulled out so it could be reused). We are using it this way instead of app.use because we don't want it global, we only want it to be used in this route
        res.send(req.user);
    });

    //CHALLENGE: POST "/users/login"
    app.post("/users/login", async (req, res) => {
        try {
            const body = _.pick(req.body, ["email", "password"]);
            const user = await User.findByCredentials(body.email, body.password);
            const token = await user.generateAuthToken();
            res.header("x-auth", token).send(user);
        } catch (e) {
            res.status(400).send();
        }
    });

    app.delete("/users/me/token", authenticate, async (req, res) => {
        try {
            await req.user.removeToken(req.token);
            res.status(200).send();
        } catch (e) {
            res.status(400).send();
        }
    });

    app.listen(port, () => {
        console.log(`Started on port ${port}`);
    });

    module.exports = { app };