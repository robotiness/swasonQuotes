var express=require('express');
var bodyParser=require('body-parser');
var quotesModule=require('./routes/getQuotes');
var voteModule=require('./routes/vote');
var mongoose=require('mongoose');
var path=require('path');
var app=express();
var PORT=require('./config').PORT;
//var mongoKey=require('./config').MONGODB_KEY;

if(process.env.port)
{
    PORT=process.env.port;
    mongoKey=process.env.MONGODB_KEY;

}
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(mongoKey);
app.use(quotesModule,voteModule);

app.listen(PORT,function(req,res){
    console.log("Listening on port"+PORT);
});