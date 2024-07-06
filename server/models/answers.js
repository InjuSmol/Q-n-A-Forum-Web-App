// Answer Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswersModelSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: String,
        required: true
    },
    ans_date_time: {
        type: Date,
        default: Date.now
    }, 
    votes: {
        type: Number, 
        default: 0
    },
    answer_id: {
        type: String
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

AnswersModelSchema
.virtual('url')
.get(function () {
    return 'posts/answer/' + this._id;
});

module.exports = mongoose.model('Answer', AnswersModelSchema);
