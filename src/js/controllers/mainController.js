angular
  .module('ohld')
  .controller('MainController', MainController);

MainController.$inject = ['$scope', 'levels'];

function MainController($scope, levels) {
    $scope.save = function() {	
	levels.save({ title: 'bestlevl4lyfe', background: 1, levelEntities: LevelManager.GetCurrent() })
    }

    $scope.update = function() {
	levels.update({ id: '5675b430376d990414798efc' , background: 1, levelEntities: LevelManager.GetCurrent() })
    }
}
  
