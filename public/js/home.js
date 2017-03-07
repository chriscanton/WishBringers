var appVar = angular.module('app', [ "ngRoute","rzModule"]);
var index = 'wishlist1';
var type = 'logs'


appVar.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller : 'WishesController',
		templateUrl : '/templates/wishes.ejs'
	}).otherwise({
		controller : 'WishesController',
		templateUrl : '/templates/wishes.ejs'
	});
	
	
} ]);

/*appVar.service('client', function ($http) {
    return $http({
		method: 'GET',
      	host: 'https://localhost:3000/getWishes'
    });
  });*/
appVar.controller('WishesController', function($scope, $http,$rootScope) {

	$scope.items = [];
	
	$scope.wishesData = function(){
		$http({
			method: 'GET',
			url: '/getWishes'
		}).then( function successCallback(response) {
			console.log(response)
			$scope.res = response.data.wishes;
			for (var i = 0; i < $scope.res.length; i++) {
				console.log("item: " + i + " pushed: " + JSON.stringify($scope.res[i]))
				$scope.items.push($scope.res[i])
			}
		})
		 /*client.search({
			  index: index,
			  type: type,
			  body: {
				from : $scope.page,
				size : $scope.per_page,
			    query: {
			      "match_all": {}
			    }
			  }
			}).then(function (resp) {
			    $scope.res = resp.hits.hits;
			    for (var i = 0; i < $scope.res.length; i++) {
					$scope.items.push($scope.res[i]._source)
				}
				
			  //  console.log( "inside wishes result-----------------"+hits);
			}, function (err) {
			    console.trace(err.message);
			});*/
	};
	 
	
	$scope.wishesData();
	 

	$scope.status = "Add to Cart";
	$rootScope.wishesCount=0;
	$rootScope.cartProducts = [];
	
	$scope.logourl = localStorage.getItem('logourl');
	console.log($scope.logourl);
	
	$scope.slider = {
			  minValue: 1,
			  maxValue: 1000,
			  options: {
			   
			    draggableRange: true
			  }
			};
	
	$scope.onSlider = function(){
		 /*client.search({
			  index: index,
			  type: type,
			  body: {
			    query: { 
			  		    "constant_score" : {
			  		        "filter" : {
			  		            "range" : {
			  		                "price" : {
			  		                    "gte": minValue,
			  		                    "lt": maxValue
			  		                }
			  		            }
			  		        }
			  		    }
			    }
			  }
			}).then(function (resp) {
			    var hits = resp.hits.hits;
			    console.log(hits);
			}, function (err) {
			    console.trace(err.message);
			});*/
	}
	
	$scope.onCheckSearch = function(bool,range){
		var limit1=0;
		var limit2=100;
		
		if(bool==true && range=="0-5"){
			limit1=0;limit2=5;
		}
		else if(bool==true && range=="5-10")
		{
			limit2=10
		}
		else if(bool==true && range=="11-15")
		{
			limit3=15
		}
		

		 /*client.search({
			  index: index,
			  type: type,
			  body: {
			    query: { 
			  		    "constant_score" : {
			  		        "filter" : {
			  		            "range" : {
			  		                "child_age" : {
			  		                    "gte": limit1,
			  		                    "lt": limit2
			  		                }
			  		            }
			  		        }
			  		    }
			    }
			  }
			}).then(function (resp) {
			    var hits = resp.hits.hits;
			    console.log(hits);
			}, function (err) {
			    console.trace(err.message);
			});*/
	}

	 $scope.filterResults = function(gender){
		 /*client.search({
			  index: index,
			  type: type,
			  body: {
			    query: {
			      match: {
			        child_gender: gender
			      }
			    }
			  }
			}).then(function (resp) {
			    var hits = resp.hits.hits;
			    console.log(hits);
			}, function (err) {
			    console.trace(err.message);
			});*/
		 
			}
	 $scope.per_page = 12;
	    $scope.page = 0;

	    $scope.show_more = function () {
	        $scope.page += 1;
	        $scope.wishes($scope.page*$scope.per_page);
	    };
	 
	
	
	$scope.addToCart = function(wish,status){
		console.log($rootScope.cartProducts.length)
		
		if(status == false)
			{
			$rootScope.wishesCount = $rootScope.wishesCount+1
			$rootScope.cartProducts.push({"name":wish.description, "price":wish.price,
				"age" : wish.age, "url": wish.imageurl})
			}
		else
			{
			$rootScope.wishesCount = $rootScope.wishesCount -1
			$scope.removeItem(wish)
			
			}
		
	}

	$scope.removeItem = function(index){
		$rootScope.cartProducts.splice(index, 1);
		  }
	
	$scope.saveInCache = function(){
		console.log("Saving to cache ")
		window.localStorage.setItem('wishes', JSON.stringify($rootScope.cartProducts));
	}
	
});

appVar.controller('submitTransaction', function($scope){
	$scope.wishesBought = JSON.parse($window.localStorage['wishes'] || '{}');
	$http({
 		method : "POST",
 		url : "/insertData",
 		
 	}).success(function (res) {
 		console.log("The return value: "+JSON.stringify(res));
 		
 	});
	
	
})


