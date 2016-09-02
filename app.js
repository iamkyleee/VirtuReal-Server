var express = require('express')
var firebase = require('firebase')
var bodyParser = require('body-parser')
var app = express()
var http = require('http')
var https = require('https')
var querystring = require('querystring')
var request = require('request')

var serverKey = 'AIzaSyDkikyhU6kKEyeoWQTBjdBJtIkfh-ale7Q'

firebase.initializeApp({
  serviceAccount: 'VirtuReal V2-95903be797f0.json',
  databaseURL: 'https://virtureal-v2.firebaseio.com/'
})

var db = firebase.database()
var ref = db.ref()

var jsonParser = bodyParser.json()

// app.use(bodyParser.json())

app.get('/usertype/:uid', (req, res) => {
  let uid = req.params.uid

  ref.child('users').child(uid).once('value', (snapshot) => {
    if (snapshot.val() == null) {
      res.send('Error! User: ' + uid + ' not found')
      return
    }
    // res.send('hello ' + uid)
    res.send(snapshot.val().userType)
  }, (err) => {
    res.send(err)
  })
})

// FAVORITES
app.post('/favorite', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400)
  const sender = req.body.sender
  const receiver = req.body.receiver

  console.log('sender: ' + sender)
  console.log('receiver: ' + receiver)

  console.log(req.body)

  let postOptions = {
    method: 'POST',
    host: 'fcm.googleapis.com',
    path: '/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + serverKey
    }
  }

  let post_data = JSON.stringify({
    'notification': {
      'title': 'New Favorite',
      'text': sender + ' added your home to his Favorites'
    },
    'to': receiver
  })

  let post_req = http.request(postOptions, (resp) => {
    resp.setEncoding('utf8')
    resp.on('data', (chunk) => {
      console.log(chunk)
      res.send(chunk)
    })
  })

  post_req.write(post_data)
  post_req.end()
})

app.post('/favorites', (req, res) => {
  const sender = req.body.sender
  const receiver = req.body.receiver

  console.log('receiver: ' + receiver)

  let postOptions = {
    method: 'POST',
    host: 'fcm.googleapis.com',
    path: '/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + serverKey
    }
  }

  let post_data = JSON.stringify({
    'notification': {
      'title': 'New Favorite',
      'text': sender + ' added your home to his Favorites'
    },
    'to': receiver
  })

  let post_req = http.request(postOptions, (resp) => {
    resp.setEncoding('utf8')
    resp.on('data', (chunk) => {
      console.log(chunk)
      res.send(chunk)
    })
  })

  post_req.write(post_data)
  post_req.end()
})




app.listen(process.env.PORT || 1337, () => {
  console.log('App listening on port 1337!')
})

