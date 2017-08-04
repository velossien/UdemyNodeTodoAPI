const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

//Todo.remove({}) - removes everything if left blank (like shown), will remove all of 
Todo.remove({}).then((result) => {
    console.log(result);
});

//findOneAndRemove - finds the first one and removes it - also returns the data removed
Todo.findOneAndRemove({_id:"5984bace4b8c5e7c1d9e7b4f"}).then((todo)=>{
    console.log(todo);
});

//Todo.findById - finds the first one with an id and removes it - returning the data removed (THIS IS PREFERRED)
Todo.findByIdAndRemove("5984b9fa4b8c5e7c1d9e7b33").then((todo)=>{
    console.log(todo);
});