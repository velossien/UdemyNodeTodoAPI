let mongoose = require("mongoose");

//tell mongoose which promise library to use
mongoose.Promise = global.Promise;

//connects server
mongoose.connect("mongodb://localhost:27017/TodoApp");

//creates the model for mongoose to use for the To Do (Todo) documents
let Todo = mongoose.model("Todo", {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// LEARNING: 
    //example of a new Todo document being created from the Todo constructor above
let newTodo = new Todo({
    text: "Cook dinner"
});

newTodo.save().then((result)=>{
    console.log("Saved To Do", result)
},(e)=> {
    console.log("Could not save To Do item.");
});


//CHALLENGE: create a new To Do document that has been completed.
let secondTodo = new Todo({
    text: "Cook all the foods.",
    completed: true,
    completedAt: 10
});

secondTodo.save().then((result) => {
    console.log("Saved To Do", result);
}, (err) => {
    console.log("Could not save To Do item.");
});