class CircleView extends AbstractCircle

	pressTime				: 0

	constructor: (@display, @color = "#F66", @container) ->
		super(@display, @color, @container)

	setPos: (x, y) ->
		TweenLite.killTweensOf(@display)
		super(x, y)

	setSelected: (selected) ->
		@selected = selected
		@priority = selected ? 1 : 0
		@display.css("cursor", "default")

		TweenLite.killTweensOf(@)

		if(@selected)
			TweenLite.to(@, 1, { radius:@openedRadius, ease:Quart.easeOut, onUpdate:@updateRadius, onComplete:@showContent });
		else
			@hideContent()
			TweenLite.to(@, 1, { radius:@originalRadius, ease:Quart.easeOut, onUpdate:@updateRadius, delay:.2 });

	apply: ->
		@x	-= (@x - @position.x) * .1
		@y	-= (@y - @position.y) * .1
		@center.x = @x + @radius
		@center.y = @y + @radius
		if(@selected)
			@content.css("top":@radius - @contentHeight * .5, "left":@radius - @contentWidth * .5)
		return if @dragging
		TweenLite.to(@display, .2, { css:{ left:@x, top:@y }, ease:Quart.easeOut })

	setupEvents: ->
		###
		Roll Over
		###
		@display.mouseenter =>
			return if @fixed
			return if @selected
			@over = true
			TweenLite.to(@, 1, { radius:@originalRadius + 50, ease:Quart.easeOut, onUpdate:@updateRadius });
			@display.css("cursor", "pointer")
			@

		###
		Roll Out
		###
		@display.mouseleave =>
			return if @fixed
			return if @selected
			@over = false
			TweenLite.to(@, 1, { radius:@originalRadius, ease:Quart.easeOut, onUpdate:@updateRadius });
			@display.css("cursor", "default")
			@

		###
		Mouse Down
		###
		@display.mousedown =>
			return if @selected
			@fixed = true
			@dragging = true
			@clickPos.x = event.offsetX + @container.position().left
			@clickPos.y = event.offsetY + @container.position().top
			@pressTime = new Date().getTime()

			###
			Mouse Up
			###
			$(window).bind "mouseup", =>
				@fixed = false
				@dragging = false
				$(window).unbind "mouseup"
				$(window).unbind "mousemove"
				#if(new Date().getTime() - @pressTime <= 300)
					#@changed.dispatch(@)
				@
			
			###
			Mouse Move
			###
			$(window).bind "mousemove", (event) =>
				@setPos(event.pageX - @clickPos.x, event.pageY - @clickPos.y)
				@
			@

		@display.dblclick =>
			@changed.dispatch(@)
		@

		