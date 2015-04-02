var TodoListView = Backbone.View.extend({
  tagName: 'div',
  id: 'all',
  template: _.template($('#second').html()),
  
  events: {
    'click #addTodoSend': 'addTodo',
    'click #destroyDone': 'destroyDone',
    'click .checkedAll': 'checkedAll',
    'click #compareTitle': 'copareSort',
    'click #about': 'goToAbout'
  },

  initialize: function(){  
    this.listenTo( this.collection, 'add', this.addOne );
    this.listenTo( this.collection, 'reset', this.addAll );    
    this.listenTo( this.collection, 'filter-event', this.addAllFiltered );
    this.listenTo(this.collection, 'sort', this.sortOm );
    this.listenTo( this.collection, 'all', this.render );
    
    this.render();
  },

  goToAbout: function(){
    window.app.navigate('author/', { trigger: true });
  },

  addTodo: function(){
    this.input = this.$('#addTodo');
    this.input2= this.$('#addTodoType');

    if(this.input.val().length == 0 || this.input2.val().length == 0) return alert('NO!');

    var model = new TodoModel({ 
      title: this.input.val(), 
      type: this.input2.val()
    });
    
    this.collection.create( model, { wait:true } );
    
    this.input.val('');
    this.input2.val('');
    this.$('#addTodo').focus();
    
    this.collection.fetch();  
  },
  
  addOne: function(model){
    // создаем представление для переданной модели
    var view = new TodoItemView({ model: model });
    // втавляем представление в главное представление
    $('#nuberlist').append( view.render().$el );
  },

  addAll: function(){
    $('#nuberlist').html('');
    // проходим всю нашу коллекцию, и для каждой модели вызываем метод
    this.collection.each( this.addOne, this );
  },

  addAllFiltered: function(){
    $('#nuberlist').html('');
    // проходим всю нашу коллекцию, и для каждой модели вызываем метод
    this.collection.each( this.addOne, this );
  },

  checkedAll: function(){
    if( this.collection.done().length != this.collection.length ){
      this.collection.each( function(model){ model.save({ done: true }); } );
    } else{
      this.collection.each( function(model){ model.save({ done: false }); } );
    }
  },

  destroyDone: function(){
    _.invoke( this.collection.done(), 'destroy' );
  },

  sortOm: function(){
    this.addAll();
    if( this.collection.sortDirrection == 1 ){
      _.defer( function() { $("#compareTitle").html('Revers Compare Title'); } );     
    } else{      
      _.defer( function() { $("#compareTitle").html('Straight Compare Title'); } ); 
    }  
  },

  copareSort: function(){
    this.collection.sortOn( 'id', -this.collection.sortDirrection );
  },

  render: function(){

    var done = this.collection.done().length;
    var remaining = this.collection.remaining().length;
    this.$el.html( this.template({
      done: done, 
      remaining: remaining
    }) );

    if( !remaining ){ this.$('.checkedAll').attr( 'checked', 'true' ); }
    
    $('#for-general-view').append( this.$el );

    return this;
  },

  remove: function(){
    // при удалении всего представления - удаляем подпредставления для очистки пямяти
    // на каждом элементе массива вызовется remove
    _.invoke( this._subviews, "remove" );

    // реализуем базовое удаление
    Backbone.View.prototype.remove.apply( this, arguments );
  }
});