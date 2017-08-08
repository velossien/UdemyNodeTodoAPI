//Do not run this code. Need to comment out either JWT code or SHA256 code for it to run

const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

let data = {
    id: 10
};

let token = jwt.sign(data, "secretsalt"); //creates a hash of data including the salt
console.log(token);

let decoded = jwt.verify(token,"secretsalt");

console.log("Decoded:",decoded);


//-------------------------------------------------------------------
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