(function() {
  'use strict';
  
  angular.module('app.directives', [
    'app.controllers'
  ])
  
  .directive('focusMe', ['$timeout', '$parse', function($timeout, $parse) {
    return {
      link: function(scope, element, attrs) {
        console.log('scope: ', scope);
        console.log('element:', element);
        console.log('attrs:', attrs);
        
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function(value) {
          console.log('value=', value);
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
  }])
  
  .directive('topNav', [function() {
    return {
      restrict: 'E',
      templateUrl: 'js/directives/top-nav/top-nav.html',
      controller: 'TopNavCtrl',
      resolve: {
      }
    };
  }])
  
  .directive('alertBox', ['AlertService', function(AlertService) {
    return {
      restrict: 'E',
      templateUrl: function(scope, elem) {
        // Use default theme if no theme is provided
        if (elem.theme) {
          return 'js/directives/alert-box/' + elem.theme + '.html'
        } else {
          return 'js/directives/alert-box/default.html'
        }
      },
      link: function(scope, elem, attrs, ctrl) {
        // attach AlertService to alert-box's scope
        scope.alert = AlertService;
      }
    };
  }]);
  
})();