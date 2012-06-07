var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  name: furnace.prop({
    validate: function(value, object, done){
      console.log('invalidate');
      console.log(value);
      
      if(value === 'hello') done("Name can't be Hello");
      else done()
    }
  }),
  first: furnace.prop()
});

furnace.addModel('noWhitelist', {});

furnace.blast('dork', {name: 'hello', first: 'hey'}, function(err, data){
  
  assert.ok(err, "should have an error because the name is hello");
});
