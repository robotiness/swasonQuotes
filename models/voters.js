var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    ipAddress:{type:String,required:true}
});

module.exports = mongoose.model('Voters', schema);