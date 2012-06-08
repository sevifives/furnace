var properties = require('./properties'),
    Property   = properties.property;
// ..........................................................
// blasting helper functions
//
var whitelist = function(source, allowedKeys){
  //pass through if no whitelist defined
  if(!allowedKeys || allowedKeys && allowedKeys.length === 0) return source;   
  var dest = {};
  allowedKeys.forEach(function(key) {
    dest[key] = source[key];
  });
  return dest;
};

// ..........................................................
// isRequired
//
var isRequired = function(object, requiredKeys){
  if(!requiredKeys) return null;
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

var runAll = function(object, functions, totalFunctions, finalCB){

  var runAllDone = function(totalErrors, totalValidations, currentDoneCount) {
    return function(errors) {
      if(errors) totalErrors.push(errors);
      if(currentDoneCount === totalValidations) {
        if(errors.length === 0) finalCB(null);
        else finalCB(errors);
      }
      else currentDoneCount+=1;
    };
  };

  //short circut
  if(totalFunctions === 0) finalCB(null);

  var currentDoneCount = 0,
      totalErrors = [];

  for(var key in object){
    if(object.hasOwnProperty(key)){
      if(functions[key]){
        functions[key](object[key], object, runAllDone(totalErrors, totalFunctions, currentDoneCount) );
      }
    }
  }
};

var buildModelConfiguration = function(model) {
  var sanitizeFunctions = {};
  var allowedKeys = [], requiredKeys = [], totalValidations = 0, validations = {};
  Object.keys(model).map(function(property) {
    //add whitelist
    allowedKeys.push(property);
    //add required fields
    if (model[property].isRequired) requiredKeys.push(property);
    //add sanitize function
    if (model[property].sanitize) sanitizeFunctions[property] = model[property].sanitize;
    //add validations
    if(model[property].validate) {
      totalValidations +=1;
      validations[property] = model[property].validate;
    }
  });
  return { 
    allowedKeys: allowedKeys,
    requiredKeys: requiredKeys,
    sanitizeFunctions: sanitizeFunctions,
    totalValidations: totalValidations,
    validations: validations
  };
};

var Model = function(properties) {
  var self = this;
  if (properties === undefined) properties = {};
  Object.keys(properties).forEach(function(property) {
    if (properties[property] instanceof Property) self[property] = properties[property];
  });
  return self;
};

var Furnace = function() {};

// ..........................................................
// runs the passed object through the filters
//
Furnace.prototype.blast = function(model, source, callback) {
  var self = this;
  var config = buildModelConfiguration(model);
  //first whitelist
  var data = whitelist(source, config.allowedKeys);
  //check for required keys
  var missingKeys = isRequired(data, config.requiredKeys);
  if(missingKeys) return callback(missingKeys, null);  //end now
  //sanitize
  data = sanitize(data, config.sanitizeFunctions);
  runAll(data, config.validations, config.totalValidations, function(errors) {
    if(errors) cb(errors, data);
    else callback(null, data);
  });
};

// ..........................................................
// connect middleware
//
Furnace.prototype.middleware = function(model) {
  var self = this;
  return function(req, res, next) {
    this.blast(model, req.body, function(err, data) {
      if (err) return next(err);
      req.body = data;
      next();
    });
  };
};

var furnace = new Furnace();
module.exports = exports = furnace;
exports.Model = Model;
exports.Property = Property;
exports.Properties = properties;