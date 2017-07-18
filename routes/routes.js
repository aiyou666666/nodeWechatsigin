var path = require('path');
var signature = require('../signature');
var config = require('../config')();
var http = require("http");
var url = require("url");
var crypto = require("crypto");


var createSignature = signature.getSignature(config);

module.exports = function(app) {
    app.post('/getsignature', getSignature);
    app.get('/test', fun);
    app.get('/',validateToken);
};

function fun(req, res) {
    var u = req.protocol + "://" + req.get('Host') + req.url;
    createSignature(u, function(error, result) {
        console.log(result);
        res.render('../public/test.html', result);
    });
}

function sha1(str){
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}
function validateToken(req,res){
  var query = url.parse(req.url,true).query;
  //console.log("*** URL:" + req.url);
  //console.log(query);
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = "ayToken";//这里是你在微信开发者中心页面里填的token，而不是****
  oriArray.sort();
  var original = oriArray.join('');
  console.log("Original str : " + original);
  console.log("Signature : " + signature );
  var scyptoString = sha1(original);
  if(signature == scyptoString){
    res.end(echostr);
    console.log("Confirm and send echo back");
  }else {
    res.end("false");
    console.log("Failed!");
  }
}	






function getSignature(req, res) {
	
    var url = req.body.url;
    console.log(url);
    createSignature(url, function(error, result) {
        if (error) {
            res.json({
                'error': error
            });
        } else {
        	
            res.json({code:200,msg:'请求成功',data:result});
        }
    });
}
