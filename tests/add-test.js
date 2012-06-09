var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  name: furnace.prop(),
  first: furnace.prop()
});

try {
  furnace.addModel('dork', {});
} catch(e){
  assert.ok(e, "should have thrown exception while adding a model with the same name");
}

var Dork = furnace.addModel({
  name: furnace.prop(),
  first: furnace.prop()
});

assert.deepEqual(Dork.origConfig,furnace.models['dork'].origConfig,
                "there are two ways to create models");