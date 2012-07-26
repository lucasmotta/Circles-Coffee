class AppView

	items			: []
	colors			: ["#C9D5A8", "#871F3B", "#F66", "#0c9"]
	center			: null
	id				: 0
	currentItem		: null
	isTouchScreen	: false

	###
	An <ul> id that contains all the list items (<li>)
	@param		container		Id of your list
	###
	constructor: (@container) ->
		@isTouchScreen = "ontouchstart" of document.documentElement
		@center	= new Point($(@container).width() * .5, $(@container).height() * .5)
		@setupItems()
		@id		= setInterval(@updateItems, 30)

	###
	Setup the items and push them to an array
	###
	setupItems: ->
		list	= $(@container).children()
		i		= list.length
		c		= null

		CircleClass = (if @isTouchScreen then CircleTouchView else CircleView)

		while(i-- > 0)
			c = new CircleClass(list[i], @colors[i % @colors.length], @container)
			c.changed.add(@onItemSelected)
			@items.push(c)
		@

	### ge
	Compare two different items and sort their positions to avoid colisions
	@param		a 				First item
	@param		b 				Second item to compare with "a"
	###
	compareItems: (a, b) ->
		return if a.fixed
		angle		= a.center.angleTo(b.center)
		distance	= a.center.distanceTo(b.center)
		margin		= 20
		minDistance	= a.radius + b.radius + margin
		force		= .8

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
					if(@items[i].priority <= @items[j].priority)
						@compareItems(@items[i], @items[j])
				j++
			@items[i].apply()
			i++
		@

	###
	Method for when the item is selected (clicked)
	###
	onItemSelected: (target) =>
		if(@currentItem != null)
			@currentItem.setSelected(false)
		@currentItem = target
		@currentItem.setSelected(true)