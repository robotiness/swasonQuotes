const express = require("express");
const router  = express.Router();
const VoterModule=require('../models/voters');
const QuotesModel=require('../models/quotes');

router.get('/vote/:id/:score',notVoted,function(req,res){
    var id=req.params.id;
    var score=req.params.score;
    var newVoter=new VoterModule({
        ipAddress:getIp(req)
    });
    newVoter.save(function(err,result){
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("voter saved");
            QuotesModel.findOne({},function(error,result){
                if(error)
                {
                    console.log(error);
                }
                else{
                    var newQuotesArray=[];
                    for(var i=0;i<result.quotes.length;++i)
                    {
                        if(id==result.quotes[i].id)
                        {
                            var totalScore=Number(result.quotes[i].totalScore)+Number(score);
                            var numOfVotes=Number(result.quotes[i].numOfVotes)+1;
                            var avgScore=totalScore/numOfVotes;
                            console.log("total score"+totalScore);
                            var newQuote={
                                quote:result.quotes[i].quote,
                                wordCount:result.quotes[i].wordCount,
                                totalScore:totalScore,
                                numOfVotes:numOfVotes,
                                averageScore:avgScore,
                                id:result.quotes[i].id,
                                
                            }
                            newQuotesArray.push(newQuote);
                        }
                        else{
                            newQuotesArray.push(result.quotes[i]);
                        }
                    }
                    QuotesModel.findOne({}).remove().exec();
                    var newQuoteModel=new QuotesModel({
                        quotes:newQuotesArray
                    });
                    newQuoteModel.save(function(err,result){
                        if(err)
                        {
                            console.log(err);
                        }
                        else{
                            console.log("Updated to database.");
                            res.redirect('/');
                        }
                    });

                }
            });
        }
    });
});

function notVoted(req,res,next){
    var ip = getIp(req);
    VoterModule.findOne({ipAddress:ip},function(error,result){
        if(result)
        {
            res.send("You already voted");
        }
        else{
            next();
        }
    });
}

function getIp(req)
{
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7);
    }
    return ip;
}

module.exports = router;