/*globals escape */
var furnace  = require('../main.js'),
    assert   = require('assert');

var model = new furnace.Model({
  name: new furnace.Property({
    sanitize: function(value, object){
      return escape(value);
    }
  }),
  first: new furnace.Property()
});

furnace.blast(model, { name: 'hello?', first: 'hey' }, function(err, data) {
  assert.deepEqual(data.name, 'hello%3F', "should have escaped that string");
});
