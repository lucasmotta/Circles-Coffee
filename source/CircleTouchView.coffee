class CircleTouchView extends AbstractCircle
	
	touch 					: null
	touchId					: 0
	lastTouch				: 0
	pinching				: false
	pinchingDistance		: 0
	clickRadius				: 0

	constructor: (@display, @color = "#F66", @container, @isTouchScreen) ->
		super(@display, @color, @container)

	setSelected: (selected) ->
		@selected = selected
		@priority = selected ? 1 : 0

	apply: ->
		@x	-= (@x - @position.x) * .1
		@y	-= (@y - @position.y) * .1
		@center.x = @x + @radius
		@center.y = @y + @radius
		@content.css("top":@radius - @contentHeight * .5, "left":@radius - @contentWidth * .5)
		return if @dragging
		@display.css("left", @x)
		@display.css("top", @y)

	updateRadius: =>
		super()
		if(@touch)
			@setPos(@touch.pageX - @clickPos.x - @radius, @touch.pageY - @clickPos.y - @radius)

	setupEvents: ->
		###
		Touch Start
		###
		@display.bind "doubletap", (event) =>
			console.log "double tap"

		@display.bind "touchstart", (event) =>
			touches 	= event.originalEvent.touches
			@touchId	= touches.length - 1
			@touch 		= touches[@touchId]
			@pinching	= touches.length == 2
			@clickRadius= @radius

			if(@pinching)
				@pinchingDistance = new Point(touches[0].pageX, touches[0].pageY).distanceTo(new Point(touches[1].pageX, touches[1].pageY))

			return if @dragging

			@dragging	= true
			@over		= true
			@clickPos.x	= @container.position().left
			@clickPos.y	= @container.position().top

			TweenLite.to(@, .5, { radius:@originalRadius + 20, ease:Quart.easeOut, onUpdate:@updateRadius });

			###
			Touch End
			###
			@display.bind "touchend", (event) =>
				@over		= false
				@dragging	= false
				@touch 		= null
				@pinching	= event.originalEvent.touches.length == 2

				TweenLite.to(@, .5, { radius:@originalRadius, ease:Quart.easeOut, onUpdate:@updateRadius });

				$(window).unbind "touchend"
				$(window).unbind "touchmove"

			###
			Touch Move
			###
			$(window).bind "touchmove", (event) =>
				touches 	= event.originalEvent.touches
				@pinching	= touches.length == 2
				distance 	= 0
				if @pinching
					distance = new Point(touches[0].pageX, touches[0].pageY).distanceTo(new Point(touches[1].pageX, touches[1].pageY))
					@radius = @originalRadius = distance - @pinchingDistance + @clickRadius
					@updateRadius()
					@center.x = @x + @radius
					@center.y = @y + @radius
					@content.css("top":@radius - @contentHeight * .5, "left":@radius - @contentWidth * .5)
				else
					@setPos(@touch.pageX - @clickPos.x - @radius, @touch.pageY - @clickPos.y - @radius)
			@
		@
