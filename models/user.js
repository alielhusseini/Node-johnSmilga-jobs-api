const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        // validate = [isEmail,'Please provide valid email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email',
        ],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
}, { timestamps: true });

userSchema.pre('save', async function() { // you can ignore the next()
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function() {
    return jwt.sign({ id: this._id, name: this.name },
        process.env.SECRET, {
            expiresIn: process.env.LIFETIME,
        }
    )
}

userSchema.methods.comparePassword = async function(canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('user', userSchema);

/*
 static methods are methods that directly apply or interact with our model when we wanted to retrieve one document from the database, like creating a find by name static method which allows us to go through the database and retrieve the document that matches the given condition,
 where instance methods or appended methods are known as document methods, since they are only applied per method, not for a database like craeting a method for a specific schema like manipulating the count property in the schema
*/