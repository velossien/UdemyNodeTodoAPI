// sets our environment -if we are on production or testing - the first option will be set and if not will be in development
let env = process.env.NODE_ENV || "development";
console.log("Environment: ", env);

if(env === "development" || env==="test"){
    let config = require("./config.json"); //by requiring a json - will automaticlaly parse it into a javascript object
    let envConfig = config[env]; //when you want to use a variable to access a property- need ot use bracket notation

    Object.keys(envConfig).forEach((key)=>{//takes an obj, gets all the keys and returns them as an array
        process.env[key] = envConfig[key];
    }); 

};

/* Commented out below code as above is a more private way of adding the environment variables

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest" //use test database instead
}
*/

