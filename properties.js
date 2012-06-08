var Property = function(options) {
  var self = this;
  if (options === undefined) options = {};
  if (options.sanitize) self.sanitize = options.sanitize;
  if (options.validate) self.validate = options.validate;
  if (options.isRequired) self.isRequired = true;
  if (options.type) {
    Object.keys(options.type).forEach(function(property) {
      self[property] = options.type[property];
    });
  }
  return self;
};

var requiredField = function(overrides) {
  if (overrides === undefined) options = {};
  var properties = {};
  for(var key in overrides) properties[key] = overrides[key];
  properties.isRequired = true;
  return new Property(properties);
};

module.exports = {
  property: Property,
  requiredField: requiredField
};