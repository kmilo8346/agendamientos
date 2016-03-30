/**
 * Created by kmilo on 23-03-16.
 */
angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope) {

})

.controller('RegisterCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope) {

})

.controller('DataCtrl', function($scope) {

})

.controller('AgendaCtrl', function($scope) {
  $scope.orders = [""];
  $scope.placa = "";
  $scope.cedula = "";

  $scope.addEmptyOrder = function() {
    $scope.orders.push("");
  }

  $scope.removeOrder = function(index) {
    $scope.orders.splice(index, 1);
  }
})

.controller('TurnCtrl', function($scope) {

});


