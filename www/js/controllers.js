angular.module('starter.controllers', ['ngResource',])

.controller('LocalCtrl', function($scope, Items, Geo) {
  $scope.items = Items.all();
})

.controller('AccountCtrl', function($scope) {
})

.controller('NewCtrl', function($scope, $resource) {

    $scope.taken = false;

    $scope.newItem = {
        image: {base64data: null},
        location: {},
        user: {username: 'anon'},
        title: null,
        description: null
    }

    // $scope.phone = {location: null, camera: null, ready: false}
    // $scope.phone.camera = navigator.camera;
    console.log('Camera is: ', navigator.camera);

    // Get current position
    console.log('Getting current location ...');
    navigator.geolocation.getCurrentPosition(
        function(position) {
            $scope.newItem.location = position.coords;
            console.log('Location is: ', position.coords);
            $scope.$apply();
        },
        function(error) {
            console.log('Error acquiring location.', error);
        }
    );


    // Take a new photo
    $scope.takePhoto = function(){

        function onSuccess(imageData) {
            var image = document.getElementById('last-photo-taken');
            image.src = "data:image/jpeg;base64," + imageData;
            $scope.newItem.image.base64data = imageData;
            $scope.newItem.location = $scope.phone.location;
        }

        function onFail(message) {
            if (message != "Camera cancelled."){
                alert('Failed because: ' + message);
            }
        }

        if (navigator.camera){
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });
        }

    }

    // Publish the photo to remote server
    $scope.publishPhoto = function(){
        var url = 'http://vocaleyesapp.org/v1/items';
        var r = $resource(url);
        r.save($scope.newItem);
    }

    $scope.takePhoto()


});
