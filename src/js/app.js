var app = angular.module('ohld', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    console.log(1);
    $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('game', {
          url: '/',
          templateUrl: 'game.html',
          onEnter: function() {
            setTimeout(StartGame,500); //FIX THIS
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

