var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Level = mongoose.model('Level');
var LevelEntity = mongoose.model('LevelEntity');

router.param('level', function(req, res, next, id){
    var query = Level.findById(id);
    query.exec(function(err, level){
	if(err){
	    return next(err);
	}
	if(!level){
	    return next(new Error('couldnt find level!'));
	}
	req.level = level;
	return next();
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/level', function(req, res, next) {
  var level = new Level(req.body);
  level.save(function(err, level) {
      if(err) {
	  console.log(err);
	  return next(err);}

    res.json(level);
  });
});

router.put('/level/:level', function(req, res, next) {
    console.log(req.body);
    console.log(req.level);
    var updatedLevel = new Level(req.body);
    console.log(updatedLevel);
    req.level.background = updatedLevel.background;
    req.level.levelEntities = updatedLevel.levelEntities;
    console.log(req.level);    
    req.level.save(function(err, level) {
	if(err) {
	  console.log(err);
	  return next(err);}

	res.json(level);
    });
});

module.exports = router;
