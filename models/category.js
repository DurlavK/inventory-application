var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
  {
    name: { type: String, required: true, maxlength:100, minlength:3  },
    description: { type: String, required: true }
  }
);

CategorySchema
.virtual('url')
.get(function(){
  return '/inventory/category/'+this._id;
});

module.exports = mongoose.model('Category', CategorySchema);