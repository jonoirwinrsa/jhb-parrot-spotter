angular.module('jonoirwin.parrots.services', ['ngResource'])

  .factory('Geo', function ($q) {
    return {
      reverseGeocode: function (lat, lng) {
        var q = $q.defer();

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          'latLng': new google.maps.LatLng(lat, lng)
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log('Reverse', results);
            if (results.length > 1) {
              var r = results[1];
              var a, types;
              var parts = [];
              var foundSuburb = false;
              var foundLocality = false;
              var foundState = false;
              for (var i = 0; i < r.address_components.length; i++) {
                a = r.address_components[i];
                types = a.types;
                for (var j = 0; j < types.length; j++) {
                  if (!foundSuburb && types[j] == 'sublocality_level_1') {
                    foundSuburb = true;
                    parts.push(a.long_name);
                  }
                  else if (!foundLocality && types[j] == 'locality') {
                    foundLocality = true;
                    parts.push(a.long_name);
                  } else if (!foundState && types[j] == 'administrative_area_level_1') {
                    foundState = true;
                    parts.push(a.long_name);
                  }
                }
              }
              console.log('Reverse', parts);
              q.resolve(parts.join(', '));
            }
          } else {
            console.log('reverse fail', results, status);
            q.reject(results);
          }
        });

        return q.promise;
      },
      getLocation: function () {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function (position) {
          q.resolve(position);
        }, function (error) {
          q.reject(error);
        });

        return q.promise;
      }
    };
  })

  .factory('Flickr', function ($q, $resource, FLICKR_API_KEY) {
    var baseUrl = 'https://api.flickr.com/services/rest/';


    var flickrSearch = $resource(baseUrl, {
      method: 'flickr.groups.pools.getPhotos',
      group_id: '28763481@N00',
      safe_search: 1,
      jsoncallback: 'JSON_CALLBACK',
      api_key: FLICKR_API_KEY,
      format: 'json'
    }, {
      get: {
        method: 'JSONP'
      }
    });

    return {
      search: function (tags, lat, lng) {
        var q = $q.defer();

        console.log('Searching flickr for tags', tags);

        flickrSearch.get({
          tags: 'sunrise',
          lat: lat,
          lng: lng
        }, function (val) {
          q.resolve(val);
        }, function (httpResponse) {
          q.reject(httpResponse);
        });

        return q.promise;
      }
    };
  });
