//@ sourceMappingURL=grid.map
// Generated by CoffeeScript 1.6.1
(function() {
  var App, CCanvas, EventedClass, Grid, GridCanvas, ObjectContainer, ObjectExtender, ObjectFactory, ObjectGeneric, ObjectMulti, ObjectTerrain, ObjectTransporter, extend,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  window.App = App = (function() {

    function App() {
      this.grid = new Grid();
      this.gridCanvas = new GridCanvas;
      this.CCanvas = new CCanvas;
      this.CCanvas.setCanvas('grid_canvas');
      this.gridCanvas.drawGridLines(this.CCanvas.getContext(), this.grid);
    }

    return App;

  })();

  Grid = (function() {

    function Grid() {
      this.lineColor = 'rgba(0,0,0,1)';
      this.cellColor = 'rgbc(255,255,255,1)';
      this.bgColor = 'rgbc(255,255,255,1)';
      this.width = 4;
      this.height = 4;
      this.cellSize = 80;
      this.gridObjects = {};
      this.init();
    }

    Grid.prototype.init = function() {
      var x, y, _i, _ref, _results;
      _results = [];
      for (x = _i = 0, _ref = this.width; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (y = _j = 0, _ref1 = this.height; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
            this.gridObjects["" + x + "," + y] = new ObjectContainer(new ObjectTerrain);
            this.gridObjects["" + x + "," + y].setX(x);
            _results1.push(this.gridObjects["" + x + "," + y].setY(y));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Grid.prototype.setWidth = function(width) {
      this.width = width;
      return this.setWidthPx(this.width * this.cellSize);
    };

    Grid.prototype.setHeight = function(height) {
      this.height = height;
    };

    Grid.prototype.getWidthPx = function() {
      return this.width * this.cellSize;
    };

    Grid.prototype.getHeightPx = function() {
      return this.height * this.cellSize;
    };

    Grid.prototype.setCellSize = function(cellSize) {
      this.cellSize = cellSize;
    };

    Grid.prototype.setCellColor = function(cellColor) {
      this.cellColor = cellColor;
    };

    Grid.prototype.setBgColor = function(bgColor) {
      this.bgColor = bgColor;
    };

    Grid.prototype.updateCellContainer = function(cellX, cellY, data) {
      var extender, h, w, _i, _j, _ref, _ref1;
      if ((data.size != null) && (data.size.w > 1 || data.size.h > 1)) {
        for (w = _i = 0, _ref = data.size.w - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; w = 0 <= _ref ? ++_i : --_i) {
          for (h = _j = 0, _ref1 = data.size.h - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; h = 0 <= _ref1 ? ++_j : --_j) {
            extender = {
              'belongsTo': [w, h],
              'color': data.color,
              'type': 'Extender'
            };
            this.gridObjects["" + (cellX + w) + "," + (cellY + h)].setContent(extender);
          }
        }
      }
      this.gridObjects["" + cellX + "," + cellY].setContent(data);
      window.gApp.gridCanvas.updateCanvas(this.gridObjects);
      return console.debug(this.gridObjects['0,0']);
    };

    return Grid;

  })();

  GridCanvas = (function() {

    function GridCanvas() {}

    GridCanvas.prototype.drawGridLines = function(ctx, grid) {
      var lineNumX, lineNumY, lineXEnd, lineXStart, lineYEnd, lineYStart, _i, _j, _ref, _ref1, _results;
      ctx.fillStyle = grid.lineColor;
      for (lineNumX = _i = 0, _ref = grid.width; 0 <= _ref ? _i <= _ref : _i >= _ref; lineNumX = 0 <= _ref ? ++_i : --_i) {
        lineXStart = lineNumX * grid.cellSize;
        lineXEnd = lineXStart;
        lineYStart = 0;
        lineYEnd = grid.getHeightPx();
        ctx.beginPath();
        ctx.moveTo(lineXStart, lineYStart);
        ctx.lineTo(lineXEnd, lineYEnd);
        ctx.closePath();
        ctx.stroke();
      }
      _results = [];
      for (lineNumY = _j = 0, _ref1 = grid.width; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; lineNumY = 0 <= _ref1 ? ++_j : --_j) {
        lineXStart = 0;
        lineXEnd = grid.getWidthPx();
        lineYStart = lineNumY * grid.cellSize;
        lineYEnd = lineYStart;
        ctx.beginPath();
        ctx.moveTo(lineXStart, lineYStart);
        ctx.lineTo(lineXEnd, lineYEnd);
        ctx.closePath();
        _results.push(ctx.stroke());
      }
      return _results;
    };

    GridCanvas.prototype.updateCell = function(ctx, cellX, cellY, cellSize, color) {
      if (color === void 0) {
        color = 'rgba(150,150,150,1)';
      }
      ctx.fillStyle = color;
      ctx.fillRect(cellX * window.gApp.grid.cellSize, cellY * window.gApp.grid.cellSize, cellSize, cellSize);
      ctx.fill();
      return ctx.stroke();
    };

    GridCanvas.prototype.updateObject = function(object) {
      var i, _i, _len, _ref, _results;
      _ref = object.getUpdateCoords();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        console.debug(i);
        if (i.icon != null) {
          _results.push(window.gApp.CCanvas.loadImageFromFile(window.gApp.CCanvas.getContext(), i.icon, i.x * window.gApp.grid.cellSize, i.y * window.gApp.grid.cellSize, object.getSize() * window.gApp.grid.cellSize, object.getSize() * window.gApp.grid.cellSize));
        } else {
          _results.push(this.updateCell(window.gApp.CCanvas.getContext(), i.x, i.y, object.getSize() * window.gApp.grid.cellSize, i.color));
        }
      }
      return _results;
    };

    GridCanvas.prototype.updateCanvas = function(gridObjects) {
      var x, y, _i, _ref, _results;
      _results = [];
      for (x = _i = 0, _ref = window.gApp.grid.width; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (y = _j = 0, _ref1 = window.gApp.grid.height; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
            if (gridObjects["" + x + "," + y].hasChanged) {
              window.gApp.gridCanvas.updateObject(gridObjects["" + x + "," + y]);
              _results1.push(gridObjects["" + x + "," + y].hasChanged = false);
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    return GridCanvas;

  })();

  CCanvas = (function() {

    function CCanvas() {}

    CCanvas.prototype.setCanvas = function(canvasId) {
      this.canvasId = canvasId;
      this.canvas = document.getElementById(this.canvasId);
      this.canvas.onmousedown = this.canvasDown;
      this.canvas.onmouseup = this.canvasUp;
      return this.ctx = this.canvas.getContext('2d');
    };

    CCanvas.prototype.getCanvas = function() {
      return this.canvas;
    };

    CCanvas.prototype.getContext = function() {
      return this.ctx;
    };

    CCanvas.prototype.canvasUp = function(e) {
      var canvas, x, y;
      canvas = e.srcElement;
      x = e.pageX - canvas.offsetLeft;
      y = e.pageY - canvas.offsetTop;
      return EventedClass.trigger('cgrid_click', [x, y, canvas.id]);
    };

    CCanvas.prototype.loadImageFromFile = function(ctx, fileName, x, y, w, h) {
      var img;
      img = new Image();
      console.debug('fname,', fileName);
      img.src = fileName;
      return ctx.drawImage(img, 7, 7, w, h, x, y, w, h);
    };

    return CCanvas;

  })();

  window.EventedClass = EventedClass = (function() {

    function EventedClass() {}

    EventedClass.prototype.bind = function(event, callback) {
      this.eventHandlers || (this.eventHandlers = {});
      if (this.eventHandlers[event] == null) {
        this.eventHandlers[event] = [];
      }
      this.eventHandlers[event].push(callback);
      return true;
    };

    EventedClass.prototype.unbind = function(event, callback) {
      this.eventHandlers || (this.eventHandlers = {});
      if ((this.eventHandlers[event] != null) && this.eventHandlers[event].indexOf(callback) >= 0) {
        this.eventHandlers[event].splice(this.eventHandlers[event].indexOf(callback), 1);
        return true;
      } else {
        return false;
      }
    };

    EventedClass.prototype.unbindAll = function() {
      this.eventHandlers = {};
      return true;
    };

    EventedClass.prototype.trigger = function(event, data) {
      var callback, _i, _len, _ref;
      if (data == null) {
        data = {};
      }
      this.eventHandlers || (this.eventHandlers = {});
      if ((this.eventHandlers[event] != null) && this.eventHandlers[event].length > 0) {
        _ref = this.eventHandlers[event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          if (typeof callback === 'function') {
            callback(data);
          }
        }
        return true;
      } else {
        return false;
      }
    };

    return EventedClass;

  })();

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  ObjectFactory = (function() {

    function ObjectFactory() {}

    ObjectFactory.getClass = function(cName) {
      switch (cName) {
        case 'Terrain':
          return new ObjectTerrain;
        case 'Transporter':
          return new ObjectTransporter;
        case 'Extener':
          return new ObjectExtender;
        default:
          return new ObjectGeneric;
      }
    };

    return ObjectFactory;

  })();

  ObjectContainer = (function() {

    function ObjectContainer(object) {
      this.object = object;
      this.hasChanged = false;
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
      var setContent, _ref;
      setContent = true;
      console.debug('d.type=', d.type);
      if ((_ref = d.type) === 'Terrain' || _ref === 'Transporter') {
        setContent = false;
        this.object = ObjectFactory.getClass(d.type);
        console.log('new object');
        this.updateNewObject();
      }
      if (setContent) {
        this.object.setContent(d);
      }
      return this.hasChanged = true;
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
    "takes whole grid cell, contains no other objects";
    function ObjectGeneric() {
      this.direction = 'l2r';
      this.size = 1;
      this.content = [{}, {}, {}, {}];
    }

    ObjectGeneric.prototype.setContent = function(d) {
      return extend(this.content, d);
    };

    ObjectGeneric.prototype.getUpdateCoords = function() {
      return [
        {
          'x': this.x,
          'y': this.y,
          'color': this.content[0].color
        }
      ];
    };

    ObjectGeneric.prototype.setType = function(type) {
      this.type = type;
    };

    ObjectGeneric.prototype.getType = function() {
      return this.type;
    };

    return ObjectGeneric;

  })();

  ObjectExtender = (function(_super) {

    __extends(ObjectExtender, _super);

    "For multi-cell objects";

    function ObjectExtender() {
      return ObjectExtender.__super__.constructor.apply(this, arguments);
    }

    ObjectExtender.prototype.setContent = function(content) {
      this.content = content;
      return console.log('ObjExtender.setContent - Not implemented');
    };

    return ObjectExtender;

  })(ObjectGeneric);

  ObjectMulti = (function(_super) {

    __extends(ObjectMulti, _super);

    function ObjectMulti() {
      ObjectMulti.__super__.constructor.apply(this, arguments);
      this.direction = 'l2r';
      this.size = 0.5;
      this.directionDict = {
        'lefttop': 0,
        'leftbottom': 2,
        'righttop': 1,
        'rightbottom': 3
      };
    }

    ObjectMulti.prototype.resetContent = function() {
      return this.content = [{}, {}, {}, {}];
    };

    ObjectMulti.prototype.getUpdateCoords = function() {
      return [
        {
          'x': this.x,
          'y': this.y,
          'color': this.content[0].color,
          'image': this.content[0].image,
          'icon': this.content[0].icon
        }, {
          'x': this.x + 0.5,
          'y': this.y,
          'color': this.content[1].color,
          'image': this.content[1].image,
          'icon': this.content[1].icon
        }, {
          'x': this.x,
          'y': this.y + 0.5,
          'color': this.content[2].color,
          'image': this.content[2].image,
          'icon': this.content[2].icon
        }, {
          'x': this.x + 0.5,
          'y': this.y + 0.5,
          'color': this.content[3].color,
          'image': this.content[3].image,
          'icon': this.content[3].icon
        }
      ];
    };

    ObjectMulti.prototype.setContent = function(content) {
      var dictKey;
      dictKey = 0;
      if (content.direction != null) {
        dictKey = this.directionDict[content.direction];
      }
      this.content[dictKey] = content;
      console.debug('multi set to', this.content);
    };

    return ObjectMulti;

  })(ObjectGeneric);

  ObjectTerrain = (function(_super) {

    __extends(ObjectTerrain, _super);

    "takes whole grid cell, is a container";

    function ObjectTerrain() {
      ObjectTerrain.__super__.constructor.apply(this, arguments);
      this.content[0].color = 'rgba(30,90,170,1)';
      this.content[1].color = 'rgba(30,90,170,1)';
      this.content[2].color = 'rgba(30,90,170,1)';
      this.content[3].color = 'rgba(30,90,170,1)';
      this.terrain = true;
      this.type = 'Terrain';
    }

    ObjectTerrain.prototype.setContent = function(d) {
      ObjectTerrain.__super__.setContent.apply(this, arguments);
      if (d.type === this.type) {
        console.log('erasing terrain content');
        return this.resetContent;
      }
    };

    return ObjectTerrain;

  })(ObjectMulti);

  ObjectTransporter = (function(_super) {

    __extends(ObjectTransporter, _super);

    "takes whole grid cell, is a container, rotatable";

    function ObjectTransporter() {
      ObjectTransporter.__super__.constructor.apply(this, arguments);
      this.type = 'Transporter';
      this.image = 'img/entity/basic-transport-belt/basic-transport-belt.png';
      this.icon = 'img/icons/basic-transport-belt/basic-transport-belt.png';
    }

    ObjectTransporter.prototype.rotateItem = function() {
      return this.content.color = [this.content.color[3], this.content.color[1], this.content.color[4], this.content.color[2]];
    };

    return ObjectTransporter;

  })(ObjectMulti);

  EventedClass = new EventedClass();

  EventedClass.bind('cgrid_click', function(e) {
    var cellX, cellY, obj, qX, qY, quX, quY, updX, updY, _ref;
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
    if ((_ref = obj.type) !== 'Terrain' && _ref !== 'Transporter') {
      obj.direction = quX + quY;
    } else {
      obj.direction = 'lefttop';
    }
    obj.size = {
      'w': obj.w,
      'h': obj.h
    };
    console.debug('obj for update', obj, 'direction:', obj.direction);
    return window.gApp.grid.updateCellContainer(cellX, cellY, obj);
  });

  $(document).ready(function() {
    window.gApp = new App();
    return window.dGrid = new window.debugGrid();
  });

  ({
    SimpleController: function($scope) {
      return $scope.names = ['Dave', 'Napur', 'Heedy', 'Shriva'];
    }
  });

}).call(this);
