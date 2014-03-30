angular.module('FpApp').factory 'RepoFactory', ->
  class RepoFactory
    @objects = [
      {name: 'transporter', image: true, color: 'rgba(90,90,90,1)', w: 1, h:1, type:'Transporter', transporter: true},
      {name: 'terrain', image: true, color: 'rgba(30,90,170,1)', w: 1, h:1, type:'Terrain', terrain: true},

      {name: 'inserter', image: false, color: 'rgba(120,50,90,1)', w: 1, h:1, type:'Inserter',transportable: true}

      {name: 'factory', image: false, color: 'rgba(120,50,90,1)', w: 3, h:3, type:'Factory'}

      {name: 'ironOre', image: false, color: 'rgba(180,50,30,1)', w: 0.5, h:0.5, type:'oreIron', transportable: true, terrainable: true}
      {name: 'copperOre', image: false, color: 'rgba(20,0,190,1)', w: 0.5, h:0.5, type:'oreCopper', transportable: true, terrainable: true}
    ]

    @getObjects: ->
      return @objects


angular.module('FpApp').controller 'RepoController', ($scope, RepoFactory) ->

  $scope.repoObjects = RepoFactory.objects

  $scope.remaining = ->
    count = 0
    for o in $scope.repoObjects
      count += o.image ? 0: 1
    count

  $scope.setSelected = (i)->
    $scope.selectedObject = i
