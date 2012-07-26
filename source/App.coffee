$ ->
	@window		= $(window)
	@main		= $("#main")
	@navigation	= $("#navigation")
	@isMobile	= /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)

	if(!@isMobile)
		@navigation.css("display":"block")

	#$(window).resize =>
		#padding = parseFloat(@main.css("padding-left")) * 2;
		#if(@isMobile)
		#	@main.css("width", @window.width() - padding);
		#	@main.css("min-width", @window.width() - padding);
		#	@main.css("height", @window.height() - padding);
		#else
		#	@main.css("width", @window.width() - @navigation.outerWidth() - padding);
		#	@main.css("min-width", @window.width() - @navigation.outerWidth() - padding);
		#	@main.css("height", @window.height() - padding);
		#@

	#$(window).trigger "resize"

	document.body.addEventListener "touchmove", (event) ->
		event.preventDefault()

	@app		= new AppView("#circles")

	@
