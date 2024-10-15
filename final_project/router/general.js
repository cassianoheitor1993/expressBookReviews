const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", async (req, res) => {
  try {
      const { username, password } = req.body;

      // Check if both username and password are provided
      if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required." });
      }

      // Check if the username is already taken
      if (!isValid(username)) {
          return res.status(400).json({ message: "Username already exists." });
      }

      // Simulate asynchronous operation (e.g., database insertion)
      await new Promise((resolve) => {
          users.push({ username, password });
          resolve();
      });

      return res.status(200).json({ message: "User successfully registered." });
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get the list of books available in the shop
public_users.get('/', async function (req, res) {
  try {
      // Simulate asynchronous operation
      const allBooks = await new Promise((resolve) => {
          resolve(books);
      });
      return res.status(200).json(allBooks);
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const book = await new Promise((resolve) => {
          resolve(books[isbn]);
      });

      if (book) {
          return res.status(200).json(book);
      } else {
          return res.status(404).json({ message: "Book not found." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
      const author = req.params.author.toLowerCase();
      let filteredBooks = await new Promise((resolve) => {
          let result = [];
          for (let isbn in books) {
              if (books[isbn].author.toLowerCase() === author) {
                  result.push({ isbn, ...books[isbn] });
              }
          }
          resolve(result);
      });

      if (filteredBooks.length > 0) {
          return res.status(200).json(filteredBooks);
      } else {
          return res.status(404).json({ message: "No books found for the given author." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});


// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title.toLowerCase();
      let filteredBooks = await new Promise((resolve) => {
          let result = [];
          for (let isbn in books) {
              if (books[isbn].title.toLowerCase() === title) {
                  result.push({ isbn, ...books[isbn] });
              }
          }
          resolve(result);
      });

      if (filteredBooks.length > 0) {
          return res.status(200).json(filteredBooks);
      } else {
          return res.status(404).json({ message: "No books found with the given title." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get book reviews
public_users.get('/review/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const book = await new Promise((resolve) => {
          resolve(books[isbn]);
      });

      if (book) {
          return res.status(200).json(book.reviews);
      } else {
          return res.status(404).json({ message: "Book not found." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports.general = public_users;