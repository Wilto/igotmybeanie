(function( $ ){
	var tweet = "This is the tweet.";
	
	$(".task")
		.append('<div class="pledges"></div>')
		.hashTask({
			message         : tweet,
			linkSelector    : function() { return this.find('.pledge') },
			avatarsSelector : function() { return this.find('.pledges') },
			hashtag         : function() { return this.data('hashtag') || '#igotmybeanie' }
		});

})( jQuery );
