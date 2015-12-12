var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Level = mongoose.model('Level');
var LevelEntity = mongoose.model('LevelEntity');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/level', function(req, res, next) {
  var level = new Level(req.body);

  level.save(function(err, level) {
    if(err) { return next(err);}

    res.json(level);
  });
});

module.exports = router;
