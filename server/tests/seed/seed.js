const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

//array of dummy todos so we can test our GET todos route
const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    completed: false,
    completedAt: null,
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    _creator: userOneId,
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
}]

const users = [{
    name: "UserOne",
    age: 10,
    _id: userOneId,
    email: "taragrimmod@gmail.com",
    password: "userOnePass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET).toString()
    }]
}, {
    name: "UserTwo",
    age:28,
    _id: userTwoId,
    email: "chris.grimm@gmail.com",
    password: "userTwoPass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET).toString()
    }]
}];

const populateTodos = (done) => { //before each test case - do this.
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);  //removes items from database and then tacks on our test array
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save(); //promise 1
        let userTwo = new User(users[1]).save(); //promise 2

        return Promise.all([userOne, userTwo]) //will wait for both promises to come back before continuing
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };