// Generated by CoffeeScript 1.7.1
(function() {
  angular.module('FpApp').factory('RepoFactory', function() {
    var RepoFactory;
    return RepoFactory = (function() {
      function RepoFactory() {}

      RepoFactory.objects = [
        {
          name: 'transporter',
          image: true,
          color: 'rgba(90,90,90,1)',
          w: 1,
          h: 1,
          type: 'Transporter',
          transporter: true
        }, {
          name: 'terrain',
          image: true,
          color: 'rgba(30,90,170,1)',
          w: 1,
          h: 1,
          type: 'Terrain',
          terrain: true
        }, {
          name: 'inserter',
          image: false,
          color: 'rgba(120,50,90,1)',
          w: 1,
          h: 1,
          type: 'Inserter',
          transportable: true
        }, {
          name: 'factory',
          image: false,
          color: 'rgba(120,50,90,1)',
          w: 3,
          h: 3,
          type: 'Factory'
        }, {
          name: 'ironOre',
          image: false,
          color: 'rgba(180,50,30,1)',
          w: 0.5,
          h: 0.5,
          type: 'oreIron',
          transportable: true,
          terrainable: true
        }, {
          name: 'copperOre',
          image: false,
          color: 'rgba(20,0,190,1)',
          w: 0.5,
          h: 0.5,
          type: 'oreCopper',
          transportable: true,
          terrainable: true
        }
      ];

      RepoFactory.getObjects = function() {
        return this.objects;
      };

      return RepoFactory;

    })();
  });

  angular.module('FpApp').controller('RepoController', function($scope, RepoFactory) {
    $scope.repoObjects = RepoFactory.objects;
    $scope.remaining = function() {
      var count, o, _i, _len, _ref, _ref1;
      count = 0;
      _ref = $scope.repoObjects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        count += (_ref1 = o.image) != null ? _ref1 : {
          0: 1
        };
      }
      return count;
    };
    return $scope.setSelected = function(i) {
      return $scope.selectedObject = i;
    };
  });

}).call(this);