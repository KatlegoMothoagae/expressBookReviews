const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    if(!doesExist(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message:"Customer successfully registered now you can login"});
    }
    // Add the new user to the users array
  } else{
    return res.status(404).json({message:username});
  }

  return res.status(404).json({message:"Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  await res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = Number(req.params.isbn);

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  })
      .then(book => {
        res.send(book);
      })
      .catch(error => {
        res.status(404).send(error);
      });
});


public_users.get('/author/:author', async function (req, res) {
  const filteredBooks = [];
  const author = req.params.author;

  await Object.keys(books).forEach(key => {
    const value = books[key];
    if (value["author"] === author) {
      filteredBooks.push(value);
    }
  });

  res.send(filteredBooks);
});
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const filteredBooks = [];
  const title = req.params.title;
  await Object.keys(books).forEach( key => {
    const value = books[key];
    if(value["title"] === title){
      filteredBooks.push(value);
    }
  })
  res.send(filteredBooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = [];
  const isbn = req.params.isbn;
  Object.keys(books).forEach(key => {
    const value = books[key]["reviews"];
    if(key === isbn ){
      reviews.push(value)
    }
  })
  res.send(reviews)

});

module.exports.general = public_users;
