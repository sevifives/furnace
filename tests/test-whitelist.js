var furnace  = require('../main.js'),
    assert   = require('assert');

var model = new furnace.Model({
  name: new furnace.Property(),
  first: new furnace.Property()
});

var noWhitelist = new furnace.Model();

furnace.blast(model, {name: 'hello', asdf:'scary', first: 'hey'}, function(err, data){
  assert.deepEqual(data, {name: 'hello', first: 'hey'}, "should have removed asdf");
});

furnace.blast(noWhitelist, {name: 'hello', last: 'dork'}, function(err,data){
  assert.deepEqual(data, {name: 'hello', last: 'dork'}, "should have passed without whitelist");
});