window.debugGrid = class debugGrid


  getGridData: ->
    x = 0
    y = 0
    tmp = {}
    string = '';
    for key in Object.keys( window.gApp.grid.gridObjects )
      string += '<div class="d_item">'
      for content in window.gApp.grid.gridObjects[key]['object']['content']
        string += '<div class="d_content">' + (content.name || 'none')+ '</div>'
      string += '</div>'

    string += '</table>'
    $('#debugwnd').html(string)

    console.log(window.gApp.grid.gridObjects)