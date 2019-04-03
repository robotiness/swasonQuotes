var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    quotes:[{
        quote:{type: String, required: true},
        wordCount:{type: Number, required: true},
        totalScore:{type: Number, required: true},
        numOfVotes:{type: Number, required: true},
        averageScore:{type: Number, required: true},
        id:{type: String, required: true}
    }]
});

module.exports = mongoose.model('Quotes', schema);