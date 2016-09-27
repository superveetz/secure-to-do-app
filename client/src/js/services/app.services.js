(function() {
  'use strict';
  
  angular.module('app.services', [
    'ui.bootstrap',
    'app.controllers'
  ])
  
  // App Modals
  .factory('ModalService', ['$uibModal', '$log', '$filter', 'AlertService', function($uibModal, $log, $filter, AlertService) {
    return {
      
      // launch register new user modal
      registerNewUser: function() {
        AlertService.reset();
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'js/services/assets/modals/templates/user-register-new.html',
          controller: 'RegisterNewUserModalCtrl',
          size: 'small',
//          resolve: {
//            items: function () {
//              return $scope.items;
//            }
//          }
        });
        // .result.then(func1, func2) takes 2 functions, 1st runs on modal open, 2nd on modal close
        modalInstance.result.then(function() {
          // when modal opens
//          $scope.example = 'sup';
        }, function() {
          // when modal closes
          // reset any alerts
          if (AlertService.hasAlert()) {
            AlertService.reset();
          }
          $log.debug('Modal dismissed at : ', $filter('date')(new Date(), 'HH:mm'));
        });
        
        modalInstance.close(function(data) {
          console.log('data: ', data);
        });
      },
      
      // launch login modal
      loginUser: function() {
        AlertService.reset();
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: '/js/services/assets/modals/templates/user-login.html',
          controller: 'LoginUserModalCtrl',
          size: 'small',
//          resolve: {
//            items: function () {
//              return $scope.items;
//            }
//          }
        });
        // triggers on modalInstance.close();
        modalInstance.result.then(function() {
          
        }, function() {
          if (AlertService.hasAlert()) {
            AlertService.reset();
          }
          $log.debug('Modal dismissed at : ', $filter('date')(new Date(), 'HH:mm'));
        });
      }
    };
  }])
  
  .service('AlertService', ['$log', function($log) {
     return {
      show: false,
      persist: false,
        /**
          * setError({ show: true, lbErr: err, title: 'string', ... }) - @params { object } 
          * - Create error with any number of properties and use alert-box
          *   directive to create custom templates
          */
      reset: function () {
        if (this.persist) return this.persist = false;

        this.show = false;
        var $this = this;
        angular.forEach(this, function(value, key) {
          // restricts users from overwriting functions
          if (!angular.isFunction(value)) {
            $this[key] = null;
          }
        });
      },
      showAlert: function () {
        this.show = true;
      },
      hasAlert: function() {
        return this.show ? true : false;
      },
      setError: function(alertObj) {
        // reference this object
        var alert = this;
        this.type = 'error';
        // first attach alert properties to current object
        angular.forEach(alertObj, function(value, key) {
          if (!angular.isFunction(value)) {
            alert[key] = value;
          }
        });
        // process a loopback err
        if (alert.lbErr) {
          $log.debug('lbErr: ', alert.lbErr);
          // check err obj for user friendly msgs
          if (alert.lbErr.data 
              && alert.lbErr.data.error 
              && alert.lbErr.data.error.details 
              && alert.lbErr.data.error.details.messages) {
            var errMsgs = alert.lbErr.data.error.details.messages;
            var errors = [];
            angular.forEach(errMsgs, function(errArr) {
              angular.forEach(errArr, function(errMsg) {
                errors.push(errMsg);
              });
            });
            // set user friendly loopback errors
            alert.errors = errors;
          }
          // check err obj for error title
          if (alert.lbErr.data 
              && alert.lbErr.data.error 
              && alert.lbErr.data.error.message) {
            var errTitle = alert.lbErr.data.error.message;
            // set user friendly error title
            alert.title = errTitle;
          }
          // overwrite title with passed in 1
          if (alertObj.title) {
            alert.title = alertObj.title;
          }
        }
      },
      setSuccess: function(alertObj) {
        // reference this object
        var alert = this;
        this.type = 'success';
        // first attach alert properties to current object
        angular.forEach(alertObj, function(value, key) {
          if (!angular.isFunction(value)) {
            alert[key] = value;
          }
        });
      }
       
    };
  }]);
  
})();