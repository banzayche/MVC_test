var AboutView = Backbone.View.extend({
	tagName: 'div',
	id: 'about',
	template: _.template( $('#aboutPage').html() ),
	
	events:{
		"click #home": "goHome",
	},
	
	goHome: function(){
		window.app.navigate( "ToDos/", { trigger: true } );
	},
	
	render: function(){
		this.$el.html( this.template() );
		$('.container').append( this.$el );
	}
});