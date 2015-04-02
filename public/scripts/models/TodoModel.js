var TodoModel = Backbone.Model.extend({
  defaults: {
    title: undefined,
    done: false,
    type: undefined,
    id: undefined
  },

  toggle: function(){
    this.save({ done: !this.get('done') });
  },

  //Метод принимает 2 переменные, название атрибута и его значение
  // Запрашивает у модели атрибут и сравнивает со значением
  match: function ( select, selectDerection ) {
      this.selector = select;
      return this.get( selectDerection ) == select;
   },

   
   urlRoot: '/api/books'
});