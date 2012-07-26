class AppView

	items			: []
	colors			: ["#C9D5A8", "#871F3B", "#F66", "#0c9"]
	center			: null
	id				: 0
	container 		: null
	currentItem		: null
	isTouchScreen	: false

	###
	An <ul> id that contains all the list items (<li>)
	@param		container_id	Id of your list
	###
	constructor: (@container_id) ->
		@container = $(@container_id)
		@isTouchScreen = "ontouchstart" of document.documentElement
		@center	= new Point(@container.width() * .5, @container.height() * .5)
		@setupItems()
		@id		= setInterval(@updateItems, 30)

	###
	Setup the items and push them to an array
	###
	setupItems: ->
		list	= @container.children()
		i		= list.length
		c		= null

		CircleClass = (if @isTouchScreen then CircleTouchView else CircleView)

		while(i-- > 0)
			c = new CircleClass($(list[i]), @colors[i % @colors.length], @container)
			c.changed.add(@onItemSelected)
			@items.push(c)
		@

	### 
	Update the position of all the items
	###
	updateItems: =>
		length		= @items.length
		i			= 0
		j			= 0
		item		= null

		@center.x	= @container.width() * .5
		@center.y	= @container.height() * .5

		while i < length
			j = 0
			@items[i].update(@center)
			while j < length
				if(i isnt j)
					if(@items[i].priority <= @items[j].priority)
						@items[i].compare(@items[j])
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