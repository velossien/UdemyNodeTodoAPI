const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");


beforeEach(populateUsers);
beforeEach(populateTodos);

/*------ TO DO ------*/

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

                Todo.find({ text }).then((todos) => { //make a request to the database fetching all todos with "text" in them (so we aren't thrown off by our dummy array)
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
                    expect(todos.length).toBe(2); //this will include the two dummy documents passed in
                    done();
                }).catch((error) => done(error));
            })
    });
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) //toHexString will turn this into a string
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        let testID = new ObjectID();

        request(app)
            .get(`/todos/${testID.toHexString()}`)
            .expect(404)
            .end(done);
        //make sure you get a 4040 back if make new object id that isn't in the array
    });

    it("should return 404 for non-object ids", (done) => {
        // /todos/123 passed in - will fail
        request(app)
            .get("/todos/123")
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {

    let deleteId = todos[0]._id.toHexString();

    it("should delete todo document based on id", (done) => {
        request(app)
            .delete(`/todos/${deleteId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(deleteId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                };

                Todo.findById(deleteId).then((todo) => {
                    expect(todo).toNotExist;
                    done();
                }).catch((error) => done(error));
            })
    });

    it("should return 404 if Todo is not found", (done) => {
        let deleteId = new ObjectID();

        request(app)
            .delete(`/todos/${deleteId}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if ID is not valid", (done) => {
        request(app)
            .delete("/todos/123")
            .expect(404)
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {


    it("should update todo document based on id", (done) => {

        let id = todos[0]._id.toHexString();
        let text = "Update todo.";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                };

                Todo.findById(id).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA("number");
                    done();
                }).catch((error) => done(error));
            })
    });

    it("should clear completedAt when todo is not completed", (done) => {
        let id = todos[1]._id.toHexString();
        let text = "Update todo!!";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

    it("should return 404 if todo is not found", (done) => {
        let newId = new ObjectID();
        request(app)
            .patch(`/todos/${newId}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if ID is not valid", (done) => {
        request(app)
            .patch("/todos/123")
            .expect(404)
            .end(done)
    });

});


/*------ USERS ------*/
describe ("GET /users/me", ()=>{

    let token = 

    it("should return user if authenticated",(done)=>{
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token) //sets headers
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("should return 401 if not authenticated",(done)=>{
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({}); //have to use toEqual instead of toBe
            })
            .end(done);
    });
});

describe ("POST /users/",()=>{

    it("should should create a user",(done)=>{
        let email = "example@example.com";
        let password = "123abc";

        request(app)
            .post("/users/")
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{  //find user based on email
                    expect(user).toExist();  //expect user exists
                    expect(user.password).toNotBe(password);  //if this fails, means passwords aren't being hashed
                    done();
                })
            })
    });

    it("should return validations errors if request invalid",(done)=>{
        let invalidEmail = "";
        let invalidPassword = "";
        
        request(app)
            .post("/users/")
            .send({invalidEmail, invalidPassword})
            .expect(400)
            .end(done);
    });

    it("should not create user if email in use",(done)=>{
        let repeatEmail = users[0].email;
        let password= "aaaaaa";

        request(app)
            .post("/users/")
            .send({repeatEmail, password})
            .expect(400)
            .end(done);

    });

});