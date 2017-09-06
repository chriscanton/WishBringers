var app = angular.module('UploadDrive', []),
uploadFile,
mapRow;

app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl,$scope){
       var fd = new FormData()
       fd.append('file', file)
       var request = {
               method: 'POST',
               url: uploadUrl,
               data: fd,
               headers: {
                   'Content-Type': undefined
               }
           };
       
       // SEND THE FILES.
       $http(request)
           .success(function (d) {
               $scope.showProgress=false;
               alert(d);
              
           })
           .error(function () {
           });

    }
 }]);

app.controller('UploadDriveLeaderController', ['$scope', 'fileUpload', function($scope, fileUpload){
    console.log($scope.showProgress);
	$scope.showProgress = false;
	$scope.uploadFile = function(){
       var file = $scope.csvFile;
       $scope.showProgress = true;
       var uploadUrl = "/InsertDrives";
       fileUpload.uploadFileToUrl(file, uploadUrl,$scope);
    };
 }])

 //map an array given by papa to object needed for serving file
mapRow = function (row) {
    var orgData = {}
    orgData.leaderName = row[0]
    orgData.email = row[1]
    orgData.orgName = row[2]
    orgData.extId = row[3]

    return orgData;
 }

 uploadFile = function(path) {
     var fileContent = new FormData();
     if (path != null && typeof path != 'undefined' && path !== '') {
        fileContent = fs.readFileSync(path, { encoding: 'binary' })
        formData.append("file", fileContent)
        //TODO: Send to server for processing
     }
 }

 