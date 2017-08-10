//Do not run this code. Need to comment out either JWT code or SHA256 code for it to run

const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//LEARNING about jsonwebtoken!
let data = {
    id: 10
};

let token = jwt.sign(data, "secretsalt"); //creates a hash of data including the salt
console.log(token);

let decoded = jwt.verify(token,"secretsalt");

console.log("Decoded:",decoded);

//-------------------------------------------------------------------
//LEARNING ABOUT CRYPTO-JS

//Code below is using crypto-js. You can see it is a much long way of hashing than using jsonwebtoken

let message = "I am user number 3";
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + "somesecret").toString() //"some secret" is the "salt"
}

//example of someone trying to "hack in"
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

if (resultHash === token.hash){
    console.log("Data was not changed.");
} else {
    console.log("Data was changed. Do not trust!");
} 

//-------------------------------------------------------------------
//LEARNING ABOUT BCRYPT-JS - hashes passwords and compares them

let password = "!23abc";

bcrypt.genSalt(10, (err, salt) => { //first parameter --> number of rounds to generate salt, bigger numbers will take longer --> decreases ability to brute force
    bcrypt.hash(password, salt, (err, hash) => {  //1st parameter= what you want to hash, 2nd param= the salt (generated above), 3rd param= callback that gives back hash value which can be stored in database
        console.log(hash);
    });
});

let hashedPassword = "$2a$10$/WZutKNlQvZOSTD4kFnR..g2/aYJVrSFktiezKkegNmSds7VeAyca";

bcrypt.compare(password, hashedPassword, (err, res)=>{ //compares normal password a user would put in against the hash of a password
    console.log(res);
})