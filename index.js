var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var io = require('socket.io')
var app = express()
app.use(bodyParser.json())

var token = 'EAANmE8COUZA0BANTZBWzFamx1ZCDalrInBZBSBc3GCLQGmFCV2Hy1avC2o15Y5wAsUjJcabADTtqnfGzL5H7C5d9w9QydxUs6yROD4OddinGDU5IvhrkqGIbqkB5HPsYBr2zKWsuMvtn17zuoQOrgzKiOouXTIbok3tV7b42TQZDZD'


app.get('/', function(req, res){
  res.sendfile('index.html')
})

io.on('connection', function(socket){
  socket.on('message', function(msg){
    console.log(socket.id + '> message : ' + msg)
    })
  })







app.set('port', (process.env.PORT || 5000))
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging // มีการตอบมาหลายๆครั้ง
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id // คนนี้คือใคร
    if (event.message && event.message.text) {
      var text = event.message.text
      // Handle a text message from this sender
      console.log(sender)

      if (text.substring(0, 3) === 'sum') {
        var Subtext = text.substring(4, text.length)
        var space = Subtext.search(' ')
        var num1 = parseFloat(Subtext.substring(0, space))
        var num2 = parseFloat(Subtext.substring(space, Subtext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        var sum = num1 + num2
        console.log('sum : ' + sum)
        sendTextMessage(sender, 'sum : ' + sum)
      }
      if (text.substring(0, 3) === 'max') {
        var Subtext = text.substring(4, text.length)
        var space = Subtext.search(' ')
        var num1 = parseFloat(Subtext.substring(0, space))
        var num2 = parseFloat(Subtext.substring(space, Subtext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        if (num1 > num2) {
          sendTextMessage(sender, 'max : ' + num1)
        }
        if (num2 > num1) {
          sendTextMessage(sender, 'max : ' + num2)
        }
      }
      if (text.substring(0, 3) === 'min') {
        var Subtext = text.substring(4, text.length)
        var space = Subtext.search(' ')
        var num1 = parseFloat(Subtext.substring(0, space))
        var num2 = parseFloat(Subtext.substring(space, Subtext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        if (num1 < num2) {
          sendTextMessage(sender, 'min : ' + num1)
        }
        if (num2 < num1) {
          sendTextMessage(sender, 'min : ' + num2)
        }
      }

      if (text.substring(0, 3) === 'avg') {
        var Subtext = text.substring(4, text.length)
        // var space = Subtext.search(' ')
        var avg = []
        var sum = 0
        avg = Subtext.split(' ')
          for (var i = 0; i < avg.length; i++) {
            sum += parseFloat(avg[i])
          }
          console.log(sum/avg.length)
          sendTextMessage(sender, 'avg : ' + sum/avg.length)
      }
    }
  }
  res.sendStatus(200)
})

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
