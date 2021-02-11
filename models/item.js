var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: { type: String, required: true, maxlength:100, minlength:3 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  }
);

ItemSchema
.virtual('url')
.get(function(){
  return '/inventory/item/'+this._id;
});

module.exports = mongoose.model('Item', ItemSchema);