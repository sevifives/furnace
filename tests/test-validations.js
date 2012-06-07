var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  name: furnace.prop({
    validate: function(value, object, done){
      if(value === 'hello') done("Name can't be Hello");
      else done()
    }
  }),
  first: furnace.prop()
});

furnace.addModel('multipleValidations', {});

furnace.blast('dork', {name: 'hello', first: 'hey'}, function(err, data){
  
  assert.ok(err, "should have an error because the name is hello");
  assert.equal(err.length, 1, "should have one error");
  assert.equal(err[0], "Name can't be Hello", "has the right error message");
});
