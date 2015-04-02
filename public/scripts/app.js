
var ToDoApp = Backbone.Router.extend({
	routes:{
		"ToDos(/)": "viewListOfToDos",
		"(/)": "viewListOfToDos",
		"author(/)": "viewAboutPage",
	},
	
	initialize: function(){
		this.activeView = undefined;
		this.selectView = undefined;

		Backbone.history.start({ pushState: true });				
	},

	viewListOfToDos: function(){
		var self = this;
		self.activeView && self.activeView.remove();

		self.collection = new TodoCollection;
		self.collection.fetch().done(function(){
			self.selectView = new FilterView({ collection : self.collection });
			self.selectView.render();
    	});
    	
    	self.activeView = new TodoListView({ collection : self.collection });
		self.activeView.render(); 	
	},

	viewAboutPage: function(){
		// очистка от ненужных представлений
		if( this.activeView ) this.activeView.collection.reset();
		this.activeView && this.activeView.remove();
		this.selectView && this.selectView.remove();
		
		this.activeView = new AboutView();
		this.activeView.render();
	},
});

// делаем глобальный обьект, чтобы ссылаться на него при использовании роутов
$(document).ready(function(){
    window.app = new ToDoApp();
});

