const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema(
    {   
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user'
        },
        reputation: {
            type: Number,
            default: 0
        }
    }, 
    { timestamps: true},

)
module.exports = mongoose.model('User', UserModelSchema); // it is better to put just User so it creates users collection in db