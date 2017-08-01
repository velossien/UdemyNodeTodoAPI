let mongoose = require("mongoose");

//tell mongoose which promise library to use
mongoose.Promise = global.Promise;

//connects server
mongoose.connect("mongodb://localhost:27017/TodoApp");

//creates the model for mongoose to use for the To Do (Todo) documents
let Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true, //this property is necessary to be added
        minlength: 1,
        trim: true //trims whitespace off of any string

    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// LEARNING: 
//example of a new Todo document being created from the Todo constructor above
let newTodo = new Todo({
    text: "Cook dinner"
});

newTodo.save().then((result) => {
    console.log("Saved To Do", result)
}, (e) => {
    console.log("Could not save To Do item.");
});


//CHALLENGE: create a new To Do document that has been completed.
let secondTodo = new Todo({
    text: "Feeds all the cats.",
    completed: true,
    completedAt: 10
});

secondTodo.save().then((result) => {
    console.log("Saved To Do", result);
}, (err) => {
    console.log("Could not save To Do item.");
});

//CHALLENGE
//create a User model with an email property that is required, trimmed, has a set type and min length of 1  
let User = mongoose.model("Users", {
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

//create a new User
let newUser = new User({
    name: "Jilly Schloss",
    age: 98,
    email: "jschloss@gmail.com  "
});

newUser.save().then((result) => {
    console.log("User saved",result);
}, (err) => {
    console.log("Could not save User.", err);
});