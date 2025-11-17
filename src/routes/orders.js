const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {protect, admin} = require('../middleware/auth');

// Create order
router.post('/', protect, async (req,res,next)=>{
  try{
    const userId = req.user._id;
    const cart = await Cart.findOne({user:userId}).populate('items.product');
    if(!cart || cart.items.length===0) 
      return res.status(400).json({success:false, message:'Carrito vacío'});
    const items = cart.items.map(i=>({product:i.product._id, quantity:i.quantity, subtotal: i.product.price * i.quantity}));
    const total = items.reduce((s,i)=> s+i.subtotal, 0);
    const order = await Order.create({user:userId, items, total, paymentMethod: req.body.paymentMethod || 'unknown'});
    for(const it of items){
      await Product.findByIdAndUpdate(it.product, {$inc:{stock:-it.quantity}});
    }
    cart.items = [];
    await cart.save();
    res.status(201).json({success:true, data:order});
  }catch(err){ next(err); }
});

// List orders (admin)
router.get('/', protect, admin, async (req,res,next)=>{
  try{
    const orders = await Order.find().populate('user','name email');
    res.json({success:true, data:orders});
  }catch(err){ next(err); }
});

// estadisticas
router.get('/stats', protect, admin, async (req,res,next)=>{
  try{
    const stats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$total' } } }
    ]);
    res.json({success:true, data:stats});
  }catch(err){ next(err); }
});

// pedido por usuario
router.get('/user/:userId', protect, async (req,res,next)=>{
  try{
    if(req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) 
      return res.status(403).json({success:false, message:'No autorizado'});
    const orders = await Order.find({user: req.params.userId});
    res.json({success:true, data:orders});
  }catch(err){ next(err); }
});

// pedido por estado
router.patch('/:id/status', protect, admin, async (req,res,next)=>{
  try{
    const {status} = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {$set:{status}}, {new:true});
    res.json({success:true, data:order});
  }catch(err){ next(err); }
});

module.exports = router;
