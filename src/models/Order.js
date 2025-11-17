const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product:{type: mongoose.Schema.Types.ObjectId, ref:'Product'},
  quantity:{type:Number, required:true},
  subtotal:{type:Number, required:true}
});

const OrderSchema = new mongoose.Schema({
  user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
  items:[OrderItemSchema],
  total:{type:Number},
  status:{type:String, enum:['pending','paid','shipped','delivered','cancelled'], default:'pending'},
  paymentMethod:{type:String}
},{timestamps:true});

module.exports = mongoose.model('Order', OrderSchema);
