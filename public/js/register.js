var appVar = angular.module('app', []);

appVar.controller('RegisterController', ['$scope', 'registerUser', function($scope, registerUser) {
	$scope.registerUser = function(org){
		var g_user = JSON.parse(window.localStorage.getItem('g_user')),
		callback = function(status) {
			if (status == 'SUCCESS') {
				alert('Successfully added organization.')
			} else if (status == 'ERROR') {
				alert('There is a problem with our system. Please try again later.')
			} else if (status == 'DUPLICATE') {
				alert('Organization name already in use. Please try another.')
			}
		}

		//register user in db
		status = registerUser.register(g_user, org, callback)
		//on failure, display a message?
		//on success, display a success / status page
		
		//window.location.href = '/home/'+$scope.user.name
		//window.localStorage.setItem('logourl', $scope.user.url)
	}
}])

appVar.service('registerUser', ['$http', function($http){ 
	this.register = function(user, org, callback) {
		var regStatus, data = {
			org: org,
			user: user
		},
		config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		},
		request = {
               method: 'POST',
               url: 'http://localhost:3000/registerUser',
               headers: {
                   'Content-Type': 'application/json'
               },
			   body: {
				   org: org,
				   user: user
			   }
        }
		$http.post('/registerUser', data, config).success(function (response) {
			   console.log(response.msg)
			   callback(response.msg)
           }).error(function () {
			   regStatus = 'ERROR'
			   callback(regStatus)
           })
	}
}])
