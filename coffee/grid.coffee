window.App = class App
  constructor: () ->
    @grid = new Grid()
    @gridCanvas = new GridCanvas
    @CCanvas = new CCanvas
    @CCanvas.setCanvas('grid_canvas')
    @gridCanvas.drawGridLines(@CCanvas.getContext(), @grid)

class  Grid
  constructor: () ->
    @lineColor = 'rgba(0,0,0,1)'
    @cellColor = 'rgbc(255,255,255,1)'
    @bgColor   = 'rgbc(255,255,255,1)'
    @width     = 20
    @height    = 20
    @cellSize  = 80
    @gridObjects = {}
    @init()

  init: () ->
    for x in [0..@width]
      for y in [0..@height]
          @gridObjects[ "#{x},#{y}" ] = new ObjectContainer( new ObjectTerrain )
          @gridObjects[ "#{x},#{y}" ].setX(x)
          @gridObjects[ "#{x},#{y}" ].setY(y)

  setWidth: (@width) ->
    @setWidthPx(@width * @cellSize)
  setHeight: (@height) ->
  getWidthPx: () ->
    return @width * @cellSize
  getHeightPx: () ->
    return @height * @cellSize
  setCellSize: (@cellSize) ->
  setCellColor: (@cellColor) ->
  setBgColor: (@bgColor) ->


  updateCellContainer: (cellX, cellY, data) ->
    if data.size? and (data.size.w >1 || data.size.h > 1)
      for w in [0..data.size.w-1]
        for h in [0..data.size.h-1]
          @gridObjects["#{cellX+w},#{cellY+h}"].setContent( 'belongsTo': [w,h] )

    @gridObjects["#{cellX},#{cellY}"].setContent(data)
    console.debug('grid', @gridObjects['0,1'].object.content)
    window.gApp.gridCanvas.updateObject( @gridObjects["#{cellX},#{cellY}"] )


class GridCanvas
  drawGridLines: (ctx, grid) ->
    ctx.fillStyle = grid.lineColor
    for lineNumX in [ 0..(grid.width) ]
      lineXStart = lineNumX * grid.cellSize
      lineXEnd   = lineXStart
      lineYStart = 0
      lineYEnd   = grid.getHeightPx()

      ctx.beginPath()
      ctx.moveTo(lineXStart, lineYStart)
      ctx.lineTo(lineXEnd, lineYEnd)
      ctx.closePath()
      ctx.stroke()

    for lineNumY in [ 0..(grid.width) ]
      lineXStart = 0
      lineXEnd   = grid.getWidthPx()
      lineYStart = lineNumY * grid.cellSize
      lineYEnd   = lineYStart

      ctx.beginPath()
      ctx.moveTo(lineXStart, lineYStart)
      ctx.lineTo(lineXEnd, lineYEnd)
      ctx.closePath()
      ctx.stroke()

  updateCell: (ctx, cellX, cellY, cellSize, color) ->
    ctx.fillStyle = color
    ctx.fillRect(
      cellX * window.gApp.grid.cellSize,
      cellY * window.gApp.grid.cellSize,
      cellSize,
      cellSize
    )
    ctx.fill()
    ctx.stroke()

  updateObject: (object) ->
    for i in object.getUpdateCoords()
      @updateCell(
        window.gApp.CCanvas.getContext(),
        i.x, i.y,
        object.size * window.gApp.grid.cellSize,
        i.color #'rgba(90,90,90,0.3)' #i.resource
      )

class CCanvas
  constructor: () ->

  setCanvas: (@canvasId) ->
    @canvas = document.getElementById(@canvasId)
    @canvas.onmousedown = @canvasDown
    @canvas.onmouseup = @canvasUp

    @ctx = @canvas.getContext('2d')

  getCanvas: () ->
    return @canvas

  getContext: () ->
    return @ctx

  canvasUp: (e) ->
    canvas = e.srcElement
    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop
    EventedClass.trigger( 'cgrid_click', [x, y, canvas.id] )

window.EventedClass = class EventedClass
  bind: (event, callback) ->
    @eventHandlers ||= {}
    @eventHandlers[event] = [] unless @eventHandlers[event]?
    @eventHandlers[event].push(callback)
    return true

  unbind: (event, callback) ->
    @eventHandlers ||= {}
    if @eventHandlers[event]? && @eventHandlers[event].indexOf(callback) >= 0
      @eventHandlers[event].splice(@eventHandlers[event].indexOf(callback), 1)
      return true
    else
      return false

  unbindAll: ->
    @eventHandlers = {}
    return true

  trigger: (event, data={}) ->
    @eventHandlers ||= {}
    if @eventHandlers[event]? && @eventHandlers[event].length > 0
      for callback in @eventHandlers[event]
        callback(data) if typeof(callback) == 'function'
      return true
    else
      return false

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

