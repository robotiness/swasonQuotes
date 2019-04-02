var express=require('express');
var bodyParser=require('body-parser');
var quotesModule=require('./routes/getQuotes');
var voteModule=require('./routes/vote');
var path=require('path');
var app=express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(quotesModule,voteModule);

app.listen(3000,function(req,res){
    console.log("Listening on port 3000.");
});