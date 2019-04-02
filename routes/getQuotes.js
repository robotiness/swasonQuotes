const express = require("express");
const router  = express.Router();
const request = require('request');

//Note: 58 Quotes
var allQuotes=[];
var singleQuote="";
router.get('/',function(req,res){
    console.log(allQuotes);
    res.render('quotes.ejs',{singleQuote:singleQuote});
});

router.get('/getQuote',function(req,res){
    request('http://ron-swanson-quotes.herokuapp.com/v2/quotes', function (error, response, body) {
        var body = JSON.parse(body);
        singleQuote=body[0];
        res.redirect('/');
    });
});

router.get('/getQuote/small',function(req,res){
    getAllQuotes(request,function(error,result){
        if(error){
            console.log(error);
        }else{
            singleQuote=getSpecifiedWord(result,"SMALL");
            res.redirect('/');
        }
    });
});

router.get('/getQuote/medium',function(req,res){
    getAllQuotes(request,function(error,result){
        if(error){
            console.log(error);
        }else{
            singleQuote=getSpecifiedWord(result,"MEDIUM");
            res.redirect('/');
        }
    });
});

router.get('/getQuote/large',function(req,res){
    getAllQuotes(request,function(error,result){
        if(error){
            console.log(error);
        }else{
            singleQuote=getSpecifiedWord(result,"LARGE");
            res.redirect('/');
        }
    });
});

function getAllQuotes(request,callback){
    request('http://ron-swanson-quotes.herokuapp.com/v2/quotes/58', function(error, response, body){
        if(error){
            callback(error);
        }else{
            var body = JSON.parse(body);
            callback(null,body);
        }
    });
}
function findQuoteByWordCount(quotes,count)
{
    console.log("Word that were found by num:"+count+"===============\n");
    for(var i=0;i<quotes.length;++i)
    {
        if(count==quotes[i].wordCount)
        {
            console.log(quotes[i]);
        }
    }
    console.log("END===============================\n");
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
        allQuotes.push({
            quote:quotes[i],
            wordCount:wordCount,
            vote:0
        });
    }
    //findQuoteByWordCount(array,4);
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
    var quotes=getWordCount(quotes);
    for(var i=0;i<quotes.length;++i)
    {
        if(quotes[i].wordCount>=minLength && quotes[i].wordCount<=maxLength)
        {
            array.push(quotes[i]);
        }
    }
    var item = array[Math.floor(Math.random()*array.length)];
    return item.quote;
}
module.exports = router;