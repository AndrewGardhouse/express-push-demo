var express = require('express');
var webPush = require('web-push');
var router = express.Router();

webPush.setGCMAPIKey('AIzaSyA3Km61lQsPvkwP9OlH16wxoW5BqHkY-eI');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/push', function(req, res, next) {
  console.log(req.body)
  webPush.sendNotification(req.body.endpoint, {
    payload: req.body.payload,
    userPublicKey: req.body.key,
    userAuth: req.body.authSecret,
  })
  .then(function() {
    res.sendStatus(201);
  });
  // https://android.googleapis.com/gcm/send
})

module.exports = router;
