var mongoose = require('mongoose');

var LevelEntitySchema = new mongoose.Schema({
  x: Number,
  y: Number,
  type: String
});

mongoose.model('LevelEntity', LevelEntitySchema);
