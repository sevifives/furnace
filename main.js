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
    requiredKeys: [],
    sanitizeFunctions: {},
    totalValidations: 0,
    validations: {},
    origConfig: config
  };
  for(var key in config){
    if(config.hasOwnProperty(key)){
      //add to the whitelist
      if(config[key]) finalConfig.whitelist.push(key);
      //add to the required keys set
      if(config[key].isRequired) requiredKeys.push(key);
      
      //add the validation
      if(config[key].validate){
        finalConfig.totalValidations +=1;
        finalConfig.validations[key] = config[key].validate;
      }
      
      //add sanitize function
      if(config[key].sanitize){
        finalConfig.sanitizeFunctions[key] = config[key].sanitize;
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
// ..........................................................
// isRequired
// 
var isRequired = function(object, requiredKeys){
  if(!requiredKeys || requiredKeys && requiredKeys.length === 0) return null;
   
  var ret = [];
  
  requiredKeys.forEach(function(key){
    if(object[key] === undefined) ret.push(key+" is required.");
  });
  if(ret.length > 0) return ret.join(", ");
  else return null;
};

// ..........................................................
// sanitize is a sync call to quote, escape your data
// 
var sanitize = function(object, sanitizeFunctions){
  for(var key in object){
    if(object.hasOwnProperty(key)){
      if(sanitizeFunctions[key]){
        object[key] = sanitizeFunctions[key](object[key], object);
      }
    }
  }
  return object;
};
// ..........................................................
// runALl is used to execute N annonomous functions for
// validations and for default values
// 
var runAllDone; //to be defined further down
var runAll = function(object, functions, totalFunctions,finalCB){
  //short circut
  if(totalFunctions === 0) finalCB(null);
  
  var currentDoneCount = 0,
      totalErrors = [];
  
  for(var key in object){
    if(object.hasOwnProperty(key)){
      if(functions[key]){
        functions[key](object[key], object, 
                        runAllDone(totalErrors, totalFunctions, currentDoneCount) );
      }
    }
  }
};
//called when all the validation callbacks have fired
runAllDone = function(totalErrors, totalValidations, currentDoneCount){
  return function(errors){
    if(errors) totalErrors.push(errors);

    if(currentDoneCount === totalValidations) {
      if(errors.length === 0) finalCB(null);
      else finalCB(errors);
    }
    else currentDoneCount+=1;
  };

};


// ..........................................................
// runs the passed object through the filters
// 
Furnace.prototype.blast = function(model, data, cb){
  var config = this.models[model], missingKeys;
  if(!config) cb("Couldn't find config for model "+model,null);
  //first whitelist
  data = whitelist(data, config.whitelist);
  //check for required keys
  missingKeys = isRequired(data,config.requiredKeys);
  if(missingKeys) cb(missingKeys, null);  //end now
  else{
    //sanitize
    data = sanitize(data, config.sanitizeFunctions);
    
    runAll(data, config.validations, config.totalValidations, function(errors){
      if(errors) cb(errors, data);
      else cb(null, data);
    });
  }
  

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