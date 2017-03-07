var appVar = angular.module('app', []);

appVar.controller('TotalWishesController', function($scope) {

	console.log("wishes controller " + JSON.stringify(window.localStorage.getItem('wishes')))
	
	$scope.wishlist = JSON.parse(window.localStorage['wishes'] || '{}');
	$scope.total = 0;
	$scope.length = $scope.wishlist.length;
	for(var i = 0; i<$scope.wishlist.length;i++)
		{
			console.log("adding " + $scope.wishlist[i].price)
			$scope.total = $scope.total+$scope.wishlist[i].price;
		}
	
});