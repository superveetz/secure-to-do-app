(function() {
  'use strict';
  
  angular.module('app.controllers')
  
  .controller('RegisterNewUserModalCtrl', ['$scope', '$log', '$rootScope', '$uibModalInstance', 'User', 'AlertService', function($scope, $log, $rootScope, $uibModalInstance, User, AlertService) {
    var newUser = {
      email: '',
      username: '',
      password: ''
    };
    
    $scope.rememberMe = false;
    
    $scope.newUser = angular.copy(newUser);
    
    $scope.registerNewUser = function (newUser) {
      if (newUser.password !== newUser.cpassword) {
        AlertService.setError({
          show: true,
          title: 'Confirm your password'
        });
        return;
      }
      $scope.submitting = true;
      // create new user
      User.create(newUser)
      .$promise
      .then(function (userCreated) {
        $log.debug('userCreated: ', userCreated);
        $rootScope.userInfo = userCreated;
        // login right after
        User.login({
          email: newUser.email,
          password: newUser.password,
          rememberMe: $scope.rememberMe
        })
        .$promise
        .then(function (userLoggedIn) {
          $scope.submitting = false;
          AlertService.reset();
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $scope.submitting = false;
        });
        
      })
      .catch(function (err) {
        $scope.submitting = false;
        AlertService.setError({
          show: true,
          lbErr: err,
          title: 'Registration Error'
        });
      });
    };
    
    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
    
  }])
  
  .controller('LoginUserModalCtrl', ['$scope', '$log', '$rootScope', '$uibModalInstance', 'User', 'AlertService', function($scope, $log, $rootScope, $uibModalInstance, User, AlertService) {
    var user = {
      emailOrUsername: '',
      password: ''
    };
    
    $scope.rememberMe = false;
    
    $scope.user = angular.copy(user);
    
    $scope.loginUser = function(user) {
      $scope.submitting = true;
      // user entered email
      if (user.emailOrUsername.indexOf('@') !== -1) {
        User.login({
          email: user.emailOrUsername,
          password: user.password,
          rememberMe: $scope.rememberMe
        })
        .$promise
        .then(function (userLogged) {
          $scope.submitting = false;
          $log.debug('userLogged: ', userLogged);
          AlertService.reset();
          $rootScope.userInfo = userLogged.user;
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $scope.submitting = false;
            AlertService.setError({
              show: true,
              lbErr: err
          });
        });
      } else {
        // user entered username
        User.login({
          username: user.emailOrUsername,
          password: user.password,
          rememberMe: $scope.rememberMe
        })
        .$promise
        .then(function (userLogged) {
          $scope.submitting = false;
          $log.debug('userLogged: ', userLogged);
          AlertService.reset();
          $rootScope.userInfo = userLogged.user;
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $scope.submitting = false;
          $log.debug('err: ',err);
          AlertService.setError({
            show: true,
            lbErr: err
          });
        });
      }
    };
    
    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
    
  }]);
  
})();