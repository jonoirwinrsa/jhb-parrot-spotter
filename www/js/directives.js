angular.module('jonoirwin.parrots.directives', [])

.directive('currentTime', function($timeout, $filter) {
  return {
    restrict: 'E',
    replace: true,
    template: '<span class="current-time">{{currentTime}}</span>',
    scope: {
      localtz: '=',
    },
    link: function($scope, $element, $attr) {
      $timeout(function checkTime() {
        if($scope.localtz) {
          $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
        }
        $timeout(checkTime, 500);
      });
    }
  }
 })


.directive('scrollEffects', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;
      var bg = document.querySelector('.bg-image');
      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('header');
        }
        st = e.detail.scrollTop;
        if(st >= 0) {
          header.style.webkitTransform = 'translate3d(0, 0, 0)';
        } else if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
        amt = Math.min(0.6, st / 1000);

        ionic.requestAnimationFrame(function() {
          header.style.opacty = 1 - amt;
          if(bg) {
            bg.style.opacity = 1 - amt;
          }
        });
      });
    }
  }
})

.directive('backgroundCycler', function($compile, $animate) {
  var animate = function($scope, $element, newImageUrl) {
    var child = $element.children()[0];

    var scope = $scope.$new();
    scope.url = newImageUrl;
    var img = $compile('<background-image></background-image>')(scope);

    $animate.enter(img, $element, null, function() {
      console.log('Inserted');
    });
    if(child) {
      $animate.leave(angular.element(child), function() {
        console.log('Removed');
      });
    }
  };

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $scope.$watch('activeBgImage', function(v) {
        if(!v) { return; }
        console.log('Active bg image changed', v);
        var item = v;
        var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
        animate($scope, $element, url);
      });
    }
  }
})

.directive('backgroundImage', function($compile, $animate) {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      if($scope.url) {
        $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
      }
    }
  }
});
