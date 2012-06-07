var property = require('./property');

var requiredField = property({ 
  required: true
});

module.exports = {
  requiredField: requiredField
};