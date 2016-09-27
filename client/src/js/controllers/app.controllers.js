(function() {
  'use strict';
  
  angular.module('app.controllers', [
    'lbServices',
    'app.services',
    'ngStorage',
    'ui.bootstrap'
  ])
  
  .controller('TopNavCtrl', ['$scope', '$timeout', '$log', '$state', '$rootScope', '$localStorage', 'ModalService', 'User', function($scope, $timeout, $log, $state, $rootScope, $localStorage, ModalService, User) {
    
    $scope.registerNewUser = function () {
      var modalInstance = ModalService.registerNewUser();
    };
    
    $scope.loginUser = function() {
      var modalInstance = ModalService.loginUser();
    };
    
    $scope.logoutUser = function() {
      User.logout()
      .$promise
      .then(function (userLoggedOut) {
        $log.debug('user logged out: ', userLoggedOut);
        $localStorage.$reset();
        $state.transitionTo('app.home');
      })
      .catch(function (err) {
        $log.debug('logout err: ', err);
      });
    };
    
  }])
  
  .controller('AppCtrl', ['$scope', function($scope) {
    
  }])

  .controller('ToDoListCtrl', ['$scope', 'AlertService', 'ToDoList', 'todoLists', function ($scope, AlertService, ToDoList, todoLists) {
    // initalization
    // attach toDoLists and toDoItems to template
    $scope.todoLists = todoLists;

    // delete toDoList and toDoItems
    $scope.deleteList = function (list) {
      AlertService.reset();
      async.series([
        function (seriesCB) {
          // first destroy toDoItem relationships
          ToDoList.toDoItems.destroyAll({
            id: list.id
          })
          .$promise
          .then(function (response) {
            return seriesCB();
          })
          .catch(function (err) {
            return seriesCB(err);
          });
        },
        function (seriesCB) {
          // then delete list
          ToDoList.destroyById({
            id: list.id
          })
          .$promise
          .then(function (response) {
            return seriesCB();
          })
          .catch(function (err) {
            return seriesCB(err);
          });
        }
      ], function (err) {

        if (err) {
          // error alert
          return AlertService.setError({
            show: true,
            title: 'Error deleting List',
            lbErr: err
          });
        }

        // success alert
        AlertService.setSuccess({
          show: true,
          title: list.name + ' deleted successfully'
        });

        // remove from dom
        var index = $scope.todoLists.indexOf(list);
        $scope.todoLists.splice(index, 1);

      });
    };

    // delete toDoItem
    $scope.deleteItem = function (list, item) {
      AlertService.reset();

      ToDoList.toDoItems.destroyById({
        id: list.id,
        fk: item.id
      })
      .$promise
      .then(function (response) {
        // remove from dom
        var index = list.toDoItems.indexOf(item);
        list.toDoItems.splice(index, 1);
        // success alert
        AlertService.setSuccess({
          show: true,
          title: item.name + ' deleted successfully.'
        });
      })
      .catch(function (err) {
        // error alert
        AlertService.setError({
          show: true,
          title: 'Error deleting List Item',
          lbErr: err
        });
      });
    };

  }])
  
  .controller('ToDoListAddCtrl', ['$scope', '$state', 'AlertService', 'ToDoList', 'todoList', function ($scope, $state, AlertService, ToDoList, todoList) {
    // initialization
    if (todoList) {
      // update existing
      $scope.todoList = todoList;
    } else {
      // create new
      $scope.todoList = {
        name: '',
        dueDate: new Date(moment().format('MM-DD-YYYY hh:mm A'))
      };
    }

    $scope.save = function () {
      // attach authorId for relationship
      $scope.todoList.authorId = $scope.User.getCurrentId();
      AlertService.reset();

      ToDoList.upsert($scope.todoList)
      .$promise
      .then(function (response) {
        // success alert
        AlertService.setSuccess({
          show: true,
          title: $scope.todoList.name + ' saved successfully.',
          persist: true
        });

        // transition to prev state
        $state.transitionTo('app.todos.list');
      })
      .catch(function (err) {
        // error alert
        AlertService.setError({
          show: true,
          lbErr: err,
          title: 'Error Saving'
        });
      });
    };

  }])
  
  .controller('ToDoListAddItemCtrl', ['$scope', '$state', '$stateParams', 'toDoItem', 'AlertService', 'ToDoList', function ($scope, $state, $stateParams, toDoItem, AlertService, ToDoList) {
    // initalization
    if (toDoItem) {
      // update existing
      $scope.todoListItem = toDoItem;
    } else {
      // create new
      $scope.todoListItem = {
        name: '',
        status: 'New',
        dueDate: new Date(moment().format('MM-DD-YYYY hh:mm A'))
      };
    }

    // save new item or update existing
    $scope.saveItem = function () {
      // attach authorId to generate relationship
      $scope.todoListItem.authorId = $scope.User.getCurrentId();
      AlertService.reset();

      ToDoList.toDoItems.create({
        id: $stateParams.listId
      }, $scope.todoListItem)
      .$promise
      .then(function (response) {
        // success alert
        AlertService.setSuccess({
          show: true,
          title: $scope.todoListItem.name + ' saved successfully.',
          persist: true
        });
        
        // transition to prev state
        $state.transitionTo('app.todos.list');
      })
      .catch(function (err) {
        // error alert
        AlertService.setError({
          show: true,
          title: 'Error saving List Item',
          lbErr: err
        });
      });
    };

  }]);
  
})();