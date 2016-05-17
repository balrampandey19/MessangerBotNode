var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (!kittenMessage(event.sender.id, event.message.text)) {
                processMessage(event.sender.id, event.message.text);
            }
        } else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }
    }
    res.sendStatus(200);
});
function processMessage(recipientId,text)
{
    console.log(recipientId);

    
    var message = [
    'hi Gamezop has the world’s best casual games within a social networking app. Play the latest games from top developers on a single app – no need to install each game individually!',
    'Stop installing every game you want to try, and get right to experiencing them in one app – instantly! Just click and play – also get an in-built cache cleaner to save space',
'Share favorite games with friends on WhatsApp, Facebook, Messenger, or Skype. Your friends can play messenger games without downloading Gamezop.'
];
var respText = 'Sorry I don\'t understand. Try:\n\nGamez\nGamezop\nRecommended\n\n.',
        keywordPos = -1,
        stationCode;
console.log(text);
var randomNumber = Math.floor(Math.random()*message.length);
    text = text.trim().toLowerCase();
     if (text.indexOf('help') > -1 || text.indexOf('hi') > -1 || text.indexOf('hello') > -1 || text.indexOf('how') > -1) {
         sendMessage(recipientId, {text:message[randomNumber]});
     }
     else
     if (text.indexOf('gamezop') > -1 || text.indexOf('casual') > -1) {
         gamezopMessage(recipientId, {text:message});
     }
     else
     
        if (text.indexOf('games') > -1 || text.indexOf('recommendation') > -1 || text.indexOf('recommended') > -1 || text.indexOf('suggested') > -1 || text.indexOf('game') > -1) {
         games(recipientId, {text:message});
     }
     
     else {
        // Unknown command
        console.log(respText);
        sendMessage(recipientId, {text:respText});
    }

}
function gamezopMessage(recipientId,text)
{

    var imageUrl="http://www.nextbigwhat.com/wp-content/uploads/2016/02/gamezop.jpg"
     var linkUrl="https://play.google.com/store/apps/details?id=co.gamezop&hl=en";
      message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Gamezop",
                            "subtitle": "Best Casual Games",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": linkUrl,
                                "title": "Download App"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
              sendMessage(recipientId, message);
            
            return true;
}
function games(recipientId,text)
{
     var linkUrl="https://play.google.com/store/apps/details?id=co.gamezop&hl=en";
      message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Timberman",
                            "subtitle": "Best Casual Games",
                            "image_url": "https://static.gamezop.io/N1sZfO1fWqg/cover.jpg" ,
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://games.gamezop.io/N1sZfO1fWqg/index.html",
                                "title": "Play"
                                }, {
                                "type": "web_url",
                               "url": linkUrl,
                                 "title": "Download app",
                            }]
                        },{
                            "title": "2048",
                            "subtitle": "Best Casual Games",
                            "image_url": "https://static.gamezop.io/NyM_JGWcx/cover.jpg" ,
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://games.gamezop.io/NyM_JGWcx/index.html",
                                "title": "Play"
                                }, {
                                "type": "web_url",
                               "url": linkUrl,
                                 "title": "Download app",
                            }]
                        },{
                            "title": "The Tower",
                            "subtitle": "Best Casual Games",
                            "image_url": "https://static.gamezop.io/EJoezu1MWqg/cover.jpg" ,
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://games.gamezop.io/EJoezu1MWqg/index.html",
                                "title": "Play"
                                }, {
                                "type": "web_url",
                               "url": linkUrl,
                                 "title": "Download app",
                            }]
                        },{
                            "title": "Stick Pin",
                            "subtitle": "Best Casual Games",
                            "image_url": "https://static.gamezop.io/E1szd1fW9e/cover.jpg" ,
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://games.gamezop.io/E1szd1fW9e/index.html",
                                "title": "Play"
                                }, {
                                "type": "web_url",
                               "url": linkUrl,
                                 "title": "Download app",
                            }]
                        }]
                    }
                }
            };
              sendMessage(recipientId, message);
            
            return true;
}

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        },{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        },{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        },{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    return false;
    
};