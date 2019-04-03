const express = require("express");
const router  = express.Router();
const request = require('request');
const QuotesModel=require('../models/quotes');
const uuidv1 = require('uuid/v1');

//Note: 58 Quotes
//var allQuotes=[];
var quoteObject={
    quote:"",
    wordCount:0,
    score:0,
    numOfVotes:0,
    averageScore:0,
    id:""
};
router.get('/',function(req,res){
    var allQuotes=null;
    QuotesModel.findOne({},function(error,result){
        if(result)
        {
            allQuotes=result.quotes;
        }
        res.render('quotes.ejs',{quoteObject:quoteObject,allQuotes:allQuotes});
    });
});

router.get('/getQuote',function(req,res){
    getAllQuotes(function(error,result){
        quoteObject=result[Math.floor(Math.random()*result.length)];
        res.redirect('/');
    });
});

router.get('/getQuote/small',function(req,res){
    getAllQuotes(function(error,result){
        if(error){
            console.log(error);
        }
        else{
            quoteObject=getSpecifiedWord(result,"SMALL");
            res.redirect('/');
        }
    });
});

router.get('/getQuote/medium',function(req,res){
    getAllQuotes(function(error,result){
        if(error){
            console.log(error);
        }else{
            quoteObject=getSpecifiedWord(result,"MEDIUM");
            res.redirect('/');
        }
    });
});

router.get('/getQuote/large',function(req,res){
    getAllQuotes(function(error,result){
        if(error){
            console.log(error);
        }else{
            quoteObject=getSpecifiedWord(result,"LARGE");
            res.redirect('/');
        }
    });
});

function getAllQuotes(callback)
{
    QuotesModel.findOne({},function(err,result){
        if(result)
        {
            callback(null,result.quotes)
        }
        else{
            request('http://ron-swanson-quotes.herokuapp.com/v2/quotes/58', function(error, response, body){
                if(error){
                    callback(error);
                }else{
                    var body = JSON.parse(body);
                    var wordCountObj=getWordCount(body);
                    var newQuoteArr=[];
                    for(var i=0;i<wordCountObj.length;++i)
                    {
                        var id=uuidv1();
                        var newQuote={
                            quote:wordCountObj[i].quote,
                            wordCount:wordCountObj[i].wordCount,
                            totalScore:0,
                            numOfVotes:0,
                            averageScore:0,
                            id:id,
                        }
                        newQuoteArr.push(newQuote);
                    }
                    var quoteObject=new QuotesModel({
                        quotes:newQuoteArr
                    });
                    quoteObject.save(function(err,result){
                        if(error)
                        {
                            console.log(err);
                        }
                        else{
                            console.log("Saved to database");
                            //console.log(result.quotes);
                            callback(null,newQuoteArr);
                        }
                    });
                }
            });
        }
        
    });
}

function getWordCount(quotes)
{
    var array=[];
    for(var i=0;i<quotes.length;++i)
    {
        quotes[i] = quotes[i].replace(/(^\s*)|(\s*$)/gi,"");
        quotes[i] = quotes[i].replace(/[ ]{2,}/gi," ");
        quotes[i] = quotes[i].replace(/\n /,"\n");

        var wordCount=quotes[i].split(' ').length;
        array.push({
            quote:quotes[i],
            wordCount:wordCount
        });
    }

    return array;
}

function getSpecifiedWord(quotes,option){
    //default is LARGE
    var minLength=13;
    var maxLength=100;
    var array=[];
    if(option=="SMALL")
    {
        minLength=0;
        maxLength=4;
    }
    else if(option=="MEDIUM")
    {
        minLength=5;
        maxLength=12;
    }
    for(var i=0;i<quotes.length;++i)
    {
        if(quotes[i].wordCount>=minLength && quotes[i].wordCount<=maxLength)
        {
            array.push(quotes[i]);
        }
    }
    var item = array[Math.floor(Math.random()*array.length)];
    return item;
}
module.exports = router;