const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
// app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.find(x=>x.username === username);
    return user !== undefined;
}


// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if(!username || !password){
    return res.status(404).json({message:"Error logging in"});
  }

  // Authenticate user
  if (authenticatedUser(username, password)){
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Customer successfully logged in");
  } else{
    return res.status(208).json({message: "Invalid login"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(isValid(req.body.username)){
    let isbn = Number(req.params.isbn);
    let book = books[isbn];
    book["reviews"][req.body.username] = req.query.review;

    res.status(200).send("The review for the book with ISBN "+isbn+" has been added/updated.")
  }
  return res.status(300).json({message: "User not logged in"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if(isValid(req.body.username)){
    let isbn = Number(req.params.isbn);
    let book = books[isbn];

    if(book["reviews"][req.body.username] !== undefined){
      delete book["reviews"][req.body.username];
      res.send("Review for the ISBN "+isbn+" posted by the user "+req.body.username+" deleted");
    }
    return res.status(300).json({message:book["reviews"][req.body.username]});
  }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