class ObjectContainer
  constructor: (@object) ->
  @property 'size',
    get: -> @object.size
    set: (s) -> @object.size = s

  setContent:(d) ->
    console.debug("setContent:", @object, d)
    #drops transporter item onto the ground
    if d.transporter?
      console.log('replace terrain with transport')
      @object.setContent(d)
      return
    if @object.transporter? == true && d.transportable
      console.log('update item on a transport belt')
      @object.setContent(d)
      return
    if @object.terrain? == true && d.terrainable || d.terrain
      console.debug('terraint',d)
      @object.setContent(d)
      return

    if d.type != 'Terrain' &&
      @object = new ObjectGeneric()
    else
      @object = new ObjectTerrain()
      @updateNewObject()

    @object.setContent(d)
    return

  updateNewObject:() ->
    @setX(@x)
    @setY(@y)

  getUpdateCoords: () ->
    return @object.getUpdateCoords()

  getSize: () ->
    return @object.size

  setX: (@x) ->
    @object.x = @x

  setY: (@y) ->
    @object.y = @y

class ObjectGeneric
  constructor: () ->
    @direction = 'l2r'
    @size = 1

  setContent: (d) ->
    @content = d
    if d.size?
      @size = d.size.w

  getUpdateCoords: () ->
    return [
      { 'x': @x, 'y': @y, 'color': @content[0] },
    ]

class ObjectTerrain
  constructor: () ->
    @direction = 'l2r'
    @content = [ 'rgba(200,200,200,1)', 'rgba(200,200,200,1)', 'rgba(200,200,200,1)', 'rgba(200,200,200,1)' ]
    @directionDict = 'lefttop': 0, 'leftbottom': 2, 'righttop': 1, 'rightbottom' : 3
    @size = 0.5
    @terrain = true

  setContent: (d) ->
    #placing terrain into terrain to erase all terrain content
    if d.terrain
      @content = [ d.color, d.color, d.color, d.color ]
    else
      if d.direction?
        @content[ @directionDict[d.direction] ] = d.color
      else
        @content = d

  getUpdateCoords: () ->
    return [
      { 'x': @x, 'y': @y, 'color': @content[0] },
      { 'x': @x+0.5, 'y': @y, 'color': @content[1] },
      { 'x': @x, 'y': @y+0.5, 'color': @content[2] },
      { 'x': @x+0.5, 'y': @y+0.5, 'color': @content[3] },
    ]

class ObjectTransporter
  constructor: () ->
    @direction = 'l2r'
    @content = [ 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)' ]
    @directionDict = 'lefttop': 0, 'leftbottom': 2, 'righttop': 1, 'rightbottom' : 3
    @size = 0.5

  setContent: (d) ->
    if d.direction?
      @content[ @directionDict[d.direction] ] = d.color
    else
      @content = d

  getUpdateCoords: () ->
    return [
      { 'x': @x, 'y': @y, 'color': @content[0] },
      { 'x': @x+0.5, 'y': @y, 'color': @content[1] },
      { 'x': @x, 'y': @y+0.5, 'color': @content[2] },
      { 'x': @x+0.5, 'y': @y+0.5, 'color': @content[3] },
    ]

  #rotate+90   12   -> 31
  #            34      42
  #            1234 -> 3142
  rotateItem: () ->
    @content = [ @content[3], @content[1], @content[4], @content[2] ]

EventedClass = new EventedClass()

EventedClass.bind('cgrid_click', (e) =>
  cellX = Math.floor( e[0]/window.gApp.grid.cellSize)
  cellY = Math.floor( e[1]/window.gApp.grid.cellSize)
  qX = e[0]-cellX*window.gApp.grid.cellSize
  qY = e[1]-cellY*window.gApp.grid.cellSize
  if qX <= (cellX+0.5*window.gApp.grid.cellSize)
    quX = 'left'
    updX = cellX
  else
    quX = 'right'
    updX = cellX + 0.5
  if qY <= (cellY+0.5*window.gApp.grid.cellSize)
    quY = 'top'
    updY = cellY
  else
    quY = 'bottom'
    updY = cellY + 0.5

  if angular.element('#objectsPanel').scope().selectedObject == 'undefined'
    return
  obj = angular.element('#objectsPanel').scope().selectedObject
  obj.direction = quX+quY
  obj.size = 'w': obj.w, 'h': obj.h

  console.debug('obj for update', obj)
  window.gApp.grid.updateCellContainer( cellX, cellY, obj)
)

$(document).ready ->
  window.gApp = new App()

SimpleController: ($scope) ->
  $scope.names = ['Dave', 'Napur', 'Heedy', 'Shriva']
