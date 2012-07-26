class CircleTouchView extends AbstractCircle
	
	touch 					: null
	touchId					: 0

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
		$(@content).css("top":@radius - @contentHeight * .5, "left":@radius - @contentWidth * .5)
		return if @dragging
		$(@display).css("left", @x)
		$(@display).css("top", @y)

	updateRadius: =>
		super()
		if(@touch)
			@setPos(@touch.pageX - @clickPos.x - @radius, @touch.pageY - @clickPos.y - @radius)

	setupEvents: ->
		###
		Touch Start
		###
		$(@display).bind "touchstart", (event) =>
			@touchId	= event.originalEvent.touches.length - 1
			@touch 		= event.originalEvent.touches[@touchId]
			@fixed		= true
			@dragging	= true
			@over		= true
			@clickPos.x	= $(@container).position().left
			@clickPos.y	= $(@container).position().top

			TweenLite.to(@, .5, { radius:@originalRadius + 20, ease:Quart.easeOut, onUpdate:@updateRadius });

			###
			Touch End
			###
			$(@display).bind "touchend", (event) =>
				@fixed		= false
				@over		= false
				@dragging	= false
				@touch 		= null

				TweenLite.to(@, .5, { radius:@originalRadius, ease:Quart.easeOut, onUpdate:@updateRadius });

				$(window).unbind "touchend"
				$(window).unbind "touchmove"

			###
			Touch Move
			###
			$(window).bind "touchmove", (event) =>
				@fixed	= false
				@setPos(@touch.pageX - @clickPos.x - @radius, @touch.pageY - @clickPos.y - @radius)
			@
		@
