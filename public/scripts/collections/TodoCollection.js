var TodoCollection = Backbone.Collection.extend({
  model: TodoModel,

  done: function(){
    return this.where({ done: true });
  },

  remaining: function(){
    return this.where({ done: false });
  },
  

  sortAttribute: 'id',
  sortDirrection: 1,
  sortOn: function( sortAttribute, sortDirrection ){
     this.sortAttribute = sortAttribute;
     this.sortDirrection = sortDirrection;

     this.sort();
  },

  comparator: function( model ){
    if( this.sortDirrection === 1 ){
      return +model.get( this.sortAttribute );
    } else if ( this.sortDirrection === -1 ){
      return -model.get( this.sortAttribute );
    }
  },


  url: '/api/books'
});