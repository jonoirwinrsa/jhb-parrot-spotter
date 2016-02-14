angular.module('jonoirwin.parrots', ['ionic', 'jonoirwin.parrots.services', 'jonoirwin.parrots.directives'])

  .constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')

  .filter('int', function () {
    return function (v) {
      return parseInt(v) || '';
    };
  })

  .controller('MainCtrl', function ($scope, $timeout, $rootScope, Geo, Flickr, $ionicModal, $ionicPlatform) {
    var _this = this;

    $ionicPlatform.ready(function () {
      // Hide the status bar
      if (window.StatusBar) {
        StatusBar.hide();
      }
    });

    $scope.activeBgImageIndex = 0;


    this.getBackgroundImage = function (lat, lng, locString) {
      Flickr.search(locString, lat, lng).then(function (resp) {
        var photos = resp.photos;
        if (photos.photo.length) {
          $scope.bgImages = photos.photo;
          _this.cycleBgImages();
        }
      }, function (error) {
        console.error('Unable to get Flickr images', error);
      });
    };


    this.cycleBgImages = function () {
      $timeout(function cycle() {
        if ($scope.bgImages) {
          $scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
        }
        //$timeout(cycle, 10000);
      });
    };

    $scope.refreshData = function () {
      Geo.getLocation().then(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        Geo.reverseGeocode(lat, lng).then(function (locString) {
          $scope.currentLocationString = locString;
          _this.getBackgroundImage(lat, lng, locString);
        });
        _this.getCurrent(lat, lng);
      }, function (error) {
        alert('Unable to get current location: ' + error);
      });
    };

    $scope.refreshData();
  })
