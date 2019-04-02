const express = require("express");
const router  = express.Router();
const request = require('request');

//A way to simulate a database only works if the server doesn't restart:
var ipAlreadyVoted=[];
router.get('/vote/:id/:score',notVoted,function(req,res){
    res.send("You can vote!!!");
    ipAlreadyVoted.push(getIp(req));
});

function notVoted(req,res,next){
    var voted=false;
    var ip = getIp(req);
    for(var i=0;i<ipAlreadyVoted.length;++i)
    {
        if(ip==ipAlreadyVoted[i])
        {
            voted=true;
        }
    }
    if(voted)
    {
        res.send("You already voted");
    }
    else{
        next();
    }
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