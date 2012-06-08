var furnace = require('../main.js'),
    assert = require('assert');

var model = new furnace.Model({
  name: new furnace.Property(),
  first: new furnace.Property()
});

assert.deepEqual(model, { name: {}, first: {} }, "should have created a model with two properties");