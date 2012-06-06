var furnace = require('furnace');
// ..........................................................
// Baisc
// 

furnace.addModel('address', {});

furnace.addModel('contact',{
  whitelsit: ['first', 'last', 'address' ],
  validations: {
    first:  furnace.validate('string')
    last: furnace.string({requried: true})
  }
});

furnace.addModel('contact', {
  first: true,
  last: {
    type: 'address',
    readonly: true,
    validate: function(callback){}
  }
})

// ..........................................................
// complex
// 
furnace.addModel('phone',{
  whitelist: ['number', 'type']
});

furnace.addModel('address',{
  whitelist: ['phoneNumbers', 'state', 'zip'],
  
  validations: {
    phoneNumbers: furnace.array({complexType: 'phone'})
  }
})

//use as connect middleware
app.post('/contact', furnace.middleware('contact'), function(request, response){
  
})

//use without connect
app.post('/contact', function(request, resp){
  furnace.blast('conact', request.body, function(err, data){
    //do your database work here
  });
  
});

//order of operations
// whitelist => validate => transform => defaultValue