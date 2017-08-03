const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

let id = '698370463eac999215661db0'; //must be single quotes

if (!ObjectID.isValid(id)) {
    console.log("ID not valid.");
}

// Using .find to find something by an ID
Todo.find({
    _id: id //mongoose will take this string and turn it into an OBjectID
}).then((todos) => {
    console.log("Todos", todos);
});

//Using .findOne to find something by an ID
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log("Todo:", todo);
});

// Using findById (which is recommended for this case)
Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log("Id not found.")
    };
    console.log("Todo by ID:", todo);
}).catch((e) => console.log(e));

//CHALLENGE
let userId = '5980d283f731fb96055b454d11';

if (!ObjectID.isValid(userId)) {
    console.log("User ID is not valid.");
}

User.findById(userId).then((user) => {
    if (!user) {
        return console.log("User ID not found.");
    };

    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));