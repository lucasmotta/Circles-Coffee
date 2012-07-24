$ ->
	@app		= new AppView("#circles")
	@window		= $(window)
	@main		= $("#main")
	@navigation	= $("#navigation")

	$(window).resize =>
		padding = parseFloat(@main.css("padding-left")) * 2;
		@main.css("width", @window.width() - @navigation.outerWidth() - padding);
		@main.css("min-width", @window.width() - @navigation.outerWidth() - padding);
		@main.css("height", @window.height() - padding);
		@

	$(window).trigger "resize"
	@
