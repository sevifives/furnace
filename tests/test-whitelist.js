var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  name: furnace.prop(),
  first: furnace.prop()
});

furnace.addModel('noWhitelist', {});

furnace.blast('dork', {name: 'hello', asdf:'scary', first: 'hey'}, function(err, data){
  assert.deepEqual(data, {name: 'hello', first: 'hey'}, "should have removed asdf");
});

furnace.blast('noWhitelist', {name: 'hello', last: 'dork'}, function(err,data){
  assert.deepEqual(data, {name: 'hello', last: 'dork'}, "should have passed without whitelist");
});