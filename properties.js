var property = require('./property');

module.exports = {

  requiredField: function(options) {
    var prop = { required: true };

    if (options === undefined) options = {};
    Object.keys(options).forEach(function(option) {
      prop[option] = options[option];
    });

    return prop;
  }

};