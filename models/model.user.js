var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    PhoneNumber: String
});

module.exports = mongoose.model('Post', userSchema);