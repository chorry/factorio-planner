//@ sourceMappingURL=debugGrid.map
// Generated by CoffeeScript 1.6.1
(function() {
  var debugGrid;

  window.debugGrid = debugGrid = (function() {

    function debugGrid() {}

    debugGrid.prototype.getGridData = function() {
      var content, key, string, tmp, x, y, _i, _j, _len, _len1, _ref, _ref1;
      x = 0;
      y = 0;
      tmp = {};
      string = '';
      _ref = Object.keys(window.gApp.grid.gridObjects);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        string += '<div class="d_item">';
        _ref1 = window.gApp.grid.gridObjects[key]['object']['content'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          content = _ref1[_j];
          string += '<div class="d_content">' + (content.name || 'none') + '</div>';
        }
        string += '</div>';
      }
      string += '</table>';
      $('#debugwnd').html(string);
      return console.log(window.gApp.grid.gridObjects);
    };

    return debugGrid;

  })();

}).call(this);