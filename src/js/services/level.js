angular
  .module('ohld')
  .factory('levels', Levels);

Levels.$inject = ['$http'];

function Levels($http) {
  var levels = {};

  levels.save = function(level) {
    console.log(level);
    $http.post('http://localhost:3000/level', level).then(function(data){ console.log(data);});
  }

  return levels;
}
