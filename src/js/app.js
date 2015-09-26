var app = angular.module('ohld', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('game', {
          url: '/',
          templateUrl: 'game.html',
          onEnter: function() {
            setTimeout(StartGame,2500); //FIX THIS
            setTimeout(function() {
              $("#aboutInner").hide();
              $("#hideshow").click(function(){
                $("#aboutInner").toggle();
              });
            }, 500);
          },
      })
        .state('lvleditor', {
          url: '/lvleditor',
          templateUrl: 'leveleditor.html'
      })
    }
  ]
);

