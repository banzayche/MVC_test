var FilterView = Backbone.View.extend({
	tagName: 'div',
	id: 'about',
	template: _.template( $("#filter-template").html() ),
	templateFilterTypes: _.template( "<option value='<%- nuber %>'><%- name %></option>" ),

	events: {
		'change #filter-types': 'goFiltered'
	},

	initialize: function(){
		// Слушаем коллекцию чтобы быть в курсе последних изменений и выводдить правельный список критерий фильтрации
		this.listenTo( this.collection, 'cange', this.buildFilterSelect );
		this.listenTo( this.collection, 'add', this.buildFilterSelect );
		this.listenTo( this.collection, 'add', this.addTruthfulHelpCollection );
    	this.listenTo( this.collection, 'destroy', this.destroyTruthfulHelpCollection );

		this.helpCollection = this.collection.clone();
		
		// Добавили событие для коллекции
		this.collection.on( "filter-event" );
	},

	addTruthfulHelpCollection: function(){
		var self = this;
		self.helpCollection = self.collection.clone();			
	},

	destroyTruthfulHelpCollection: function(){
		var self = this;

		if( !self.collection.models.length ){
			self.collection
				.fetch()
				.done(function(){
					self.helpCollection = self.collection.clone();
				});
			self.buildFilterSelect();
		} else {
			// получаем массив из значений тайпа
		    self.arrTypes = _.pluck( self.collection.toJSON(), 'type' );
		    // сравниваем значения
		    self.arrTypes = _.every( self.arrTypes, _.identity );

		    if( self.arrTypes ) return false;
		    else self.buildFilterSelect();			
		}
	},

	goFiltered: function(e){
		var self = this;

		// получили value
		var selector = $(e.target).val();
		var selectDirection = 'type';
		// нашли наименование типа для фильтрации
		selector = self.$('option[value='+selector+']').html();

		if( selector == 'Select All' ){
			self.collection.reset( self.helpCollection.filter( function(model) { return true } ) );
		} else{
			// фильтрируем массив
			self.collection.reset( self.helpCollection.filter( function( model ) { return model.match( selector, selectDirection ); } ) );
			// тригерим эвент перерисовки
			self.collection.trigger( "filter-event" );	
		}				
	},

	buildFilterSelect: function(){
		var self = this;

		// чистим селект от старых значений
		self.$('#filter-types').html('');
	    // получаем массив из значений тайпа
	    self.arrTypes = _.pluck( self.collection.toJSON(), 'type' );
	    // удаляем одинаковые значения
	    self.arrTypes = _.uniq( self.arrTypes );
	    
	    // Для вывода всего списка
	    self.$('#filter-types').append( self.templateFilterTypes( { 
	    	name: "Select All", 
	    	nuber: 0 
	    } ) );

	    _.each(self.arrTypes, function(value, index){
	    	self.$('#filter-types').append( self.templateFilterTypes( {
	    		name: value, 
	    		nuber: index+1
	    	} ) );
	    });		
	},

	render: function(){
		this.$el.html( this.template() );
		$('#for-filter-select').append( this.$el );
		this.buildFilterSelect();		
	}
});