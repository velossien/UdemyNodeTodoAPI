let mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp"); //the first option comes from the mlab addon in heroku

module.exports = { mongoose };