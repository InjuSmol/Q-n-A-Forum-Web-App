// Tag Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagsModelSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

TagsModelSchema
.virtual('url')
.get(function () {
  return ' posts/tag/' + this._id;
});


module.exports = mongoose.model('Tag', TagsModelSchema);