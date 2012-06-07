var properties = require('./properties');

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
    totalValidations: 0,
    validations: {},
    origConfig: config
  };
  for(var key in config){
    if(config.hasOwnProperty(key)){
      //add to the whitelist
      if(config[key]) finalConfig.whitelist.push(key);
      //add the validation
      if(config[key].validate){
        finalConfig.totalValidations +=1;
        finalConfig.validations[key] = config[key].validate;
      }
      
    }
  }
  this.models[name] = finalConfig; 
};
// ..........................................................
// Define a property and property helpers
// 
Furnace.prototype.prop = properties.prop;
Furnace.prototype.properties = properties;

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

var validationDone; //to be defined further down
var validateAll = function(object, validations,totalValidations,finalCB){
  //short circut
  if(totalValidations === 0) finalCB(null);
  
  var currentDoneCount = 0,
      totalErrors = [];
  
  for(var key in object){
    if(object.hasOwnProperty(key)){
      if(validations[key]){
        validations[key](object[key], object, validationDone);
      }
    }
  }
};
//called when all the validation callbacks have fired
validationDone = function(errors){
  if(errors) totalErrors.push(errors);
  
  if(currentDoneCount === totalValidations) {
    if(errors.length === 0) finalCB(null);
    else finalCB(errors);
  }
  else currentDoneCount+=1;
};


// ..........................................................
// runs the passed object through the filters
// 
Furnace.prototype.blast = function(model, data, cb){
  var config = this.models[model];
  if(!config) cb("Couldn't find config for model "+model,null);
  data = whitelist(data, config.whitelist);
  validateAll(data, config.validations, config.totalValidations, function(errors){
    if(errors) cb(errors);
    else cb(null, data);
  });
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
var f = new Furnace();
module.exports = f;