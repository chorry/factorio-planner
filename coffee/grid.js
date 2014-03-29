// Generated by CoffeeScript 1.7.1
(function() {
  var App, CCanvas, EventedClass, Grid, GridCanvas, ObjectContainer, ObjectTerrain, ObjectTransporter;

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
      this.width = 20;
      this.height = 20;
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
      var h, w, _i, _j, _ref, _ref1;
      if ((data.size != null) && (data.size.w > 1 || data.size.h > 1)) {
        for (w = _i = 0, _ref = data.size.w - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; w = 0 <= _ref ? ++_i : --_i) {
          for (h = _j = 0, _ref1 = data.size.h - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; h = 0 <= _ref1 ? ++_j : --_j) {
            this.gridObjects["" + (cellX + w) + "," + (cellY + h)].setContent({
              'belongsTo': [w, h]
            });
          }
        }
      }
      this.gridObjects["" + cellX + "," + cellY].setContent(data);
      return window.gApp.gridCanvas.updateObject(this.gridObjects["" + cellX + "," + cellY]);
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
        _results.push(this.updateCell(window.gApp.CCanvas.getContext(), i.x, i.y, object.size * window.gApp.grid.cellSize, i.color));
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

  ObjectContainer = (function() {
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
      return this.object.setContent(d);
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
        return this.content[this.directionDict[d.direction]] = d.value;
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
        return this.content[this.directionDict[d.direction]] = d.value;
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
      var cellX, cellY, data, qX, qY, quX, quY, updX, updY;
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
      data = {
        value: 'rgba(90,90,90,0.5)',
        direction: quX + quY,
        size: {
          'w': 1,
          'h': 1
        }
      };
      window.gApp.cgrid;
      return window.gApp.grid.updateCellContainer(cellX, cellY, data);
    };
  })(this));

  $(document).ready(function() {
    return window.gApp = new App();
  });

}).call(this);
