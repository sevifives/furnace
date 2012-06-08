var furnace = require('../main.js'),
    assert = require('assert');

var model = new furnace.Model({
  name: new furnace.Property(),
  first: new furnace.Property()
});

var complexModel = new furnace.Model({
  last: new furnace.Property(),
  rest: new furnace.Property({type: model})
});

assert.deepEqual(model, { name: {}, first: {} }, "should have created a model with two properties");

assert.deepEqual(complexModel, { last: {}, rest: { name: {}, first: {} } }, "should have created a complex model with nested properties");