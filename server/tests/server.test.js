const expect = require("expect");
const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

beforeEach((done) => { //before each test case - do this.
    Todo.remove({}).then(() => done()); //empties database
});

//LEARNING
//describe will allow you to describe what the tests are doing to post to your terminal
describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        let text = "Test todo text";

        request(app) //making a request on the "app"
            .post("/todos") //sets up a POST request
            .send({ text }) //sends data with the request as the body
            .expect(200) //this expect method is part of supertest library-  checking the status is
            .expect((res) => { //so is this one! (custom expect calls to get passed a response that is used below)
                expect(res.body.text).toBe(text); //this expect is part of the expect library
            }) // this is making an assertion about thr body that comes back - want to make sure the body is an object and it has the text property equal to one we specified
            .end((err, res) => {
                if (err) {
                    return done(err); //returning this will stop the function exectution so the rest isn't run
                };

                Todo.find().then((todos) => { //make a request to the database fetching all todos
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done(); //wraps up test case
                }).catch((error) => done(error)); //this will catch any errors above
                //end will wrap things up - but we want to check what actually got stored in the mongoDB collection.  Instead of passing done into end - will pass in a callback expecting an error and/or result.
            })
    });

    //CHALLENGE - create a test to make sure to do documents aren't created with invalid input
    it("should not create todo with invalid body data", (done) => {

        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            })
    });
});