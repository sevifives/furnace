module.exports = {
  
  prop: function(options) {
    if(options === undefined) options = {}
    if(!options.whitelist) options.whitelist = true;
    return options;
  },

  requiredField: function(options) {
    var prop = { required: true };

    if (options === undefined) options = {};
    Object.keys(options).forEach(function(option) {
      prop[option] = options[option];
    });

    return prop;
  }

};