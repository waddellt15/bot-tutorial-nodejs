var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = "0b09c5795270482bb28ecfb5ef";

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;
  console.log(request.attachments);
  if(Array.isArray(request.attachments) && request.attachments.length){
	var att = request.attachments[0].url;
	console.log(att);
	options = {
		hostname: 'api.groupme.com',
		path: '/v3/groups',
		method: 'GET'
	};
	var data = '';
	HTTPS.get('https://api.groupme.com/v3/groups/55230894/messages?token=c2b94360da7f013732bc364efad1a7ec', function(res) {
		console.log("thisworks");
			if(res.statusCode == 200) {
			//neat
		} else {
			console.log('rejecting bad status code ' + res.statusCode);
		}
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
		var mess = JSON.parse(data);
		console.log(mess.response.messages);
		});
		
	});
	
  }
  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;