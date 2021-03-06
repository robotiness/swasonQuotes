var express=require('express');
var bodyParser=require('body-parser');
var quotesModule=require('./routes/getQuotes');
var voteModule=require('./routes/vote');
var mongoose=require('mongoose');
var path=require('path');
var app=express();

var PORT=process.env.port;
var mongoKey=process.env.MONGODB_KEY;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(mongoKey);
app.use(quotesModule,voteModule);

app.listen(PORT,function(req,res){
    console.log("Listening on port"+PORT);
});