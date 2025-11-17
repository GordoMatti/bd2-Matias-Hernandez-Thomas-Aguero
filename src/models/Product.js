const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:{type:String, required:true},
  description:{type:String},
  category:{type: mongoose.Schema.Types.ObjectId, ref:'Category'},
  price:{type:Number, required:true},
  stock:{type:Number, default:0},
  brand:{type:String},
  reviews:[{type: mongoose.Schema.Types.ObjectId, ref:'Review'}]
},{timestamps:true});

module.exports = mongoose.model('Product', ProductSchema);
