class CircleView extends Point

	fixed					: false

	momentum				: null
	position				: null
	center 					: null
	clickPos				: null
	container				: null

	radius					: 0
	originalRadius			: 0

	content					: null
	contentHeight			: 0
	contentWidth			: 0

	###
	@param		display			Set the DOM object of your item
	@param 		color			Color of your item
	###
	constructor: (@display, @color = "#F66") ->
		super()

		@radius			= 30 + Math.random() * 60
		@originalRadius	= @radius
		@momentum		= new Point()
		@position		= new Point()
		@center			= new Point()
		@clickPos		= new Point()
		@content		= $(@display).find("span")
		@contentHeight	= $(@content).height()
		@contentWidth	= $(@content).width()

		$(@display).css("visibility", "visible")
		$(@display).css("width", @radius * 2)
		$(@display).css("height", @radius * 2)
		$(@display).css("background-color", @color)

		###
		Roll Over
		###
		$(@display).mouseenter =>
			return if @fixed
			TweenLite.to(@, 1, { radius:@originalRadius + 50, ease:Quart.easeOut, onUpdate:@updateRadius });
			$(@display).css("cursor", "pointer")

		###
		Roll Out
		###
		$(@display).mouseleave =>
			return if @fixed

			TweenLite.to(@, 1, { radius:@originalRadius, ease:Quart.easeOut, onUpdate:@updateRadius });
			$(@display).css("cursor", "default")

		###
		Mouse Down
		###
		$(@display).mousedown =>
			@fixed = true
			@clickPos.x = event.offsetX + $(@container).position().left
			@clickPos.y = event.offsetY + $(@container).position().top

			###
			Mouse Up
			###
			$(window).bind "mouseup", =>
				@fixed = false
				$(window).unbind "mouseup"
				$(window).unbind "mousemove"

			###
			Mouse Move
			###
			$(window).bind "mousemove", (event) =>
				@x = @position.x = event.pageX - @clickPos.x;
				@y = @position.y = event.pageY - @clickPos.y;
				TweenLite.killTweensOf($(@display))
				$(@display).css("left", @x);
				$(@display).css("top", @y);
				#TweenLite.to($(@display), .5, { css:{ left:@x, top:@y }, ease:Quart.easeOut })

	###
	Update the position of your item based on the given center position
	@param		destination		Destination point of your circle
	###
	update: (destination) ->
		@momentum.reset()
		@momentum.x	-= (@center.x - destination.x) / 30
		@momentum.y	-= (@center.y - destination.y) / 30
		@momentum.x	*= .6
		@momentum.y	*= .6
		@position.x	+= @momentum.x
		@position.y	+= @momentum.y

	###
	Apply the position to the DOM object
	###
	apply: ->
		@x	-= (@x - @position.x) * .7
		@y	-= (@y - @position.y) * .7
		@center.x = @x + @radius
		@center.y = @y + @radius
		$(@content).css("top", @radius - @contentHeight * .5)
		$(@content).css("left", @radius - @contentWidth * .5)
		#$(@display).css("left", @x)
		#$(@display).css("top", @y)
		return if @fixed
		TweenLite.to($(@display), 1, { css:{ left:@x, top:@y }, ease:Quart.easeOut })

	###
	Update the DOM object with the radius
	###
	updateRadius: =>
		$(@display).css("width", @radius * 2);
		$(@display).css("height", @radius * 2);

		