$ ->
	@window		= $(window)
	@isMobile	= /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)

	if(!@isMobile)
		$("#navigation").css("display":"block")
		$("#share").css("display":"block")

	document.body.addEventListener "touchmove", (event) ->
		event.preventDefault()

	@app		= new AppView("#circles")

	@