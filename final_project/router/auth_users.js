const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (i.e., not already taken)
const isValid = (username) => { 
    return users.find(user => user.username === username) ? false : true;
}

// Authenticate user credentials
const authenticatedUser = (username, password) => { 
    return users.find(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const user = authenticatedUser(username, password);
    if (user) {
        // Save user to session
        req.session.user = { username: user.username };
        return res.status(200).json({ message: "Login successful." });
    } else {
        return res.status(401).json({ message: "Invalid username or password." });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Review not found for this user." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
