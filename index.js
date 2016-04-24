var express = require('express')
var app = express()
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
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
