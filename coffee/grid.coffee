extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

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
    @bgColor = 'rgbc(255,255,255,1)'
    @width = 4
    @height = 4
    @cellSize = 80
    @gridObjects = {}
    @init()

  getRealWidth: ->
    @width - 1
  getRealHeight: ->
    @height - 1

  init: () ->
    for x in [0..@getRealWidth()]
      for y in [0..@getRealHeight()]
        @gridObjects[ "#{x},#{y}" ] = new ObjectContainer(new ObjectTerrain)
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

  getGridObjects: ->
    return @gridObjects

  scaleUp: ->
    window.gApp.grid.cellSize = window.gApp.grid.cellSize / 2
    window.gApp.gridCanvas.redrawAfterScale = true
    window.gApp.gridCanvas.updateCanvas(window.gApp.grid.gridObjects)

  scaleDown: ->
    window.gApp.grid.cellSize = window.gApp.grid.cellSize * 2
    window.gApp.gridCanvas.redrawAfterScale = true
    window.gApp.gridCanvas.updateCanvas(window.gApp.grid.gridObjects)

  updateCellContainer: (cellX, cellY, data) ->
    tmpObjects = []
    if data.size? #and (data.size.w >1 || data.size.h > 1)
      for w in [0..data.size.w - 1]
        for h in [0..data.size.h - 1]
          # check if there is enough space to place object
          if (data.size.w > 1 || data.size.h > 1)
            for i in [0..3]
              if @gridObjects["#{cellX + w},#{cellY + h}"].object.content[i].type != undefined
                #TODO: raise "object already exist there" notice
                return
            extender = { 'belongsTo': [cellX, cellY], 'color': data.color, 'type': 'Extender' }
            tmpObjects["#{cellX + w},#{cellY + h}"] = extender
          else

            if @gridObjects["#{cellX + w},#{cellY + h}"].object.content[ 0 ].hasOwnProperty('type') and @gridObjects["#{cellX + w},#{cellY + h}"].object.content[ 0 ].type in [ 'Extender']
              return


    for i in Object.keys(tmpObjects)
      @gridObjects[i].setContent(tmpObjects[i])

    @gridObjects["#{cellX},#{cellY}"].setContent(data)
    window.gApp.gridCanvas.updateCanvas(@gridObjects)


class GridCanvas
  drawGridLines: (ctx, grid) ->
    ctx.fillStyle = grid.lineColor
    for lineNumX in [ 0..(grid.getRealWidth()) ]
      lineXStart = lineNumX * grid.cellSize
      lineXEnd = lineXStart
      lineYStart = 0
      lineYEnd = grid.getHeightPx()

      ctx.beginPath()
      ctx.moveTo(lineXStart, lineYStart)
      ctx.lineTo(lineXEnd, lineYEnd)
      ctx.closePath()
      ctx.stroke()

    for lineNumY in [ 0..(grid.getRealWidth()) ]
      lineXStart = 0
      lineXEnd = grid.getWidthPx()
      lineYStart = lineNumY * grid.cellSize
      lineYEnd = lineYStart

      ctx.beginPath()
      ctx.moveTo(lineXStart, lineYStart)
      ctx.lineTo(lineXEnd, lineYEnd)
      ctx.closePath()
      ctx.stroke()

  updateCell: (ctx, cellX, cellY, cellSize, color) ->
    #TODO: remove when all objects have colors
    if color == undefined
      color = 'rgba(150,150,150,1)'

    ctx.fillStyle = color

    ctx.fillRect(
      cellX * window.gApp.grid.cellSize,
      cellY * window.gApp.grid.cellSize,
      cellSize,
      cellSize
    )
    ctx.fill()
    ctx.stroke()

  objectCanBePlaced: (object) ->


  updateObject: (object) ->
    for i in object.getUpdateCoords()
      if i.icon?
        window.gApp.CCanvas.loadImageFromFile(
          window.gApp.CCanvas.getContext(),
          i.icon, i.x * window.gApp.grid.cellSize, i.y * window.gApp.grid.cellSize,
          object.getSize() * window.gApp.grid.cellSize,
          object.getSize() * window.gApp.grid.cellSize
        )
      else
        @updateCell(
          window.gApp.CCanvas.getContext(),
          i.x, i.y,
          object.getSize() * window.gApp.grid.cellSize,
          i.color #'rgba(90,90,90,0.3)' #i.resource
        )


  updateCanvas: (gridObjects) ->
    for x in [0..window.gApp.grid.getRealWidth()]
      for y in [0..window.gApp.grid.getRealHeight()]
        if gridObjects["#{x},#{y}"].hasChanged || @redrawAfterScale
          window.gApp.gridCanvas.updateObject(gridObjects["#{x},#{y}"])
          gridObjects["#{x},#{y}"].hasChanged = false
    @redrawAfterScale = false

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

  canvasDown: (e) ->
    @clickDown = {
      'x': e.pageX - e.srcElement.offsetLeft,
      'y': e.pageY - e.srcElement.offsetTop
    }

  canvasUp: (e) ->
    canvas = e.srcElement
    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop
    if x == @clickDown['x'] and y == @clickDown['y']
      EventedClass.trigger('cgrid_click', [x, y, canvas.id])
    else
      EventedClass.trigger('cgrid_drag', [ @clickDown, {'x': x, 'y': y}, canvas.id])

  loadImageFromFile: (ctx, fileName, x, y, w, h) ->
    img = new Image()
    img.src = fileName
    ctx.drawImage(img, 7, 7, w, h, x, y, w, h)

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

  trigger: (event, data = {}) ->
    @eventHandlers ||= {}
    if @eventHandlers[event]? && @eventHandlers[event].length > 0
      for callback in @eventHandlers[event]
        callback(data) if typeof(callback) == 'function'
      return true
    else
      return false

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

