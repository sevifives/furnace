var furnace  = require('../main.js'),
    assert   = require('assert');

var model = new furnace.Model({
  name: new furnace.Properties.requiredField()
});

furnace.blast(model, {first: 'hey'}, function(err, data){
  assert.ok(err, "name is required");
  assert.equal(err.length, 1, "should have one error");
});