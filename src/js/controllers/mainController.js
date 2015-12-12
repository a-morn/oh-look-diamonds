angular
  .module('ohld')
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'levels'];

function MainController($scope, levels) {
  $scope.save = function() {
    levels.save({ title: 'best level', background: 1 });
  }
}
  
