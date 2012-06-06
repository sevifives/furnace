var furnace = require('../main.js'),
    assert = require('assert');

furnace.addModel('dork', {
  whitelist: ['name', 'first']
});

furnace.blast('dork', {name: 'hello', asdf:'scary', first: 'hey'}, function(err, data){
  assert.deepEqual(data, {name: 'hello', first: 'hey'}, "should have removed asdf");
})