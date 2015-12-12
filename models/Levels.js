var mongoose = require('mongoose');

var LevelSchema = new mongoose.Schema({
  title: String,
  background: Number,
  levelEntities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LevelEntity'}]
});

mongoose.model('Level', LevelSchema);