class ObjectFactory
  @getClass: (cName) ->
    switch cName
      when 'Terrain' then return new ObjectTerrain
      when 'Transporter' then return new ObjectTransporter
      when 'Extender' then return new ObjectExtender
      else return new ObjectGeneric

class ObjectContainer
  constructor: (@object) ->
    @hasChanged = false
  @property 'size',
    get: ->
      @object.size
    set: (s) ->
      @object.size = s

  setContent: (d) ->
    if d.type == 'destroy'
      #TODO: destroy existing object
      return

    setContent = true
    #if d.type != @object.getType() and d.type in ['Terrain','Transporter']
    if d.type in ['Terrain', 'Transporter']
      setContent = false
      @object = ObjectFactory.getClass(d.type)
      @updateNewObject()

    if setContent
      @object.setContent(d)

    @hasChanged = true

  updateNewObject: () ->
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
  """
  takes whole grid cell, contains no other objects
  """
  constructor: () ->
    @direction = 'l2r'
    @size = 1
    @content = [
      {},
      {},
      {},
      {}
    ]

  setContent: (d) ->
    extend @content, d


  getUpdateCoords: () ->
    return [
      { 'x': @x, 'y': @y, 'color': @content[0].color },
    ]

  setType: (@type) ->

  getType: () ->
    @type

class ObjectExtender extends ObjectGeneric
  """
  For multi-cell objects
  """
  setContent: (@content) ->
    console.log('ObjExtender.setContent - Not implemented')

class ObjectMulti extends ObjectGeneric
  constructor: () ->
    super
    @direction = 'l2r'
    @size = 0.5
    @directionDict =
      'lefttop': 0, 'leftbottom': 2, 'righttop': 1, 'rightbottom': 3

  resetContent: () ->
    @content = [
      {},
      {},
      {},
      {}
    ]

  getUpdateCoords: () ->
    return [
      { 'x': @x, 'y': @y, 'color': @content[0].color, 'image': @content[0].image, 'icon': @content[0].icon },
      { 'x': @x + 0.5, 'y': @y, 'color': @content[1].color, 'image': @content[1].image, 'icon': @content[1].icon },
      { 'x': @x, 'y': @y + 0.5, 'color': @content[2].color, 'image': @content[2].image, 'icon': @content[2].icon },
      { 'x': @x + 0.5, 'y': @y + 0.5, 'color': @content[3].color, 'image': @content[3].image, 'icon': @content[3].icon },
    ]

  setContent: (content) ->
    dictKey = 0
    if content.direction?
      dictKey = @directionDict[content.direction]
    @content[ dictKey ] = content

    return

class ObjectTerrain extends ObjectMulti
  """
  takes whole grid cell, is a container
  """
  constructor: () ->
    super
    @content[0].color = 'rgba(30,90,170,1)'
    @content[1].color = 'rgba(30,90,170,1)'
    @content[2].color = 'rgba(30,90,170,1)'
    @content[3].color = 'rgba(30,90,170,1)'
    @terrain = true
    @type = 'Terrain'

  setContent: (d) ->
    super
    #placing terrain into terrain to erase all terrain content
    if d.type == @type
      console.log('erasing terrain content')
      @resetContent

class ObjectTransporter extends ObjectMulti
  """
  takes whole grid cell, is a container, rotatable
  """
  constructor: () ->
    super
    #@content.color = [ 'rgba(100,0,0,1)', 'rgba(100,0,0,1)', 'rgba(100,0,0,1)', 'rgba(100,0,0,1)' ]
    #@transporter = true
    @type = 'Transporter'
    @image = 'img/entity/basic-transport-belt/basic-transport-belt.png'
    @icon = 'img/icons/basic-transport-belt/basic-transport-belt.png'


  #rotate+90   12   -> 31
  #            34   -> 42
  #            1234 -> 3142
  #TODO: fix this part
  rotateItem: () ->
    @content.color = [ @content.color[3], @content.color[1], @content.color[4], @content.color[2] ]

EventedClass = new EventedClass()

EventedClass.bind('cgrid_click', (e) =>
  cellX = Math.floor(e[0] / window.gApp.grid.cellSize)
  cellY = Math.floor(e[1] / window.gApp.grid.cellSize)
  qX = e[0] - cellX * window.gApp.grid.cellSize
  qY = e[1] - cellY * window.gApp.grid.cellSize
  if qX <= (cellX + 0.5 * window.gApp.grid.cellSize)
    quX = 'left'
    updX = cellX
  else
    quX = 'right'
    updX = cellX + 0.5
  if qY <= (cellY + 0.5 * window.gApp.grid.cellSize)
    quY = 'top'
    updY = cellY
  else
    quY = 'bottom'
    updY = cellY + 0.5

  if angular.element('#objectsPanel').scope().selectedObject == 'undefined'
    return
  obj = angular.element('#objectsPanel').scope().selectedObject

  if obj.type not in ['Terrain', 'Transporter']
    obj.direction = quX + quY
  else
    obj.direction = 'lefttop'

  obj.size =
    'w': obj.w, 'h': obj.h

  #console.debug('obj for update', obj, 'direction:', obj.direction)
  window.gApp.grid.updateCellContainer(cellX, cellY, obj)
)

$(document).ready ->
  window.gApp = new App()
  window.dGrid = new window.debugGrid()

  $('#zoom_in').bind('click', window.gApp.grid.scaleDown)
  $('#zoom_out').bind('click', window.gApp.grid.scaleUp)

SimpleController: ($scope) ->
  $scope.names = ['Dave', 'Napur', 'Heedy', 'Shriva']
