const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
});

exports.module = mongoose.model('User', userSchema);;