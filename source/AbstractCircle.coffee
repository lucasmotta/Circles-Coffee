class AbstractCircle extends Point
	
	fixed					: false
	dragging				: false
	over					: false
	selected				: false

	momentum				: null
	position				: null
	center 					: null
	clickPos				: null

	color 					: 0
	radius					: 0
	originalRadius			: 0

	priority				: 0

	container				: null
	content					: null
	contentHeight			: 0
	contentWidth			: 0

	###
	Signals
	###
	changed					: null

	###
	@param		display			Set the DOM object of your item
	@param 		color			Color of your item
	###
	constructor: (@display, @color = "#F66", @container) ->
		super(0, 0)

		@radius			= 30 + Math.random() * 60
		@originalRadius	= @radius
		@momentum		= new Point()
		@position		= new Point()
		@center			= new Point()
		@clickPos		= new Point()

		@setPos(@container.width() * Math.random(), @container.height() * Math.random())
		@display.css("display":"inline", "width":@radius * 2, "height":@radius * 2, "background-color":@color)

		@content		= $(@display.find("span"))
		@contentHeight	= @content.height()
		@contentWidth	= @content.width()
		@changed		= new signals.Signal()

		@setupEvents()

	###
	Apply the position to the DOM object
	###
	apply: -> console.log("Warning: This method should be overridden")

	###
	Setup the regular events
	###
	setupEvents: -> console.log("Warning: This method should be overridden")

	###
	Setup the items and push them to an array
	###
	setSelected: -> console.log("Warning: This method should be overridden")

	###
	Set the position of your display
	###
	setPos: (x, y) ->
		@x = @position.x = x
		@y = @position.y = y
		@display.css("left":@x, "top":@y)

	###
	Update the position of your item based on the given center position
	@param		destination		Destination point of your circle
	###
	update: (destination) ->
		return if @fixed
		@momentum.reset()
		if(@selected)
			@momentum.x	-= (@center.x - destination.x) * .15
			@momentum.y	-= (@center.y - destination.y) * .15
		else
			@momentum.x	-= (@center.x - destination.x) * .02
			@momentum.y	-= (@center.y - destination.y) * .02
		@position.x	+= @momentum.x
		@position.y	+= @momentum.y

	###
	Compare two different items and sort their positions to avoid colisions
	@param		b 				Item to compare
	###
	compare: (b) ->
		return if @fixed
		angle		= @center.angleTo(b.center)
		distance	= @center.distanceTo(b.center)
		margin		= 20
		minDistance	= @radius + b.radius + margin
		force		= 1

		if(distance < minDistance)
			@position.x	+= Math.sin(angle) * (minDistance - distance) * force
			@position.y	+= Math.cos(angle) * (minDistance - distance) * force
		@

	###
	Update the DOM object with the radius
	###
	updateRadius: => @display.css("width":@radius * 2, "height":@radius * 2)