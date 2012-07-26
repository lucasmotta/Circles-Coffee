class Point
	x	: 0
	y	: 0
	constructor: (@x = 0, @y = 0) ->

	reset: ->
		@x = 0;
		@y = 0;
		@

	###
	Get the center distance between two different items
	@param		b 				Item to compare
	###
	distanceTo: (b) ->
		x	= b.x - @.x
		y	= b.y - @.y
		x	= x * x
		y	= y * y
		Math.sqrt(x + y)

	###
	Get the angle between two different items
	@param		b 				Item to compare
	###
	angleTo: (b) ->
		x	= @x - b.x
		y	= @y - b.y
		Math.atan2(x, y)
