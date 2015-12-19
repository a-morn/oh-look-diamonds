angular
  .module('ohld')
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'levels'];

function MainController($scope, levels) {
    $scope.save = function() {	
	levels.save({ title: 'bestlevl4lyfe', background: 1, levelEntities: LevelManager.GetCurrent() })
  }
}
  
