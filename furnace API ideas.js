var furnace = require('furnace');
// ..........................................................
// Baisc
// 
furnace.addModel('contact',{
  whitelsit: ['first', 'last' ],
  validations: {
    first:  furnace.validate('string')
    last: furnace.string({requried: true})
  }
});
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
  furnace.pipe('conact', request.body, function(err, data){
    //do your database work here
  });
  
});