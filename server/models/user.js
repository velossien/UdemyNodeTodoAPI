const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

//switched to using a Schema, so you could add methods on as needed
let UserSchema = new mongoose.Schema({
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
        trim: true,
        unique: true, //can't have same email in the database
        validate: {
            validator: (value) => {
                validator.isEmail(value);
            }, //can also just do validator: validator.isEmail,
            message: "{VALUE} is not a valid email."
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//over-ride the method to update how mongoose handles certain things - tells it what to send back when a mongoose item is changed into a JSON value.  This will make it so we are not returning the token or password to a user. This is not called later on, it is just now part of UserSchema as a method.
UserSchema.methods.toJSON = function () {
    let user = this; //did not use an arrow function so we could use "this". Added this line, so it's clear what "this" is.
    let userObject = user.toObject(); //converts mongoose variable (user) to a regular object where only the properties available on the document exist. This gets rid of all the extra mongoose methods/props.

    return _.pick(userObject, ["_id", "email", "name", "age"]);
};

UserSchema.methods.generateAuthToken = function () { //UserSchema is an object so we can add an instance method using .methods.
    let user = this;
    let access = "auth";
    let token = jwt.sign({ _id: user._id.toHexString(), access }, "secretsalt").toString();

    user.tokens.push({ access, token }); //pushes the token to the user.tokens array (which is empty by default)
    return user.save().then(() => {
        return token; //do this so later on in the server.js file we can grab the token by tacking on a .then callback thus getting access to the token
        //the first return is put in because you want to send back the whole promise chain, so more can chained onto it. If you don't return the whole thing, then you won't be able to chain the next .then on it in server.js
    });
};

UserSchema.statics.findByToken = function (token) {  //statics is an object likes methods (above), but everything you add onto it turns into a model method instead of an instance method
    let User = this; //model methods get called with the model (User instead of user) as the .this binding
    let decoded; //stores the decoded jwt values

    try {
        decoded = jwt.verify(token, "secretsalt");
    } catch (e) {
        return Promise.reject(); //return a promise so the chain continues back in server.js
    };
    /* Above is a shortened version of writing:
    return new Promise((resolve, reject) => {
         reject();
    }
    */


    /* find one User whose:
        -->  _id matches the decoded id
        --> a token nested inside their tokens array equals our requested token
        --> an access property nested inside their tokens array equals "auth"
        * mongoDB allows us to use the syntax below instead of having to deal with nesting things
    */
    return User.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
}
UserSchema.pre("save", function (next) {
    let user = this;

    if (user.isModified("password")) { //returns true if "password" is modified, false if not
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model("User", UserSchema);

module.exports = { User };