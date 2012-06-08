var furnace  = require('../main.js'),
    assert   = require('assert');

var model = new furnace.Model({
  name: new furnace.Property({
    validate: function(value, object, done){
      if(value === 'hello') done("Name can't be Hello");
      else done()
    }
  }),
  first: new furnace.Property()
});

furnace.blast(model, {name: 'hello', first: 'hey'}, function(err, data){
  assert.ok(err, "should have an error because the name is hello");
  assert.equal(err.length, 1, "should have one error");
  assert.equal(err[0], "Name can't be Hello", "has the right error message");
});
