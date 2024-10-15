const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));


// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is authenticated
    if(req.session && req.session.user){
        return next();
    } else {
        return res.status(401).json({message: "Unauthorized. Please login"});
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);

app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));