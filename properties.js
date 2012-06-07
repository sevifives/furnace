var property = require('./property');

var requiredField = function(options) {
  var prop = { required: true };

  if (!options) options = {};
  Object.keys(options).forEach(function(option) {
    prop[option] = options[option];
  });

  return prop;
};

module.exports = {
  requiredField: requiredField
};