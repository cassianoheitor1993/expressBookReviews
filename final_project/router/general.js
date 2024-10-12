const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (username && password) {
    if (isValid(username, password)) {
      return res.status(200).json({message: "User created successfully"});
    } else {
      return res.status(400).json({message: "User already exists"});
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === isbn);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book = books.find(book => book.author === author);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book = books.find(book => book.title === title);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === isbn);
  if (book) {
    return res.status(200).json(book.review);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
