// Generated by CoffeeScript 1.7.1
(function() {
  var EventedClass, ObjectContainer, ObjectGeneric, ObjectTerrain, ObjectTransporter;

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  window.ObjectCont = ObjectContainer = (function() {
    function ObjectContainer(object) {
      this.object = object;
    }

    ObjectContainer.property('size', {
      get: function() {
        return this.object.size;
      },
      set: function(s) {
        return this.object.size = s;
      }
    });

    ObjectContainer.prototype.setContent = function(d) {
      if (d.type !== 'Terrain') {
        this.object = new ObjectGeneric();
      } else {
        this.object = new ObjectTerrain();
      }
      this.updateNewObject();
      return this.object.setContent(d);
    };

    ObjectContainer.prototype.updateNewObject = function() {
      this.setX(this.x);
      return this.setY(this.y);
    };

    ObjectContainer.prototype.getUpdateCoords = function() {
      return this.object.getUpdateCoords();
    };

    ObjectContainer.prototype.getSize = function() {
      return this.object.size;
    };

    ObjectContainer.prototype.setX = function(x) {
      this.x = x;
      return this.object.x = this.x;
    };

    ObjectContainer.prototype.setY = function(y) {
      this.y = y;
      return this.object.y = this.y;
    };

    return ObjectContainer;

  })();

  ObjectGeneric = (function() {
    function ObjectGeneric() {
      this.direction = 'l2r';
      this.size = 1;
    }

    ObjectGeneric.prototype.setContent = function(d) {
      this.content = d;
      if (d.size != null) {
        return this.size = d.size.w;
      }
    };

    ObjectGeneric.prototype.getUpdateCoords = function() {
      return [
        {
          'x': this.x,
          'y': this.y,
          'color': this.content[0]
        }
      ];
    };

    return ObjectGeneric;

  })();

  ObjectTerrain = (function() {
    function ObjectTerrain() {
      this.direction = 'l2r';
      this.content = ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)'];
      this.directionDict = {
        'lefttop': 0,
        'leftbottom': 2,
        'righttop': 1,
        'rightbottom': 3
      };
      this.size = 0.5;
    }

    ObjectTerrain.prototype.setContent = function(d) {
      if (d.direction != null) {
        return this.content[this.directionDict[d.direction]] = d.color;
      } else {
        return this.content = d;
      }
    };

    ObjectTerrain.prototype.getUpdateCoords = function() {
      return [
        {
          'x': this.x,
          'y': this.y,
          'color': this.content[0]
        }, {
          'x': this.x + 0.5,
          'y': this.y,
          'color': this.content[1]
        }, {
          'x': this.x,
          'y': this.y + 0.5,
          'color': this.content[2]
        }, {
          'x': this.x + 0.5,
          'y': this.y + 0.5,
          'color': this.content[3]
        }
      ];
    };

    return ObjectTerrain;

  })();

  ObjectTransporter = (function() {
    function ObjectTransporter() {
      this.direction = 'l2r';
      this.content = ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)'];
      this.directionDict = {
        'lefttop': 0,
        'leftbottom': 2,
        'righttop': 1,
        'rightbottom': 3
      };
      this.size = 0.5;
    }

    ObjectTransporter.prototype.setContent = function(d) {
      if (d.direction != null) {
        return this.content[this.directionDict[d.direction]] = d.color;
      } else {
        return this.content = d;
      }
    };

    ObjectTransporter.prototype.getUpdateCoords = function() {
      return [
        {
          'x': this.x,
          'y': this.y,
          'color': this.content[0]
        }, {
          'x': this.x + 0.5,
          'y': this.y,
          'color': this.content[1]
        }, {
          'x': this.x,
          'y': this.y + 0.5,
          'color': this.content[2]
        }, {
          'x': this.x + 0.5,
          'y': this.y + 0.5,
          'color': this.content[3]
        }
      ];
    };

    ObjectTransporter.prototype.rotateItem = function() {
      return this.content = [this.content[3], this.content[1], this.content[4], this.content[2]];
    };

    return ObjectTransporter;

  })();

  EventedClass = new EventedClass();

  EventedClass.bind('cgrid_click', (function(_this) {
    return function(e) {
      var cellX, cellY, data, obj, qX, qY, quX, quY, updX, updY;
      cellX = Math.floor(e[0] / window.gApp.grid.cellSize);
      cellY = Math.floor(e[1] / window.gApp.grid.cellSize);
      qX = e[0] - cellX * window.gApp.grid.cellSize;
      qY = e[1] - cellY * window.gApp.grid.cellSize;
      if (qX <= (cellX + 0.5 * window.gApp.grid.cellSize)) {
        quX = 'left';
        updX = cellX;
      } else {
        quX = 'right';
        updX = cellX + 0.5;
      }
      if (qY <= (cellY + 0.5 * window.gApp.grid.cellSize)) {
        quY = 'top';
        updY = cellY;
      } else {
        quY = 'bottom';
        updY = cellY + 0.5;
      }
      if (angular.element('#objectsPanel').scope().selectedObject === 'undefined') {
        return;
      }
      obj = angular.element('#objectsPanel').scope().selectedObject;
      data = {
        type: obj.type,
        color: obj.color,
        direction: quX + quY,
        size: {
          'w': obj.w,
          'h': obj.h
        }
      };
      window.gApp.cgrid;
      return window.gApp.grid.updateCellContainer(cellX, cellY, data);
    };
  })(this));

}).call(this);
