
var mongoose = require('mongoose');

var LevelEntity = new mongoose.Schema({
  x: Number,
  y: Number,
  type: String
});

mongoose.model('LevelEntity', LevelEntity);

var LevelSchema = new mongoose.Schema({
  title: String,
  background: Number,
  levelEntities: [LevelEntity]
});

mongoose.model('Level', LevelSchema);
