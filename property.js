module.exports = function(options) {
  if(options === undefined) options = {}
  if(!options.whitelist) options.whitelist = true;
  return options;
};