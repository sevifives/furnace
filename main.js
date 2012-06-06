function Furnace(){
  //do some kind of init
  this.models = {};
}
// ..........................................................
// Add's models to the furnace global
// 
Furnace.prototype.addModel = function(name, config){
  if(this.models[name] !== undefined) throw "Attempting to add model "+name+" that already exists!";
  
  this.models[name] = config; 
};


// ..........................................................
// blasting helper functions
// 
var whitelist = function(object, allowedKeys){
  if(!allowedKeys) return object; //pass through if no whitelist defined
  
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