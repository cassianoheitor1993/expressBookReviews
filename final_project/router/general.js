const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
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
    new Promise((resolve, reject) => {
        try {
            users.push({ username, password });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
    .then(() => {
        return res.status(200).json({ message: "User successfully registered." });
    })
    .catch((error) => {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

// Get the list of books available in the shop
public_users.get('/', (req, res) => {
    // Simulate asynchronous operation
    new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (error) {
            reject(error);
        }
    })
    .then((allBooks) => {
        return res.status(200).json(allBooks);
    })
    .catch((error) => {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        try {
            const book = books[isbn];
            resolve(book);
        } catch (error) {
            reject(error);
        }
    })
    .then((book) => {
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found." });
        }
    })
    .catch((error) => {
        console.error("Error fetching book by ISBN:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        try {
            let result = [];
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === author) {
                    result.push({ isbn, ...books[isbn] });
                }
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then((filteredBooks) => {
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found for the given author." });
        }
    })
    .catch((error) => {
        console.error("Error fetching books by author:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

// Get book details based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        try {
            let result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === title) {
                    result.push({ isbn, ...books[isbn] });
                }
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then((filteredBooks) => {
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found with the given title." });
        }
    })
    .catch((error) => {
        console.error("Error fetching books by title:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        try {
            const book = books[isbn];
            resolve(book);
        } catch (error) {
            reject(error);
        }
    })
    .then((book) => {
        if (book) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "Book not found." });
        }
    })
    .catch((error) => {
        console.error("Error fetching book reviews:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    });
});

module.exports.general = public_users;
