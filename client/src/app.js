(function() {
  'use strict';
  
  angular.module('app', [
    'ui.bootstrap.datetimepicker',
    'ui.dateTimeInput',
    'app.controllers',
    'app.directives',
    'app.services',
    'ngResource',
    'ui.bootstrap',
    'lbServices',
    'ui.router',
    'ngAnimate',
    'ng.q',
    'ngStorage' // localStorage is javascript global
    ])
  
  .run(['$rootScope', '$log', '$state', 'User', 'AlertService', function($rootScope, $log, $state, User, AlertService) {
      /**
        * $log - Replacement for console.log() which allows debug
        *        msgs to be turned off so that err msgs can be shown in debug mode
        *        1. $log.debug() - only shows when debugMode enabled
        *        2. $log.warn()  - shows when debugMode disabled
        *        3. $log.error() - shows when debugMode disabled
        *        4. $log.info()  - shows when debugMode disabled
        *        5. $log.log()   - shows when debugMode disabled
        */
//    console.log('local: ', localStorage);
//    console.log('storage?: ', sessionStorage);
    
    $rootScope.$log = $log;
    $rootScope.User = User;
    $rootScope.$state = $state;
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.clear();
      AlertService.reset();
    });
    
    if (User.isAuthenticated()) {
      User.getCurrent()
      .$promise
      .then(function (UserInfo) {
        $log.debug('UserInfo: ', UserInfo);
        $rootScope.userInfo = UserInfo;
      })
      .catch(function (err) {
        $log.debug('UserInfo err: ', err);
      });
    }

  }])
  
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $logProvider) {
    // sets html5 mode so that urls do not contain #hash
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    });
    
    // sets debug mode so that $log msgs can be shown/turned off
    $logProvider.debugEnabled(true);
    
//    $urlRouterProvider.deferIntercept();
    // set 404 etc.
   $urlRouterProvider.otherwise('/404');
    
      /**
        * App States
        */
    $stateProvider
    .state('app', {
      abstract: true,
      url: '',
      templateUrl: '/js/views/app/index.html',
      controller: 'AppCtrl'
    })

    .state('app.home', {
      url: '/',
      templateUrl: '/js/views/home/index.html'
    })

    .state('app.todos', {
      abstract: true,
      url: '/todos',
      templateUrl: '/js/views/todos/index.html'
    })

    .state('app.todos.list', {
      url: '',
      templateUrl: '/js/views/todos/list.html',
      controller: 'ToDoListCtrl',
      resolve: {
        todoLists: ['ToDoList', 'User', function (ToDoList, User) {
          return ToDoList.find({
            filter: {
              where: {
                authorId: User.getCurrentId()
              },
              include: 'toDoItems'
            }
          })
          .$promise
          .then(function (response) {
            return response;
          })
          .catch(function (err) {
            return [];
          });
        }]
      }
    })

    .state('app.todos.add', {
      url: '/add/:listId',
      templateUrl: '/js/views/todos/add.html',
      controller: 'ToDoListAddCtrl',
      resolve: {
        todoList: ['$stateParams', 'ToDoList', function ($stateParams, ToDoList) {
          if (!$stateParams.listId) return null;

          return ToDoList.findById({
            id: $stateParams.listId
          })
          .$promise
          .then(function (res) {
            return res;
          })
          .catch(function (err) {
            return null;
          });
        }]
      }
    })
    
    .state('app.todos.add-item', {
      url: '/add-item/:listId',
      templateUrl: '/js/views/todos/add-item.html',
      controller: 'ToDoListAddItemCtrl'
    });
    
    
  }]);
  
})();