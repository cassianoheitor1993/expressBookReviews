const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const user = users.find(user => user.username === username);

  if (user) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if the user is valid
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    return true;
  } else {
    return false;
  }


}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      return res.status(200).json({message: "User logged in successfully"});
    } else {
      return res.status(400).json({message: "Invalid credentials"});
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === isbn);
  if (book) {
    book.reviews.push(req.body);
    return res.status(200).json({message: "Review added successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
