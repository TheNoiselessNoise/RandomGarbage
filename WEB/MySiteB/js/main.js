$(document).ready(function(){
	$("#search").on("keyup", function(){
		// RESET - SHOW ALL
		for(let name of $("my-projs pro-jects pro-ject pro-name")){
			$(name).parent().css({ "display":"flex" })
		}
		
		// SHOW MATCHING
		let regexp = RegExp(".*" + $(this).val().toUpperCase() + ".*")
		for(let name of $("my-projs pro-jects pro-ject pro-name")){
			if(!regexp.test($(name).html().toUpperCase())){
				$(name).parent().css({ "display":"none" })
			}
		}
	})

	$(window).scroll(function() {
		if ($(this).scrollTop() > 50) {
			$('#tothetop:hidden').fadeIn();
		} else {
			$('#tothetop').fadeOut();
		}
	});
})