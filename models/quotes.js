var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    quotes:[{
        quote:String,
        wordCount:Number,
        votes:Number
    }]
});

module.exports = mongoose.model('Quotes', schema);