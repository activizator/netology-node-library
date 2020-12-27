const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userlogin: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    username: {
        type: String, default: 'Anon'
    },
    email: {
        type: String, default: ''
    }
});

module.exports = model('Users', userSchema);
