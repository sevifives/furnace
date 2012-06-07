var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  name: furnace.prop({
    sanitize: function(value, object){
      return escape(value);
    }
  }),
  first: furnace.prop()
});

furnace.blast('dork', {name: '"hello', first: 'hey'}, function(err, data){
  
  assert(data.name, '\"hello', "should have escaped that string");

});
