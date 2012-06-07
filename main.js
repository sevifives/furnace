var Furnace = function(){
  //do some kind of init
  this.models = {};
};
// ..........................................................
// Add's models to the furnace global
// 
Furnace.prototype.addModel = function(name, config){
  if(this.models[name] !== undefined) throw "Attempting to add model "+name+" that already exists!";
  
  var finalConfig = {
    whitelist: [],
    origConfig: config
  };
  for(var key in config){
    if(config.hasOwnProperty(key)){
      //add to the whitelist
      if(config[key]) finalConfig.whitelist.push(key);
    }
  }
  this.models[name] = finalConfig; 
};


// ..........................................................
// blasting helper functions
// 
var whitelist = function(object, allowedKeys){
  //pass through if no whitelist defined
  if(!allowedKeys || allowedKeys && allowedKeys.length === 0) return object; 
  
  var newObj = {};
  allowedKeys.forEach(function(key){
    newObj[key] = object[key];
  });
  return newObj;
};



// ..........................................................
// runs the passed object through the filters
// 
Furnace.prototype.blast = function(model, data, cb){
  var config = this.models[model];
  if(!config) cb("Couldn't find config for model "+model,null);
  data = whitelist(data, config.whitelist);
  
  cb(null, data);
};


// ..........................................................
// connect middleware
//
Furnace.prototype.middleware = function(model){
  var self = this;
  return function(request, response, next){
    self.blast(model, request.body, function(err, data){
      if (err) return next(err);
      request.body = data;
      next();
    });
  };
};
module.exports = new Furnace();