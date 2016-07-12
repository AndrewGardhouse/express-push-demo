var express = require('express');
var webPush = require('web-push');
// database
var mongo = require('mongodb');
var monk = require('monk');
var mongoLab = require('../db.js')
var db = monk(mongoLab.url);
var subscriptions = db.get('subscriptions');

var router = express.Router();

webPush.setGCMAPIKey('AIzaSyA3Km61lQsPvkwP9OlH16wxoW5BqHkY-eI');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/new', function(req, res, next) {
  subscriptions.insert(req.body).then(function(sunscription) {
    console.log('Saved successfully', sunscription);
    webPush.sendNotification(sunscription.endpoint, {
      payload: "You're All Good To Go!",
      userPublicKey: sunscription.key,
      userAuth: sunscription.authSecret,
    })
    res.sendStatus(200);
  }).catch(function(error) {
    console.log('Error saving subscription', error);
    res.sendStatus(500);
  })
})

router.delete('/remove', function(req, res, next) {
  subscriptions.remove({ endpoint: req.body.endpoint }).then(function(result) {
    console.log('Subscription successfully removed', result.status)
    res.sendStatus(200);
  }).catch(function(error) {
    console.log('There was an error', error)
    res.sendStatus(500);
  })
})

router.post('/push', function(req, res, next) {
  subscriptions.find({}).then(function(subs) {
    subs.forEach(function(sub) {
      webPush.sendNotification(sub.endpoint, {
        payload: req.body.payload,
        userPublicKey: sub.key,
        userAuth: sub.authSecret,
      })
      .then(function() {
        res.sendStatus(201);
      });
    })
  })
})

module.exports = router;
