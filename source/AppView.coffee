class AppView

	items	: []
	colors	: ["#C9D5A8", "#871F3B", "#F66", "#0c9"]
	center 	: null
	id		: 0

	###
	An <ul> id that contains all the list items (<li>)
	@param		container		Id of your list
	###
	constructor: (@container) ->
		@setupItems()
		@center	= new Point($(@container).width() * .5, $(@container).height() * .5)
		@id		= setInterval(@updateItems, 30)

	###
	Setup the items and push them to an array
	###
	setupItems: ->
		list	= $(@container).children()
		i		= list.length
		c		= null

		while(i-- > 0)
			c = new CircleView(list[i], @colors[i % @colors.length])
			c.container = @container
			@items.push(c)
		@

	### ge
	Compare two different items and sort their positions to avoid colisions
	@param		a 				First item
	@param		b 				Second item to compare with "a"
	###
	compareItems: (a, b) ->
		return if a.fixed
		angle		= @getAngle(a, b)
		distance	= @getDistance(a, b)
		margin		= 20
		minDistance	= a.radius + b.radius + margin
		force		= .9

		if(distance < minDistance)
			a.position.x	+= Math.sin(angle) * (minDistance - distance) * force
			a.position.y	+= Math.cos(angle) * (minDistance - distance) * force
		@

	### 
	Update the position of all the items
	###
	updateItems: =>
		length		= @items.length
		i			= 0
		j			= 0
		item		= null

		@center.x	= $(@container).width() * .5
		@center.y	= $(@container).height() * .5

		while i < length
			j = 0
			@items[i].update(@center)
			while j < length
				if(i isnt j)
					@compareItems(@items[i], @items[j])
				j++
			@items[i].apply()
			i++
		@

	###
	Get the center distance between two different items
	@param		a 				First item
	@param		b 				Second item
	###
	getDistance: (a, b) ->
		x	= b.center.x - a.center.x
		y	= b.center.y - a.center.y
		x	= x * x
		y	= y * y
		Math.sqrt(x + y)

	###
	Get the angle between two different items
	@param		a 				First item
	@param		b 				Second item
	###
	getAngle: (a, b, rotation = 0) ->
		x	= a.center.x - b.center.x
		y	= a.center.y - b.center.y
		Math.atan2(x, y)
