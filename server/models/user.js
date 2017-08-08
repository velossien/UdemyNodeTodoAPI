const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

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

//over-ride method to update how mongoose handles certain things - tells it what to send back when a mongoose item is changed into a JSON value.  This will make it so we are not returning the token or password to a user.
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject(); //converts mongoose variable (user) to a regular object where only the properties available on the document exist

    return _.pick(userObject, ["_id", "email", "name", "age"]);
};

UserSchema.methods.generateAuthToken = function () { //UserSchema is an object so we can add an instance method using .methods.
    let user = this; //did not use an arrow function so we could use "this"
    let access = "auth";
    let token = jwt.sign({ _id: user._id.toHexString(), access }, "secretsalt").toString();

    user.tokens.push({ access, token }); //pushes the token to the user.tokens array (which is empty by default)
    return user.save().then(() => {
        return token; //do this so later on in the server file we can grab the token by tacking on a .then callback, getting access to the token and then responding inside of the callback function.  
        //put the first return so this can happen
    });
};

let User = mongoose.model("User", UserSchema);

module.exports = { User };