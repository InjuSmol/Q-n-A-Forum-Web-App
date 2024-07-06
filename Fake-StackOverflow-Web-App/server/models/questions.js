// Question Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionsModelSchema = new Schema ({
    title: {
        type: String,
        maxlength: 100,
        required: true
    },
    summary: {
        type: String,
        maxlength: 140,
        required: true,
        default: ''
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }]
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer',
    }],
    asked_by: {
        type: String,
        default: "Anonymous"
    },
    ask_date_time: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number, 
        default: 0 
    },
    userID: {
        type: String
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

QuestionsModelSchema
.virtual('url')
.get(function () {
  return ' posts/question/' + this._id;
});

module.exports = mongoose.model('Question', QuestionsModelSchema);
 