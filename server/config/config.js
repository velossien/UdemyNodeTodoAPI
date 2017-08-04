// sets our environment -if we are on production or testing - the first option will be set and if not will be in development
let env = process.env.NODE_ENV || "development";
console.log("Environment: ", env);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest" //use test database instead
}

