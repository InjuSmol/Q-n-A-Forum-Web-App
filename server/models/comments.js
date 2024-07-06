// Answer Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentsModelSchema = new Schema({
    text: {
        type: String,
        maxlength: 140,
        required: true
    },
    comment_by: {
        type: String,
        required: true
    },
    comment_date_time: {
        type: Date,
        default: Date.now
    }, 
    votes: {
        type: Number, 
        default: 0
    },
    commenter_id: {
        type: String
    }
});

CommentsModelSchema
.virtual('url')
.get(function () {
    return 'posts/comment/' + this._id;
});

module.exports = mongoose.model('Comment', CommentsModelSchema);
