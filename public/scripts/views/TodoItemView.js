var TodoItemView = Backbone.View.extend({
  tagName: 'div',
  
  events:{
    'click #delete': 'clear',
    'dblclick' : 'renameShow',
    'blur .newName': 'rename',
    'keypress .newName': 'renameOnEnter',
    'click .checkDone': 'checkDone'
  },
  
  template: _.template( $('#first').html() ),

  initialize: function(){
    this.listenTo( this.model, 'change', this.render );
    this.listenTo( this.model, 'destroy', this.remove );
  },

  checkDone: function(){
    this.model.toggle();
  },

  renameShow: function(){
    this.$('.addHidden').show();
    this.$('.newName').focus();
    this.$('.addShow').hide();
  },

  rename: function(){
    this.$('.addHidden').hide();
    this.$('.addShow').show();
  },
  

  renameOnEnter: function(e){
    if( e.keyCode == 13 ){
      if( this.$('.newName').val().length == 0 ) return false;

      this.$('.addHidden').hide();
      this.$('.addShow').show();
      this.model.save( 'title', this.$('.newName').val() );
    }
  },
  

  clear: function(){
    this.model.destroy();
  },
  

  render: function(){
    // так, как это представление одной модели, то ее мы будем получать из представления общей модели.
    // и соответственно преобразуем полученную модель в джейсон, даем ее шаблону, 
    // шаблон отбирает себе ненобходимые данные и пишеться в $el
    this.$el.html( this.template( this.model.toJSON() ) );

    // Данная строчка поставит или удалит класс done для обьекта, в зависимости от того
    // что вернет this.model.get('done'). true - ставит, false - удаляет.
    this.$el.toggleClass( 'done', this.model.get('done') );
    
    if( this.$el.attr('class') === 'done' ){
      this.$('.checkDone').attr('checked', 'true');
    } else{
      this.$('.checkDone').removeAttr('checked');
    }

    
    return this;
  }
});